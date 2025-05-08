"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = require("./config");
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const expireTask_1 = require("./utils/cron/expireTask");
const register_router_1 = __importDefault(require("./routers/register.router"));
const login_router_1 = __importDefault(require("./routers/login.router"));
const profile_router_1 = __importDefault(require("./routers/profile.router"));
const dashboard_router_1 = __importDefault(require("./routers/dashboard.router")); // Import DashboardRouter
const event_router_1 = __importDefault(require("./routers/event.router"));
const verify_router_1 = __importDefault(require("./routers/verify.router"));
const port = config_1.PORT || 5000;
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
//middleware
app.use((0, cors_1.default)({
    origin: config_1.FE_PORT, // frontend Local Host
    credentials: true
}));
app.use(express_1.default.json());
app.get("/api", (req, res, next) => {
    console.log("test masuk");
    next();
}, (req, res, next) => {
    res.status(200).send("ini API event_management kita");
});
app.use("/auth", register_router_1.default);
app.use("/auth", login_router_1.default);
app.use("/auth", verify_router_1.default); // ✅ Tambahkan ini
app.use('/profile', profile_router_1.default);
app.use('/organizer', dashboard_router_1.default);
app.use('/events', event_router_1.default);
// Jalankan server
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
(0, expireTask_1.startExpireCronJob)();
