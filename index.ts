import express from "express";
import { Express } from "express";
import helmet from "helmet";
import { dbConnection } from "./database/dbConnection";
import cors from "cors";
import morgan from "morgan";
import bootstrap from "./src/modules/bootstrap";
import dotenv from "dotenv";
dotenv.config();

const app: Express = express();
dbConnection();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());
bootstrap(app);
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
