import { z } from "zod";
import { userRolesEnumArray } from "./const.js";
import type { JSONContent } from "@tiptap/react";



export const SignupSchema = z.object({
  name: z.string().min(3).max(64),
  email: z.email(),
  password: z.string().min(8),
  role: z.enum(userRolesEnumArray).default("admin"),
});

export const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});
export const JSONContentSchema: z.ZodSchema<JSONContent> = z.lazy(() =>
  z.object({
    type: z.string(),
    attrs: z.record(z.string(), z.any()).default({}),
    content: z.array(JSONContentSchema).default([]),
    marks: z
      .array(
        z.object({
          type: z.string(),
          attrs: z.record(z.string(), z.any()).default({}),
        }),
      )
      .default([]),
    text: z.string().default(""),
  }),
);

export type JSONContentZod = z.infer<typeof JSONContentSchema>;
