export const userRolesEnumArray=[
    'admin',
] as const;

export const ticketCategoryEnumArray = [
  "uncategorized",
  "bug",
  "feature",
  "question",
  "other",
] as const;
export const ticketPriorityEnumArray = [
  "urgent",
  "high",
  "medium",
  "normal",
  "low",
] as const;

export const ticketStatusEnumArray = [
  "pending",
  "in_progress",
  "resolved",
] as const;
export const dislikeReasonEnumArray = [
  "irrelevant", 
  "unresolved", 
  "unfriendly", 
  "slow_response", 
  "other", 
] as const;
export const sentimentLabelEnumArray = [
  "NEUTRAL",
  "FRUSTRATED",
  "ANGRY",
  "REQUEST_AGENT",
  "ABUSIVE",
  "CONFUSED",
  "ANXIOUS",
  "SATISFIED",
] as const;
export const feedbackTypeEnumArray = [
  "like",
  "dislike",
  "neutral",
] as const;
export type TicketStatus = (typeof ticketStatusEnumArray)[number];
export type SentimentLabel = (typeof sentimentLabelEnumArray)[number];

export type TicketPriority = (typeof ticketPriorityEnumArray)[number];
export type TicketCategory = (typeof ticketCategoryEnumArray)[number];
