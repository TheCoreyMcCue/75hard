#!/usr/bin/env node
// Provisions the three DynamoDB tables for a given DYNAMODB_TABLE_PREFIX.
// Run via `npm run db:create` after env vars are set in .env.local.

import {
  DynamoDBClient,
  CreateTableCommand,
  DescribeTableCommand,
  ResourceInUseException,
} from "@aws-sdk/client-dynamodb";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, "..", ".env.local");
try {
  const raw = readFileSync(envPath, "utf8");
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!(key in process.env)) process.env[key] = value;
  }
} catch {
  // .env.local optional — env may come from elsewhere
}

const prefix = process.env.DYNAMODB_TABLE_PREFIX;
if (!prefix) {
  console.error("DYNAMODB_TABLE_PREFIX is required");
  process.exit(1);
}

const region = process.env.AWS_REGION ?? "us-east-1";
const client = new DynamoDBClient({
  region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
  },
});

const tableDefs = [
  {
    TableName: `${prefix}-users`,
    AttributeDefinitions: [
      { AttributeName: "userId", AttributeType: "S" },
      { AttributeName: "email", AttributeType: "S" },
    ],
    KeySchema: [{ AttributeName: "userId", KeyType: "HASH" }],
    GlobalSecondaryIndexes: [
      {
        IndexName: "email-index",
        KeySchema: [{ AttributeName: "email", KeyType: "HASH" }],
        Projection: { ProjectionType: "ALL" },
      },
    ],
    BillingMode: "PAY_PER_REQUEST",
  },
  {
    TableName: `${prefix}-challenges`,
    AttributeDefinitions: [
      { AttributeName: "userId", AttributeType: "S" },
      { AttributeName: "challengeId", AttributeType: "S" },
    ],
    KeySchema: [
      { AttributeName: "userId", KeyType: "HASH" },
      { AttributeName: "challengeId", KeyType: "RANGE" },
    ],
    BillingMode: "PAY_PER_REQUEST",
  },
  {
    TableName: `${prefix}-daily-logs`,
    AttributeDefinitions: [
      { AttributeName: "userChallenge", AttributeType: "S" },
      { AttributeName: "dayNumber", AttributeType: "N" },
    ],
    KeySchema: [
      { AttributeName: "userChallenge", KeyType: "HASH" },
      { AttributeName: "dayNumber", KeyType: "RANGE" },
    ],
    BillingMode: "PAY_PER_REQUEST",
  },
];

for (const def of tableDefs) {
  try {
    await client.send(new CreateTableCommand(def));
    console.log(`Created ${def.TableName}`);
  } catch (err) {
    if (err instanceof ResourceInUseException) {
      console.log(`${def.TableName} already exists`);
    } else {
      console.error(`Failed to create ${def.TableName}:`, err);
      process.exitCode = 1;
    }
  }
}

// Wait for tables to become ACTIVE
for (const def of tableDefs) {
  while (true) {
    const { Table } = await client.send(new DescribeTableCommand({ TableName: def.TableName }));
    if (Table?.TableStatus === "ACTIVE") {
      console.log(`${def.TableName} is ACTIVE`);
      break;
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
}

console.log("Done.");
