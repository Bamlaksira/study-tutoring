const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// Render provides PORT automatically.
// 5000 is used when running locally.
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// =====================================================
// 1. FREE GUIDE LEAD SCHEMA
// =====================================================

const leadSchema = new mongoose.Schema({
  // CHILD
  childName: {
    type: String,
    required: true
  },

  preferredName: {
    type: String,
    default: ""
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

  gender: {
    type: String,
    default: ""
  },

  // PARENT
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

  // ACADEMICS
  subjects: {
    type: [String],
    default: []
  },

  strongestSubjects: {
    type: String,
    default: ""
  },

  interestedSubject: {
    type: String,
    default: ""
  },

  strugglingSubject: {
    type: String,
    default: ""
  },

  currentPerformance: {
    type: String,
    default: ""
  },

  recentResults: {
    type: String,
    default: ""
  },

  difficultTopics: {
    type: String,
    default: ""
  },

  homeworkSituation: {
    type: String,
    default: ""
  },

  academicConcern: {
    type: String,
    default: ""
  },

  // STRENGTHS / CHALLENGES
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

  motivation: {
    type: String,
    default: ""
  },

  dislikes: {
    type: String,
    default: ""
  },

  // STUDY HABITS
  studyRoutine: {
    type: String,
    default: ""
  },

  studyDuration: {
    type: String,
    default: ""
  },

  concentration: {
    type: String,
    default: ""
  },

  distractions: {
    type: String,
    default: ""
  },

  independentStudy: {
    type: String,
    default: ""
  },

  examPreparation: {
    type: String,
    default: ""
  },

  homeworkHabits: {
    type: String,
    default: ""
  },

  // LEARNING PREFERENCES
  learningStyle: {
    type: String,
    default: ""
  },

  helpfulSupport: {
    type: [String],
    default: []
  },

  // GOALS
  goals: {
    type: [String],
    default: []
  },

  mainGoals: {
    type: String,
    default: ""
  },

  oneMonthGoal: {
    type: String,
    default: ""
  },

  threeMonthGoal: {
    type: String,
    default: ""
  },

  upcomingExam: {
    type: String,
    default: ""
  },

  targetGrade: {
    type: String,
    default: ""
  },

  // STUDENT VOICE
  studentGoal: {
    type: String,
    default: ""
  },

  studentDifficulty: {
    type: String,
    default: ""
  },

  // SCHEDULE
  preferredStudyTime: {
    type: [String],
    default: []
  },

  unavailableTimes: {
    type: String,
    default: ""
  },

  sessionsPerWeek: {
    type: String,
    default: ""
  },

  sessionLength: {
    type: String,
    default: ""
  },

  learningMode: {
    type: String,
    default: ""
  },

  // ENVIRONMENT
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

  // PREVIOUS SUPPORT
  previousTutoring: {
    type: String,
    default: ""
  },

  previousTutoringDetails: {
    type: String,
    default: ""
  },

  whatWorked: {
    type: String,
    default: ""
  },

  whatDidNotWork: {
    type: String,
    default: ""
  },

  // PARENT EXPECTATIONS
  parentConcern: {
    type: String,
    default: ""
  },

  parentExpectations: {
    type: String,
    default: ""
  },

  progressUpdates: {
    type: String,
    default: ""
  },

  // ADDITIONAL
  additionalInformation: {
    type: String,
    default: ""
  },

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
// 2. PAID CLIENT ONBOARDING SCHEMA
// =====================================================

const onboardingSchema = new mongoose.Schema({
  // CHILD INFORMATION
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

  // PARENT INFORMATION
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

  // ACADEMICS
  subjects: {
    type: [String],
    default: []
  },

  strongestSubjects: {
    type: String,
    default: ""
  },

  interestedSubject: {
    type: String,
    default: ""
  },

  strugglingSubject: {
    type: String,
    default: ""
  },

  currentPerformance: {
    type: String,
    default: ""
  },

  recentResults: {
    type: String,
    default: ""
  },

  difficultTopics: {
    type: String,
    default: ""
  },

  homeworkSituation: {
    type: String,
    default: ""
  },

  academicConcern: {
    type: String,
    default: ""
  },

  // STRENGTHS / CHALLENGES
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

  motivation: {
    type: String,
    default: ""
  },

  dislikes: {
    type: String,
    default: ""
  },

  // STUDY HABITS
  studyRoutine: {
    type: String,
    default: ""
  },

  studyDuration: {
    type: String,
    default: ""
  },

  concentration: {
    type: String,
    default: ""
  },

  distractions: {
    type: String,
    default: ""
  },

  independentStudy: {
    type: String,
    default: ""
  },

  examPreparation: {
    type: String,
    default: ""
  },

  homeworkHabits: {
    type: String,
    default: ""
  },

  // LEARNING PREFERENCES
  learningStyle: {
    type: String,
    default: ""
  },

  helpfulSupport: {
    type: [String],
    default: []
  },

  // GOALS
  goals: {
    type: [String],
    default: []
  },

  mainGoals: {
    type: String,
    default: ""
  },

  oneMonthGoal: {
    type: String,
    default: ""
  },

  threeMonthGoal: {
    type: String,
    default: ""
  },

  upcomingExam: {
    type: String,
    default: ""
  },

  targetGrade: {
    type: String,
    default: ""
  },

  // STUDENT VOICE
  studentGoal: {
    type: String,
    default: ""
  },

  studentDifficulty: {
    type: String,
    default: ""
  },

  // SCHEDULE
  preferredStudyTime: {
    type: [String],
    default: []
  },

  unavailableTimes: {
    type: String,
    default: ""
  },

  sessionsPerWeek: {
    type: String,
    default: ""
  },

  sessionLength: {
    type: String,
    default: ""
  },

  learningMode: {
    type: String,
    default: ""
  },

  // LEARNING ENVIRONMENT
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

  // PREVIOUS SUPPORT
  previousTutoring: {
    type: String,
    default: ""
  },

  previousTutoringDetails: {
    type: String,
    default: ""
  },

  whatWorked: {
    type: String,
    default: ""
  },

  whatDidNotWork: {
    type: String,
    default: ""
  },

  // PARENT EXPECTATIONS
  parentConcern: {
    type: String,
    default: ""
  },

  parentExpectations: {
    type: String,
    default: ""
  },

  progressUpdates: {
    type: String,
    default: ""
  },

  // ADDITIONAL
  additionalInformation: {
    type: String,
    default: ""
  },

  expectations: {
    type: String,
    default: ""
  },

  // SERVICE
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
// 3. HEALTH CHECK
// =====================================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "StudyCare backend is running"
  });
});


// =====================================================
// 4. FREE GUIDE LEAD SUBMISSION
// =====================================================

app.post("/api/leads", async (req, res) => {
  try {
    const {
      childName,
      grade,
      parentName,
      phone
    } = req.body;

    if (!childName || !grade || !parentName || !phone) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide the child's name, grade, parent name and phone number."
      });
    }

    const newLead = new Lead({
      ...req.body,
      serviceStatus: "active"
    });

    await newLead.save();

    console.log("New free-guide lead saved:", newLead._id);

    res.status(201).json({
      success: true,
      message: "Lead saved successfully.",
      leadId: newLead._id
    });

  } catch (error) {
    console.error("Error saving lead:", error);

    res.status(500).json({
      success: false,
      message: "Unable to save lead."
    });
  }
});


