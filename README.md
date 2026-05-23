# 75 Hard Tracker

A Next.js app for tracking the 75 Hard challenge — with your own rules. Pre-filled with the
standard 75 Hard tasks, fully customizable before you start, then locked for the duration.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- Auth.js v5 (credentials provider, bcrypt)
- DynamoDB (AWS SDK v3)
- Framer Motion for the daily-completion animation
- Vercel for hosting

## Local setup

### 1. Install dependencies

```sh
npm install
```

### 2. Create an IAM user in AWS

In the AWS console, create an IAM user with programmatic access. Attach a custom policy that allows
DynamoDB actions only on the tables this app uses. Example policy (replace `ACCOUNT_ID` and
`REGION`):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:CreateTable",
        "dynamodb:DescribeTable",
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:Query",
        "dynamodb:Scan"
      ],
      "Resource": [
        "arn:aws:dynamodb:REGION:ACCOUNT_ID:table/75hard-*",
        "arn:aws:dynamodb:REGION:ACCOUNT_ID:table/75hard-*/index/*"
      ]
    }
  ]
}
```

Save the access key ID and secret access key.

### 3. Configure `.env.local`

Copy `.env.example` to `.env.local` and fill in:

- `AWS_REGION` — e.g. `us-east-1`
- `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` — from the IAM user
- `DYNAMODB_TABLE_PREFIX` — `75hard-dev` locally, `75hard-prod` in Vercel
- `AUTH_SECRET` — generate with `openssl rand -base64 32`
- `ALLOWED_EMAILS` — comma-separated list of emails that can sign up

### 4. Provision DynamoDB tables

```sh
npm run db:create
```

This creates three tables (`<prefix>-users`, `<prefix>-challenges`, `<prefix>-daily-logs`) using
on-demand billing. Idempotent — safe to re-run.

### 5. Run the dev server

```sh
npm run dev
```

Open http://localhost:3000. Sign up with an email from `ALLOWED_EMAILS`.

## Deploying to Vercel

1. Push the repo to GitHub.
2. Import the project in Vercel.
3. Set the same env vars from `.env.local` in Vercel — but with `DYNAMODB_TABLE_PREFIX=75hard-prod`
   and a separate `AUTH_SECRET`.
4. Re-run `npm run db:create` locally with the prod prefix in `.env.local` (or temporarily
   override) to create the prod tables.
5. Deploy.

## Data model

- `<prefix>-users`: `userId` (PK), `email-index` GSI
- `<prefix>-challenges`: `userId` (PK) + `challengeId` (SK)
- `<prefix>-daily-logs`: `userChallenge` (PK, `userId#challengeId`) + `dayNumber` (SK)

## How challenges work

- Set up tasks (seeded with the standard 75 Hard rules) and a duration (default 75 days).
- Confirm the lock prompt to start. Tasks and duration cannot be changed mid-challenge.
- Check off tasks each day. When all tasks for the day are complete, a celebration plays.
- On the final day, mark the challenge complete to archive it.
- Missed a day? Hit "I missed a day" to reset — the failed attempt is archived in history and a
  fresh challenge starts at Day 1 with the same parameters.
