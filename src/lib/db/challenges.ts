import { GetCommand, PutCommand, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "node:crypto";
import { ddb, tables } from "./client";
import type { Challenge, ChallengeStatus, Task } from "../types";

export async function getActiveChallenge(userId: string): Promise<Challenge | null> {
  const result = await ddb.send(
    new QueryCommand({
      TableName: tables.challenges(),
      KeyConditionExpression: "userId = :u",
      FilterExpression: "#s = :active",
      ExpressionAttributeNames: { "#s": "status" },
      ExpressionAttributeValues: { ":u": userId, ":active": "active" satisfies ChallengeStatus },
      Limit: 1,
    }),
  );
  return (result.Items?.[0] as Challenge | undefined) ?? null;
}

export async function listChallenges(userId: string): Promise<Challenge[]> {
  const result = await ddb.send(
    new QueryCommand({
      TableName: tables.challenges(),
      KeyConditionExpression: "userId = :u",
      ExpressionAttributeValues: { ":u": userId },
      ScanIndexForward: false,
    }),
  );
  return (result.Items as Challenge[] | undefined) ?? [];
}

export async function getChallenge(userId: string, challengeId: string): Promise<Challenge | null> {
  const result = await ddb.send(
    new GetCommand({
      TableName: tables.challenges(),
      Key: { userId, challengeId },
    }),
  );
  return (result.Item as Challenge | undefined) ?? null;
}

export async function createChallenge(
  userId: string,
  tasks: Task[],
  durationDays: number,
): Promise<Challenge> {
  const challenge: Challenge = {
    userId,
    challengeId: randomUUID(),
    status: "active",
    startDate: new Date().toISOString(),
    tasks,
    durationDays,
    createdAt: new Date().toISOString(),
  };

  await ddb.send(
    new PutCommand({
      TableName: tables.challenges(),
      Item: challenge,
    }),
  );

  return challenge;
}

export async function updateChallengeStatus(
  userId: string,
  challengeId: string,
  status: ChallengeStatus,
): Promise<void> {
  await ddb.send(
    new UpdateCommand({
      TableName: tables.challenges(),
      Key: { userId, challengeId },
      UpdateExpression: "SET #s = :s, endDate = :e",
      ExpressionAttributeNames: { "#s": "status" },
      ExpressionAttributeValues: {
        ":s": status,
        ":e": new Date().toISOString(),
      },
    }),
  );
}
