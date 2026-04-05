import { Router } from "express";
import multer from "multer";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../../utils/minio.js";
import db from "../../db/index.js";
import { files } from "../../db/schema.js";
import { processPDF } from "../../utils/kb/processfile.js";

const fileRouter = Router();
const upload = multer({ storage: multer.memoryStorage() });

fileRouter.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const isPdf =
      file.mimetype === "application/pdf" ||
      file.originalname.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      return res.status(400).json({ error: "Only PDF files are allowed" });
    }

    const command = new PutObjectCommand({
      Bucket: "resolveai",
      Key: file.originalname,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await s3Client.send(command);
    const insetfile=await db.insert(files).values({
        userId :"24a24a3a-ced7-46d8-a752-e9c55cdd3d49",
        filename: file.originalname,
        originalFilename: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        url: `http://localhost:9000/resolveai/${file.originalname}`,
    }).returning({id:files.id});
    if(insetfile){
        console.log("file metadata inserted into database");
    }
    processPDF(file.originalname,insetfile[0]!.id);
    return res.status(200).json({ message: "Upload and Scan successful" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Upload failed" });
  }
});

export default fileRouter;