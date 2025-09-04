import express from "express";
import upload from "./config/multer.js";
import { deleteFile, getFiles, saveSignature } from "./config/multer.js";

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

router.get("/download/:filename", (req, res) => {
  const filePath = path.join("uploads", req.params.filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "Fichier introuvable" });
  }

  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${req.params.filename}"`
  );
  res.setHeader("Content-Type", "application/octet-stream");

  res.sendFile(filePath, { root: "." });
});

router.delete("/delete/:filename", deleteFile);
router.get("/files", getFiles);
router.post("signature", saveSignature)
export default router;
