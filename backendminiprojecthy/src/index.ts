import express, { Application, Request, Response, NextFunction } from "express";
import { FE_PORT, PORT } from "./config"
import RegisterRouter from "./routers/register.router";
import LoginRouter from "./routers/login.router";
import profileRouter from './routers/profile.router';
import DashboardRouter from './routers/dashboard.router'; // Import DashboardRouter
import cors from 'cors';
import EventRouter from './routers/event.router';
import helmet from 'helmet';

const port = PORT || 5000;
const app: Application = express();

app.use(helmet());
//middleware
app.use(cors({
  origin: FE_PORT, // frontend Local Host
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
    res.status(200).send("ini API event_management");
  }
);




app.use("/auth", RegisterRouter)
app.use("/auth",LoginRouter)
app.use('/profile', profileRouter);
app.use('/organizer', DashboardRouter);
app.use('/events', EventRouter);





// Jalankan server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});