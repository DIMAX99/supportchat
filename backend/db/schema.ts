import {sql} from 'drizzle-orm';
import { 
    boolean,
    char,
    integer,
    pgSchema,
    foreignKey,
    jsonb,
    text,
    date,
    index,
    varchar,
    primaryKey,
    unique,
    uniqueIndex,
    uuid,
    vector,
    real,
    timestamp,
    smallint,
    serial
 } from 'drizzle-orm/pg-core';
import { userRolesEnumArray,
    ticketCategoryEnumArray,
    ticketPriorityEnumArray,
    ticketStatusEnumArray,
    dislikeReasonEnumArray,
    sentimentLabelEnumArray,
    feedbackTypeEnumArray
 } from '../utils/const.js';
import type { JSONContentZod } from '../utils/types.js';
export const resolveai = pgSchema('resolveai');
export const userRole=resolveai.enum('user_role',userRolesEnumArray);
export const ticketCategory = resolveai.enum(
  "ticket_category",
  ticketCategoryEnumArray,
);
export const ticketPriority = resolveai.enum(
  "ticket_priority",
  ticketPriorityEnumArray,
);
export const ticketStatus = resolveai.enum(
  "ticket_status",
  ticketStatusEnumArray,
);
export const dislikeReason = resolveai.enum(
  "dislike_reason",
  dislikeReasonEnumArray,
);
export const sentimentLabel = resolveai.enum(
  "sentiment_label",
  sentimentLabelEnumArray,
);
export const feedbackType = resolveai.enum(
  "feedback_type",
  feedbackTypeEnumArray,
);
export const users=resolveai.table(
    'users',
{
    id: uuid("id").default(sql`gen_random_uuid()`).primaryKey().notNull(),
    name:varchar("name",{length:64}).default("").notNull(),
    email:varchar("email",{length:128}).notNull().unique(),
    role:userRole("role").default('admin').notNull(),
    password:varchar("password",{length:256}).notNull(),
    avatar_url:varchar("avatar_url",{length:256}).default(""),
    registered_at:timestamp("registered_at",{mode:'date'}).default(sql`now()`),
},(table)=>[
    index("idx_user_role").on(table.role),
])

export const tickets=resolveai.table(
     'tickets',
     {
        id: uuid("id").default(sql`gen_random_uuid()`).primaryKey().notNull(),
        org_id: uuid("org_id").notNull().references(()=>users.id),
        title:varchar("title",{length:256}).notNull(),
        session_id: uuid("session_id").default(sql`gen_random_uuid()`).notNull(),
        description:text("description").notNull(),
        category:ticketCategory("category").default("uncategorized").notNull(),
        priority:ticketPriority("priority").default("normal").notNull(),
        status:ticketStatus("status").default("pending").notNull(),
        created_at:timestamp("created_at",{mode:'date'}).default(sql`now()`),
        updated_at:timestamp("updated_at",{mode:'date'}).default(sql`now()`),
     },(table)=>[
    index("idx_ticket_org_id").on(table.org_id),
    index("idx_ticket_status").on(table.status),
    index("idx_ticket_priority").on(table.priority),
    index("idx_ticket_category").on(table.category),
     ]
)
export const knowledgeBase = resolveai.table(
  "knowledge_base",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    sourceType: varchar("source_type", { length: 50 }).notNull(),
    sourceId: text("source_id").notNull(),
    userId: uuid("user_id").notNull().references(() => users.id),
    chunkId: integer("chunk_id").notNull(),
    title: text("title").notNull().default(""),
    content: text("content").notNull(),
    embedding: vector("embedding", { dimensions: 3072 }).notNull(),
    metadata: jsonb("metadata").notNull(),
    score: integer("score").default(0),
    accessCount: integer("access_count").default(0),
    lang: varchar("lang", { length: 12 }).default("auto"),
    tokenCount: integer("token_count").default(0),
    isDeleted: boolean("is_deleted").default(false),
    contentHash: text("content_hash").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, precision: 3 })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, precision: 3 })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    index("idx_kb_user_chunk").on(t.userId),
    uniqueIndex("idx_kb_unique_source_chunk").on(
      t.sourceType,
      t.sourceId,
      t.chunkId,
    ),
    uniqueIndex("idx_kb_content_hash").on(t.contentHash),
    index("idx_kb_metadata").using("gin", t.metadata),
  ],
);
export const files = resolveai.table(
  "files",
  {
    id: uuid("id").default(sql`gen_random_uuid()`).primaryKey().notNull(),
    userId: uuid("user_id").notNull().references(() => users.id),
    filename: varchar("filename", { length: 256 }).notNull(),
    originalFilename: varchar("original_filename", { length: 256 }).notNull(),
    mimetype: varchar("mimetype", { length: 128 }).notNull(),
    size: integer("size").notNull(),
    url: text("url").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, precision: 3 })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    index("idx_files_user").on(t.userId),
    index("idx_files_created").on(t.createdAt),
  ],
);

