import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
export const redis = new Redis(redisUrl,
                                { 
                                    maxRetriesPerRequest: null,
                                    retryStrategy(times) {
                                        return Math.min(times * 50, 2000);
                                    }
                                }
                            );

redis.on("connect", () => console.log("Redis client connected"));
redis.on("error", (err) => console.log("Redis error: ", err.message));

export const getCache = async <T>(key: string): Promise<T | null> => {
    try {
        const data = await redis.get(key);
        if(!data) return null;

        return JSON.parse(data) as T;
    }
    catch(err) {
        return null;
    }
}

export const setCache = async (key: string, value: any, ttlSeconds = 3600): Promise<void> => {
    try {
        const serialized = JSON.stringify(value);
        await redis.setex(key, ttlSeconds, serialized);
    }
    catch(err) {
        console.error("Redis setCatche error: ", err);
    }
}

export const deleteCache = async (key: string): Promise<void> => {
    try {
        await redis.del(key);
    }
    catch(err) {
        console.error("Redis deleteCache error: ", err);
    }
}