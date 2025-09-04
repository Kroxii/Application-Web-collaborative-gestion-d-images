import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import router from "./route.js";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors({
  origin: 'http://127.0.0.1:5500', 
  credentials: true,            
}))

app.use(express.json());
app.use('/', router);

app.listen(PORT, (error) => {
  if (!error)
    console.log(
      "Server is Successfully Running, and App is listening on port http://localhost:" + PORT
    );
  else console.log("Error occurred, server can't start", error);
});

