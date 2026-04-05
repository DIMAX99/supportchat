// lib/minio.ts
import { S3Client } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
  region: "us-east-1", // can be anything
  endpoint: "http://localhost:9000", // your MinIO endpoint
  credentials: {
    accessKeyId: "admin",
    secretAccessKey: "password",
  },
  forcePathStyle: true, // IMPORTANT for MinIO
});