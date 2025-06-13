import { db } from "@/configs/db";
import { VideoData } from "@/configs/schema";
import { eq } from "drizzle-orm";

export const getVideoDataById = async (id) => {
  const result = await db.select().from(VideoData).where(eq(VideoData.id, id));
  return result[0];
};
