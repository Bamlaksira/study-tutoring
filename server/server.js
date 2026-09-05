const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json({ limit: "100kb" }));

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const ADMIN_KEY = process.env.ADMIN_KEY || "studycare-admin";

// ===============================
// HEALTH CHECK
// ===============================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "StudyCare backend is running",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// ===============================
// HELPERS
// ===============================

const clean = (value) => {
  if (value === undefined || value === null) return "";
  return String(value).trim();
};

const requireAdmin = (req, res, next) => {
  if (req.headers["x-admin-key"] !== ADMIN_KEY) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  next();
};

// ===============================
// FREE GUIDE LEADS
// ===============================

const leadSchema = new mongoose.Schema(
  {
    parentName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    grade: {
      type: String,
      required: true,
      trim: true,
    },

    childName: {
      type: String,
      default: "",
      trim: true,
    },

    subject: {
      type: String,
      default: "",
      trim: true,
    },

    city: {
      type: String,
      default: "",
      trim: true,
    },

    location: {
      type: String,
      default: "",
      trim: true,
    },

    area: {
      type: String,
      default: "",
      trim: true,
    },

    country: {
      type: String,
      default: "",
      trim: true,
    },

    preferredLanguage: {
      type: String,
      default: "en",
      trim: true,
    },

    mainLearningChallenge: {
      type: String,
      default: "",
      trim: true,
    },

    marketingSource: {
      type: String,
      default: "",
      trim: true,
    },

    heardAbout: {
      type: String,
      default: "",
      trim: true,
    },

    leadStatus: {
      type: String,
      enum: [
        "New",
        "Contacted",
        "Interested",
        "Consultation",
        "Enrolled",
        "Active",
        "Completed",
        "Lost",
      ],
      default: "New",
    },

    // Kept for compatibility with the existing system.
    serviceStatus: {
      type: String,
      default: "active",
    },

    utmSource: {
      type: String,
      default: "",
      trim: true,
    },

    utmMedium: {
      type: String,
      default: "",
      trim: true,
    },

    utmCampaign: {
      type: String,
      default: "",
      trim: true,
    },

    utmContent: {
      type: String,
      default: "",
      trim: true,
    },

    utmTerm: {
      type: String,
      default: "",
      trim: true,
    },

    landingPage: {
      type: String,
      default: "",
      trim: true,
    },

    referrer: {
      type: String,
      default: "",
      trim: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    strict: true,
  }
);

const Lead = mongoose.model("Lead", leadSchema);

// ===============================
// SAVE FREE GUIDE LEAD
// ===============================

app.post("/api/leads", async (req, res) => {
  try {
    const parentName = clean(req.body.parentName);
    const phone = clean(req.body.phone);
    const grade = clean(req.body.grade);

    const city = clean(req.body.city || req.body.location);

    if (!parentName || !phone || !grade || !city) {
      return res.status(400).json({
        success: false,
        message: "Parent name, phone, grade and location are required.",
      });
    }

    const marketingSource = clean(
      req.body.marketingSource || req.body.heardAbout
    );

    const lead = await Lead.create({
      parentName,
      phone,
      grade,

      childName: clean(req.body.childName),
      subject: clean(req.body.subject),

      city,
      location: city,
      area: clean(req.body.area),
      country: clean(req.body.country),

      preferredLanguage: clean(req.body.preferredLanguage) || "en",

      mainLearningChallenge: clean(
        req.body.mainLearningChallenge || req.body.challenge
      ),

      marketingSource,
      heardAbout: marketingSource,

      leadStatus: "New",
      serviceStatus: "active",

      utmSource: clean(req.body.utmSource),
      utmMedium: clean(req.body.utmMedium),
      utmCampaign: clean(req.body.utmCampaign),
      utmContent: clean(req.body.utmContent),
      utmTerm: clean(req.body.utmTerm),

      landingPage: clean(req.body.landingPage),
      referrer: clean(req.body.referrer),

      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log("New StudyCare lead saved:", lead._id);

    res.status(201).json({
      success: true,
      message: "Lead saved successfully.",
      leadId: lead._id,
    });
  } catch (error) {
    console.error("Lead save error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to save the lead.",
    });
  }
});

// ===============================
// GET LEADS - ADMIN
// ===============================

app.get("/api/leads", requireAdmin, async (req, res) => {
  try {
    const leads = await Lead.find()
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      leads,
    });
  } catch (error) {
    console.error("Get leads error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to retrieve leads.",
    });
  }
});

