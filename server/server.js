const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


// =====================================================
// 1. FREE GUIDE LEAD SCHEMA
// =====================================================
const onboardingSchema = new mongoose.Schema({

  // CHILD
  childName: { type: String, required: true },
  preferredName: { type: String, default: "" },
  age: { type: String, default: "" },
  dateOfBirth: { type: String, default: "" },
  grade: { type: String, required: true },
  school: { type: String, default: "" },
  gender: { type: String, default: "" },

  // PARENT
  parentName: { type: String, required: true },
  relationship: { type: String, default: "" },
  phone: { type: String, required: true },
  email: { type: String, default: "" },
  city: { type: String, default: "" },
  heardAbout: { type: String, default: "" },

  // ACADEMICS
  subjects: { type: [String], default: [] },
  strongestSubjects: { type: String, default: "" },
  interestedSubject: { type: String, default: "" },
  strugglingSubject: { type: String, default: "" },
  currentPerformance: { type: String, default: "" },
  recentResults: { type: String, default: "" },
  difficultTopics: { type: String, default: "" },
  homeworkSituation: { type: String, default: "" },
  academicConcern: { type: String, default: "" },

  // STRENGTHS / CHALLENGES
  strengths: { type: String, default: "" },
  learningChallenges: { type: String, default: "" },
  freeTimeActivities: { type: String, default: "" },
  motivation: { type: String, default: "" },
  dislikes: { type: String, default: "" },

  // STUDY HABITS
  studyRoutine: { type: String, default: "" },
  studyDuration: { type: String, default: "" },
  concentration: { type: String, default: "" },
  distractions: { type: String, default: "" },
  independentStudy: { type: String, default: "" },
  examPreparation: { type: String, default: "" },
  homeworkHabits: { type: String, default: "" },

  // LEARNING PREFERENCES
  learningStyle: { type: String, default: "" },
  helpfulSupport: { type: [String], default: [] },

  // GOALS
  goals: { type: [String], default: [] },
  mainGoals: { type: String, default: "" },
  oneMonthGoal: { type: String, default: "" },
  threeMonthGoal: { type: String, default: "" },
  upcomingExam: { type: String, default: "" },
  targetGrade: { type: String, default: "" },

  // STUDENT VOICE
  studentGoal: { type: String, default: "" },
  studentDifficulty: { type: String, default: "" },

  // SCHEDULE
  preferredStudyTime: { type: [String], default: [] },
  unavailableTimes: { type: String, default: "" },
  sessionsPerWeek: { type: String, default: "" },
  sessionLength: { type: String, default: "" },
  learningMode: { type: String, default: "" },

  // ENVIRONMENT
  quietPlace: { type: String, default: "" },
  devices: { type: [String], default: [] },
  internetConnection: { type: String, default: "" },

  // PREVIOUS SUPPORT
  previousTutoring: { type: String, default: "" },
  previousTutoringDetails: { type: String, default: "" },
  whatWorked: { type: String, default: "" },
  whatDidNotWork: { type: String, default: "" },

  // PARENT EXPECTATIONS
  parentConcern: { type: String, default: "" },
  parentExpectations: { type: String, default: "" },
  progressUpdates: { type: String, default: "" },

  // ADDITIONAL
  additionalInformation: { type: String, default: "" },

  serviceStatus: {
    type: String,
    default: "active"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

const Lead = mongoose.model("Lead", leadSchema);


// =====================================================
// 2. PARENT & CHILD ONBOARDING SCHEMA
// =====================================================


  // ---------------- CHILD INFORMATION ----------------

  childName: {
    type: String,
    required: true
  },

  age: {
    type: String,
    default: ""
  },

  dateOfBirth: {
    type: String,
    default: ""
  },

  grade: {
    type: String,
    required: true
  },

  school: {
    type: String,
    default: ""
  },

  preferredName: {
    type: String,
    default: ""
  },

  gender: {
    type: String,
    default: ""
  },


  // ---------------- PARENT INFORMATION ----------------

  parentName: {
    type: String,
    required: true
  },

  relationship: {
    type: String,
    default: ""
  },

  phone: {
    type: String,
    required: true
  },

  email: {
    type: String,
    default: ""
  },

  city: {
    type: String,
    default: ""
  },

  heardAbout: {
    type: String,
    default: ""
  },


  // ---------------- SUBJECTS ----------------

  subjects: {
    type: [String],
    default: []
  },

  interestedSubject: {
    type: String,
    default: ""
  },

  strugglingSubject: {
    type: String,
    default: ""
  },


  // ---------------- GOALS ----------------

  goals: {
    type: [String],
    default: []
  },

  mainGoals: {
    type: String,
    default: ""
  },


  // ---------------- LEARNING STYLE ----------------

  learningStyle: {
    type: String,
    default: ""
  },

  strengths: {
    type: String,
    default: ""
  },

  learningChallenges: {
    type: String,
    default: ""
  },

  freeTimeActivities: {
    type: String,
    default: ""
  },


  // ---------------- DAILY ROUTINE ----------------

  preferredStudyTime: {
    type: [String],
    default: []
  },

  unavailableTimes: {
    type: String,
    default: ""
  },


  // ---------------- LEARNING ENVIRONMENT ----------------

  quietPlace: {
    type: String,
    default: ""
  },

  devices: {
    type: [String],
    default: []
  },

  internetConnection: {
    type: String,
    default: ""
  },


  // ---------------- ADDITIONAL INFORMATION ----------------

  additionalInformation: {
    type: String,
    default: ""
  },

  expectations: {
    type: String,
    default: ""
  },


  // ---------------- SERVICE INFORMATION ----------------

  serviceStatus: {
    type: String,
    default: "active"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

const Onboarding = mongoose.model("Onboarding", onboardingSchema);


// =====================================================
// 3. FREE GUIDE LEAD SUBMISSION
// =====================================================
app.post("/api/onboarding", async (req, res) => {

  try {

    const {
      childName,
      grade,
      parentName,
      phone
    } = req.body;

    if (!childName || !grade || !parentName || !phone) {
      return res.status(400).json({
        message:
          "Please provide the child's name, grade, parent name and phone number."
      });
    }

    const newOnboarding = new Onboarding({
      ...req.body,
      serviceStatus: "active"
    });

    await newOnboarding.save();

    console.log(
      "New paid-client onboarding saved:",
      newOnboarding
    );

    res.status(201).json({
      success: true,
      message:
        "Onboarding information saved successfully.",
      onboardingId: newOnboarding._id
    });

  } catch (error) {

    console.error(
      "Error saving onboarding information:",
      error
    );

    res.status(500).json({
      message:
        "Unable to save onboarding information."
    });

  }

});





// =====================================================
// 4. ADMIN - GET FREE GUIDE LEADS
// =====================================================

app.get("/api/leads", async (req, res) => {

  try {

    const adminKey = req.headers["x-admin-key"];


    if (!adminKey || adminKey !== process.env.ADMIN_KEY) {

      return res.status(401).json({

        message: "Unauthorized"

      });

    }


    const leads = await Lead
      .find()
      .sort({ createdAt: -1 });


    res.json(leads);


  } catch (error) {

    console.error("Error fetching leads:", error);


    res.status(500).json({

      message: "Something went wrong."

    });

  }

});


// =====================================================
// 5. PAID CLIENT ONBOARDING SUBMISSION
// =====================================================

app.post("/api/onboarding", async (req, res) => {

  try {

    const {

      childName,
      age,
      dateOfBirth,
      grade,
      school,
      preferredName,
      gender,

      parentName,
      relationship,
      phone,
      email,
      city,
      heardAbout,

      subjects,
      interestedSubject,
      strugglingSubject,

      goals,
      mainGoals,

      learningStyle,
      strengths,
      learningChallenges,
      freeTimeActivities,

      preferredStudyTime,
      unavailableTimes,

      quietPlace,
      devices,
      internetConnection,

      additionalInformation,
      expectations

    } = req.body;


    // Required information

    if (!childName || !grade || !parentName || !phone) {

      return res.status(400).json({

        message:
          "Please provide the child's name, grade, parent name and phone number."

      });

    }


    const newOnboarding = new Onboarding({

      childName,
      age: age || "",
      dateOfBirth: dateOfBirth || "",
      grade,
      school: school || "",
      preferredName: preferredName || "",
      gender: gender || "",

      parentName,
      relationship: relationship || "",
      phone,
      email: email || "",
      city: city || "",
      heardAbout: heardAbout || "",

      subjects: subjects || [],
      interestedSubject: interestedSubject || "",
      strugglingSubject: strugglingSubject || "",

      goals: goals || [],
      mainGoals: mainGoals || "",

      learningStyle: learningStyle || "",
      strengths: strengths || "",
      learningChallenges: learningChallenges || "",
      freeTimeActivities: freeTimeActivities || "",

      preferredStudyTime: preferredStudyTime || [],
      unavailableTimes: unavailableTimes || "",

      quietPlace: quietPlace || "",
      devices: devices || [],
      internetConnection: internetConnection || "",

      additionalInformation: additionalInformation || "",
      expectations: expectations || "",

      serviceStatus: "active"

    });


    await newOnboarding.save();


    console.log(
      "New paid-client onboarding saved:",
      newOnboarding
    );


    res.status(201).json({

      success: true,

      message:
        "Onboarding information saved successfully.",

      onboardingId: newOnboarding._id

    });


  } catch (error) {

    console.error(
      "Error saving onboarding information:",
      error
    );


    res.status(500).json({

      message:
        "Unable to save onboarding information."

    });

  }

});


// =====================================================
// 6. ADMIN - GET PAID CLIENT ONBOARDING FORMS
// =====================================================

app.get("/api/onboarding", async (req, res) => {

  try {

    const adminKey = req.headers["x-admin-key"];


    if (!adminKey || adminKey !== process.env.ADMIN_KEY) {

      return res.status(401).json({

        message: "Unauthorized"

      });

    }


    const onboardingForms = await Onboarding
      .find()
      .sort({ createdAt: -1 });


    res.json(onboardingForms);


  } catch (error) {

    console.error(
      "Error fetching onboarding forms:",
      error
    );


    res.status(500).json({

      message: "Something went wrong."

    });

  }

});


// =====================================================
// 7. TEST ROUTE
// =====================================================

app.get("/", (req, res) => {

  res.send(
    "StudyCare backend is running with MongoDB!"
  );

});


// =====================================================
// 8. CONNECT TO MONGODB
// =====================================================

mongoose
  .connect(process.env.MONGO_URI)

  .then(() => {

    console.log(
      "Connected to MongoDB successfully"
    );


    app.listen(
      PORT,
      "0.0.0.0",
      () => {

        console.log(
          `StudyCare backend running on port ${PORT}`
        );

      }
    );

  })

  .catch((error) => {

    console.error(
      "MongoDB connection failed:",
      error
    );

  });
