import { Queue } from "bullmq";
import IORedis from "ioredis";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

export const connection = new IORedis(redisUrl, {
    maxRetriesPerRequest: null,
});

export const emailQueue = new Queue("email-notifications", { connection });
export const activityQueue = new Queue("activity-logs", { connection });

export interface EmailJobData {
    to: string;
    subject: string;
    body: string;
}

export const queueEmailNotification = async (data: EmailJobData) => {
    try {
        await emailQueue.add("send-email", data, {
            attempts: 3,
            backoff: { type: "exponential", delay: 2000 },
            removeOnComplete: true,
        });
    }
    catch(err) {
        console.error("Failed to enqueue email job: ", err);
    }
};

export interface ActivityJobData {
    issueId: string;
    userId: string;
    action: string;
    metadata?: any;
}

export const queueActivityLog = async (data: ActivityJobData) => {
    try {
        await activityQueue.add("log-activity", data, {
            attempts: 3,
            removeOnComplete: true,
        });
    }
    catch(err) {
        console.error("Failed to enqueue activity log job: ", err);
    }
};