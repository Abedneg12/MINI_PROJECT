import express, { Application, Request, Response, NextFunction } from "express";
import { FE_PORT, PORT } from "./config"
import helmet from 'helmet';
import cors from 'cors';
import cron from 'node-cron';
import { startExpireCronJob } from './utils/cron/expireTask';


import RegisterRouter from "./routers/register.router";
import LoginRouter from "./routers/login.router";
import profileRouter from './routers/profile.router';
import DashboardRouter from './routers/dashboard.router';
import EventRouter from './routers/event.router';
import verifyRouter from './routers/verify.router';
import myEVent from './routers/event.organizer.router';
import ResetPassword from './routers/reset.password.router';


const port = PORT || 5000;
const app: Application = express();

app.use(helmet());

app.use(cors({
  origin: FE_PORT,
  credentials: true
}));
app.use(express.json());

app.get(
  "/api",
  (req: Request, res: Response, next: NextFunction) => {
    console.log("test masuk");
    next()
  },
  (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send("ini API event_management kita");
  }
);

app.use("/auth", RegisterRouter);
app.use("/auth", LoginRouter);
app.use("/auth", verifyRouter); 
app.use('/profile', profileRouter);
app.use('/organizer', DashboardRouter);
app.use('/events', EventRouter);
app.use('/organizer', myEVent);
app.use('/act', ResetPassword);


app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
startExpireCronJob();