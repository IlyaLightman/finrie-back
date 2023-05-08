-- CreateEnum
CREATE TYPE "SenderType" AS ENUM ('system', 'user');

-- CreateEnum
CREATE TYPE "ReceiverType" AS ENUM ('user');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('issuance', 'transfer');

-- CreateEnum
CREATE TYPE "PoolTransactionStatus" AS ENUM ('processing', 'discarded');

-- CreateTable
CREATE TABLE "systems" (
    "system_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "issuance_restriction" TEXT NOT NULL,
    "issuance_current_linit" INTEGER NOT NULL,
    "issuance_rule" TEXT NOT NULL,
    "kyc_fields" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "password_hash" TEXT NOT NULL,
    "hash" TEXT NOT NULL,

    CONSTRAINT "systems_pkey" PRIMARY KEY ("system_id")
);

-- CreateTable
CREATE TABLE "users" (
    "user_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "system_id" UUID NOT NULL,
    "kyc_data" JSONB NOT NULL,
    "status" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "registered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "senders" (
    "sender_id" UUID NOT NULL,
    "user_id" TEXT NOT NULL,
    "system_id" UUID NOT NULL,
    "type" "SenderType" NOT NULL,

    CONSTRAINT "senders_pkey" PRIMARY KEY ("sender_id")
);

-- CreateTable
CREATE TABLE "receivers" (
    "receiver_id" UUID NOT NULL,
    "user_id" TEXT NOT NULL,
    "system_id" UUID NOT NULL,
    "type" "ReceiverType" NOT NULL,

    CONSTRAINT "receivers_pkey" PRIMARY KEY ("receiver_id")
);

-- CreateTable
CREATE TABLE "weekly_statements" (
    "weekly_statement_id" UUID NOT NULL,
    "balance" INTEGER NOT NULL,
    "system_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "week_number" INTEGER NOT NULL,
    "transactions_count" INTEGER NOT NULL,

    CONSTRAINT "weekly_statements_pkey" PRIMARY KEY ("weekly_statement_id")
);

-- CreateTable
CREATE TABLE "transactions_pool" (
    "pool_transactions_id" UUID NOT NULL,
    "type" "TransactionType" NOT NULL,
    "value" INTEGER NOT NULL,
    "system_id" UUID NOT NULL,
    "sender_id" UUID NOT NULL,
    "receiver_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "PoolTransactionStatus" NOT NULL,

    CONSTRAINT "transactions_pool_pkey" PRIMARY KEY ("pool_transactions_id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "transaction_id" UUID NOT NULL,
    "type" "TransactionType" NOT NULL,
    "value" INTEGER NOT NULL,
    "system_id" UUID NOT NULL,
    "sender_id" UUID NOT NULL,
    "receiver_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "accepted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hash" TEXT NOT NULL,
    "prev_hash" TEXT NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("transaction_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "systems_name_key" ON "systems"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_name_key" ON "users"("name");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_system_id_fkey" FOREIGN KEY ("system_id") REFERENCES "systems"("system_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "senders" ADD CONSTRAINT "senders_system_id_fkey" FOREIGN KEY ("system_id") REFERENCES "systems"("system_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receivers" ADD CONSTRAINT "receivers_system_id_fkey" FOREIGN KEY ("system_id") REFERENCES "systems"("system_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "weekly_statements" ADD CONSTRAINT "weekly_statements_system_id_fkey" FOREIGN KEY ("system_id") REFERENCES "systems"("system_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "weekly_statements" ADD CONSTRAINT "weekly_statements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions_pool" ADD CONSTRAINT "transactions_pool_system_id_fkey" FOREIGN KEY ("system_id") REFERENCES "systems"("system_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions_pool" ADD CONSTRAINT "transactions_pool_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "senders"("sender_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions_pool" ADD CONSTRAINT "transactions_pool_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "receivers"("receiver_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_system_id_fkey" FOREIGN KEY ("system_id") REFERENCES "systems"("system_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "senders"("sender_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "receivers"("receiver_id") ON DELETE RESTRICT ON UPDATE CASCADE;
