const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB Lead Schema
const leadSchema = new mongoose.Schema({
  parentName: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  grade: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    default: ""
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Lead = mongoose.model("Lead", leadSchema);

// Receive a new parent lead
app.post("/api/leads", async (req, res) => {
  try {
    const {
      parentName,
      phone,
      grade,
      subject
    } = req.body;

    if (!parentName || !phone || !grade) {
      return res.status(400).json({
        message: "Please provide your name, phone number and child's grade."
      });
    }

    const newLead = new Lead({
      parentName,
      phone,
      grade,
      subject: subject || ""
    });

    await newLead.save();

    console.log("New lead saved:", newLead);

    res.status(201).json({
      success: true,
      message: "Lead saved successfully."
    });

  } catch (error) {
    console.error("Error saving lead:", error);

    res.status(500).json({
      message: "Something went wrong."
    });
  }
});

// Test route
app.get("/", (req, res) => {
  res.send("StudyCare backend is running with MongoDB!");
});

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB successfully");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`StudyCare backend running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
  });
