const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { ImageAnnotatorClient } = require("@google-cloud/vision");
const multer = require("multer");
const fs = require("fs");
const cors=require("cors");


// Create a new Express app
const app = express();

// Set up middleware to parse incoming request bodies
app.use(express.json());
app.use(cors())
app.use(express.urlencoded({ extended: false }));

// Set up a route to handle file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    const fileName = uuidv4();
    cb(null, fileName + ".jpg");
  },
});
const upload = multer({ storage: storage });
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    // Get the uploaded file name
    const fileName = req.file.filename;

    // Read the file data and pass it to the Google Cloud Vision API for analysis
    const visionClient = new ImageAnnotatorClient();
    const [result] = await visionClient.labelDetection(`./uploads/${fileName}`);
    const labels = result.labelAnnotations.map((label) => label.description);

    // Return the generated tags to the client
    res.json({ tags: labels });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});


process.env.GOOGLE_APPLICATION_CREDENTIALS = './awesome-destiny-378211-957cb723ebf3.json';