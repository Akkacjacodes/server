const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const app = express();

app.use(express.json()); // Ensure express can parse JSON bodies
app.use(cors()); // Apply CORS for all routes

app.post("/api/submit-form", async (req, res) => {
  console.log("Received body: ", req.body); // Log incoming data

  const body = {
    ...req.body,
    access_key: process.env.WEB3FORMS_ACCESS_KEY,
  };

  console.log("Sending to Web3Forms: ", body); // Log data being sent

  try {
    const apiResponse = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const apiData = await apiResponse.json();
    console.log("Response from Web3Forms: ", apiData); // Log response data

    if (apiData.success) {
      res
        .status(200)
        .send({ success: true, message: "Form submitted successfully." });
    } else {
        console.log(apiData)
      res
        .status(500)
        .send({
          success: false,
          message: "Failed to submit form.",
          data: apiData,
        });
    }
  } catch (error) {
    console.error("Error submitting form to Web3Forms:", error);
    res.status(500).send({ success: false, message: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