// ===============================
// UPDATE LEAD STATUS - ADMIN
// ===============================

app.patch("/api/leads/:id/status", requireAdmin, async (req, res) => {
  try {
    const allowedStatuses = [
      "New",
      "Contacted",
      "Interested",
      "Consultation",
      "Enrolled",
      "Active",
      "Completed",
      "Lost",
    ];

    const status = clean(req.body.status);

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lead status.",
      });
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lead ID.",
      });
    }

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      {
        leadStatus: status,
        updatedAt: new Date(),
      },
      {
        new: true,
      }
    );

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found.",
      });
    }

    res.json({
      success: true,
      message: "Lead status updated.",
      lead,
    });
  } catch (error) {
    console.error("Update lead status error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to update lead status.",
    });
  }
});

// ===============================
// PAID ONBOARDING
// ===============================

const onboardingSchema = new mongoose.Schema(
  {
    // Student
    childName: { type: String, required: true, trim: true },
    preferredName: { type: String, default: "", trim: true },
    age: { type: String, default: "", trim: true },
    dateOfBirth: { type: String, default: "", trim: true },
    grade: { type: String, required: true, trim: true },
    school: { type: String, default: "", trim: true },
    gender: { type: String, default: "", trim: true },

    // Parent
    parentName: { type: String, required: true, trim: true },
    relationship: { type: String, default: "", trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, default: "", trim: true },
    city: { type: String, default: "", trim: true },
    location: { type: String, default: "", trim: true },
    area: { type: String, default: "", trim: true },
    country: { type: String, default: "", trim: true },
    preferredLanguage: { type: String, default: "en", trim: true },
    heardAbout: { type: String, default: "", trim: true },

    // Academics
    subjects: { type: [String], default: [] },
    strongestSubjects: { type: String, default: "", trim: true },
    interestedSubject: { type: String, default: "", trim: true },
    strugglingSubject: { type: String, default: "", trim: true },
    currentPerformance: { type: String, default: "", trim: true },
    recentResults: { type: String, default: "", trim: true },
    difficultTopics: { type: String, default: "", trim: true },
    homeworkSituation: { type: String, default: "", trim: true },
    academicConcern: { type: String, default: "", trim: true },

    // Strengths / challenges
    strengths: { type: String, default: "", trim: true },
    learningChallenges: { type: String, default: "", trim: true },
    freeTimeActivities: { type: String, default: "", trim: true },
    motivation: { type: String, default: "", trim: true },
    dislikes: { type: String, default: "", trim: true },

    // Study habits
    studyRoutine: { type: String, default: "", trim: true },
    studyDuration: { type: String, default: "", trim: true },
    concentration: { type: String, default: "", trim: true },
    distractions: { type: String, default: "", trim: true },
    independentStudy: { type: String, default: "", trim: true },
    examPreparation: { type: String, default: "", trim: true },
    homeworkHabits: { type: String, default: "", trim: true },

    // Learning preferences
    learningStyle: { type: String, default: "", trim: true },
    helpfulSupport: { type: [String], default: [] },

    // Goals
    goals: { type: [String], default: [] },
    mainGoals: { type: String, default: "", trim: true },
    oneMonthGoal: { type: String, default: "", trim: true },
    threeMonthGoal: { type: String, default: "", trim: true },
    upcomingExam: { type: String, default: "", trim: true },
    targetGrade: { type: String, default: "", trim: true },
    studentGoal: { type: String, default: "", trim: true },
    studentDifficulty: { type: String, default: "", trim: true },

    // Schedule
    preferredStudyTime: { type: [String], default: [] },
    unavailableTimes: { type: String, default: "", trim: true },
    sessionsPerWeek: { type: String, default: "", trim: true },
    sessionLength: { type: String, default: "", trim: true },
    learningMode: { type: String, default: "", trim: true },

    // Environment
    quietPlace: { type: String, default: "", trim: true },
    devices: { type: String, default: "", trim: true },
    internetConnection: { type: String, default: "", trim: true },

    // Previous tutoring
    previousTutoring: { type: String, default: "", trim: true },
    previousTutoringDetails: { type: String, default: "", trim: true },
    whatWorked: { type: String, default: "", trim: true },
    whatDidNotWork: { type: String, default: "", trim: true },

    // Parent expectations
    parentConcern: { type: String, default: "", trim: true },
    parentExpectations: { type: String, default: "", trim: true },
    progressUpdates: { type: String, default: "", trim: true },

    // Additional
    additionalInformation: { type: String, default: "", trim: true },
    expectations: { type: String, default: "", trim: true },

    serviceStatus: {
      type: String,
      default: "new",
      trim: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    strict: true,
  }
);

const Onboarding = mongoose.model("Onboarding", onboardingSchema);

// ===============================
// SAVE PAID ONBOARDING
// ===============================

app.post("/api/onboarding", async (req, res) => {
  try {
    const childName = clean(req.body.childName);
    const grade = clean(req.body.grade);
    const parentName = clean(req.body.parentName);
    const phone = clean(req.body.phone);

    if (!childName || !grade || !parentName || !phone) {
      return res.status(400).json({
        success: false,
        message:
          "Child name, grade, parent name and phone are required.",
      });
    }

    const onboarding = await Onboarding.create({
      ...req.body,

      childName,
      grade,
      parentName,
      phone,

      location: clean(req.body.location || req.body.city),
      city: clean(req.body.city || req.body.location),
      area: clean(req.body.area),
      country: clean(req.body.country),
      preferredLanguage:
        clean(req.body.preferredLanguage) || "en",

      updatedAt: new Date(),
    });

    console.log(
      "New StudyCare onboarding saved:",
      onboarding._id
    );

    res.status(201).json({
      success: true,
      message: "Onboarding submitted successfully.",
      onboardingId: onboarding._id,
    });
  } catch (error) {
    console.error("Onboarding save error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to save onboarding.",
    });
  }
});