// =====================================================
// 5. ADMIN - GET FREE GUIDE LEADS
// =====================================================

app.get("/api/leads", async (req, res) => {
  try {
    const adminKey = req.headers["x-admin-key"];

    if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
      return res.status(401).json({
        success: false,
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
      success: false,
      message: "Something went wrong."
    });
  }
});


// =====================================================
// 6. PAID CLIENT ONBOARDING SUBMISSION
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
      strongestSubjects,
      interestedSubject,
      strugglingSubject,
      currentPerformance,
      recentResults,
      difficultTopics,
      homeworkSituation,
      academicConcern,

      strengths,
      learningChallenges,
      freeTimeActivities,
      motivation,
      dislikes,

      studyRoutine,
      studyDuration,
      concentration,
      distractions,
      independentStudy,
      examPreparation,
      homeworkHabits,

      learningStyle,
      helpfulSupport,

      goals,
      mainGoals,
      oneMonthGoal,
      threeMonthGoal,
      upcomingExam,
      targetGrade,

      studentGoal,
      studentDifficulty,

      preferredStudyTime,
      unavailableTimes,
      sessionsPerWeek,
      sessionLength,
      learningMode,

      quietPlace,
      devices,
      internetConnection,

      previousTutoring,
      previousTutoringDetails,
      whatWorked,
      whatDidNotWork,

      parentConcern,
      parentExpectations,
      progressUpdates,

      additionalInformation,
      expectations
    } = req.body;

    // Required information
    if (!childName || !grade || !parentName || !phone) {
      return res.status(400).json({
        success: false,
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
      strongestSubjects: strongestSubjects || "",
      interestedSubject: interestedSubject || "",
      strugglingSubject: strugglingSubject || "",
      currentPerformance: currentPerformance || "",
      recentResults: recentResults || "",
      difficultTopics: difficultTopics || "",
      homeworkSituation: homeworkSituation || "",
      academicConcern: academicConcern || "",

      strengths: strengths || "",
      learningChallenges: learningChallenges || "",
      freeTimeActivities: freeTimeActivities || "",
      motivation: motivation || "",
      dislikes: dislikes || "",

      studyRoutine: studyRoutine || "",
      studyDuration: studyDuration || "",
      concentration: concentration || "",
      distractions: distractions || "",
      independentStudy: independentStudy || "",
      examPreparation: examPreparation || "",
      homeworkHabits: homeworkHabits || "",

      learningStyle: learningStyle || "",
      helpfulSupport: helpfulSupport || [],

      goals: goals || [],
      mainGoals: mainGoals || "",
      oneMonthGoal: oneMonthGoal || "",
      threeMonthGoal: threeMonthGoal || "",
      upcomingExam: upcomingExam || "",
      targetGrade: targetGrade || "",

      studentGoal: studentGoal || "",
      studentDifficulty: studentDifficulty || "",

      preferredStudyTime: preferredStudyTime || [],
      unavailableTimes: unavailableTimes || "",
      sessionsPerWeek: sessionsPerWeek || "",
      sessionLength: sessionLength || "",
      learningMode: learningMode || "",

      quietPlace: quietPlace || "",
      devices: devices || [],
      internetConnection: internetConnection || "",

      previousTutoring: previousTutoring || "",
      previousTutoringDetails: previousTutoringDetails || "",
      whatWorked: whatWorked || "",
      whatDidNotWork: whatDidNotWork || "",

      parentConcern: parentConcern || "",
      parentExpectations: parentExpectations || "",
      progressUpdates: progressUpdates || "",

      additionalInformation: additionalInformation || "",
      expectations: expectations || "",

      serviceStatus: "active"
    });

    await newOnboarding.save();

    console.log(
      "New paid-client onboarding saved:",
      newOnboarding._id
    );

    res.status(201).json({
      success: true,
      message: "Onboarding information saved successfully.",
      onboardingId: newOnboarding._id
    });

  } catch (error) {
    console.error(
      "Error saving onboarding information:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to save onboarding information."
    });
  }
});


// =====================================================
// 7. ADMIN - GET PAID CLIENT ONBOARDING
// =====================================================

app.get("/api/onboarding", async (req, res) => {
  try {
    const adminKey = req.headers["x-admin-key"];

    if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
      return res.status(401).json({
        success: false,
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
      success: false,
      message: "Something went wrong."
    });
  }
});


// =====================================================
// 8. START SERVER
// =====================================================

// IMPORTANT:
// Start Express immediately so Render can detect the port.
// MongoDB connects separately below.

app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `StudyCare backend running on port ${PORT}`
  );
});


// =====================================================
// 9. CONNECT TO MONGODB
// =====================================================

if (!process.env.MONGO_URI) {
  console.error(
    "WARNING: MONGO_URI is not defined."
  );
} else {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log(
        "Connected to MongoDB successfully"
      );
    })
    .catch((error) => {
      console.error(
        "MongoDB connection failed:",
        error.message
      );
    });
}
