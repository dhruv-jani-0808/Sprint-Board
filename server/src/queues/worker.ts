import { Worker, Job } from "bullmq";
import { connection, EmailJobData, ActivityJobData } from "./queue";
import { prisma } from "../config/db";

export const emailWorker = new Worker<EmailJobData>(
    "email-notifications",
    async (job: Job<EmailJobData>) => {
        const { to, subject, body } = job.data;
        console.log(`[Email Worker] Processing email to: ${to}`);
        console.log(`Subject: ${subject}`);

        await new Promise((res) => setTimeout(res, 500));
        return { delivered: true };
    },
    { connection }
);

export const activityWorker = new Worker<ActivityJobData>(
    "activity-logs",
    async (job: Job<ActivityJobData>) => {
        const { issueId, userId, action, metadata } = job.data;
        
        await prisma.activity.create({
            data: {
                issueId,
                userId,
                action,
                metadata: metadata || {},
            },
        });
        return { logged: true };
    },
    { connection }
);

emailWorker.on("completed", (job) => {
    console.log(`[Email Worker] Job ${job.id} completed`);
});
emailWorker.on("failed", (job, err) => {
    console.error(`[Email Worker] Job ${job?.id} failed:`, err.message);
});

activityWorker.on("completed", (job) => {
    console.log(`[Activity Worker] Job ${job.id} completed`);
});
activityWorker.on("failed", (job, err) => {
    console.error(`[Activity Worker] Job ${job?.id} failed:`, err.message);
});

export const initWorkers = () => {
    console.log("BullMQ Background Workers initialized and listening for jobs");
};