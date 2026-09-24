const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const examPurchaseSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      default: "",
    },

    productId: {
      type: String,
      required: true,
    },

    productName: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    transactionReference: {
      type: String,
      required: true,
      trim: true,
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },

    accessStatus: {
      type: String,
      enum: ["Locked", "Unlocked"],
      default: "Locked",
    },

    paidAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const ExamPurchase = mongoose.model("ExamPurchase", examPurchaseSchema);
const freeQuizLeadSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: true,
      trim: true,
    },
    parentName: {
      type: String,
      required: true,
      trim: true,
    },
    parentPhone: {
      type: String,
      required: true,
      trim: true,
    },
    parentEmail: {
      type: String,
      trim: true,
      default: "",
    },
    region: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    preferredLanguage: {
      type: String,
      trim: true,
      default: "",
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    score: {
      type: Number,
      required: true,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    percentage: {
      type: Number,
      required: true,
    },
    marketingConsent: {
      type: Boolean,
      default: false,
    },
    marketingConsentAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const FreeQuizLead = mongoose.model("FreeQuizLead", freeQuizLeadSchema);
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
app.post("/api/exam-purchases", async (req, res) => {
  try {
    const {
      customerName,
      phone,
      email,
      productId,
      productName,
      amount,
      transactionReference,
    } = req.body;

    if (
      !customerName ||
      !phone ||
      !productId ||
      !productName ||
      !amount ||
      !transactionReference
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required payment information.",
      });
    }

    const existingPurchase = await ExamPurchase.findOne({
      transactionReference: transactionReference.trim(),
    });

    if (existingPurchase) {
      return res.status(409).json({
        success: false,
        message: "This transaction reference has already been submitted.",
      });
    }

    const purchase = await ExamPurchase.create({
      customerName: customerName.trim(),
      phone: phone.trim(),
      email: email ? email.trim() : "",
      productId,
      productName,
      amount,
      transactionReference: transactionReference.trim(),
      paymentStatus: "Pending",
      accessStatus: "Locked",
    });

    res.status(201).json({
      success: true,
      message:
        "Payment information submitted successfully. Your payment will be verified before access is granted.",
      purchaseId: purchase._id,
    });
  } catch (error) {
    console.error("Exam purchase error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to submit payment information.",
    });
  }
});

app.post("/api/free-quiz-leads", async (req, res) => {
  try {
    const {
      studentName,
      parentName,
      parentPhone,
      parentEmail,
      region,
      city,
      preferredLanguage,
      subject,
      score,
      totalQuestions,
      percentage,
      marketingConsent,
    } = req.body;

    if (
      !studentName ||
      !parentName ||
      !parentPhone ||
      !region ||
      !city ||
      !subject ||
      score === undefined ||
      totalQuestions === undefined ||
      percentage === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Please complete all required information.",
      });
    }

    const lead = await FreeQuizLead.create({
      studentName: studentName.trim(),
      parentName: parentName.trim(),
      parentPhone: parentPhone.trim(),
      parentEmail: parentEmail?.trim() || "",
      region: region.trim(),
      city: city.trim(),
      preferredLanguage: preferredLanguage?.trim() || "",
      subject: subject.trim(),
      score: Number(score),
      totalQuestions: Number(totalQuestions),
      percentage: Number(percentage),
      marketingConsent: Boolean(marketingConsent),
      marketingConsentAt: marketingConsent ? new Date() : null,
    });

    res.status(201).json({
      success: true,
      message: "Quiz result saved successfully.",
      leadId: lead._id,
    });
  } catch (error) {
    console.error("Free quiz lead error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to save quiz result.",
    });
  }
});
app.post("/api/exam-purchases/check-access", async (req, res) => {
  try {
    const {
      phone,
      transactionReference,
      productId,
    } = req.body;

    if (!phone || !transactionReference || !productId) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide your phone number, transaction reference, and product.",
      });
    }

    const purchase = await ExamPurchase.findOne({
      phone: phone.trim(),
      transactionReference: transactionReference.trim(),
      productId,
    });

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message:
          "No purchase was found with these details.",
      });
    }

    res.json({
      success: true,
      purchaseId: purchase._id,
      paymentStatus: purchase.paymentStatus,
      accessStatus: purchase.accessStatus,
    });
  } catch (error) {
    console.error(
      "Exam access check error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to check exam access.",
    });
  }
});

