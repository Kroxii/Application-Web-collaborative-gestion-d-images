import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const originalName = path.parse(file.originalname).name;
    const ext = path.extname(file.originalname);
    const safeName = originalName.replace(/[^a-zA-Z0-9-_]/g, "_");
    cb(null, `${safeName}-${timestamp}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 3 * 1024 * 1024 }, // 3 Mo max
  fileFilter: (req, file, cb) => {
    const allowed = [
      "text/plain",
      "application/pdf",
      "image/jpeg",
      "image/png",
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Type de fichier non supporté."));
    }
  },
});

export function deleteFile(req, res) {
  try {
    const filepath = path.join("uploads", req.params.filename);
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ message: "Fichier non trouvé" });
    }
    fs.unlinkSync(filepath);
    res.json({ success: true, message: "Fichier supprimé avec succès" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression du fichier" });
  }
}
  
export function getFiles(req, res) {
  try {
    const files = fs.readdirSync("uploads").map(file => {
      const stats = fs.statSync(path.join("uploads", file));
      return {
        name: file,
        size: stats.size,
        type: path.extname(file),
        url: `/uploads/${file}`,
        uploadedAt: stats.birthtime
      };
    });
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: "Erreur lecture fichiers" });
  }
};

export default upload;
