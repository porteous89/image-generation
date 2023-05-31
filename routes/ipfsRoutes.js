// ipfsRoutes.js

const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const FormData = require("form-data");
const { Readable } = require("stream"); // Import Readable from 'stream'

router.post("/upload-to-ipfs", async (req, res) => {
  const { imageUrl } = req.body;

  const response = await fetch(imageUrl);
  const data = await response.buffer();

  // Convert the buffer to a readable stream
  const readableStream = new Readable();
  readableStream.push(data);
  readableStream.push(null);

  const formData = new FormData();
  formData.append("file", readableStream, {
    filename: "image.jpg",
    contentType: "image/jpeg",
    knownLength: data.length,
  }); // Adjust the filename and contentType as necessary

  const result = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + process.env.PINATA_JWT,
    },
    body: formData,
  });

  if (!result.ok) {
    const errorDetails = await result.json(); // To get more details about the error
    res
      .status(500)
      .json({ error: "Error uploading file to Pinata", details: errorDetails });
    return;
  }

  const resultData = await result.json();
  res.json({ ipfsHash: resultData.IpfsHash });
});

module.exports = router;