// ===============================
// PAID EXAM CONTENT
// ===============================

const paidExamQuestions = {
  "grade6-mathematics": [
    {
      id: "g6math-4",
      order: 4,
      question: "What is 6 × 9?",
      options: ["45", "54", "63", "72"],
      correctAnswer: "54",
      explanation: "6 × 9 = 54.",
    },
  ],
  "grade6-english": [
    {
      id: "g6eng-4",
      order: 4,
      question: "What is the main idea of paragraph 3?",
      options: ["The role of effective study strategies","The roles of diagrams and charts in learning","The role of using different suitable learning methods","Maintaining a healthy life style is part of effective study skills"],
      correctAnswer: "The role of using different suitable learning methods",
      explanation: "Paragraph 3 focuses on choosing different learning methods according to individual needs, as well as regular review and practice.",
    },
    {
      id: "g6eng-5",
      order: 5,
      question: "As used in paragraph 1, line 3, the pronoun ‘they’ refers to:",
      options: ["study habits","academic pursuits","students","clear goals"],
      correctAnswer: "students",
      explanation: "The sentence says: “When students know what they need to learn...” Therefore, they refers to students.",
    },
    {
      id: "g6eng-6",
      order: 6,
      question: "What does the pronoun ‘This’ in paragraph 2, line 2, refer to?",
      options: ["Finding a quiet and comfortable study place","Managing time more effectively","Developing good study habits","Using active learning techniques"],
      correctAnswer: "Finding a quiet and comfortable study place",
      explanation: "The previous sentence says it is important to find a quiet, comfortable place to study. This refers to that action.",
    },
    {
      id: "g6eng-7",
      order: 7,
      question: "In paragraph 3, line 3, what does the pronoun ‘others’ refer to?",
      options: ["Study skills","Learning methods","Students who prefer listening or reading books","Students who may benefit from visual aids"],
      correctAnswer: "Students who prefer listening or reading books",
      explanation: "The passage says some students benefit from visual aids, while others may prefer listening to lectures or reading textbooks. Therefore, “others” refers to those students.",
    },
    {
      id: "g6eng-8",
      order: 8,
      question: "As used in paragraph 2, line 2, the word ‘retain’ means:",
      options: ["keep","lose","release","forget"],
      correctAnswer: "keep",
      explanation: "To retain information means to keep information in your memory.",
    },
    {
      id: "g6eng-9",
      order: 9,
      question: "In paragraph 2, line 4, the word ‘enhance’ means:",
      options: ["diminish","improve","reduce","hinder"],
      correctAnswer: "improve",
      explanation: "“Enhance” means to improve or make something better.",
    },
    {
      id: "g6eng-10",
      order: 10,
      question: "As used in paragraph 3, line 6, what does the word ‘reinforce’ mean?",
      options: ["Strengthen","Erode","Weaken","Undermine"],
      correctAnswer: "Strengthen",
      explanation: "“Reinforce learning” means to strengthen learning or make the knowledge stronger in memory.",
    },
    {
      id: "g6eng-11",
      order: 11,
      question: "Farmers cultivate teff and coffee in the fertile soil during the rainy season. In this sentence, the meaning of ‘cultivate’ is:",
      options: ["grow","destroy","cut","abandon"],
      correctAnswer: "grow",
      explanation: "To cultivate crops means to grow and take care of them.",
    },
    {
      id: "g6eng-12",
      order: 12,
      question: "Lack of water for their animals is one of the big challenges for people who live in deserts. Meaning of ‘challenges’:",
      options: ["supports","advantages","resources","problems"],
      correctAnswer: "problems",
      explanation: "A challenge is a difficult situation or problem that someone has to deal with.",
    },
    {
      id: "g6eng-13",
      order: 13,
      question: "Schools are the best places for students to gain the knowledge they need for their future careers. Meaning of ‘gain’:",
      options: ["get","forget","lose","control"],
      correctAnswer: "get",
      explanation: "Here, gain knowledge means to get or acquire knowledge.",
    },
    {
      id: "g6eng-14",
      order: 14,
      question: "Success in learning demands hard work, motivation and commitment from students. ‘demands’ means:",
      options: ["accepts","avoids","offers","requires"],
      correctAnswer: "requires",
      explanation: "“Demands” means requires something.",
    },
    {
      id: "g6eng-15",
      order: 15,
      question: "One of the characteristics of honest students is that they don’t deny the mistake they have made. Meaning of ‘deny’:",
      options: ["Admit","Confirm","Reject","Accept"],
      correctAnswer: "Reject",
      explanation: "To deny a mistake means to say that you did not make it or to reject the truth of it.",
    },
    {
      id: "g6eng-16",
      order: 16,
      question: "It is proved that water ______ at 100°C.",
      options: ["boils","is boiling","boiled","boil"],
      correctAnswer: "boils",
      explanation: "We use simple present for general facts and scientific truths. Water boils at 100°C.",
    },
    {
      id: "g6eng-17",
      order: 17,
      question: "Mother: Is your brother at home?\nDaughter: ______",
      options: ["Yes, he is not.","No, he is.","Yes, he does.","Yes, he is."],
      correctAnswer: "Yes, he is.",
      explanation: "The question uses the verb is, so the short positive answer is Yes, he is.",
    },
    {
      id: "g6eng-18",
      order: 18,
      question: "Among all the books I have read so far, this one is ______.",
      options: ["more interesting","the most interesting","interesting","less interesting"],
      correctAnswer: "the most interesting",
      explanation: "We are comparing one book with all the other books, so we use the superlative form.",
    },
    {
      id: "g6eng-19",
      order: 19,
      question: "Hanna: ______\nBeletu: No. I am doing my homework.",
      options: ["Have you washed your clothes?","Are you washing your clothes?","Were you washing your clothes?","Did you wash your clothes?"],
      correctAnswer: "Are you washing your clothes?",
      explanation: "“I am doing my homework” describes an action happening now, so the question should use the present continuous.",
    },
    {
      id: "g6eng-20",
      order: 20,
      question: "Teacher: ______ students are there in the classroom?\nStudent: There are ten students.",
      options: ["How much","How often","How far","How many"],
      correctAnswer: "How many",
      explanation: "Students are countable nouns, so we use How many.",
    },
    {
      id: "g6eng-21",
      order: 21,
      question: "Alemitu is a clever student and I like ______ handwriting.",
      options: ["hers","she","her","herself"],
      correctAnswer: "her",
      explanation: "We need a possessive adjective before the noun handwriting. Her is the correct choice.",
    },
    {
      id: "g6eng-22",
      order: 22,
      question: "Alemu: I feel sick.\nZenaw: You had better go to hospital and see a doctor.\nAlemu: Ok. Thanks.",
      options: ["What should I do?","Do you feel the same?","When should I go?","Why I should go?"],
      correctAnswer: "What should I do?",
      explanation: "“I feel sick” naturally leads to “What should I do?” before receiving advice.",
    },
    {
      id: "g6eng-23",
      order: 23,
      question: "Teacher: ______ the class work?\nStudents: No, we haven’t.",
      options: ["Do you finish","Did you finish","Have you finished","Will you finish"],
      correctAnswer: "Have you finished",
      explanation: "The answer uses the present perfect auxiliary have, so the question is Have you finished...?",
    },
    {
      id: "g6eng-24",
      order: 24,
      question: "Almaz: ______ you come home and help me tomorrow? I have a lot to do.\nHanna: Ok.",
      options: ["Do","Will","Did","Are"],
      correctAnswer: "Will",
      explanation: "Tomorrow refers to the future. Will you...? is used to ask about a future action.",
    },
    {
      id: "g6eng-25",
      order: 25,
      question: "The baby ______ loudly immediately after its mother leaves.",
      options: ["cry","cries","cryes","cries"],
      correctAnswer: "cries",
      explanation: "The subject is singular, so the verb needs the singular form. Cry changes to cries because it ends in consonant + y.",
    },
    {
      id: "g6eng-26",
      order: 26,
      question: "There is a little cloud in the sky, but it ______ rain in the afternoon.",
      options: ["should","has to","may","must"],
      correctAnswer: "may",
      explanation: "May is used to express possibility.",
    },
    {
      id: "g6eng-27",
      order: 27,
      question: "My brother is good at language. He ______ speak three languages fluently.",
      options: ["should","could","may","can"],
      correctAnswer: "can",
      explanation: "Can is used to express ability.",
    },
    {
      id: "g6eng-28",
      order: 28,
      question: "Yesterday, we ______ to school early.",
      options: ["go","went","gone","goes"],
      correctAnswer: "went",
      explanation: "Yesterday indicates the past, and the past tense of go is went.",
    },
    {
      id: "g6eng-29",
      order: 29,
      question: "Active Voice: Many people speak English.\nPassive Voice:",
      options: ["English is spoken by many people.","English has been spoken by many people.","English was spoken by many people.","English is being spoken by many people."],
      correctAnswer: "English is spoken by many people.",
      explanation: "The active sentence is in the simple present. The passive form is object + am/is/are + past participle.",
    },
    {
      id: "g6eng-30",
      order: 30,
      question: "Which is conditional sentence Type 1?",
      options: ["If she studies hard, she will pass the exam.","If she studied hard, she would pass the exam.","If she studied hard, she passed the exam.","If she had studied hard, she would have passed the exam."],
      correctAnswer: "If she studies hard, she will pass the exam.",
      explanation: "The first conditional uses If + simple present, followed by will + base verb.",
    },
    {
      id: "g6eng-31",
      order: 31,
      question: "Student 1: ______\nStudent 2: It is very warm.",
      options: ["Do you like the weather of your village?","Do you think it will rain today?","How’s the weather of your village?","Is the weather suitable to grow rice?"],
      correctAnswer: "How’s the weather of your village?",
      explanation: "The answer “It is very warm” describes the weather.",
    },
    {
      id: "g6eng-32",
      order: 32,
      question: "I ______ today’s lesson very much. It is very entertaining.",
      options: ["dislike","like","hate","don’t prefer"],
      correctAnswer: "like",
      explanation: "“Very entertaining” expresses a positive opinion, so like is the correct answer.",
    },
    {
      id: "g6eng-33",
      order: 33,
      question: "Belay: ______\nHenok: I like bread with rice.",
      options: ["When did you eat your breakfast?","Do you like to eat your breakfast?","What do you like for your breakfast?","How often do you eat your breakfast?"],
      correctAnswer: "What do you like for your breakfast?",
      explanation: "The answer gives the food Henok likes for breakfast.",
    },
    {
      id: "g6eng-34",
      order: 34,
      question: "Father: Do you like your new shoes?\nSon: Yes. They ______ comfortable and attractive.",
      options: ["are","can","will","have"],
      correctAnswer: "are",
      explanation: "Comfortable and attractive are adjectives describing the plural subject they, so we use are.",
    },
    {
      id: "g6eng-35",
      order: 35,
      question: "Person 1: ______, it is wrong to allow children to use mobile phones.\nPerson 2: You are right. It is not good for their health.",
      options: ["I don’t agree","I don’t believe","In my opinion","I don’t care"],
      correctAnswer: "In my opinion",
      explanation: "In my opinion is used to introduce a person's view or opinion.",
    },
    {
      id: "g6eng-36",
      order: 36,
      question: "Student 1: Thanks to the government, these days big cities are becoming more attractive and comfortable.\nStudent 2: ______ and the same thing should be done to small cities.",
      options: ["I don’t agree with you","I agree with you","Good morning to you","I’m fine thank you"],
      correctAnswer: "I agree with you",
      explanation: "The second speaker agrees with the first speaker's statement.",
    },
    {
      id: "g6eng-37",
      order: 37,
      question: "Which sentence is correctly punctuated?",
      options: ["Do you know the answer of this question,","All of you stand up,","Our teacher is absent today;","They love their country so much."],
      correctAnswer: "They love their country so much.",
      explanation: "This is a complete statement and is correctly ended with a full stop.",
    },
    {
      id: "g6eng-38",
      order: 38,
      question: "Disordered words (brother/like/my/banana/doesn’t). Correct order:",
      options: ["Banana doesn’t like my brother.","My brother not does like banana.","Banana my brother doesn’t like.","My brother doesn’t like banana."],
      correctAnswer: "My brother doesn’t like banana.",
      explanation: "The correct structure is subject + does not/doesn’t + base verb + object.",
    },
    {
      id: "g6eng-39",
      order: 39,
      question: "All the windows and the door are closed, ______ our classroom is very hot.",
      options: ["but","so","and","for"],
      correctAnswer: "so",
      explanation: "So is used to show a result.",
    },
    {
      id: "g6eng-40",
      order: 40,
      question: "My uncle is a very rich man, ______ he is not happy.",
      options: ["so","and","for","yet"],
      correctAnswer: "yet",
      explanation: "Yet is used to show contrast.",
    },
  ],
};

