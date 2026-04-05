import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../../utils/minio.js";
import { PDFParse } from "pdf-parse";
import OpenAI from "openai";
import db from "../../db/index.js";
import { knowledgeBase } from "../../db/schema.js";
import { GoogleGenAI } from "@google/genai";

export async function getFileFromMinIO(key: string) {
  const res = await s3Client.send(
    new GetObjectCommand({
      Bucket: "resolveai",
      Key: key,
    })
  );

  const stream = res.Body as any;

  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks);
}

export async function parsePDF(buffer: Buffer) {
  const parser = new PDFParse({ data: buffer });

  try {
    const data = await parser.getText();
    return data.text;
  } finally {
    await parser.destroy();
  }
}
export function chunkText(text: string, chunkSize = 500, overlap = 100) {
  const chunks = [];

  for (let i = 0; i < text.length; i += chunkSize - overlap) {
    chunks.push(text.slice(i, i + chunkSize));
  }

  return chunks;
}

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });
const googleGenAI = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY!,
});

export async function getEmbedding(text: string) {
//   const res = await openai.embeddings.create({
//     model: "text-embedding-3-small",
//     input: text,
//   });
  const response = await googleGenAI.models.embedContent({
        model: 'gemini-embedding-001',
        contents: text,
    });

  const embedding = response?.embeddings?.[0]?.values;

  if (!embedding) {
    throw new Error("Failed to generate embedding");
  }

  return embedding;
}
export async function processPDF(fileKey: string, fileId: string) {
  try {
    console.log("Processing started:", fileKey);

    const buffer = await getFileFromMinIO(fileKey);

    const text = await parsePDF(buffer);

    const chunks = chunkText(text);

    for (const chunk of chunks) {
      const embedding = await getEmbedding(chunk);

      // save in DB
      await db.insert(knowledgeBase).values({
        sourceId: fileId,
        chunkId: Math.floor(Math.random() * 1000000),
        metadata: {}, // you can use a better chunk ID generation strategy
        userId: "24a24a3a-ced7-46d8-a752-e9c55cdd3d49",
        sourceType: "pdf",
        contentHash: `${fileId}-${chunk.slice(0, 20)}`,
        content: chunk,
        embedding,
      });
    }

    console.log("Processing complete:", fileKey);
  } catch (err) {
    console.error("Processing failed:", err);
  }
}