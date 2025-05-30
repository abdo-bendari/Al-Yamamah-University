"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const dbConnection_1 = require("./database/dbConnection");
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const bootstrap_1 = __importDefault(require("./src/modules/bootstrap"));
dotenv_1.default.config();
const app = (0, express_1.default)();
(0, dbConnection_1.dbConnection)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
app.use((0, helmet_1.default)());
(0, bootstrap_1.default)(app);
const port = process.env.PORT || 5000;
const host = process.env.HOST || "0.0.0.0";
app.listen(port, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
app.get("/test", (req, res) => {
    res.json({ message: "API is working!" });
});
