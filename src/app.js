import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import cors from "cors";

const app = express();

dotenv.config({ path: "/config.env" });

// app.use(
//   cors({
//     origin: [process.env.PORTFOLIO_URL, process.env.DASHBOARD_URL],
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//   })
// );

app.use(
  cors({
    origin: [process.env.PORTFOLIO_URL, process.env.CORS_ORIGIN,"http://localhost:5173","https://myportfoliozone.online"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./public/temp",
  })
);

//import routes

import userRouter from "./routes/user.route.js";
import messageRouter from "./routes/message.route.js";
import projectRouter from "./routes/project.route.js";
import skillRouter from "./routes/skill.route.js";
import applicationRouter from "./routes/application.route.js";
import timelineRoute from "./routes/timeline.route.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/project", projectRouter);
app.use("/api/v1/skill", skillRouter);
app.use("/api/v1/application", applicationRouter);
app.use("/api/v1/timeline", timelineRoute);

export { app };