// ===============================
// GET ONBOARDING - ADMIN
// ===============================

app.get("/api/onboarding", requireAdmin, async (req, res) => {
  try {
    const onboarding = await Onboarding.find()
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      onboarding,
    });
  } catch (error) {
    console.error("Get onboarding error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to retrieve onboarding records.",
    });
  }
});

// ===============================
// UPDATE ONBOARDING STATUS - ADMIN
// ===============================

app.patch(
  "/api/onboarding/:id/status",
  requireAdmin,
  async (req, res) => {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid onboarding ID.",
        });
      }

      const status = clean(req.body.status);

      if (!status) {
        return res.status(400).json({
          success: false,
          message: "Status is required.",
        });
      }

      const record = await Onboarding.findByIdAndUpdate(
        req.params.id,
        {
          serviceStatus: status,
          updatedAt: new Date(),
        },
        { new: true }
      );

      if (!record) {
        return res.status(404).json({
          success: false,
          message: "Onboarding record not found.",
        });
      }

      res.json({
        success: true,
        message: "Onboarding status updated.",
        onboarding: record,
      });
    } catch (error) {
      console.error("Update onboarding status error:", error);

      res.status(500).json({
        success: false,
        message: "Unable to update onboarding status.",
      });
    }
  }
);

// ===============================
// 404
// ===============================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found.",
  });
});

// ===============================
// ERROR HANDLER
// ===============================

app.use((err, req, res, next) => {
  console.error("Server error:", err);

  res.status(500).json({
    success: false,
    message: "Internal server error.",
  });
});

// ===============================
// DATABASE + SERVER
// ===============================

async function startServer() {
  try {
    if (!MONGO_URI) {
      console.error("MONGO_URI is missing.");
      process.exit(1);
    }

    await mongoose.connect(MONGO_URI);

    console.log("Connected to MongoDB successfully");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`StudyCare backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
}

startServer();
