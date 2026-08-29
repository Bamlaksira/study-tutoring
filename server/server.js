const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const leadsFile = path.join(__dirname, "leads.json");

// Receive a new parent lead
app.post("/api/leads", (req, res) => {
  try {
    const {
      parentName,
      phone,
      grade,
      subject
    } = req.body;

    // Basic validation
    if (!parentName || !phone || !grade) {
      return res.status(400).json({
        message: "Please provide your name, phone number and child's grade."
      });
    }

    const leads = JSON.parse(
      fs.readFileSync(leadsFile, "utf8")
    );

    const newLead = {
      id: Date.now(),
      parentName,
      phone,
      grade,
      subject: subject || "",
      createdAt: new Date().toISOString()
    };

    leads.push(newLead);

    fs.writeFileSync(
      leadsFile,
      JSON.stringify(leads, null, 2)
    );

    console.log("New lead:", newLead);

    res.status(201).json({
      success: true,
      message: "Lead saved successfully."
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Something went wrong."
    });
  }
});

// Test route
app.get("/", (req, res) => {
  res.send("StudyCare backend is running!");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`StudyCare backend running on port ${PORT}`);
});