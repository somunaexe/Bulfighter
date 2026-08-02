// Lightweight public-safe lookup: given a list of consentId values, returns
// ONLY { consentId, fullName, photoUrl } for each - no phone/email/age/
// allergies. Safe to call from the public Clips page, unlike the full
// Consents endpoint (which returns every field for every consent ever
// submitted and is only meant for the authenticated admin pages).
//
// Deploy:
//   1. Deploy this file as its own Lambda function (Node.js 18+ runtime -
//      the AWS SDK v3 imports below are bundled with that runtime, nothing
//      to install).
//   2. Front it with an API Gateway GET route.
//   3. Set one Lambda environment variable:
//        CONSENTS_TABLE_NAME - the DynamoDB table name backing the existing
//        Consents Lambda (this reads the same table, just projects fewer
//        fields per item).
//   4. Put the resulting API Gateway invoke URL in the frontend's
//      src/api/config.js as CAST_NAMES_API_URL, then tell Claude to wire
//      it into src/sections/Clips.jsx's cast-name resolution.
//
// Call shape: GET ?consentIds=id1,id2,id3
// Response:   { people: [{ consentId, fullName, photoUrl }, ...] }
//
// photoUrl is null until a photo field exists on the Consents table - once
// you add one, add its name to the ProjectionExpression below and it'll
// start coming through with no frontend change needed.

import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb'

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}))

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET,OPTIONS',
}

const jsonResponse = (statusCode, body) => ({
  statusCode,
  headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
})

export const handler = async (event) => {
  const method = event.requestContext?.http?.method ?? event.httpMethod
  if (method === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' }
  }

  const raw = event.queryStringParameters?.consentIds ?? ''
  const consentIds = raw.split(',').map((id) => id.trim()).filter(Boolean)

  if (consentIds.length === 0) {
    return jsonResponse(200, { people: [] })
  }

  // Scan + filter in-memory since this file doesn't know the table's exact
  // key schema. If consentId is the table's partition key, swap this for a
  // BatchGetItem keyed directly on consentIds - faster once the table grows.
  const result = await client.send(new ScanCommand({
    TableName: process.env.CONSENTS_TABLE_NAME,
    ProjectionExpression: 'consentId, fullName',
  }))

  const byId = new Map((result.Items ?? []).map((item) => [item.consentId, item]))
  const people = consentIds
    .map((id) => byId.get(id))
    .filter(Boolean)
    .map((item) => ({
      consentId: item.consentId,
      fullName: item.fullName,
      photoUrl: item.photoUrl ?? null,
    }))

  return jsonResponse(200, { people })
}
