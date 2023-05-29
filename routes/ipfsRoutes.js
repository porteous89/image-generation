// ipfsRoutes.js

const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const FormData = require("form-data");

router.post("/upload-to-ipfs", async (req, res) => {
  const { imageUrl } = req.body;

  const response = await fetch(imageUrl);
  const data = await response.buffer();

  const formData = new FormData();
  formData.append("file", data);

  const result = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
    method: "POST",
    headers: {
      pinata_api_key: process.env.PINATA_API_KEY,
      pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
    },
    body: formData,
  });

  if (!result.ok) {
    res.status(500).json({ error: "Error uploading file to Pinata" });
    return;
  }

  const resultData = await result.json();
  res.json({ ipfsHash: resultData.IpfsHash });
});

module.exports = router;
