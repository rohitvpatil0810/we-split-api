import "../config/dotenv.config";
import express, { Request, Response } from "express";
import router from "./routes";

const app = express();

const port = process.env.PORT || 8000;

// Middlewares
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to We Split API");
});

app.use("/api", router);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
