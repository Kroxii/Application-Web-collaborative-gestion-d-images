const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const fileRoutes = require('./routes/fichiers');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("uploads", express.static("uploads"));

app.use('/api/files', fileRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Le serveur est lancé sur le ${PORT}`);
});