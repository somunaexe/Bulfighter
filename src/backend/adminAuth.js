// AWS Lambda handler for the admin login gate.
//
// The old Admin.jsx compared the typed password against a plaintext string
// baked into the React bundle - anyone could read it straight out of the
// deployed JS. This moves that check server-side: the real password only
// ever lives in this Lambda's environment variables, never in git or the
// browser.
//
// Deploy:
//   1. Deploy this file as its own Lambda function (Node.js 18+ runtime).
//   2. Front it with an API Gateway route, e.g. POST /admin-auth.
//   3. Set two Lambda environment variables:
//        ADMIN_PASSWORD - the real admin password
//        TOKEN_SECRET   - a separate random string used to sign session tokens
//   4. Put the resulting API Gateway invoke URL in the frontend's
//      VITE_ADMIN_AUTH_URL (see src/admin/Admin.jsx).
//
// Note: this only secures the login gate itself. The Interests/Consents/
// Topics Lambdas don't yet check this token on their own requests - that's
// a separate follow-up if those endpoints need to be locked down too.

import { createHmac, timingSafeEqual } from 'crypto'

const TOKEN_TTL_MS = 1000 * 60 * 60 * 12 // 12 hours

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST,OPTIONS',
}

const jsonResponse = (statusCode, body) => ({
  statusCode,
  headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
})

const sign = (payload) => createHmac('sha256', process.env.TOKEN_SECRET).update(payload).digest('hex')

const passwordMatches = (candidate) => {
  const candidateBuffer = Buffer.from(String(candidate ?? ''))
  const expectedBuffer = Buffer.from(String(process.env.ADMIN_PASSWORD ?? ''))
  return candidateBuffer.length === expectedBuffer.length && timingSafeEqual(candidateBuffer, expectedBuffer)
}

export const handler = async (event) => {
  const method = event.requestContext?.http?.method ?? event.httpMethod
  if (method === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' }
  }

  let password
  try {
    ({ password } = JSON.parse(event.body || '{}'))
  } catch {
    return jsonResponse(400, { error: 'Malformed request' })
  }

  if (!password || !passwordMatches(password)) {
    return jsonResponse(401, { error: 'Incorrect password' })
  }

  const expires = Date.now() + TOKEN_TTL_MS
  const token = `${expires}.${sign(String(expires))}`
  return jsonResponse(200, { token })
}
