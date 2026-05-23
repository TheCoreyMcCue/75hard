import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const region = process.env.AWS_REGION ?? "us-east-1";

const baseClient = new DynamoDBClient({
  region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
  },
});

export const ddb = DynamoDBDocumentClient.from(baseClient, {
  marshallOptions: {
    removeUndefinedValues: true,
    convertClassInstanceToMap: true,
  },
});

const prefix = () => {
  const p = process.env.DYNAMODB_TABLE_PREFIX;
  if (!p) throw new Error("DYNAMODB_TABLE_PREFIX env var is required");
  return p;
};

export const tables = {
  users: () => `${prefix()}-users`,
  challenges: () => `${prefix()}-challenges`,
  dailyLogs: () => `${prefix()}-daily-logs`,
};
