import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors";
require("dotenv").config();

const app = express();

const whitelist = [
  "http://localhost:3000",
  "https://code-verse-git-main-bimalstha23.vercel.app",
  "https://code-verse-rouge.vercel.app",
  "https://code-verse-d4u7fejfu-bimalstha23.vercel.app",
];

const corsOptions = {
  // credentials: true, // This is important.
  origin: whitelist,
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(morgan("dev"));

// Config Database
const uri  = process.env.MONGO_URI || 'mongodb+srv://bimalshrestha074:nwr5xqKHHxHkQkMs@cluster0.xkraiuj.mongodb.net/?retryWrites=true&w=majority' as string; 
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database Connected!"))
  .catch((e) => console.log(e));

mongoose.connection.on("error", (err) => {
  console.log(`DB Connection error: ${err.message}`);
});

const PORT = process.env.PORT || 8080;

const roomRoutes = require("./routes/room");
const messageRoutes = require("./routes/messages");

app.get("/", async (_req: Request, res: Response, _next: NextFunction) => {
  res.send({ message: "You're in right place folk 🐻" });
});


app.use("/api", roomRoutes);
app.use("/api", messageRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
