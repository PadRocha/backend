import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import api from "./routes/api.routes";
import config from "./config/config";

const app = express();

/*------------------------------------------------------------------*/
// Settings
/*------------------------------------------------------------------*/

app.set("trust proxy", true);
app.set("env", config.ENV);
app.set("port", process.env.PORT || 4000);
const storage = multer.diskStorage({
  destination: path.join(__dirname, "uploads"),
  filename: (req, file, cb) =>
    cb(null, uuidv4() + path.extname(file.originalname).toLowerCase()),
});

/*------------------------------------------------------------------*/
// Middlewares
/*------------------------------------------------------------------*/

if (app.get("env") === "development") {
  app.use(morgan("dev"));
}
app.use(cors());
app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  multer({
    storage,
    dest: path.join(__dirname, "uploads"),
    fileFilter(req, file, cb: any) {
      var filetypes = /jpeg|jpg|png|gif/;
      var mimetype = filetypes.test(file.mimetype);
      var extname = filetypes.test(
        path.extname(file.originalname).toLowerCase(),
      );
      if (mimetype && extname) return cb(null, true);
      cb(
        `Error: File upload only supports the following filetypes - ${filetypes}`,
      );
    },
    limits: { fileSize: 1000000 },
  }).single("image"),
);

/*------------------------------------------------------------------*/
// Routes
/*------------------------------------------------------------------*/

app.use("/api", api);

/*------------------------------------------------------------------*/

export default app;
