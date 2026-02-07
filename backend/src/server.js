import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import testRoutes from "./routes/test.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("PassItOn Backend Running !!");
});

app.use("/api/test", testRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🦇 PassItOn Server running on port ${PORT}`);
});
