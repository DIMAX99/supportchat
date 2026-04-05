  import express from "express";
  import cors from "cors";
  import authRouter from "./api/auth/auth.route.js";
  import fileRouter from "./api/file/file.route.js";
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use("/api/auth", authRouter);
  app.use("/api/file", fileRouter);

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

