const express = require("express");
const cors = require("cors");
const fs = require("fs");
var path = require("path")
require("dotenv").config();

const app = express();
app.use(cors());
app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", function(_req, res) {
  res.sendFile(process.cwd() + "/public/index.html");
});

const multer = require("multer");
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, "public/uploads/"),
  filename: (_req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

// Speficies where file should be stored
const uploads = multer({ storage: storage });

/**
 * Displays the new name of the file
 * @param {express.Request} req - Request object 
 * @param {express.Response} res - Response object 
 * @param {express.NextFunction} next - The next callback function
 */   
function displayName(req, res, next) {
  res.send(req.file.originalname + " was saved as " + req.file.filename + "!");
  next();
}

app.post("/api/uploaded", uploads.single("upfile"), displayName);

app.listen(3334, () => {
  console.log("Your app is listening on port 3334");
});

app.get("/audio/:audio", (req, res) => {
    

  const filePath = process.cwd() + "/public/uploads/" + req.params.audio;

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(400).send("File not found");
  }
});