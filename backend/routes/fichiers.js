const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { url } = require('inspector');

const router = express.Router();

const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 10000000 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ["text/plain", "application/pdf", "image/jpeg", "image/png"];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Type de fichier non autorisé"));
        }
    }
});

router.post('/upload', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Aucun fichier téléchargé' });
        }

        res.json({
            success: true,
            name: req.file.filename,
            size: req.file.size,
            type: req.file.mimetype,
            url: `uploads/${req.file.filename}`
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors du traitement du fichier' });
    }
});

router.delete('/delete/:filename', (req, res) => {
    try {
        const filepath = path.join("uploads", req.params.filename);
        if (!fs.existsSync(filepath)) {
            return res.status(404).json({ message: 'Fichier non trouvé' });
        }
        fs.unlinkSync(filepath);
        res.json({ success: true, message: 'Fichier supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression du fichier'});
    }
});

setInterval(() => {
    const now = Date.now();
    const files = fs.readdirSync("uploads");
    files.forEach(file => {
        const filepath = path.join("uploads", file);
        const stats = fs.statSync(filepath);
        if (now - stats.mtimeMs > 24 * 60 * 60 * 1000) {
            fs.unlinkSync(filepath);
        }
    });
}, 60 * 60 * 1000);

module.exports = router;