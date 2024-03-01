import express from "express";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import compression from "compression";
import dotenv from "dotenv";
import connectDB from "./config/db";
import authenticationRoute from "./router/authentication";
import userRoute from "./router/users";


dotenv.config();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    credentials: true,
  })
);
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

app.use('/api/auth', authenticationRoute)
app.use('/api/users', userRoute)

const server = http.createServer(app);

server.listen(process.env.PORT, async () => {
  console.log("Server is running on port http://localhost:8080");
  await connectDB();
});