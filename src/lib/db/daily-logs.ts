import { GetCommand, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { ddb, tables } from "./client";
import type { DailyLog } from "../types";

const pk = (userId: string, challengeId: string) => `${userId}#${challengeId}`;

function stripPk(item: Record<string, unknown>): DailyLog {
  const copy = { ...item };
  delete copy.userChallenge;
  return copy as unknown as DailyLog;
}

export async function getDailyLog(
  userId: string,
  challengeId: string,
  dayNumber: number,
): Promise<DailyLog | null> {
  const result = await ddb.send(
    new GetCommand({
      TableName: tables.dailyLogs(),
      Key: { userChallenge: pk(userId, challengeId), dayNumber },
    }),
  );
  return result.Item ? stripPk(result.Item) : null;
}

export async function listDailyLogs(userId: string, challengeId: string): Promise<DailyLog[]> {
  const result = await ddb.send(
    new QueryCommand({
      TableName: tables.dailyLogs(),
      KeyConditionExpression: "userChallenge = :uc",
      ExpressionAttributeValues: { ":uc": pk(userId, challengeId) },
    }),
  );
  return (result.Items ?? []).map(stripPk);
}

export async function upsertDailyLog(log: DailyLog): Promise<void> {
  await ddb.send(
    new PutCommand({
      TableName: tables.dailyLogs(),
      Item: {
        userChallenge: pk(log.userId, log.challengeId),
        ...log,
      },
    }),
  );
}
