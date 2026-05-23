import { GetCommand, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import { ddb, tables } from "./client";
import type { User } from "../types";

export async function findUserByEmail(email: string): Promise<User | null> {
  const result = await ddb.send(
    new QueryCommand({
      TableName: tables.users(),
      IndexName: "email-index",
      KeyConditionExpression: "email = :email",
      ExpressionAttributeValues: { ":email": email.toLowerCase() },
      Limit: 1,
    }),
  );
  return (result.Items?.[0] as User | undefined) ?? null;
}

export async function findUserById(userId: string): Promise<User | null> {
  const result = await ddb.send(
    new GetCommand({
      TableName: tables.users(),
      Key: { userId },
    }),
  );
  return (result.Item as User | undefined) ?? null;
}

export async function createUser(email: string, password: string): Promise<User> {
  const normalizedEmail = email.toLowerCase();
  const existing = await findUserByEmail(normalizedEmail);
  if (existing) throw new Error("Email already registered");

  const user: User = {
    userId: randomUUID(),
    email: normalizedEmail,
    passwordHash: await bcrypt.hash(password, 12),
    createdAt: new Date().toISOString(),
  };

  await ddb.send(
    new PutCommand({
      TableName: tables.users(),
      Item: user,
      ConditionExpression: "attribute_not_exists(userId)",
    }),
  );

  return user;
}

export async function verifyPassword(plaintext: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plaintext, hash);
}