app.post("/api/exams/paid-content", async (req, res) => {
  try {
    const {
      phone,
      transactionReference,
      productId,
    } = req.body;

    if (!phone || !transactionReference || !productId) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide your phone number, transaction reference, and product.",
      });
    }

    const purchase = await ExamPurchase.findOne({
      phone: phone.trim(),
      transactionReference: transactionReference.trim(),
      productId,
      paymentStatus: "Approved",
      accessStatus: "Unlocked",
    });

    if (!purchase) {
      return res.status(403).json({
        success: false,
        message:
          "Full access has not been approved for this exam.",
      });
    }

    const questions = paidExamQuestions[productId] || [];

    res.json({
      success: true,
      productId,
      questions,
    });
  } catch (error) {
    console.error("Paid exam content error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load paid exam content.",
    });
  }
});
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

app.get("/api/free-quiz-leads", async (req, res) => {
  try {
    const adminKey = req.headers["x-admin-key"];

    if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    const leads = await FreeQuizLead.find()
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      leads,
    });
  } catch (error) {
    console.error("Free quiz leads error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load free quiz leads.",
    });
  }
});
app.get("/api/exam-purchases", async (req, res) => {
  try {
    if (req.headers["x-admin-key"] !== process.env.ADMIN_KEY) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const purchases = await ExamPurchase.find()
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      purchases,
    });
  } catch (error) {
    console.error("Exam purchases fetch error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch exam purchases.",
    });
  }
});

app.patch("/api/exam-purchases/:id/status", async (req, res) => {
  try {
    if (req.headers["x-admin-key"] !== process.env.ADMIN_KEY) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { paymentStatus } = req.body;

    if (!["Approved", "Rejected", "Pending"].includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment status.",
      });
    }

    const update = {
      paymentStatus,
    };

    if (paymentStatus === "Approved") {
      update.accessStatus = "Unlocked";
      update.paidAt = new Date();
    } else {
      update.accessStatus = "Locked";
      update.paidAt = null;
    }

    const purchase = await ExamPurchase.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    );

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: "Purchase not found.",
      });
    }

    res.json({
      success: true,
      message: `Payment ${paymentStatus.toLowerCase()} successfully.`,
      purchase,
    });
  } catch (error) {
    console.error("Exam purchase status error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update payment status.",
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
