import express from "express";
import upload from "./config/multer.js";
import { deleteFile } from "./config/multer.js";

const router = express.Router();

router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Aucun fichier reçu." });
  }

  res.json({
    message: "Fichier uploadé avec succès.",
    filename: req.file.filename,
  });
});

router.delete("/delete/:filename", deleteFile);

export default router;