export const chatMessages = resolveai.table(
  "chat_messages",
  {
    id: serial("id").primaryKey().notNull(),
    ticketId: uuid("ticket_id")
      .notNull()
      .references(() => tickets.id),
    senderId: integer("sender_id")
      .notNull(),
    content: jsonb().$type<JSONContentZod>().notNull(),
    createdAt: timestamp("created_at", {
      precision: 3,
      mode: "string",
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
    withdrawn: boolean("withdrawn").default(false).notNull(),
  },
  (table) => [
    index("idx_chat_messages_ticket_created").on(
      table.ticketId,
      table.createdAt.desc(),
    ),
  ],
);

export const messageFeedback = resolveai.table(
  "message_feedback",
  {
    id: serial("id").primaryKey().notNull(),
    messageId: integer("message_id")
      .notNull()
      .references(() => chatMessages.id, { onDelete: "cascade" }), // 消息删除时级联删除反馈
    userId: integer("user_id") // 评价用户ID
      .notNull(), // 用户删除时级联删除反馈
    ticketId: uuid("ticket_id") // 冗余字段，便于查询
      .notNull()
      .references(() => tickets.id, { onDelete: "cascade" }), // 工单删除时级联删除反馈
    feedbackType: feedbackType("feedback_type").notNull(), // like | dislike
    dislikeReasons: dislikeReason("dislike_reasons").array().default([]),
    feedbackComment: text("feedback_comment").default(""),
    hasComplaint: boolean("has_complaint").default(false).notNull(),
    createdAt: timestamp("created_at", {
      precision: 3,
      mode: "string",
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", {
      precision: 3,
      mode: "string",
      withTimezone: true,
    })
      .defaultNow()
      .$onUpdate(() => sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    // 每个用户对每条消息只能有一次反馈
    unique("message_feedback_unique").on(table.messageId, table.userId),
    // 索引优化
    index("idx_message_feedback_ticket").on(table.ticketId),
    index("idx_message_feedback_user").on(table.userId),
    index("idx_message_feedback_message").on(table.messageId),
  ]);

  export const ticketFeedback = resolveai.table(
  "ticket_feedback",
  {
    id: serial("id").primaryKey().notNull(),
    ticketId: uuid("ticket_id")
      .notNull()
      .references(() => tickets.id, { onDelete: "cascade" }), // 工单删除时级联删除反馈
    userId: integer("user_id") // 评价用户ID（通常是客户）
      .notNull(), // 用户删除时级联删除反馈,
    satisfactionRating: smallint("satisfaction_rating").default(0).notNull(), // 1-5分满意度
    dislikeReasons: dislikeReason("dislike_reasons").array().default([]),
    feedbackComment: text("feedback_comment").default(""),
    hasComplaint: boolean("has_complaint").default(false).notNull(),
    createdAt: timestamp("created_at", {
      precision: 3,
      mode: "string",
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", {
      precision: 3,
      mode: "string",
      withTimezone: true,
    })
      .defaultNow()
      .$onUpdate(() => sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    // 每个工单只能有一次反馈
    unique("ticket_feedback_unique").on(table.ticketId),
    // 索引优化
    index("idx_ticket_feedback_user").on(table.userId),
    index("idx_ticket_feedback_rating").on(table.satisfactionRating),
    index("idx_ticket_feedback_created").on(table.createdAt),
  ],
);

