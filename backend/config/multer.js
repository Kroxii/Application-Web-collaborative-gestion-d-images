import multer from "multer";
import path from "path";
import fs from "fs";
import { fileTypeFromFile } from "file-type";

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

export async function saveSignature(req, res) {
  try {
    const { filename, signature } = req.body;

    if (!filename || !signature) {
      return res.status(400).json({ message: "Fichier ou signature manquant." });
    }

    const base64Data = signature.replace(/^data:image\/png;base64,/, "");

    
    const signatureFilename = `${filename}-signature.png`;
    const signatureDir = path.resolve("signatures");

    
    if (!fs.existsSync(signatureDir)) {
      fs.mkdirSync(signatureDir, { recursive: true });
    }

   
    const filePath = path.join(signatureDir, signatureFilename);

    
    fs.writeFileSync(filePath, base64Data, "base64");

    res.status(200).json({ message: "Signature sauvegardée.", path: `/signatures/${signatureFilename}` });

  } catch (error) {
    console.error("Erreur lors de l'enregistrement de la signature :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
}

const fileFilter = async (req, file, cb) => {
  const allowedExt = ["png", "jpg", "jpeg", "pdf", "txt"];
  const ext = path.extname(file.originalname).slice(1).toLowerCase();

  if (!allowedExt.includes(ext)) {
    return cb(new Error("Extension non autorisée."), false);
  }

  const type = await fileTypeFromFile(file.path);
  if (type && !allowedExt.includes(type.ext)) {
    return cb(new Error("Le fichier ne correspond pas à son extension."), false);
  }

  cb(null, true);
};

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
