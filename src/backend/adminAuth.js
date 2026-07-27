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
