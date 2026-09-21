// Handles rental equipment requests: POST from the public Rentals page
// (src/sections/Rentals.jsx) to submit one, GET from the admin Rentals page
// (src/admin/Rentals.jsx) to list them all.
//
// Deploy:
//   1. Deploy as its own Lambda function (Node.js 18+ runtime).
//   2. Front it with an API Gateway route (GET, POST, OPTIONS) - same
//      pattern as the existing Interests/Consents/Topics endpoints.
//   3. Create a DynamoDB table named RMEquipmentRentals with rentalId as
//      the partition key (string).
//   4. Put the resulting API Gateway invoke URL into
//      src/api/config.js as EQUIPMENT_RENTAL_API_URL.
//
// Note: matching how the existing Interests/Consents/Topics endpoints work,
// the GET here has no auth check of its own - the admin password gate is
// frontend-only (see src/admin/Admin.jsx). Fine for now since it matches
// what's already there, but worth tightening later if this data becomes
// more sensitive than names/emails/phone numbers already are elsewhere.

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import crypto from "crypto";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const headersObj = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS, GET, POST",
  "Access-Control-Allow-Headers": "Content-Type",
};

const jsonResponse = (statusCode, body) => ({
  statusCode,
  headers: headersObj,
  body: JSON.stringify(body),
});

export const handler = async (event) => {
  try {
    const method = event.httpMethod;

    if (method === "OPTIONS") {
      return { statusCode: 200, headers: headersObj, body: "" };
    }

    if (method === "GET") {
      const { Items } = await docClient.send(
        new ScanCommand({ TableName: "RMEquipmentRentals" })
      );
      return jsonResponse(200, { rentals: Items ?? [] });
    }

    if (method === "POST") {
      const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body || {};
      const {
        fullName,
        email,
        phoneNumber,
        equipmentIds,
        startDate,
        endDate,
        notes,
        agreedToPolicy,
      } = body;

      if (
        !fullName || !email || !phoneNumber || !startDate || !endDate ||
        !Array.isArray(equipmentIds) || equipmentIds.length === 0 || !agreedToPolicy
      ) {
        return jsonResponse(400, { success: false, error: "Missing required fields" });
      }

      const rentalId = crypto.randomUUID();
      const timestamp = new Date().toISOString();

      await docClient.send(
        new PutCommand({
          TableName: "RMEquipmentRentals",
          Item: {
            rentalId,
            fullName: fullName.trim(),
            email: email.trim(),
            phoneNumber: phoneNumber.trim(),
            equipmentIds,
            startDate,
            endDate,
            notes: notes?.trim() || '',
            status: "pending",
            timestamp,
          },
        })
      );

      return jsonResponse(200, {
        success: true,
        rentalId,
        message: "Rental request submitted! We'll confirm availability and follow up by email or phone.",
      });
    }

    return jsonResponse(405, { error: "Method not allowed" });
  } catch (error) {
    console.error("Error:", error);
    return jsonResponse(500, { success: false, error: "Sorry! That didn't work." });
  }
};
