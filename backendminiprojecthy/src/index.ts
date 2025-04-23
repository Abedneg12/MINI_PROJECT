import express, { Application, Request, Response, NextFunction } from "express";
import { PORT } from "./config"
import RegisterRouter from "./routers/register.router";
import LoginRouter from "./routers/login.router";
import profileRouter from './routers/profile.router';
import DashboardRouter from './routers/dashboard.router'; // Import DashboardRouter
import cors from 'cors';
import EventRouter from './routers/event.router';

const port = PORT || 5000;
const app: Application = express();

//middleware
app.use(cors({
  origin: 'http://localhost:3000', // frontend kamu
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