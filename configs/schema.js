import {
  boolean,
  integer,
  json,
  pgTable,
  serial,
  varchar,
} from "drizzle-orm/pg-core";

export const Users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  imageUrl: varchar("imageUrl", { length: 500 }),
  subscription: boolean("subscription").default(false),
  credits: integer("credits").default(30),
});

export const VideoData = pgTable("videoData", {
  id: serial("id").primaryKey(),
  script: json("script").notNull(),
  audioFileUrl: varchar("audioFileUrl", { length: 500 }).notNull(),
  imageList: varchar("imageList", { length: 500 }).array(),
  createdBy: varchar("createdBy", { length: 255 }).notNull(),
});
