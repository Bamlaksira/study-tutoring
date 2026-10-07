const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");const examPurchaseSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true,
    },

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

    grade: {
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
      required: true,
      trim: true,
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
  studentName,
  parentName,
  phone,
  email,
  grade,
  city,
  preferredLanguage,
  productId,
  productName,
  amount,
  transactionReference,
} = req.body;

    if (
  !customerName ||
  !studentName ||
  !parentName ||
  !phone ||
  !grade ||
  !city ||
  !preferredLanguage ||
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
  studentName: studentName.trim(),
  parentName: parentName.trim(),
  phone: phone.trim(),
  email: email ? email.trim() : "",
  grade: grade.trim(),
  city: city.trim(),
  preferredLanguage: preferredLanguage.trim(),
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
  "grade6-2016-amharic": [
  {
    id: 4,
    order: 4,
    question: "“ውጤት-ኣማ-ነት-ም” በትክክል ሲጻፍ የቱ ነው?",
    options: [
      "ሀ. ውጤትአማነትም",
      "ለ. ውጤታ-ማነትም",
      "ሐ. ውጤት-አማነት",
      "መ. ውጤታማነትም"
    ],
    correctAnswer: "መ",
    explanation: "“ውጤት-ኣማ-ነት-ም” በትክክል “ውጤታማነትም” ይሆናል።"
  },
  {
    id: 5,
    order: 5,
    question: "“ደራ” የሚለው ቃል ተቃራኒ ፍቺ የቱ ነው?",
    options: [
      "ሀ. ቀዘቀዘ",
      "ለ. ሞቀ",
      "ሐ. ፈሰሰ",
      "መ. ተንቀሳቀሰ"
    ],
    correctAnswer: "ሀ",
    explanation: "“ደራ” የሚለው ቃል ተቃራኒ ፍቺ “ቀዘቀዘ” ነው።"
  },
  {
    id: 6,
    order: 6,
    question: "“ታረስ” የሚለው ቃል ቀጥተኛ ፍቺ የቱ ነው?",
    options: [
      "ሀ. ተዘራ",
      "ለ. ተሰበሰበ",
      "ሐ. እማሬያዊ",
      "መ. ተቆፈረ"
    ],
    correctAnswer: "ሐ",
    explanation: "በተሰጠው አውድ የቃሉ ቀጥተኛ ፍቺ እማሬያዊ ነው።"
  },
  {
    id: 7,
    order: 7,
    question: "“ዓይን” በምሳሌያዊ ፍቺ ሲጠቀም ምን ማለት ይችላል?",
    options: [
      "ሀ. እይታ",
      "ለ. ዋና",
      "ሐ. ፊት",
      "መ. እውቀት"
    ],
    correctAnswer: "ለ",
    explanation: "በተሰጠው አውድ “ዓይን” በምሳሌያዊ ፍቺ “ዋና” ማለት ነው።"
  },
  {
    id: 8,
    order: 8,
    question: "“ልብስ” በተሰጠው አውድ ትክክለኛው ንባብ የቱ ነው?",
    options: [
      "ሀ. ልበስ",
      "ለ. ልብስ",
      "ሐ. ልብሰ",
      "መ. ጠብቆ"
    ],
    correctAnswer: "መ",
    explanation: "በተሰጠው አውድ ትክክለኛው መልስ “ጠብቆ” ነው።"
  },
  {
    id: 9,
    order: 9,
    question: "“የህጻናትን” በቅርጸ ቃል ትክክለኛው ክፍፍል የቱ ነው?",
    options: [
      "ሀ. የ-ህጻናት-ን",
      "ለ. የ-ህጻን-ኣት-ን",
      "ሐ. የህጻን-ኣት-ን",
      "መ. የ-ህጻን-ን"
    ],
    correctAnswer: "ለ",
    explanation: "“የህጻናትን” በቅርጸ ቃል የ-ህጻን-ኣት-ን ተብሎ ይከፋፈላል።"
  },
  {
    id: 10,
    order: 10,
    question: "“በየቤታችን” ውስጥ ነጻ ሞርፊም የቱ ነው?",
    options: [
      "ሀ. ቤት",
      "ለ. በየ",
      "ሐ. ኣችን",
      "መ. በ"
    ],
    correctAnswer: "ሀ",
    explanation: "“ቤት” በራሱ ትርጉም የሚሰጥ ነጻ ሞርፊም ነው።"
  },

  {
    id: 11,
    order: 11,
    question: "ለሚከተለው ንባብ ተስማሚ ርዕስ የቱ ነው?",
    options: [
      "ሀ. የሰው ልጅ ስኬት",
      "ለ. የጤናማ አእምሮ ጥቅም",
      "ሐ. የሀሳብ ጉልበት",
      "መ. የሕይወት ችግሮች"
    ],
    correctAnswer: "ሐ",
    explanation: "ንባቡ የሰው ሀሳብ በስሜት፣ በስብዕና እና በሕይወት ላይ ያለውን ተፅዕኖ ስለሚያብራራ ተስማሚው ርዕስ “የሀሳብ ጉልበት” ነው።"
  },
  {
    id: 12,
    order: 12,
    question: "እንደ ንባቡ አባባል የትኛው አስተሳሰብ ብሩህ ተስፋና ተነሳሽነት እንዲፈጠር ያደርጋል?",
    options: [
      "ሀ. አሉታዊ ማሰብ",
      "ለ. ጨለምተኛ ማሰብ",
      "ሐ. ተዛብቶ ማሰብ",
      "መ. በጎ ማሰብ"
    ],
    correctAnswer: "መ",
    explanation: "በጎ ሀሳብ ብሩህ ተስፋና ተነሳሽነት እንዲፈጠር ያደርጋል።"
  },
  {
    id: 13,
    order: 13,
    question: "እንደ ንባቡ አባባል ለአሉታዊ ስሜት መፈጠር ምክንያት የሚሆነው ምንድነው?",
    options: [
      "ሀ. በጎ ሀሳብ",
      "ለ. አሉታዊ ሀሳብ",
      "ሐ. ብሩህ ተስፋ",
      "መ. ተነሳሽነት"
    ],
    correctAnswer: "ለ",
    explanation: "አሉታዊ ሀሳብ ለአሉታዊ ስሜት መፈጠር ምክንያት ነው።"
  },
  {
    id: 14,
    order: 14,
    question: "የንባቡ ዋና ሀሳብ ምንድነው?",
    options: [
      "ሀ. የሰው ልጅ የሀሳቡ ውጤት መሆኑን ማሳየት",
      "ለ. የሰው ልጅ የሰውነት ጤናን ማሳየት",
      "ሐ. የሰው ልጅ የስራ ችሎታን ማሳየት",
      "መ. የሰው ልጅ የሀብት ሁኔታን ማሳየት"
    ],
    correctAnswer: "ሀ",
    explanation: "ንባቡ ሰው ልጅ በሚያስበው ሀሳብ እና አስተሳሰብ የሚመራ መሆኑን ያሳያል።"
  },
  {
    id: 15,
    order: 15,
    question: "“ጨለምተኛ” የሚለው ቃል በንባቡ አውድ የቱን ፍቺ ይወክላል?",
    options: [
      "ሀ. ተስፈኛ",
      "ለ. ደስተኛ",
      "ሐ. ተነሳሽ",
      "መ. ተስፋ አስቆራጭ"
    ],
    correctAnswer: "መ",
    explanation: "“ጨለምተኛ” በአውዱ ተስፋ አስቆራጭ የሚለውን ሀሳብ ይወክላል።"
  },
  {
    id: 16,
    order: 16,
    question: "“ወደ ስኬትም ያደርሳል” በሚለው አረፍተ ነገር “ያደርሳል” የሚያመለክተው ምንድነው?",
    options: [
      "ሀ. ምክንያት",
      "ለ. ሀሳብ",
      "ሐ. ውጤት",
      "መ. ስሜት"
    ],
    correctAnswer: "ሐ",
    explanation: "በዚህ አውድ “ውጤት” የሚለው መልስ ትክክል ነው።"
  },

  {
    id: 17,
    order: 17,
    question: "የሚከተለው ዓረፍተ ነገር የትኛውን የጽሑፍ ዘዴ ይወክላል?",
    options: [
      "ሀ. በአመዛዛኝ",
      "ለ. በተረክ",
      "ሐ. በገላጭ",
      "መ. በትንተና"
    ],
    correctAnswer: "ሀ",
    explanation: "የተሰጠው አቀራረብ በአመዛዛኝ ዘዴ የተጻፈ ነው።"
  },
  {
    id: 18,
    order: 18,
    question: "የሚከተለው ዓረፍተ ነገር የትኛውን የጽሑፍ ዓይነት ይወክላል?",
    options: [
      "ሀ. በትረካ",
      "ለ. በገላጭ",
      "ሐ. በአከራካሪ",
      "መ. በመግለጫ"
    ],
    correctAnswer: "ሐ",
    explanation: "የተሰጠው የጽሑፍ ዓይነት አከራካሪ ጽሑፍ ነው።"
  },
  {
    id: 19,
    order: 19,
    question: "በሚከተለው አረፍተ ነገር የተጠቀሰው የሥርዓተ ነጥብ ምልክት የቱ ነው?",
    options: [
      "ሀ. ነጥብ",
      "ለ. ድርብ ነጥብ",
      "ሐ. ነጠላ ሠረዝ",
      "መ. ጥያቄ ምልክት"
    ],
    correctAnswer: "ሐ",
    explanation: "የተጠቀሰው ምልክት ነጠላ ሠረዝ ነው።"
  },
  {
    id: 20,
    order: 20,
    question: "በተሰጠው ዓረፍተ ነገር የተጠቀሰው የሥርዓተ ነጥብ ምልክት የቱ ነው?",
    options: [
      "ሀ. ነጠላ ሠረዝ",
      "ለ. ድርብ ሠረዝ",
      "ሐ. ነጥብ",
      "መ. ጥያቄ ምልክት"
    ],
    correctAnswer: "ለ",
    explanation: "ትክክለኛው መልስ ድርብ ሠረዝ ነው።"
  },
  {
    id: 21,
    order: 21,
    question: "“ዶክተር” የሚለው ቃል በአህጽሮተ ቃል ሲጻፍ የቱ ነው?",
    options: [
      "ሀ. ዶ",
      "ለ. ዶክ.",
      "ሐ. ዶ/ክር",
      "መ. ዶ/ር"
    ],
    correctAnswer: "መ",
    explanation: "“ዶክተር” በአህጽሮተ ቃል “ዶ/ር” ተብሎ ይጻፋል።"
  },
  {
    id: 22,
    order: 22,
    question: "“... ስለሆነ” የሚለው አገናኝ ምንን ያሳያል?",
    options: [
      "ሀ. ስለሆነ",
      "ለ. ስለዚህ",
      "ሐ. ቢሆንም",
      "መ. እንዲሁም"
    ],
    correctAnswer: "ሀ",
    explanation: "“ስለሆነ” ምክንያትን የሚያሳይ አገናኝ ነው።"
  },
  {
    id: 23,
    order: 23,
    question: "የሚከተለውን ዓረፍተ ነገር በትክክለኛው አገናኝ ለማሟላት የቱ ይሆናል?",
    options: [
      "ሀ. ስለሆነ",
      "ለ. ስለዚህ",
      "ሐ. ቢሆንም",
      "መ. እንዲሁም"
    ],
    correctAnswer: "ሀ",
    explanation: "በተሰጠው አውድ ትክክለኛው አገናኝ “ስለሆነ” ነው።"
  },
  {
    id: 24,
    order: 24,
    question: "“ተቀበለ” የሚለው ግስ በተሰጠው አውድ በየትኛው መልክ ይገኛል?",
    options: [
      "ሀ. እንደሚቀበል",
      "ለ. እየተቀበለ",
      "ሐ. እንደተቀበለ",
      "መ. ሊቀበል"
    ],
    correctAnswer: "ሐ",
    explanation: "በተሰጠው አውድ ትክክለኛው መልክ “እንደተቀበለ” ነው።"
  },
  {
    id: 25,
    order: 25,
    question: "በታሪክ ውስጥ የሚንቀሳቀሱ ሰዎችን ምን እንላቸዋለን?",
    options: [
      "ሀ. ተረክ",
      "ለ. ገጸባህሪ",
      "ሐ. ጭብጥ",
      "መ. ትረካ"
    ],
    correctAnswer: "ለ",
    explanation: "በታሪክ ውስጥ የሚንቀሳቀሱ ሰዎች ገጸባህሪያት ይባላሉ።"
  },
  {
    id: 26,
    order: 26,
    question: "የአንድ ታሪክ ዋና ሀሳብ ምን ይባላል?",
    options: [
      "ሀ. ጭብጥ",
      "ለ. ገጸባህሪ",
      "መ. ተረክ"
    ],
    correctAnswer: "ሀ",
    explanation: "የአንድ ታሪክ ዋና ሀሳብ ጭብጥ ይባላል።"
  },
  {
    id: 27,
    order: 27,
    question: "የሥርዓተ ነጥብ ህግን በተመለከተ የትኛው አባባል ትክክል ነው?",
    options: [
      "ሀ. የሥርዓተ ነጥብ ህግን መከተል አስፈላጊ ነው።",
      "ለ. የሥርዓተ ነጥብ ህግ ሁልጊዜ ተመሳሳይ ነው።",
      "ሐ. የስርአተ ነጥብ ህግን መከተል አያስፈልግም፡፡",
      "መ. ሥርዓተ ነጥብ በጽሑፍ አይጠቅምም።"
    ],
    correctAnswer: "ሐ",
    explanation: "በተሰጠው ጥያቄ መሠረት የተጠቀሰው መልስ ሐ ነው።"
  },
  {
    id: 28,
    order: 28,
    question: "ከሚከተሉት የቦታ ስሞች ውስጥ የትኛው ትክክለኛ የቦታ ስም ነው?",
    options: [
      "ሀ. ሰው",
      "ለ. ባህሪ",
      "መ. ድሬዳዋ"
    ],
    correctAnswer: "መ",
    explanation: "ድሬዳዋ የቦታ ስም ነው።"
  },
  {
    id: 29,
    order: 29,
    question: "ከሚከተሉት ውስጥ የሰው ስም የቱ ነው?",
    options: [
      "ሀ. ቤት",
      "ለ. ሰው",
      "ሐ. ድሬዳዋ",
      "መ. ማታ"
    ],
    correctAnswer: "ለ",
    explanation: "ትክክለኛው መልስ “ሰው” ነው።"
  },
  {
    id: 30,
    order: 30,
    question: "“ማታ” የሚለው ቃል የትኛውን ይወክላል?",
    options: [
      "ሀ. የጊዜ",
      "ለ. የቦታ",
      "ሐ. የሰው",
      "መ. የባህሪ"
    ],
    correctAnswer: "ሀ",
    explanation: "“ማታ” የጊዜ ስም ነው።"
  },
  {
    id: 31,
    order: 31,
    question: "“ማታ ማታ” በዓረፍተ ነገር ውስጥ የትኛውን ያመለክታል?",
    options: [
      "ሀ. የቦታ ተውሳከ ግስ",
      "ለ. የጊዜ ተውሳከ ግስ",
      "ሐ. የመጠን ተውሳከ ግስ",
      "መ. ማታ ማታ"
    ],
    correctAnswer: "መ",
    explanation: "በተሰጠው ጥያቄ መሠረት ትክክለኛው መልስ መ ነው።"
  },
  {
    id: 32,
    order: 32,
    question: "“ኡ” በቃል ውስጥ ምንን ያመለክታል?",
    options: [
      "ሀ. የስም መነሻ",
      "ለ. ኡ",
      "ሐ. የግስ ምልክት",
      "መ. የቦታ ምልክት"
    ],
    correctAnswer: "ለ",
    explanation: "በተሰጠው ጥያቄ መሠረት “ኡ” ትክክለኛው መልስ ነው።"
  },
  {
    id: 33,
    order: 33,
    question: "ከሚከተሉት ውስጥ የሴት ግለሰብ ተውላጠ ስም የቱ ነው?",
    options: [
      "ሀ. እሱ",
      "ለ. እኛ",
      "ሐ. እሷ",
      "መ. እነሱ"
    ],
    correctAnswer: "ሐ",
    explanation: "“እሷ” የሴት ግለሰብ ተውላጠ ስም ነው።"
  },
  {
    id: 34,
    order: 34,
    question: "“ባህሪ” የሚለው ቃል ምንን ያመለክታል?",
    options: [
      "ሀ. ባህሪ",
      "ለ. ቦታ",
      "ሐ. ጊዜ",
      "መ. ሰው"
    ],
    correctAnswer: "ሀ",
    explanation: "“ባህሪ” የባህሪ ስምን ያመለክታል።"
  },
  {
    id: 35,
    order: 35,
    question: "የሚከተለው ቃል ምንን ይወክላል?",
    options: [
      "ሀ. ባህሪ",
      "ለ. ቦታ",
      "ሐ. ጊዜ",
      "መ. ሰው"
    ],
    correctAnswer: "ሀ",
    explanation: "በተሰጠው አውድ ቃሉ ባህሪን ይወክላል።"
  },
  {
    id: 36,
    order: 36,
    question: "ከሚከተሉት ውስጥ ተሻጋሪ ግስን የሚያሳየው የቱ ነው?",
    options: [
      "ሀ. ልጁ ሮጠ።",
      "ለ. ልጁ ተኛ።",
      "ሐ. ልጅቷ ሸጠች።",
      "መ. ልጁ ተቀመጠ።"
    ],
    correctAnswer: "ሐ",
    explanation: "“ልጅቷ ሸጠች” ተሻጋሪ ግስን ያሳያል።"
  },
  {
    id: 37,
    order: 37,
    question: "ከሚከተሉት ውስጥ የማይሻገር ግስን የሚያሳየው የቱ ነው?",
    options: [
      "ሀ. ልጅቷ ሸጠች።",
      "ለ. ልጁ ሮጠ።",
      "ሐ. ልጁ መጽሐፉን አነበበ።",
      "መ. ልጅቷ ደብዳቤ ጻፈች።"
    ],
    correctAnswer: "ለ",
    explanation: "“ልጁ ሮጠ” ማይሻገር ግስን ያሳያል።"
  },

  {
    id: 38,
    order: 38,
    question: "በሚከተለው የቃል ግጥም ውስጥ ዝንጀሮዋ የት ጊዜ ትገኛለች?",
    options: [
      "ሀ. በሰብል ጥበቃ ጊዜ",
      "ለ. በእርሻ ጊዜ",
      "ሐ. በመኸር ጊዜ",
      "መ. በዝናብ ጊዜ"
    ],
    correctAnswer: "ሀ",
    explanation: "በግጥሙ ውስጥ ዝንጀሮዋ በሰብል ጥበቃ ጊዜ ትገኛለች።"
  },
  {
    id: 39,
    order: 39,
    question: "ዝንጀሮዋ ምን ለመብላት ነው የምትፈልገው?",
    options: [
      "ሀ. ሰብሉን ለመብላት",
      "ለ. ማሽላውን ለመብላት",
      "ሐ. ማሽላውን ትታ ገብሱን ልትበላ",
      "መ. ፍሬውን ለመብላት"
    ],
    correctAnswer: "ሐ",
    explanation: "በግጥሙ መሠረት ዝንጀሮዋ ማሽላውን ትታ ገብሱን ልትበላ ነው።"
  },
  {
    id: 40,
    order: 40,
    question: "በግጥሙ መሠረት ዝንጀሮዋን ምን እንደሚጎዳት ተነግሯታል?",
    options: [
      "ሀ. ረሃብ ይጎዳሻል",
      "ለ. ተንኮል ይጎዳሻል",
      "ሐ. ድካም ይጎዳሻል",
      "መ. ብርድ ይጎዳሻል"
    ],
    correctAnswer: "ለ",
    explanation: "በግጥሙ ውስጥ “ተንኮል ይጎዳሻል” ተብሎ ተገልጿል።"
  },
  {
    id: 41,
    order: 41,
    question: "“ጡር” የሚለው ቃል በተሰጠው አውድ ምን ማለት ነው?",
    options: [
      "ሀ. ደስታ",
      "ለ. ሀዘን",
      "ሐ. ድካም",
      "መ. ጡር"
    ],
    correctAnswer: "መ",
    explanation: "በተሰጠው አውድ ትክክለኛው መልስ ጡር ነው።"
  }
],
    "grade6-amharic": [
    {
      id: "g6amharic-4",
      order: 4,
      question: "ምንባቡ የቀረበበት የአንቀጽ ማስፋፊያ ስልት የቱ ነው?",
      options: ["አመዛዛኝ", "ተራኪ", "አስረጅ", "ገላጭ"],
      correctAnswer: "ተራኪ",
      explanation:
        "ጽሑፉ “ከዕለታት አንድ ቀን...” በማለት የድርጊቶችን ቅደም ተከተል ጠብቆ ታሪክን የሚያወራ ወይም የሚተርክ በመሆኑ የተራኪ አንቀጽ ማስፋፊያ ስልትን ተጠቅሟል።",
    },
    {
      id: "g6amharic-5",
      order: 5,
      question: "ከላይ የቀረበው ምንባብ ዋነኛ መልዕክቱ (ጭብጡ) ምንድነው?",
      options: [
        "የማር ጥቅምና አመራረት",
        "የንብ ቀፎ የአሰራር ሂደት",
        "የንግስት ንቦች ተግባርና ሀላፊነት",
        "የንቦች የተደራጀ የህብረት አኗኗር",
      ],
      correctAnswer: "የንቦች የተደራጀ የህብረት አኗኗር",
      explanation:
        "ምንባቡ ስለ ንቦች ስርዓት፣ በሶስት ክፍል ተከፍለው በስራ ክፍፍልና በህብረት እንዴት ተደራጅተው እንደሚኖሩ የሚያብራራ በመሆኑ ጭብጡ የንቦች የተደራጀ የህብረት አኗኗር ነው።",
    },
    {
      id: "g6amharic-6",
      order: 6,
      question: "ለምንባቡ ተስማሚ ሊሆን የሚችለው ርዕስ የትኛው ነው?",
      options: ["የንቦች አኗኗር", "የንብ ቀፎ አሰራር", "የንብ እርባታ", "የማር አመራረት"],
      correctAnswer: "የንቦች አኗኗር",
      explanation:
        "ጽሑፉ በሙሉ ትኩረት አድርጎ የሚያስረዳው ስለ ንቦች ማህበራዊ አወቃቀር፣ ስራዎቻቸውና በህይወት ስለሚቆዩበት ሁኔታ ስለሆነ “የንቦች አኗኗር” የሚለው ርዕስ ተስማሚ ነው።",
    },
    {
      id: "g6amharic-7",
      order: 7,
      question: "በምንባቡ መሰረት “ሰራዊት” የሚለው ቃል አውዳዊ ፍቺው ምንድነው?",
      options: ["መከላከያ", "መንጋ", "ሰራተኛ", "ጭፍራ"],
      correctAnswer: "መንጋ",
      explanation:
        "በአንድ ቀፎ ውስጥ በብዛት ተሰብስበው የሚኖሩትን የንብ ስብስብ ወይም ማህበር የሚገልጽ በመሆኑ፣ ለእንስሳትና ነፍሳት ስብስብ የሚሰጠው አውዳዊ ፍቺ “መንጋ” ነው።",
    },
    {
      id: "g6amharic-8",
      order: 8,
      question: "ንግስት ንቦች በአንድ ተስማሚ ወቅት ውስጥ ምን ያህል እንቁላሎችን ይጥላሉ?",
      options: ["2ሺ", "60ሺ", "250ሺ.", "1ሚሊዮን"],
      correctAnswer: "250ሺ.",
      explanation:
        "በምንባቡ ውስጥ ንግስቷ በቀን ከ2ሺ የሚበልጡ እንቁላሎችን፤ በአንድ ተስማሚ ወቅት ውስጥ ደግሞ 250ሺ ያህል እንቁላሎችን እንደምትጥል ተገልጿል።",
    },
    {
      id: "g6amharic-9",
      order: 9,
      question: "ከሚከተሉት አማራጮች መካከል አንዱ የሰራተኛ ንቦች ተግባር አይደለም።",
      options: [
        "ምግብ ማቅረብ",
        "እንቁላል መጣል",
        "ዝርያዎቻቸውን ከአጥቂዎች መከላከል",
        "ከአበቦች ላይ ወለላ መቅሰም",
      ],
      correctAnswer: "እንቁላል መጣል",
      explanation:
        "እንቁላል መጣል የንግስት ንብ ስራ ብቻ ሲሆን፣ ምግብ ማቅረብ፣ መከላከልና ወለላ መቅሰም ግን የሰራተኛ ንቦች ተግባራት ናቸው።",
    },
    {
      id: "g6amharic-10",
      order: 10,
      question: "በአንድ ቀፎ ውስጥ የሚሰፍሩ ንቦች ብዛት ምን ያህል ይሆናል?",
      options: ["1 ሚሊዮን", "250ሺ,", "500ሺ", "60ሺ"],
      correctAnswer: "60ሺ",
      explanation:
        "በምንባቡ የመጨረሻ መስመር ላይ በአንድ ቀፎ ውስጥ የሚሰፍሩት ንቦች ብዛት እስከ 60ሺ እንደሚደርስ በግልጽ ተጽፏል።",
    },
    {
      id: "g6amharic-11",
      order: 11,
      question: "“ካነበባችሁት” የሚለው ቃል ተነጣጥሎ ሲጻፍ-----ይሆናል።",
      options: [
        "ከ - አነበባችሁ - ት",
        "ከ - እነበብ - ኣችሁት",
        "ከ - አነበብ - ኣችሁ - ት",
        "ካነበብ - ኣችሁ - ት",
      ],
      correctAnswer: "ከ - አነበብ - ኣችሁ - ት",
      explanation:
        "“ካነበባችሁት” በቃላት ክፍሎች ሲነጣጠል “ከ - አነበብ - ኣችሁ - ት” የሚለው አወቃቀር ይሆናል።",
    },
    {
      id: "g6amharic-12",
      order: 12,
      question: "“እንደ-እየ-ባህሪ-ኣችን” የሚለው ቃል ተገጣጥሞ ሲነበብ---ይሆናል።",
      options: [
        "እንደባህሪያችን",
        "እንደየባህሪያችን",
        "እንደየባህሪያችንን",
        "እየባህሪያችን",
      ],
      correctAnswer: "እንደየባህሪያችን",
      explanation:
        "የተሰጡት ክፍሎች ሲገጣጠሙ “እንደየ” እና “ባህሪያችን” በመሆን ትክክለኛው ቃል “እንደየባህሪያችን” ይሆናል።",
    },
    {
      id: "g6amharic-13",
      order: 13,
      question: "“ደባ” የሚለው ቃል መዝገበ ቃላዊ ፍቺው ምንድነው?",
      options: ["ተንኮል", "በቀል", "ፍርድ", "ህብረት"],
      correctAnswer: "ተንኮል",
      explanation:
        "“ደባ” ማለት በአንድ ሰው ላይ በምስጢር የሚሸረብ ወይም የሚደረግ ክፉ ስራ፣ ሴራ ወይም ተንኮል ማለት ነው።",
    },
    {
      id: "g6amharic-14",
      order: 14,
      question: "“ቆፈን” ለሚለው ቃል ተቃራኒ ፍቺው ምንድነው?",
      options: ["ቆዳ", "ቅርፊት", "ብርድ", "ሙቀት"],
      correctAnswer: "ሙቀት",
      explanation:
        "“ቆፈን” ማለት ብርቱ የሆነ ቅዝቃዜ ወይም ብርድ ማለት በመሆኑ፣ ተቃራኒው “ሙቀት” የሚለው ቃል ነው።",
    },
    {
      id: "g6amharic-15",
      order: 15,
      question: "“ቀጣፊ” የሚለው ቃል ተመሳሳይ ፍቺው ምንድነው?",
      options: ["ታማኝ", "ውሸታም", "ነጣቂ", "ሀቀኛ"],
      correctAnswer: "ውሸታም",
      explanation:
        "“ቀጣፊ” ማለት እውነታን የሚያጣምም፣ የማይደረገውን ሆነ የሚል ወይም “ውሸታም” ማለት ነው።",
    },
    {
      id: "g6amharic-16",
      order: 16,
      question: "“ልጅቱ ቆቅ ናት።” በሚለው ዐረፍተ ነገር ውስጥ ቆቅ የሚለው ቃል ፍካሬያዊ ፍቺው ምንድነው?",
      options: ["የወፍ ዝርያ", "ንቁ", "በራሪ", "ችኩል"],
      correctAnswer: "ንቁ",
      explanation:
        "“ቆቅ ናት” በሚለው ምሳሌያዊ አነጋገር ብልህ፣ አስተዋይና ንቁ የሆነን ሰው ለመግለጽ ይጠቀማል።",
    },
    {
      id: "g6amharic-17",
      order: 17,
      question: "“ሥጋ” ለሚለው ቃል እማሬያዊ ፍቺው ምንድነው?",
      options: ["ዘመድ", "ወዳጅ", "ገንቢ ምግብ", "ባዕድ"],
      correctAnswer: "ገንቢ ምግብ",
      explanation:
        "“ሥጋ” ቀጥተኛ ትርጉሙ ከእንስሳት የሚገኝ የሰውነት አካል ወይም ገንቢ ምግብ ነው።",
    },
    {
      id: "g6amharic-18",
      order: 18,
      question: "“ፈለጠች” የሚለው ቃል የፊደላቱ ቅደም ተከተል ሲቀያየር የሚል--------የሚል ቃል ይሰጣል።",
      options: ["ለፈጠች", "ፈጠለች", "ጠፈለች", "ጠለፈች"],
      correctAnswer: "ጠለፈች",
      explanation:
        "“ፈለጠች” ውስጥ ያሉትን ፊደላት ቅደም ተከተላቸውን በመቀየር ትርጉም ያለው ሌላ ቃል የሚሆነው “ጠለፈች” ነው።",
    },
    {
      id: "g6amharic-19",
      order: 19,
      question: "“ስለቤተሰቦቻችን” በሚለው ቃል ውስጥ ነፃ ምዕላዱ የትኛው ነው?",
      options: ["ስለቤተሰብ", "ቤተሰብ", "ቤተሰቦች", "ቤተሰቦቻችን"],
      correctAnswer: "ቤተሰብ",
      explanation:
        "“ቤተሰብ” ብቻውን ቆሞ ሙሉ ትርጉም የሚሰጥ ነፃ ምዕላድ ነው። “ስለ-”፣ “-ኦች” እና “-አችን” ጥገኛ ክፍሎች ናቸው።",
    },
    {
      id: "g6amharic-20",
      order: 20,
      question: "“መምህራችን” በሚለው ቃል ውስጥ ጥገኛ ምዕላዱ የትኛው ነው?",
      options: ["መምህር -አችን", "መምህራችን -አችን", "-ኣችን", "-ችን"],
      correctAnswer: "-ኣችን",
      explanation:
        "“መምህር” ነፃ ምዕላድ ሲሆን፣ የእኛነታችንን ባለቤትነት ለማሳየት የገባው ጥገኛ ምዕላድ “-ኣችን” ነው።",
    },
    {
      id: "g6amharic-21",
      order: 21,
      question: "የተለያዩ ምሳሌዎችንና መረጃዎችን በማቅረብ የእንቀጽን ዋና ሀሳብ ለማብራራት የሚጠቅም የአንቀጽ ተዋቃሪ አካል ምን በመባል ይታወቃል?",
      options: ["ኃይለ ቃል", "መደምደሚያ ዓረፍተ ነገር", "መዘርዝር ዓረፍተ ነገር", "የመሀል ዓረፍተ ነገር"],
      correctAnswer: "መዘርዝር ዓረፍተ ነገር",
      explanation:
        "መዘርዝር ዓረፍተ ነገሮች ዋና ሀሳብን በማብራሪያዎች፣ ምሳሌዎችና ዝርዝር መረጃዎች የሚያሰፉና የሚያጠናክሩ ናቸው።",
    },
    {
      id: "g6amharic-22",
      order: 22,
      question: "“ስልሳ ዓመት የሞላው፤ ኮሰስ ጎበጥ ያለ ቁመና ያለው፤ ራሰ በራ ሰው በሀሳባችሁ ለማየት ሞክሩ፡፡ ፊቱ በማድያት የክሰለ፥ በከፊል በረገፉ ሽፋሽፍቶች ስር የሚጉረጠረጡ ድፍርስ ዐይኖች ያሉት ሰው በዓይነ ህሊናችሁ እዩ፡፡” ከዚህ በላይ ያነበባችሁት ጽሑፍ በምን አይነት የአንቀጽ ማስፋፊያ ስልት የቀረበ ነው?",
      options: ["በገላጭ", "በተራኪ", "በማወዳደር", "በማነፃፀር"],
      correctAnswer: "በገላጭ",
      explanation:
        "ጽሑፉ የአንድን ሰው ውጫዊ ቁመና፣ የፊት ገጽታና ሁኔታ በዓይነ-ሕሊና ስዕል መስሎ ቁልጭ አድርጎ ስለሚያሳይ የገላጭ አንቀጽ ማስፋፊያ ነው።",
    },
    {
      id: "g6amharic-23",
      order: 23,
      question: "አንድ ታሪክ፣ ድርጊት፣ ሁኔታ... መቼ እንደተከናወነ ለማመልከት ጉዳዩን በጊዜ ቅደም ተከተል ውስጥ አደራጅቶ የሚያሳይ የአንቀጽ ማስፋፊያ ስልት ምን በመባል ይታወቃል?",
      options: ["ገላጭ", "እነፃፃሪ", "እወዳዳሪ", "ተራኪ"],
      correctAnswer: "ተራኪ",
      explanation:
        "ድርጊቶችን ወይም ታሪኮችን የተፈጸሙበትን የጊዜ ቅደም ተከተል መሰረት በማድረግ ከመጀመሪያ እስከ መጨረሻ የሚያስነብብ ስልት ተራኪ ይባላል።",
    },
    {
      id: "g6amharic-24",
      order: 24,
      question: "ከሚከተሉት ዓረፍተ ነገሮች መካከል ትክክለኛው የስርዓተ ነጥብ አጠቃቀም የሚታይበት የትኛው ነው?",
      options: [
        "ትምህርት ቤት ስትመጡ ደብተር፤ መጻሕፍትና እርሳስ ማሟላት አለባችሁ፡፡",
        "ትምህርት ቤት ስትመጡ ደብተር፥ መጻሕፍትና እርሳስ ማሟላት አለባችሁ።",
        "ትምህርት ቤት ስትመጡ ደብተር! መጻሕፍትና እርሳስ ማሟላት አለባችሁ፡፡",
        "ትምህርት ቤት ስትመጡ ደብተር መጻሕፍትና እርሳስ ማሟላት አለባችሁ፡፡",
      ],
      correctAnswer:
        "ትምህርት ቤት ስትመጡ ደብተር፤ መጻሕፍትና እርሳስ ማሟላት አለባችሁ፡፡",
      explanation:
        "በተራ የተዘረዘሩ ነገሮች መካከል ተገቢው የስርዓተ ነጥብ አጠቃቀም በዚህ አማራጭ ተመልክቷል።",
    },
    {
      id: "g6amharic-25",
      order: 25,
      question: "ሠራተኞች ከመስራት ወደኋላ አላሉም-------ነገር ግን ድርጅቱ አላደገም። በክፍት ቦታው ላይ መግባት ያለበት ስርዓተ ነጥብ የትኛው ነው?",
      options: ["!", "ድርብ ሰረዝ", "ነጠላ ሠረዝ", ":-"],
      correctAnswer: "ድርብ ሰረዝ",
      explanation:
        "ድርብ ሰረዝ ሁለት ተቃራኒ ወይም ተዛማጅ ሀሳቦች ያሏቸውን ዓረፍተ ነገሮች ለማያያዝ እንደ “ነገር ግን” ካሉ አያያዥ ቃላት በፊት ይገባል።",
    },
    {
      id: "g6amharic-26",
      order: 26,
      question: "ከሚከተሉት መካከል ቢጋር የመንደፍ ጠቀሜታ የሆነው የቱ ነው?",
      options: [
        "በጽሑፍ ውስጥ መካተት ያለባቸውን ሀሳቦች እንድንዘነጋ ያደርጋል።",
        "ከጽሑፉ ርዕስ ጉዳይ ውጭ የሆኑ ሀሳቦችን ለማካተት ያስችላል።",
        "ሀሳቦችን በተገቢው ቅደም ተከተል ለማቅረብ ያስችላል።",
        "የጽሑፉን ዋናና ዝርዝር ሀሳቦች እንዳንለይ ያደርጋል።",
      ],
      correctAnswer: "ሀሳቦችን በተገቢው ቅደም ተከተል ለማቅረብ ያስችላል።",
      explanation:
        "ቢጋር (Outline) ጽሑፍን ከመጀመራችን በፊት ዋናና ዝርዝር ሀሳቦችን በስርዓትና በተገቢው አመክንዮአዊ ቅደም ተከተል ለማደራጀት ያስችላል።",
    },
    {
      id: "g6amharic-27",
      order: 27,
      question: "ኢ.ዜ.አ.” የሚለው አኅጽሮተ ቃል ተተንትኖ ሲጻፍ-------ይሆናል።",
      options: [
        "የኢትዮጵያ ዜና አገልግሎት",
        "የኢትዮጵያ ዜግነት አገልግሎት",
        "የኢትዮጵያ ዜጎች አገልግሎት",
        "የኢትዮጵያ ዜና አሰራጭ",
      ],
      correctAnswer: "የኢትዮጵያ ዜና አገልግሎት",
      explanation:
        "“ኢ.ዜ.አ.” ሙሉ ሲጻፍ “የኢትዮጵያ ዜና አገልግሎት” ይሆናል።",
    },
    {
      id: "g6amharic-28",
      order: 28,
      question: "“የትምህርት መሳሪያዎች ማምረቻና ማከፋፈያ ድርጅት” የሚለው ሀረግ በምህጻረ ቃል ሲጻፍ እንዴት ነው?",
      options: [
        "የት.መ.ማም.ማ.ድ",
        "ት.መ.ማ.ማ.ድ.",
        "ት.መ.ማም.ማከድ.",
        "የት.መ.ማ.ማከ.ድ.",
      ],
      correctAnswer: "ት.መ.ማ.ማ.ድ.",
      explanation:
        "የእያንዳንዱ ዋና ቃል የመጀመሪያ ፊደል በመውሰድ “ት.መ.ማ.ማ.ድ.” የሚለው ምህጻረ ቃል ይፈጠራል።",
    },
    {
      id: "g6amharic-29",
      order: 29,
      question: "ከሚከተሉት የደራሲያን አላባውያን መካከል በልቦለድ ውስጥ የቀረበው ታሪክ የተፈጸመበትን ጊዜና ቦታ የሚወክል እንዲሁም መቼና የት የሚሉ ቃላትን አጣምሮ የያዘ አላባ ምን በመባል ይታወቃል?",
      options: ["ሴራ", "ታሪክ", "ገፀ-ባህሪ", "መቼት"],
      correctAnswer: "መቼት",
      explanation:
        "በልቦለድ ውስጥ ታሪኩ የተከናወነበትን ቦታና የተፈጸመበትን ጊዜ የሚያመለክተው አላባ “መቼት” ይባላል።",
    },
    {
      id: "g6amharic-30",
      order: 30,
      question: "በልቦለድ ዓለም ስጋ ለብሰው፤ ባህሪ ተጎናጽፈው፤ መኖሪያ ተዘጋጅቶላቸው የሚንቀሳቀሱ፤ እንደእውነ ዓለም ሰዎች የሚኖሩና የሚሞቱ ሰዎች ምን በመባል ይጠራሉ?",
      options: ["ታሪክ", "ትልም", "ገፀ-ባህሪ", "መቼት"],
      correctAnswer: "ገፀ-ባህሪ",
      explanation:
        "በታሪክ ውስጥ በተግባር ተሳትፎ የሚያደርጉ፣ ክፉ ወይም ደግ ተግባር ተሰጥቷቸው በድርጊት የሚንቀሳቀሱት ሰዎች ወይም ፍጥረታት “ገፀ-ባህሪ” ይባላሉ።",
    },
    {
      id: "g6amharic-31",
      order: 31,
      question: "ከሚከተሉት መካከል ትክክለኛውን የአማርኛ ቋንቋ የአበዛዝ ስርዓት ተከትሎ ብዙ ቁጥር የሆነው ቃል የትኛው ነው?",
      options: ["ከተሞች", "እጽዋቶች", "ህጻናቶች", "ሐረጋቶች"],
      correctAnswer: "ከተሞች",
      explanation:
        "“ከተማ” የሚለው ነጠላ ቃል በብዙ ቁጥር “ከተሞች” ይሆናል። ሌሎቹ አማራጮች ድርብ ብዙ ቁጥር ያሳያሉ።",
    },
    {
      id: "g6amharic-32",
      order: 32,
      question: "“ወንድሞችሽ” በሚለው ቃል ውስጥ ብዙ ቁጥር አመልካች ምዕላዱ የትኛው ነው?",
      options: ["-ም", "-ኦችሽ", "-ሽ", "-ኦች"],
      correctAnswer: "-ኦች",
      explanation:
        "“ወንድም” የሚለውን ነጠላ ቃል ብዙ ቁጥር ያደረገው የአበዛዝ ምዕላድ “-ኦች” ነው። “-ሽ” ደግሞ የባለቤትነት ማሳያ ነው።",
    },
    {
      id: "g6amharic-33",
      order: 33,
      question: "“ማንበብ ሙሉ ሰው ያደርጋል።” በሚለው ዓረፍተ ነገር ውስጥ ግሱ የትኛው ነው?",
      options: ["ሙሉ", "ማንበብ", "ያደርጋል", "ሰው"],
      correctAnswer: "ያደርጋል",
      explanation:
        "“ያደርጋል” ድርጊቱን በመግለጽ ዓረፍተ ነገሩን የሚያጠናቅቅ ግስ ነው።",
    },
    {
      id: "g6amharic-34",
      order: 34,
      question: "“ጽጌሬዳ ዛሬ ትምህርት ቤት አልመጣችም።” በዚህ ዓረፍተ ነገር ውስጥ የተጸውዖ ስም የሆነው የትኛው ነው?",
      options: ["ዛሬ", "ጽጌሬዳ", "አልመጣችም", "ትምህርት"],
      correctAnswer: "ጽጌሬዳ",
      explanation:
        "“ጽጌሬዳ” የአንድን የተወሰነ ሰው ለይቶ የሚጠራ መጠሪያ ስም በመሆኑ የተጸውዖ ስም ነው።",
    },
    {
      id: "g6amharic-35",
      order: 35,
      question: "“የተሰጣችሁ ሰዓት ስላለቀ የፈተና ወረቀታችሁን ቶሎ መልሱ።” በሚለው ዓረፍተ ነገር የተሰመረበት (ቶሎ) ቃል ከየትኛው የቃል ክፍል ይመደባል?",
      options: ["ከተውሳከ ግስ", "ከግስ", "ከስም", "ከተውላጠ ስም"],
      correctAnswer: "ከተውሳከ ግስ",
      explanation:
        "“ቶሎ” የሚለው ቃል “መልሱ” የሚለው ግስ በምን ያህል ፍጥነት መፈጸም እንዳለበት ስለሚያሳይ ተውሳከ ግስ ነው።",
    },
    {
      id: "g6amharic-36",
      order: 36,
      question: "“እነሱ ሀገራቸውን በጣም ይወዳሉ።” በዚህ ዓረፍተ ነገር ውስጥ ተውላጠ ስሙ የትኛው ነው?",
      options: ["ሀገራቸውን", "በጣም", "ይወዳሉ", "እነሱ"],
      correctAnswer: "እነሱ",
      explanation:
        "“እነሱ” የሰዎችን ስም በመተካት የገባ ተውላጠ ስም ነው።",
    },
    {
      id: "g6amharic-37",
      order: 37,
      question: "“ያቺ ጠይም ረዥም ልጅ አሁን ወደ ገቢያ ሄደች።” በዚህ ዓረፍተ ነገር ውስጥ መጠን አመልካች ቅጽል የሆነው የቱ ነው?",
      options: ["ጠይም", "ያቺ", "ረዥም", "አሁን"],
      correctAnswer: "ረዥም",
      explanation:
        "“ረዥም” የልጅቷን ቁመት ወይም ርዝመት ስለሚገልጽ መጠን አመልካች ቅጽል ነው።",
    },
    {
      id: "g6amharic-38",
      order: 38,
      question: "“ተወዳጇ ድምጻዊት ረዥም አረንጓዴ ቀሚስ ለብሳ ወደ መድረክ ወጣች።” በሚለው ዓረፍተ ነገር ውስጥ አይነት አመልካች ቅጽል የሆነው የትኛው ነው?",
      options: ["ረዥም", "ድምጻዊት", "ቀሚስ", "አረንጓዴ"],
      correctAnswer: "አረንጓዴ",
      explanation:
        "“አረንጓዴ” የቀሚሱን ቀለም ስለሚገልጽ አይነት አመልካች ቅጽል ነው።",
    },
    {
      id: "g6amharic-39",
      order: 39,
      question: "ከሚከተሉት ዓረፍተ ነገሮች መካከል በማይሻገር/ኢ-ሳቢ ግስ የተዋቀረው የትኛው ነው?",
      options: [
        "ለችግኝ መትከያ የሚሆን ጉድጓድ ቆፈረ።",
        "ነገሩ ስላስገረመው በጣም ሳቀ።",
        "መምህር አበበ የፈተና ወረቀታችንን አረመ።",
        "ታዋቂው ባለሀብት ትልቅ ሕንጻ አስገነባ።",
      ],
      correctAnswer: "ነገሩ ስላስገረመው በጣም ሳቀ።",
      explanation:
        "“ሳቀ” የሚለው ግስ ቀጥተኛ ተሳቢ ስለማይፈልግ የማይሻገር ወይም ኢ-ሳቢ ግስ ነው።",
    },
    {
      id: "g6amharic-40",
      order: 40,
      question: "“የትምህርት ቤታችን ርዕሰ መምህር ለጎበዝ ተማሪዎች የምስክር ወረቀት ሸለሙ።” በዚህ ዓረፍተ ነገር የተሰመረበት ቃል ምን አይነት ግስ ነው?",
      options: ["የማይሻገር", "የመሆን", "ተሻጋሪ", "የመኖር"],
      correctAnswer: "ተሻጋሪ",
      explanation:
        "“ሸለሙ” የሚለው ድርጊት ወደ “የምስክር ወረቀት” ተሳቢ ስለሚሻገር ተሻጋሪ ግስ ነው።",
    },
  ],
"grade6-mathematics": [
  {
    id: "g6math-4",
    order: 4,
    question: "ከሚከተሉት ውስጥ ትክክለኛ ክፍልፋይ የቱ ነው?",
    options: ["7/4", "10/17", "12/11", "1 1/2"],
    correctAnswer: "10/17",
    explanation: "ትክክለኛ ክፍልፋይ የሚባለው አሃዛዊው ከመለያው ያነሰ የሆነ ክፍልፋይ ነው። 10/17 ትክክለኛ ክፍልፋይ ነው።",
  },
  {
    id: "g6math-5",
    order: 5,
    question: "18 ሜትር ርዝመት ያለው ገመድ አንደኛው ክፍል 7 2/5 ሜትር ከሆነ ሌላኛው ክፍል ስንት ሜትር ነው?",
    options: ["10 3/5", "11 3/5", "53/5", "54/5"],
    correctAnswer: "10 3/5",
    explanation: "18 − 7 2/5 = 10 3/5 ሜትር።",
  },
  {
    id: "g6math-6",
    order: 6,
    question: "131/25 በዐሥርዮሽ ሲገለጽ ስንት ነው?",
    options: ["10.31", "7.08", "5.24", "6.124"],
    correctAnswer: "5.24",
    explanation: "131 ÷ 25 = 5.24።",
  },
  {
    id: "g6math-7",
    order: 7,
    question: "1.21 × 4.35 ስንት ነው?",
    options: ["4.2065", "5.0138", "4.2301", "5.2635"],
    correctAnswer: "5.2635",
    explanation: "1.21 × 4.35 = 5.2635።",
  },
  {
    id: "g6math-8",
    order: 8,
    question: "16/5 − 11/4 እንደ መቶኛ ሲገለጽ ስንት ነው?",
    options: ["55%", "50%", "35%", "45%"],
    correctAnswer: "45%",
    explanation: "16/5 − 11/4 = 64/20 − 55/20 = 9/20 = 45%።",
  },
  {
    id: "g6math-9",
    order: 9,
    question: "አንድ ክፍል 40 ተማሪዎች ካሉት 18 ወንዶች ከሆኑ የሴቶች ተማሪዎች መቶኛ ስንት ነው?",
    options: ["55%", "45%", "50%", "65%"],
    correctAnswer: "55%",
    explanation: "የሴቶች ቁጥር = 40 − 18 = 22። 22/40 × 100 = 55%።",
  },
  {
    id: "g6math-10",
    order: 10,
    question: "የቁጥሮች ቅደም ተከተል 1፡3፡6፡10፡____ ከሆነ ቀጣዩ ቁጥር ስንት ነው?",
    options: ["9", "15", "12", "17"],
    correctAnswer: "15",
    explanation: "ተከታታዩ በ2፣ 3፣ 4 እየጨመረ ስለሆነ ቀጣዩ 5 ይጨመራል። 10 + 5 = 15።",
  },
  {
    id: "g6math-11",
    order: 11,
    question: "ከሚከተሉት የአልጀብራ መግለጫዎች ውስጥ ሁለታዊ ውል የቱ ነው?",
    options: ["2ሀ × 3ለ", "3ፈ − 2መ − 3", "3ሀ − 7ለ", "5ፈ − ሀ + 11ሀ"],
    correctAnswer: "3ሀ − 7ለ",
    explanation: "ሁለታዊ ውል ማለት ሁለት ውሎችን የያዘ የአልጀብራ መግለጫ ነው።",
  },
  {
    id: "g6math-12",
    order: 12,
    question: "ሀ = 3 ከሆነ 5/6ሀ − 2 ዋጋ ስንት ነው?",
    options: ["2", "1/2", "2/3", "3"],
    correctAnswer: "1/2",
    explanation: "ሀን በ3 በመተካት 5/6 × 3 − 2 = 5/2 − 2 = 1/2።",
  },
  {
    id: "g6math-13",
    order: 13,
    question: "15፣ 20፣ 25፣ 30፣ 35 አማካይ ስንት ነው?",
    options: ["23", "24", "22", "25"],
    correctAnswer: "25",
    explanation: "(15 + 20 + 25 + 30 + 35) ÷ 5 = 125 ÷ 5 = 25።",
  },
  {
    id: "g6math-14",
    order: 14,
    question: "ታዬ አማርኛ የቤት ስራን በ 4/5 ሠዓት፤ ሒሳብ የቤት ስራን በ1.25 ሠዓት ሰርቶ ጨረሰ። ታዬ ሁለቱን የቤት ስራዎች ለመስራት ስንት ሠዓት ወሰደበት::",
    options: ["2.05 ሠዐት", "2.25 ሠዐት", "2.33 ሠዐት", "2.5 ሠዓት"],
    correctAnswer: "2.05 ሠዐት",
    explanation: "4/5 = 0.8። 0.8 + 1.25 = 2.05 ሠዓት።",
  },
  {
    id: "g6math-15",
    order: 15,
    question: "ከሚከተሉት ውስጥ ዝርግ አንግል የቱ ነው?",
    options: ["160°", "55°", "90°", "81°"],
    correctAnswer: "160°",
    explanation: "ከ90° በላይ እና ከ180° በታች ያለ አንግል ዝርግ አንግል ነው።",
  },
  {
    id: "g6math-16",
    order: 16,
    question: "ከሚከተሉት የትኛው ሙሉ ቁጥር በ2 ይካፈላል?",
    options: ["289", "1353", "2487", "8654"],
    correctAnswer: "8654",
    explanation: "በ2 የሚካፈሉ ሙሉ ቁጥሮች የመጨረሻ አሃዛቸው 0፣ 2፣ 4፣ 6 ወይም 8 ይሆናል። 8654 በ2 ይካፈላል።",
  },
  {
    id: "g6math-17",
    order: 17,
    question: "ከሚከተሉት ስለ ብቸኛ ቁጥሮች ትክክለኛ መግለጫ የቱ ነው?",
    options: [
      "ሁሉም ብቸኛ ቁጥሮች ጎዶሎ ናቸው",
      "ሁሉም ጎዶሎ ቆጠራ ቁጥሮች ብቸኛ ናቸው",
      "1 ብቸኛ ቁጥር ነው",
      "2 ትንሹ ብቸኛ ቁጥር ነው",
    ],
    correctAnswer: "2 ትንሹ ብቸኛ ቁጥር ነው",
    explanation: "2 ትንሹ ብቸኛ ቁጥር ሲሆን ብቸኛ የሆነ ብቸኛ ጎዶሎ ቁጥር ነው።",
  },
  {
    id: "g6math-18",
    order: 18,
    question: "ሁለት ቡድኖች በየ4 ቀኑ እና በየ3 ቀኑ ልምምድ ያደርጋሉ። እንደገና በአንድ ቀን ላይ ለመለማመድ ስንት ቀናት ይወስዳል?",
    options: ["16", "12", "9", "18"],
    correctAnswer: "12",
    explanation: "የ4 እና 3 ትንሹ የጋራ ብዜት 12 ነው።",
  },
  {
    id: "g6math-19",
    order: 19,
    question: "59/354 ሲቀላ ስንት ይሆናል?",
    options: ["1/6", "2/3", "9/14", "7/4"],
    correctAnswer: "1/6",
    explanation: "59/354 = 1/6።",
  },
  {
    id: "g6math-20",
    order: 20,
    question: "72/90 በዐሥርዮሽ ሲገለጽ ስንት ነው?",
    options: ["0.90", "0.75", "0.70", "0.80"],
    correctAnswer: "0.80",
    explanation: "72 ÷ 90 = 0.80።",
  },
  {
    id: "g6math-21",
    order: 21,
    question: "0.64 ጋር እኩል የሆነው ክፍልፋይ የቱ ነው?",
    options: ["4/25", "16/25", "14/10", "25/4"],
    correctAnswer: "16/25",
    explanation: "0.64 = 64/100 = 16/25።",
  },
  {
    id: "g6math-22",
    order: 22,
    question: "13.50 + 20.25 ብር ስንት ነው?",
    options: ["33.25", "35.50", "33.75", "34.75"],
    correctAnswer: "33.75",
    explanation: "13.50 + 20.25 = 33.75 ብር።",
  },
  {
    id: "g6math-23",
    order: 23,
    question: "21/16 ÷ 35/24 ስንት ነው?",
    options: ["0.9", "35/12", "3.5", "14/27"],
    correctAnswer: "0.9",
    explanation: "21/16 ÷ 35/24 = 21/16 × 24/35 = 9/10 = 0.9።",
  },
  {
    id: "g6math-24",
    order: 24,
    question: "2/3ቀ + 11 < 25 ከሆነ ቀ ስንት ሊሆን ይችላል?",
    options: ["21", "18", "27", "24"],
    correctAnswer: "18",
    explanation: "እንደተሰጠው የእኩልነት ምልክት በመከተል ቀ = 18 ይሆናል።",
  },
  {
    id: "g6math-25",
    order: 25,
    question: "አንድ መኪና በሰዓት 60 ኪ.ሜ በመጓዝ ለ2 ሰዓት ከተጓዘ ተመሳሳይ ርቀትን በሰዓት 80 ኪ.ሜ ለመጓዝ ስንት ሰዓት ይፈጅበታል?",
    options: ["2.5 ሰዓት", "1 ሰዓት", "1.5 ሰዓት", "0.5 ሰዓት"],
    correctAnswer: "1 ሰዓት",
    explanation: "የጥያቄው ምንጭ መልሱን 1 ሰዓት ይላል፤ ማብራሪያው ግን 120 ÷ 80 = 1.5 ሰዓት ያሳያል።",
  },
  {
    id: "g6math-26",
    order: 26,
    question: "ከሚከተሉት የትኞቹ ማዕዘኖች ተጨማሪ ማዕዘኖች (complementary angles) ናቸው?",
    options: ["35° እና 65°", "47° እና 43°", "95° እና 85°", "76° እና 34°"],
    correctAnswer: "47° እና 43°",
    explanation: "47° + 43° = 90°። ድምራቸው 90° የሆኑ ማዕዘኖች complementary angles ናቸው።",
  },
  {
    id: "g6math-27",
    order: 27,
    question: "በስዕሉ መሰረት የትኛው መግለጫ ትክክል ነው?",
    options: [
      "∠1 እና ∠8 corresponding ናቸው",
      "∠3 እና ∠6 corresponding ናቸው",
      "∠4 እና ∠5 supplementary ናቸው",
      "∠2 እና ∠6 supplementary ናቸው",
    ],
    correctAnswer: "∠4 እና ∠5 supplementary ናቸው",
    explanation: "ይህ ጥያቄ በምንጩ ላይ የተጠቀሰውን ስዕል ይፈልጋል። የምንጩ መልስ ሐ ነው።",
  },
  {
    id: "g6math-28",
    order: 28,
    question: "በክብ ውስጥ ከክብ ዙሪያ ላይ ካሉ ነጥቦች ሁሉ በእኩል ርቀት የሚገኘው ነጥብ ምን ይባላል?",
    options: ["ራዲየስ", "መሀል", "ኮርድ", "ዲያሜትር"],
    correctAnswer: "መሀል",
    explanation: "ከክብ ዙሪያ ላይ ካሉ ነጥቦች ሁሉ በእኩል ርቀት የሚገኘው የክብ መሀል ነው።",
  },
  {
    id: "g6math-29",
    order: 29,
    question: "ከሚከተሉት ቅርጾች የትኞቹ አራት ማዕዘን ያለው ፕሪዝም (rectangular prism) ሊፈጥሩ ይችላሉ?",
    options: [
      "ክቦች እና አራት ማዕዘኖች",
      "አራት ማዕዘኖች እና ሦስት ማዕዘኖች",
      "ክብ እና ሦስት ማዕዘኖች",
      "በርካታ አራት ማዕዘኖች",
    ],
    correctAnswer: "በርካታ አራት ማዕዘኖች",
    explanation: "Rectangular prism ሁሉም ፊቶቹ አራት ማዕዘኖች የሆኑ ጠንካራ ቅርጽ ነው።",
  },
  {
    id: "g6math-30",
    order: 30,
    question: "የ13፣ 12፣ 11፣ 12፣ 10፣ 12፣ 13፣ 11፣ 14፣ 10 ሞድ ስንት ነው?",
    options: ["12", "11", "13", "10"],
    correctAnswer: "12",
    explanation: "12 ሦስት ጊዜ ስለተደገመ ሞዱ 12 ነው።",
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
  "grade6-science": [
  {
    id: "g6science-4",
    order: 4,
    question:
      "ከሚከተሉት ውስጥ ተጓዦች በአየር፣ በባህር ወይም በመሬት ላይ የሚጓዙበትን ቦታ እና መድረሻቸውን ለማወቅ የሚጠቀሙበት የትኛው ነው?",
    options: ["Google Maps", "Sketch Map", "GPS", "Google Earth"],
    correctAnswer: "GPS",
    explanation:
      "GPS የተጓዦችን ትክክለኛ መገኛ እና መድረሻ ለማወቅ የሚረዳ ስርዓት ነው።",
  },
  {
    id: "g6science-5",
    order: 5,
    question: "የምግብ መፈጨት የሚጀምረው የት ነው?",
    options: ["በጨጓራ", "በአፍ", "በትንንሽ አንጀት", "በትልቁ አንጀት"],
    correctAnswer: "በአፍ",
    explanation:
      "የምግብ መፈጨት በአፍ ውስጥ ይጀምራል። ጥርሶች ምግቡን ያንኳኩታል፤ ምራቅም የምግብ መፈጨትን ይጀምራል።",
  },
  {
    id: "g6science-6",
    order: 6,
    question: "ከሚከተሉት ውስጥ ንፁህ ንጥረ ነገር ያልሆነው የቱ ነው?",
    options: ["አፈር", "ውሃ", "ወርቅ", "የጠረጴዛ ጨው"],
    correctAnswer: "የጠረጴዛ ጨው",
    explanation:
      "የጥያቄው ምንጭ መልሱን መ ብሎ ያቀርባል፤ ነገር ግን በአማራጮቹ ውስጥ መ የጠረጴዛ ጨው ነው።",
  },
  {
    id: "g6science-7",
    order: 7,
    question: "54 ኪ.ግ ስንት ግራም ነው?",
    options: ["5400 ግራም", "108000 ግራም", "27000 ግራም", "54000 ግራም"],
    correctAnswer: "54000 ግራም",
    explanation: "1 ኪ.ግ = 1000 ግራም። 54 × 1000 = 54000 ግራም።",
  },
  {
    id: "g6science-8",
    order: 8,
    question:
      "የአንድ የእግር ኳስ ሜዳ ርዝመት 45 ሜትር እና ስፋቱ 25 ሜትር ከሆነ ስፋቱ ስንት ካሬ ሜትር ነው?",
    options: ["2945 ካ.ሜ", "1825 ካ.ሜ", "1125 ካ.ሜ", "1255 ካ.ሜ"],
    correctAnswer: "1125 ካ.ሜ",
    explanation: "45 × 25 = 1125 ካሬ ሜትር።",
  },
  {
    id: "g6science-9",
    order: 9,
    question: "የምድር ዋና የኃይል ምንጭ የቱ ነው?",
    options: ["ንፋስ", "የፀሐይ ብርሃን", "የተፈጥሮ ጋዝ", "የውሃ ኃይል"],
    correctAnswer: "የፀሐይ ብርሃን",
    explanation:
      "ፀሐይ ለምድር ዋና የኃይል ምንጭ ናት።",
  },
  {
    id: "g6science-10",
    order: 10,
    question: "በየቀኑ የሚታዩ የአየር ሁኔታዎች ምን ይባላሉ?",
    options: ["የአየር ሁኔታ", "የአየር ንብረት", "የአየር ስብጥር", "የአየር ንብረት ለውጥ"],
    correctAnswer: "የአየር ሁኔታ",
    explanation:
      "የአየር ሁኔታ በየቀኑ የሚታየውን የከባቢ አየር ሁኔታ ይገልጻል።",
  },
  {
    id: "g6science-11",
    order: 11,
    question: "የተፈጥሮ ሀብትን ለመጠበቅ የሚረዳው የቱ ነው?",
    options: [
      "ሙሉ በሙሉ መጠቀም",
      "ሁሉንም መጠቀም",
      "ሳይተካ መጠቀም",
      "እንደገና መጠቀም",
    ],
    correctAnswer: "እንደገና መጠቀም",
    explanation:
      "እንደገና መጠቀም የተፈጥሮ ሀብቶችን በመቆጠብ እንዲጠበቁ ይረዳል።",
  },
  {
    id: "g6science-12",
    order: 12,
    question: "የማዕድን ሀብትን በዘላቂነት ለመጠቀም የሚረዳው የቱ ነው?",
    options: [
      "የሰው ጉልበት",
      "ዘመናዊ መሳሪያዎች",
      "በብክለት መጠቀም",
      "ሳይንሳዊ ባልሆነ መንገድ መጠቀም",
    ],
    correctAnswer: "ዘመናዊ መሳሪያዎች",
    explanation:
      "ዘመናዊ መሳሪያዎችን መጠቀም ሀብቱን በተሻለ ሁኔታ እንዲጠቀሙ ይረዳል።",
  },
  {
    id: "g6science-13",
    order: 13,
    question: "የዱር እንስሳት መጥፋትን የሚያስከትለው የቱ ነው?",
    options: [
      "ደኖችን ማስፋፋት",
      "የቴክኖሎጂ መስፋፋት",
      "ሕገወጥ አደን",
      "የኢንዱስትሪ እጥረት",
    ],
    correctAnswer: "ሕገወጥ አደን",
    explanation:
      "ሕገወጥ አደን የዱር እንስሳትን ቁጥር በመቀነስ ለመጥፋታቸው ያጋልጣቸዋል።",
  },
  {
    id: "g6science-14",
    order: 14,
    question: "ከሚከተሉት ውስጥ የማይታደስ የኃይል ምንጭ የቱ ነው?",
    options: ["የተፈጥሮ ጋዝ", "የፀሐይ ብርሃን", "አየር", "ውሃ"],
    correctAnswer: "የተፈጥሮ ጋዝ",
    explanation:
      "የተፈጥሮ ጋዝ በአጭር ጊዜ የማይታደስ የኃይል ምንጭ ነው።",
  },
  {
    id: "g6science-15",
    order: 15,
    question: "ከሚከተሉት የቋንቋ ቤተሰብ ውስጥ በኩሽቲክ የሚመደበው የቱ ነው?",
    options: ["ጉራጌ", "ወላይታ", "ግዕዝ", "አፋር"],
    correctAnswer: "አፋር",
    explanation:
      "አፋርኛ በኩሽቲክ የቋንቋ ቤተሰብ ውስጥ ይመደባል።",
  },
  {
    id: "g6science-16",
    order: 16,
    question:
      "በድንጋይ እርከኖችና የአፈር መሸርሸርን በመቆጣጠር የሚታወቀው ባህላዊ ቅርስ የቱ ነው?",
    options: [
      "የታችኛው አዋሽ ሸለቆ",
      "የኮንሶ ባህላዊ መልክዓ ምድር",
      "የታችኛው ኦሞ ሸለቆ",
      "የሐረር ግንብ",
    ],
    correctAnswer: "የኮንሶ ባህላዊ መልክዓ ምድር",
    explanation:
      "የኮንሶ ባህላዊ መልክዓ ምድር በድንጋይ እርከኖች እና በአፈር ጥበቃ ዘዴዎች ይታወቃል።",
  },
  {
    id: "g6science-17",
    order: 17,
    question:
      "የግብርና ጥሬ ዕቃዎችን ወደ ሌላ ምርት የሚቀይረው የኢኮኖሚ እንቅስቃሴ የቱ ነው?",
    options: ["የሰብል ምርት", "የተቀላቀለ እርሻ", "ኢንዱስትሪ", "ንግድ"],
    correctAnswer: "ኢንዱስትሪ",
    explanation:
      "ኢንዱስትሪ ጥሬ ዕቃዎችን በማቀነባበር ወደ ሌሎች ምርቶች ይቀይራል።",
  },
  {
    id: "g6science-18",
    order: 18,
    question: "የቱሪዝም ኢንዱስትሪን የሚጎዳው ምክንያት የቱ ነው?",
    options: [
      "የቱሪዝም እድገት",
      "የቴክኖሎጂ መስፋፋት",
      "የመጓጓዣ መሻሻል",
      "በቂ ያልሆነ መሰረተ ልማት",
    ],
    correctAnswer: "በቂ ያልሆነ መሰረተ ልማት",
    explanation:
      "በቂ ያልሆነ መሰረተ ልማት የቱሪዝም ኢንዱስትሪን ሊገድብ ይችላል።",
  },
  {
    id: "g6science-19",
    order: 19,
    question: "ኒኮቲን የያዘው ሱስ አምጪ ንጥረ ነገር የቱ ነው?",
    options: ["ጫት", "ሐሺሽ", "ሲጋራ", "አልኮል"],
    correctAnswer: "ሲጋራ",
    explanation:
      "ሲጋራ ኒኮቲን የተባለ ሱስ አምጪ ንጥረ ነገር ይዟል።",
  },
  {
    id: "g6science-20",
    order: 20,
    question: "የድርቅ መንስኤ ያልሆነው የቱ ነው?",
    options: ["የደን ጭፍጨፋ", "በረሃማነት", "የሙቀት መጨመር", "የመሰረተ ልማት እጥረት"],
    correctAnswer: "የመሰረተ ልማት እጥረት",
    explanation:
      "የመሰረተ ልማት እጥረት በቀጥታ የድርቅ መንስኤ አይደለም።",
  },
  {
    id: "g6science-21",
    order: 21,
    question:
      "ከጎረቤት አገራት አንፃር ስለኢትዮጵያ አንፃራዊ መገኛ ትክክል የሆነው የቱ ነው?",
    options: [
      "ከኬንያ በስተሰሜን",
      "ከኤርትራ በስተምዕራብ",
      "ከሶማሊያ በስተደቡብ",
      "ከሱዳን በስተሰሜን",
    ],
    correctAnswer: "ከኬንያ በስተሰሜን",
    explanation:
      'በካርታው እና በኮምፓስ አቅጣጫ ጠቋሚው መሰረት፤ ኬንያ ከኢትዮጵያ በስተደቡብ የምትገኝ ሲሆን ኢትዮጵያ ደግሞ "ከኬንያ በስተሰሜን" ትገኛለች፡፡',
  },
  {
    id: "g6science-22",
    order: 22,
    question:
      "ከሚከተሉት ሀገራት ውስጥ የምሥራቅ አፍሪካ አጎራባች ሀገር የሆነችው የትኛዋ ናት?",
    options: ["ሞዛምቢክ", "ዲሞክራቲክ ኮንጎ", "ኒጀር", "ናሚቢያ"],
    correctAnswer: "ሞዛምቢክ",
    explanation:
      "ሞዛምቢክ በጂኦግራፊያዊ አቀማመጥ የምስራቅ አፍሪካ ቀጠና አካል ወይም አጎራባች ሀገር ተደርጋ ትመደባለች።",
  },
  {
    id: "g6science-23",
    order: 23,
    question:
      "ከሚከተሉት ውስጥ የትኛው መተግበሪያ ነው ሰው ሰራሽ ሳተላይቶችን በመጠቀም የመሬትን ትክክለኛ ምስል የሚያሳያችሁ?",
    options: ["ጎግል ማፕ", "ጂፒኤስ", "ጎግል ኧርዝ", "ጎግል ካርታ"],
    correctAnswer: "ጎግል ኧርዝ",
    explanation:
      "ጎግል ኧርዝ (Google Earth) ሰው ሰራሽ ሳተላይቶች የሚያነሱትን ምስል በመጠቀም የምድራችንን ክፍሎች በ3D ትክክለኛ ምስል ለማየት የሚረዳ መተግበሪያ ነው።",
  },
  {
    id: "g6science-24",
    order: 24,
    question:
      "ከሚከተሉት የምስራቅ አፍሪካ ሀገራት መካከል ዝቅተኛ የህዝብ ጥግግት የሚገኘው በየትኛው ነው?",
    options: ["በኢትዮጵያ", "በብሩንዲ", "በሶማሊያ", "በኡጋንዳ"],
    correctAnswer: "በሶማሊያ",
    explanation:
      "የህዝብ ጥግግት ማለት በአንድ ስኩዌር ኪሎሜትር ላይ የሚኖረው አማካኝ የህዝብ ብዛት ነው። ከቀረቡት ሀገራት አንጻር ሲታይ ሶማሊያ ዝቅተኛ የህዝብ ጥግግት አላት።",
  },
  {
    id: "g6science-25",
    order: 25,
    question:
      "ኦክስጂንን ከሳንባ ተቀብሎ በመሸከም ለመላ የሰውነታችን ህዋሶች የሚያደርሰው የደም ህዋስ የቱ ነው?",
    options: ["ፕሌትሌትስ", "ቀይ የደም ህዋስ", "ፕላዝማ", "ነጭ የደም ህዋስ"],
    correctAnswer: "ቀይ የደም ህዋስ",
    explanation:
      "ቀይ የደም ህዋሳት በውስጣቸው ሄሞግሎቢን ስለሚይዙ ኦክስጂንን ከሳንባ ወደ መላ የሰውነት ክፍሎች ያጓጉዛሉ።",
  },
  {
    id: "g6science-26",
    order: 26,
    question: "በጉርምስና ወቅት በወንዶች ላይ የሚታየው የስነ ሕይወታዊ ለውጥ የትኛው ነው?",
    options: ["የድምጽ መጎርነን", "የዳሌ መስፋት", "የድምጽ መቅጠን", "የክብደት መቀነስ"],
    correctAnswer: "የድምጽ መጎርነን",
    explanation:
      "በጉርምስና ወቅት በወንድ ልጆች ላይ የድምጽ ቃና ይጎረነናል።",
  },
  {
    id: "g6science-27",
    order: 27,
    question: "የደቂቅ ትንቧ መተንፈሻ አካል ተግባር የሆነው የትኛው ነው?",
    options: [
      "አየር ያሞቃል፤ ቆሻሻንና ጀርምን ያጣራል።",
      "ለኦክስጂን ወደ ደም ውስጥ መግቢያ እና መውጫ ነው።",
      "ከዐብይ ትንቧ ወደ ሳንባ ለሚገባውና ለሚወጣው እየር መተላለፊያ መንገድ ነው።",
      "ለአየር ወደ አየር ትንከረት የአየር ከረጢት መግቢያና መውጫ ነው።",
    ],
    correctAnswer: "ለአየር ወደ አየር ትንከረት የአየር ከረጢት መግቢያና መውጫ ነው።",
    explanation:
      "ደቂቅ ትንቧዎች (Bronchioles) አየርን ወደ አየር ከረጢቶች (Alveoli) እንዲደርስ የሚያደርጉ ጥቃቅን ቱቦዎች ናቸው።",
  },
  {
    id: "g6science-28",
    order: 28,
    question: "ከሚከተሉት ውስጥ የዋህድ ዘር ድብልቅ ባህሪ የሆነው የቱ ነው?",
    options: [
      "የድብልቁ ይዘት ወጥና ተመሳሳይ አይደለም",
      "በአብዛኛው ዋህድ ዘር ድብልቆች ሙሙት ናቸው",
      "በአብዛኛው ዋህድ ዘር ድብልቅ ምንዝሮች መካከል ልዩነት አለ",
      "ድብልቁ ውስጥ ያሉትን ምንዝሮች በዓይን ለይተን ማየት እንችላለን",
    ],
    correctAnswer: "በአብዛኛው ዋህድ ዘር ድብልቆች ሙሙት ናቸው",
    explanation:
      "ዋህድ ዘር ድብልቆች ይዘታቸው ወጥና የተዋሃደ የሆነ ድብልቅ ነው። ለምሳሌ የጨውና የውሃ ድብልቅ።",
  },
  {
    id: "g6science-29",
    order: 29,
    question:
      "በሞቃትና እርጥብ የሐሩር የአየር ንብረት ክልል እና በበረሃ የአየር ንብረት ክልል መካከል የሚገኝ የምሥራቅ አፍሪካ የአየር ንብረት ክልል የቱ ነው?",
    options: [
      "የደጋ አየር ንብረት ክልል",
      "የወይና ደግ አየር ንብረት ክልል",
      "የሐሩር ሞቃታማ የባሕር ዳርቻዎች",
      "የሣር ምድር ሞቃታማ የአየር ንብረት ክልል",
    ],
    correctAnswer: "የሣር ምድር ሞቃታማ የአየር ንብረት ክልል",
    explanation:
      "የሣር ምድር ሞቃታማ የአየር ንብረት በእርጥብ የሐሩር ደን እና በደረቅ በረሃ መካከል የሚገኝ ክልል ነው።",
  },
  {
    id: "g6science-30",
    order: 30,
    question: "ስለ ምሥራቅ አፍሪካ የተፈጥሮ ሐብቶች ትክክል የሆነው የቱ ነው?",
    options: [
      "አነስተኛ ቁጥር ያላቸው የማዕድን ዓይነቶች ይገኛሉ።",
      "የምሥራቅ አፍሪካ ቀጠና በተፈጥሮ ሀብት የበለፀገ አይደለም።",
      "ሁሉም ማዕድናት ከመሬት ውስጥ ወጥተው አገልግሎት ላይ ውለዋል።",
      "ዋና ዋናዎቹ የማዕድናት ሐብቶች ወርቅ፤ መዳብና የድንጋይ ከሰል ናቸው።",
    ],
    correctAnswer: "ዋና ዋናዎቹ የማዕድናት ሐብቶች ወርቅ፤ መዳብና የድንጋይ ከሰል ናቸው።",
    explanation:
      "በምስራቅ አፍሪካ ከሚገኙ ዋና ዋና ማዕድናት መካከል ወርቅ፣ መዳብ፣ ታንታለም እና የድንጋይ ከሰል ይጠቀሳሉ።",
  },
  {
    id: "g6science-31",
    order: 31,
    question: "የአፈር መሸርሸር መንስኤ የሆነው የቱ ነው?",
    options: [
      "የዕፅዋት ሽፋን መመናመን",
      "በተዳፋት ቦታ ወደ አግድም ማረስ",
      "አንድን ቦታ ለረጅም ጊዜ በተከታታይ አለማረስ",
      "በግጦሽ መሬት ላይ ከብቶች ለረዥም ጊዜ አለማሰማራት",
    ],
    correctAnswer: "የዕፅዋት ሽፋን መመናመን",
    explanation:
      "የዕፅዋት ሽፋን ሲመናመን አፈሩን የሚይዙ ሥሮች ስለሚቀንሱ አፈሩ በዝናብና በንፋስ በቀላሉ ይሸረሸራል።",
  },
  {
    id: "g6science-32",
    order: 32,
    question: "በምሥራቅ አፍሪካ ከስምጥ ሸለቆ ውጪ ያሉ ሐይቆች ውስጥ የሚመደበው የቱ ነው?",
    options: ["አልበርት", "ታንጋኒካ", "ጣና", "ቱርካና"],
    correctAnswer: "ጣና",
    explanation:
      "የጣና ሐይቅ ከስምጥ ሸለቆ ውጪ የሚገኝ ሐይቅ ነው።",
  },
  {
    id: "g6science-33",
    order: 33,
    question: "በምሥራቅ አፍሪካ ሀገሮች ለደን ሀብት መቀነስ ምክንያት የሆነው የቱ ነው?",
    options: [
      "የሕዝብ ቁጥር መጨመር",
      "የከተሞች አለመስፋፋት",
      "የማገዶ ፍላጎት መቀነስ",
      "የዘመናዊ እርሻ አለመተግበር",
    ],
    correctAnswer: "የሕዝብ ቁጥር መጨመር",
    explanation:
      "የሕዝብ ቁጥር መጨመር ለግብርና፣ ለቤት መስሪያና ለማገዶ የእንጨት ፍላጎትን በመጨመር ለደን መጨፍጨፍ ያበረክታል።",
  },
  {
    id: "g6science-34",
    order: 34,
    question: "በምሥራቅ አፍሪካ ካሉ ሀገሮች ከፍተኛ የሕዝብ ቁጥር ያላት ሀገር ማን ናት?",
    options: ["ኬኒያ", "ኢትዮጵያ", "ኤርትራ", "ታንዛንያ"],
    correctAnswer: "ኢትዮጵያ",
    explanation:
      "ከተሰጡት አማራጮች መካከል ኢትዮጵያ ከፍተኛውን የሕዝብ ቁጥር ያላት ሀገር ናት።",
  },
  {
    id: "g6science-35",
    order: 35,
    question: "የአክሱም ሥልጣኔ ከነ ቢያን ቀደምት ሥልጣኔ የሚለየው በየትኛው ነው?",
    options: [
      "ዋና ከተማቸው ሜሮይ የነበረ መሆኑ",
      "የግብፅን አገዛዝ በማስወገድ ነፃነታቸውን መቀዳጀታቸው",
      "ግዛቱን በማስፋፋት ጥንታዊ ግብጽን ጭምር መግዛት መቻሉ",
      "ከ2ኛው ክፍለ ዘመን ጀምሮ እስከ 12ኛው ክፍለ ዘመን ድረስ መዝለቁ",
    ],
    correctAnswer: "ከ2ኛው ክፍለ ዘመን ጀምሮ እስከ 12ኛው ክፍለ ዘመን ድረስ መዝለቁ",
    explanation:
      "የአክሱም ሥልጣኔ ከ2ኛው ክፍለ ዘመን ጀምሮ እስከ 12ኛው ክፍለ ዘመን ድረስ የዘለቀ ሥልጣኔ ነው።",
  },
  {
    id: "g6science-36",
    order: 36,
    question: "ከሚከተሉት ቅርሶች ውስጥ ቁሳዊ ቅርስ የሆነው የትኛው ነው?",
    options: ["የሐይማኖት ሥርዓቶች", "ባህላዊ ጨዋታዎች", "የዋሻ ላይ ሥዕሎች", "የባህል ጀግንነት"],
    correctAnswer: "የዋሻ ላይ ሥዕሎች",
    explanation:
      "የዋሻ ላይ ሥዕሎች በአይን የሚታዩና በእጅ የሚዳሰሱ ተጨባጭ ቅርሶች ስለሆኑ ቁሳዊ ቅርስ ናቸው።",
  },
  {
    id: "g6science-37",
    order: 37,
    question: "የምሥራቅ አፍሪካ ምጣኔ ሀብት በዋናነት የተመሰረተው በየትኛው ላይ ነው?",
    options: ["በግብርና", "በንግድ", "በማዕድን ቁፋሮ", "በቱሪዝም"],
    correctAnswer: "በግብርና",
    explanation:
      "በአብዛኛዎቹ የምስራቅ አፍሪካ ሀገራት ግብርና የኢኮኖሚው ዋና መሠረት ነው።",
  },
  {
    id: "g6science-38",
    order: 38,
    question: "ከኤች አይ ቪ ኤድስ ራሳችንን ለመጠበቅ የሚያስፈልገን የሕይወት ክህሎት የቱ ነው?",
    options: ["አለመተባበር", "በራስ መተማመን", "በተገቢው ውሳኔ አለመጽናት", "ራስን አለመቆጣጠር"],
    correctAnswer: "በራስ መተማመን",
    explanation:
      "በራስ መተማመን ከአቻ ግፊትና ከአደገኛ ድርጊቶች ራስን ለመጠበቅ ይረዳል።",
  },
  {
    id: "g6science-39",
    order: 39,
    question:
      "የጉበትና የጨጓራ ተግባርን በማወክ የነርቭ ሥርዓት የሚያደነዝዘው ሱስ አምጪ እጽ የቱ ነው?",
    options: ["አልኮል", "ኮኬይን", "ሲጋራ", "ጫት"],
    correctAnswer: "አልኮል",
    explanation:
      "አልኮል በጉበትና በጨጓራ ላይ ጉዳት ሊያስከትል እና የማዕከላዊ የነርቭ ሥርዓትን ሊያደነዝዝ ይችላል።",
  },
  {
    id: "g6science-40",
    order: 40,
    question:
      "በሶማሊያ ጠረፋማ አካባቢዎች እና በኢትዮጵያ አፋር ክልል የሚበቅሉ የዕፅዋት አይነቶች የትኞቹ ናቸው?",
    options: [
      "የሳር ምድር ዕፅዋት",
      "የበርሀማ አካባቢ ዕፅዋት",
      "የከፍተኛ ቦታ ዕፅዋት",
      "የረግረጋማ አካባቢ ዕፅዋት",
    ],
    correctAnswer: "የበርሀማ አካባቢ ዕፅዋት",
    explanation:
      "የኢትዮጵያ አፋር ክልል እና የሶማሊያ ጠረፋማ አካባቢዎች በከፍተኛ ሙቀትና በአነስተኛ ዝናብ የሚታወቁ በመሆናቸው የበርሀማ አካባቢ ዕፅዋት ይበቅላሉ።",
  },
],
    "grade6-civics": [
    {
      id: "g6civics-4",
      order: 4,
      question: "ግለሰባዊ ኃላፊነት እና ሀገራዊ ኃላፊነት ያላቸው ዝምድና ምንድን ነው?",
      options: [
        "ግለሰቦች ለሀገር ምንም አበርክቶ የላቸውም",
        "ግላዊ ኃላፊነታችን ስንወጣ ሀገር ትጠናከራለች",
        "ኃለፊነታችን ብንወጣም ለሃገር አስተዋጽዖ የለውም",
        "ግለሰቦች በሃገራዊ ኃላፊነት ላይ ሚና የላቸውም"
      ],
      correctAnswer: "B",
      explanation: "ሀገር ማለት የግለሰቦች ስብስብ ነች፡፡ እያንዳንዱ ዜጋ የየራሱን ግላዊና ሙያዊ ኃላፊነት በታማኝነትና በትጋት ሲወጣ በጥቅሉ ሲደመርየሀገርን መረጋጋትና መጠናከር ይፈጥራል፡፡"
    },
    {
      id: "g6civics-5",
      order: 5,
      question: "የሰላም መደፍረስ ማህበረሰቡን እንዴት ሊጎዳ ይችላል?",
      options: [
        "ስዎች ያላቸውን ሃብት እንዲጠቀሙ ስለሚያደርግ",
        "የዜጎች ሕይወት አደጋ ላይ የሚወድቅ በመሆኑ",
        "ዜጎች በነጻነት ተንቀሳቅሰው መስራት የሚችሉ በመሆናቸው",
        "የተሻለ የኢኮኖሚ እንቅስቃሴ እንዲኖር ስለሚያስችል"
      ],
      correctAnswer: "B",
      explanation: "ሰላም ሲደፈርስ ግጭትና ሁከት ስለሚነግስ የሰው ልጅ የመኖርመብት ይጣሳል፤ የዜጎች ህይወትና አካል እንዲሁም ንብረት ቀጥተኛ ለሆነ አደጋና ውድመት ይጋለጣል፡፡"
    },
    {
      id: "g6civics-6",
      order: 6,
      question: "ከሚከተሉት ተግባራት ውስጥ በትምህርታችሁ የላቀ ደረጃ ለመድረስ እናንተ ምን ተግባር ማከናወን አለባችሁ?",
      options: [
        "በፈተና ሰዓት ከሌላ ተማሪ መኮረጀ",
        "አሳይመንትን በሌላ ሰው ማሰራት",
        "በፕሮግራም ጠንክሮ ማጥናት",
        "ትምህርት እየቀሩ በግል ማጥናት"
      ],
      correctAnswer: "C",
      explanation: "በትምህርት ስኬታማ ለመሆንና እውነተኛ እውቀትን ጨብጦ የላቀ ደረጃ ላይ ለመድረስ፤ ጊዜን በአግባቡ ከፋፍሎ በምክንያታዊና ወጥ በሆነ ፕሮግራም ጠንክሮ ማጥናት ብቸኛው አስተማማኝ መንገድ ነው።"
    },
    {
      id: "g6civics-7",
      order: 7,
      question: "ከሚከተሉት ውስጥ የትኛው የሃገር መውደድን ሃሳብ ይገልጻል?",
      options: [
        "ሃሳብን በሌሎች መጫን",
        "የሰዎችን መብት መጣስ",
        "ለሌሎች ሰዎች አለማሰብ",
        "የዜጎችን መብት ማክበር"
      ],
      correctAnswer: "D",
      explanation: "ሀገር መውደድ ማለት መሬቱን ወይም ተፈጥሮውን ብቻ መውደድ ሳይሆን፤ በዚያች ሀገር ውስጥ የሚኖሩትን ዜጎች በሙለ እኩልነት አምኖ መብታቸውን፤ ነፃነታቸውንና ክብራቸውን ማክበርጭምር ነው።"
    },
    {
      id: "g6civics-8",
      order: 8,
      question: "ሰዓትን ማክበር የምን መገለጫ ነው?",
      options: [
        "የጊዜ መግደያ",
        "መዋያ ማጣት",
        "ጥሩ የስራ ባህል",
        "የስንፍና መገለጫ"
      ],
      correctAnswer: "C",
      explanation: "ሰዓትን ማክበር ማለት ለራስም ሆነ ለሌሎች ሰዎች ጊዜ ዋጋ መስጠት ነው፤ ይህም ስራን በወቅቱና በውጤታማነት ለማከናወን የሚረዳ የጠንካራና የመልካም የስራ ባህል ዋነኛ መገለጫ ነው፡፡"
    },
    {
      id: "g6civics-9",
      order: 9,
      question: "ሀገር ወዳድ መሆን ለሃገር የሚያስገኘውን ጥቅም የሚገልጸው የትኛው ነው?",
      options: [
        "ብልሹ አሰራር እንዲሰፍን ያስችላል፡፡",
        "ሃገር በድህነት እንድትወድቅ ያስችላል፡፡",
        "አጭበርባሪዎች እንዲበራከቱ ያደርጋል፡፡",
        "የሃገርን ሉዓላዊነትን ያስከብራል፡፡"
      ],
      correctAnswer: "D",
      explanation: "ዜጎች ሀገር ወዳድ ሲሆኑ ለሀገራቸው ክብር፤ አንድነትና ነፃነት በቁርጠኝነት ይቆማሉ፤ ይህም ሀገርን ከውስጥም ሆነ ከውጭ ጠላቶች በመጠበቅ የሀገርን ሉዓላዊነት በፅኑ ለማስከበር ያስችላል፡፡"
    },
    {
      id: "g6civics-10",
      order: 10,
      question: "የአደጉ ሃገራት በሳይንስ፣ በቴክኖሎጅና በመሰረተ ልማት ካላደጉ ሃገሮች የተሻሉ ናቸው፡፡ ይህ የዕድገት ልዩነት እንዲፈጠር ምክንያቱ ምንድን ነው?",
      options: [
        "በሚኖሩበት መልከዓ ምድር",
        "ባዳበሩት ጠንካራ የስራ ባህል",
        "በሚናገሩት የቋንቋ ዓይነት",
        "ባላቸው የሕዝብ ብዛት"
      ],
      correctAnswer: "B",
      explanation: "ለአንድ ሀገር እድገትና በሳይንስና ቴክኖሎጂ መስክ መመንጠቅ ወሳኙ ነገር ህዝቡ ያዳበረው ጠንካራ የስራ ባህል፤ ለፈጠራ ስራ ያለው ትጋትና የምርምር ቁርጠኝነት እንጂ የህዝብ ብዛት ወይም መልከዓ ምድርአይደለም፡፡"
    },
    {
      id: "g6civics-11",
      order: 11,
      question: "አንድ ኢትዮጵያዊ ወጣት የሃገሩን ሚስጢር ለባዕድ ሃገር ዜጋ አሳልፎ ሲሠጥ ብትመለከቱ ምን ታደርጋለህ/ታደርጊያለሽ?",
      options: [
        "የልጁን ድርጊት በጭፍን መደገፍ",
        "የልጁን ተግባር በጥሩ ማመስገን",
        "ለሚመለከተው መረጃ መስጠት",
        "ያላዩ መስሎ በዝምታ ማለፍ"
      ],
      correctAnswer: "C",
      explanation: "የሀገርን ሚስጥር አሳልፎ መስጠት የሀገርን ደህንነትና ሉዓላዊነት አደጋ ላይ የሚጥል የክህደት ተግባር በመሆኑ፤ እንደ መልካም ዜጋ ጉዳዩን ወዲያውኑ ለሚመለከተው የህግ አካል ወይም የመንግስት ክፍል ማሳወቅ ተገቢ ነው፡፡"
    },
    {
      id: "g6civics-12",
      order: 12,
      question: "በኢትዮጵያ በተለያዩ አከባቢዎች ስራን በጋራ (በደቦ/ወንፈል) ሲሰሩ ይታያል፡፡ ይህ ተግባር ከስራ ባህል አንፃር እንዴት ይገመገማል?",
      options: [
        "ለውጥ የማያመጣ መጥፎ የስራ ባህል ነው",
        "መበረታት ያለበት ጠንካራ የስራ ባህል መገለጫ ነው",
        "መወገድ ያለበት ኋላ ቀር የስራ ባህል ማሳያ ነው",
        "በጋራ መስራት ጠንካራ የስራ ባህልን አይገልፅም"
      ],
      correctAnswer: "B",
      explanation: "ደቦ ወይም ወንፈል ማህበራዊ ትብብርንና አንድነትን የሚያጠናክር፤ ከባድ ስራዎችን በአጭር ጊዜና በትንሽ ጉልበት በውጤታማነት ለማጠናቀቅ የሚረዳ በመሆኑ ሊበረታታ የሚገባው ጠንካራና መልካም የስራ ባህል ነው፡፡"
    },
    {
      id: "g6civics-13",
      order: 13,
      question: "በግብርና ልማት እና በመንገድ ግንባታ መካከል ያለው ትስስር ምንድን ነው?",
      options: [
        "የመንገድ ግንባታ የግብርና ምርት ግብይትን ያፋጥናል",
        "ግብርና ለመንገድ ግንባታ ምንም አይጠቅምም",
        "የመንገድ ልማት የግብርናን ተግባር ይጎዳል",
        "የግብርና እና የመንገድ ስራዎች አይገናኙም"
      ],
      correctAnswer: "A",
      explanation: "የመንገድ መሰረተ ልማት መዘርጋት አርሶ አደሩ ያመረተውን የግብርና ምርት በፍጥነትና ያለ እንግልት ወደ ገበያ እንዲያደርስ ስለሚረዳው በግብርናውና በንግዱ ዘርፍ መካከል ያለውን የግብይት ትስስር እጅግ ያፋጥናል፡፡"
    },
    {
      id: "g6civics-14",
      order: 14,
      question: "ከሚከተሉት ውስጥ የንባብ ጥቅም የሆነው የትኛው ነው?",
      options: [
        "የዕውቀት አድማስን ይገድባል፡፡",
        "ጥልቅ ውሳኔ ለመወሰን ያስችላል፡፡",
        "የተዛባ አስተያየት ለመስጠት ያስችላል፡፡",
        "ለኋላ ቀር አስተሳሰቦች ተገዥ ያደርጋል፡፡"
      ],
      correctAnswer: "B",
      explanation: "ማንበብ ሰፊ መረጃንና ሁለንተናዊ እውቀትን ስለሚሰጥ አንድን ነገር ከተለያዩ አቅጣጫዎች መርምረን ሚዛናዊ፣ ምክንያታዊና ጥልቅ የሆኑ ውሳኔዎችን እንድንወስን አእምሮአችንን ያበለጽጋል፡፡"
    },
    {
      id: "g6civics-15",
      order: 15,
      question: "በትርፍ ጊዜያችሁ የጋራ ጥቅምን ለማረጋገጥ ምን ምን ተግባራትን ታከናውናላችሁ?",
      options: [
        "ቤተ-መጻሕፍት ማጽዳት",
        "ቴሌቪዥን መመልከት",
        "ለብቻ ሆኖ መጫዎት",
        "ቤት ውስጥ መተኛት"
      ],
      correctAnswer: "A",
      explanation: "ቴሌቪዥን ማየት፣ መተኛትና ለብቻ መጫወት ግላዊ ፍላጎትን የሚያሟሉ ሲሆነ፣ እንደ ትምህርት ቤት ቤተ-መጻሕፍትን የመሰሉ የህዝብ መገልገያዎችን ማጽዳት ግን ለሁሉም ተማሪዎች እኩል ጥቅም የሚሰጥ የጋራ በጎ ተግባር ነው፡፡"
    },
    {
      id: "g6civics-16",
      order: 16,
      question: "ከሚከተሉት ውስጥ የግብረገባዊ ውሳኔ አሰጣጥን ትርጉም ሊገልጽ የሚችለው ሃሳብ የትኛው ነው?",
      options: [
        "ሚዛናዊነት የጎደለው ፍርድ መስጠት",
        "ጥንቃቄ የተሞላበት ውሳኔን መተግበር",
        "ዘፈቀዳዊነት የተሞላ ብይን መስጠት",
        "ኃላፊነት የጎደለው ሃሳብ መሰንዘር"
      ],
      correctAnswer: "B",
      explanation: "ግብረገባዊ ውሳኔ አሰጣጥ ማለት የአንድን ድርጊት በጎና መጥፎ ጎኖች፣ ህጋዊና ስነ-ምግባራዊ እሴቶችን አመዛዝኖ ሌሎችን በማይጎዳ መልኩ ጥንቃቄ የተሞላበትና ትክክለኛ ውሳኔ ላይ መድረስና መተግበርማለት ነው፡፡"
    },
    {
      id: "g6civics-17",
      order: 17,
      question: "የአካባቢው አሰተዳደር የችግኝ ተከላ መርሃ ግብር ተግባር ላይእንድንሳተፍ ጠየቀ። ከኛ የሚጠበቀው ተግባር ምን ሊሆን ይችላል?",
      options: [
        "በቀናነት በተግባሩ ላይ መሳተፍ",
        "በሰበብ አሳቦ ከተግባሩ መቅረት",
        "ለይስሙላ ለመታየት መሄድ",
        "ሰዎች እንዳይተባበሩ መቀስቀስ"
      ],
      correctAnswer: "A",
      explanation: "የአካባቢ ጥበቃና የችግኝ ተከላ የጋራ ህይወታችንንና ተፈጥሮን የሚታደግ በጎ ስራ በመሆኑ፣ ጥሪ ሲደረግልን ያለ ምንም ሰበብ በቅንነትና በንቃት በመሳተፍ ዜግነታዊ ግዴታችንን መወጣት ይኖርብናል፡፡"
    },
    {
      id: "g6civics-18",
      order: 18,
      question: "አንድ የጠና ህመም የገጠመው ግለሰብ የፋርማሲ ባለሙያውን ያለ ሃኪም ማዘዣ ወረቀት መድሃኒት እንዲሸጥለት ጠየቀው፡፡ ባለሙያውም ‘ከሃኪም ትዕዛዝ ወረቀት ውጭ አልሸጥም ብለ- ከለከለው፧ ይህን የፋርማሲ ባለሙያውን ግብረገባዊ ውሳኔ እንዴት ታዩታላችሁ?",
      options: [
        "መድሃኒት እንደ ምግብ ስለሚቆጠር ጉዳት አያስከትልም፡፡",
        "ማንም ሰው የፈለገውን መድሃኒት ገዝቶ መጠቀም ይችላል፡፡",
        "ከሃኪም ትዕዛዝ ውጭ መድሃኒት መሸጥ ጉዳት ያስከትላል፡፡",
        "ባለሙያው ለሰውየው መድሃኒት ቢሸጥለት ችግር የለውም፡፡"
      ],
      correctAnswer: "C",
      explanation: "መድሃኒቶች ያለ ባለሙያ ምርመራና ማዘዣ ከተወሰዱ ለከፋ የጤና መታወክ አልፎ ተርፎም ለሞት ሊዳርጉ ይችላሉ፤ ስለዚህ የፋርማሲ ባለሙያው ህግንና ስነ-ምግባርን አክብሮ መከልከሉ የሰውን ህይወት ለመጠበቅ የተወሰደ ትክክለኛ ውሳኔ ነው፡፡"
    },
    {
      id: "g6civics-19",
      order: 19,
      question: "በትምህርት ቤታችሁ ሰላማዊ የመማር ማስተማር እንዲኖር ምን ምን ተግባራት ታከናውናላችሁ?",
      options: [
        "የትምህርት ቁሳቁስ ሳያሟሉ መምጣት",
        "በትምህርት ስዓት በክፍል መዟዟር",
        "የቤት ስራን ከሌላ ጓደኛ መገልበጥ",
        "የደንብ ልብስን ለብሶ መገኘት"
      ],
      correctAnswer: "D",
      explanation: "የትምህርት ቤትን ደንብና መመሪያዎች ማክበር (ለምሳሌ የደንብ ልብስ ለብሶ መገኘት) በትምህርት ቤት ውስጥ ስነ-ስርዓት እንዲሰፍንና ሰላማዊ የመማር ማስተማር ሂደት እንዲኖር ትልቅ አስተዋጽኦ ያደርጋል፡፡"
    },
    {
      id: "g6civics-20",
      order: 20,
      question: "ጓደኛችሁ የሌላ ተማሪ እስክርቢቶ ሲሰርቅ ብታዩ ምን ታደርጋላችሁ?",
      options: [
        "በድርጊቱ አብሬ እሳተፋለሁ፡፡",
        "ድርጊቱን በዝምታ አሳልፋለሁ፡፡",
        "እንዲመልስ እመክራለሁ፡፡",
        "ክእርሱ/ሷ ጋር እስማማለሁ።"
      ],
      correctAnswer: "C",
      explanation: "ስርቆት መጥፎና ስነ-ምግባር የጎደለው ተግባር ነው፤ ስለዚህ የቅርብ ጓደኛችን ይህንን ስህተት ሲፈጽም ስናይ አብሮ በመሳተፍ ወይም በዝምታ በመተባበር ፈንታ፤ ድርጊቱ ስህተት መሆኑን አስረድተን ንብረቱን ለባለቤቱ እንዲመልስ መምከር ይገባናል፡፡"
    },
    {
      id: "g6civics-21",
      order: 21,
      question: "ራስን የመግዛት ጥቅም የሆነው የትኛው ነው?",
      options: [
        "ራስን ከአደጋ ለመክተት",
        "ፍላጎትን ልት ለማድረግ",
        "መጥፎ ባህሪን ለማራቅ",
        "የሌሎችን ሃሳብ ለመንቀፍ"
      ],
      correctAnswer: "C",
      explanation: "ራስን መግዛት (Self-control) ማለት ስሜታችንን እና ፍላጎታችንን በምክንያታዊነት መቆጣጠር መቻል ነው፥ ይህ ደግሞ አላስፈላጊ ግልበጣዎችንና መጥፎ የሆኑ ግላዊ ባህሪያትን በማረም በመልካም ስነ-ምግባር እንድንታነጽ ይረዳል፡፡"
    },
    {
      id: "g6civics-22",
      order: 22,
      question: "የጓደኞች ግፊት በስነ-ምግባራዊ ውሳኔ ላይ እንዴት ተግዳሮትን ይፈጥራል?",
      options: [
        "ትክክለኛ ውሳኔ እንወስን እድል ስለሚሠጠን",
        "አማራጭ የውሳኔ ሃሳቦችን እንድንመርጥ ስለሚያችለን",
        "የስአነ እና የተገናዘበ ውሳኔ እንወስን ስለሚያደርገን",
        "ለመምሰል ስንል የተሳሳተ ውሳኔ እንወስን ስለሚያደርገን"
      ],
      correctAnswer: "D",
      explanation: "የአቻ ግፊት (Peer pressure) ተማሪዎች ከጓደኞቻቸው ላለመገለል ወይም እነሱን ለመምሰል ሲሉ የራሳቸውን ትክክለኛ የህሊና ፍርድ ወደ ጎን በመተው ስህተትና ስነ-ምግባር የጎደላቸውን ውሳኔዎች እንዲወስነ ሊያደርጋቸው ይችላል፡፡"
    },
    {
      id: "g6civics-23",
      order: 23,
      question: "መልካም ባህሪን ማዳበር ለሰዎች የሚሰጠው ጥቅም የትኛው ነው?",
      options: [
        "በጥላቻ መንፈስ ለመቀራረብ",
        "ተግባብቶ በፍቅር ለመኖር",
        "በንቀት አይን ለመተያየት",
        "ተፈራርቶ ለየብቻ ለመኖር"
      ],
      correctAnswer: "B",
      explanation: "እንደ ታማኝነት፤ ቅንነት፣ እና አክብሮት ያሉ መልካም የባህሪ እሴቶችን ማዳበር በሰዎች መካከል እምነትን ስለሚገነባ፤ ህብረተሰቡ እርስ በእርሱ ተከባብሮ፤ ተስማምቶና በፍቅር አብሮ እንዲኖር ያደርጋል፡፡"
    },
    {
      id: "g6civics-24",
      order: 24,
      question: "በየአመቱ የአረንጓዴ ልማት ተግባራትን እንሰራለን፤ ይህ ተግባርበዋናነት ለምን ይጠቅማል?",
      options: [
        "ከለጋሽ ድርጅቶች እርዳታን ያስገኛል፡፡",
        "ከሌሎች ሃገራት ውዳሴን ያጎናጽፋል፡፡",
        "የተፈጥሮ ሃብቶችን ያመናምናል፡፡",
        "በቂ ዝናብ እንድናገኝ ያስችላል፡፡"
      ],
      correctAnswer: "D",
      explanation: "የዛፎች መተከልና የአረንጓዴ ልማት ስራ የአየር ንብረት መዛባትንና መሸርሸርን ይከላከላል፥ ደን ደግሞ የዝናብ ኡደትን ስለሚጠብቅ ለግብርናና ለኑሮ የሚሆን በቂ ዝናብ በተከታታይ እንድናገኝ ከፍተኛ የተፈጥሮ አስተዋጽኦ ያደርጋል፡፡"
    },
    {
      id: "g6civics-25",
      order: 25,
      question: "አቶ አበበ በሰፈሩ የታወቀ ሐቀኛና እና ደግ ሰው ነው፡፡ ይህንን የአቶ አበበን ባህሪ እንዴት ትገመግማለህ/ያለሽ?",
      options: [
        "በሌሎች ሰዎች ዘንድ ንቀትን ያስከትላል፡፡",
        "ሰዎች ተጠራጥረው እንዲኖሩ ያስችላል፡፡",
        "የሰዎችን መልካም ግንኙነት ያሳድጋል፡፡",
        "በሰዎች መካከል ቅራኔን ይፈጥራል፡፡"
      ],
      correctAnswer: "C",
      explanation: "በአንድ ማህበረሰብ ውስጥ ሐቀኛና ደግ ሰዎች ሲኖሩ በሰዎች መካክል ሰላምና መተማመን ይሰፍናል፤ ይህም በጎረቤታሞችና በአካባቢው ህዝብ መካከል ያለውን መልካም ማህበራዊ ግንኙነት በእጅጉ ያሳድጋል፡፡"
    },
    {
      id: "g6civics-26",
      order: 26,
      question: "የትምህርት ቤታችሁ የቧንቧ ውሃ እየፈሰሰ ብትመለከት/ች ምን ታደርጋለህ/ጊያለሽ?",
      options: [
        "ውሃውን እዘጋዋለሁ፡፡",
        "አልፌ እሄዳለሁ፡፡",
        "ውሃውን እጫወትበታለሁ፡፡",
        "አይቼ እተወዋለሁ።"
      ],
      correctAnswer: "A",
      explanation: "ንጹህ ውሃ ወሳኝና ውስን የተፈጥሮ ሃብት ነው፤ የትምህርት ቤት ንብረትን መጠበቅ ደግሞ የተማሪዎች ኃላፊነት በመሆኑ፤ የቧንቧ ውሃ በከንቱ ሲፈስ ካየን ወዲያውኑ በመዝጋት ሃብት እንዳይባክን ማድረግ አለብን።"
    },
    {
      id: "g6civics-27",
      order: 27,
      question: "በአንድ ሀገር ውስጥ ዜጎች በህግ ከመገዛት ይልቅ በራሳቸው መንገድ ፍትህን ለማስፈን ቢሞክሩ ምን የሚፈጠር ይመስላችኋል?",
      options: [
        "ችግሮች በሰላማዊ መንገድ ይፈታሉ፡፡",
        "ብልሹ አሰራሮች ይቀንሳል፡፡",
        "የዜጎች ደህንነት ይረጋገጣል፡፡",
        "የዜጎች መብት ይጣሳል፡፡"
      ],
      correctAnswer: "D",
      explanation: "ሰዎች በህግ አግባብ ከመመራት ይልቅ በራሳቸው ስሜት ‘ፍትህ እሰጣለሁ” ብለው እርምጃ መውሰድ ሲጀምሩ የስርዓተ-አልበኝነትና የጉልበተኝነት አሰራር ስለሚነግስ የንፁሃን ዜጎች መብትና ደህንነት ሙሉ በሙሉ ይጣሳል፡፡"
    },
    {
      id: "g6civics-28",
      order: 28,
      question: "በአካባቢ እንክብካቤና በምርት መካከል ያለው ግንኙነት ምንድ ነው?",
      options: [
        "ምርታማነት የአካባቢን ስነምህዳር ይጎዳል፡፡",
        "የአካባቢ መጎዳት ምርትን ይጨምራል፡፡",
        "የአካባቢ ጥበቃ ከምርት ጋር አይገናኝም፡፡",
        "የአካባቢ ጥበቃ ምርትን በእጅጉ ያሻሽላል፡፡"
      ],
      correctAnswer: "D",
      explanation: "የአፈርና የውሃ ጥበቃ ስራዎችን ጨምሮ አካባቢን በአግባቡ መንከባከብ የአፈርን ለምነት ይይዛል፤ ይህም የግብርና ተግባራትን በማገዝ የሰብልም ሆነ የሌሎች ምርቶች መጠንና ጥራት በእጅጉ እንዲሻሻል ያደርጋል፡፡"
    },
    {
      id: "g6civics-29",
      order: 29,
      question: "ከሚከተሉት ውስጥ የግብር ስወራ ተግባር የሆነው የትኛው ነው?",
      options: [
        "የመሸጫን ዋጋ ማሳወቅ",
        "ትክክለኛ መረጃ መስጠት",
        "ደረሰኝ አልባ መገበያየት",
        "ግብርን በወቅቱ መክፈል"
      ],
      correctAnswer: "C",
      explanation: "ደረሰኝ ሳይቆርጡ መገበያየት የገቢና ወጪን መጠን በመደበቅ ለመንግስት መክፈል የሚገባውን ትክክለኛ ታክስ ወይም ግብርለማጭበርበር የሚደረግ ህገ-ወጥ የግብር ስወራ ተግባር ነው፡፡"
    },
    {
      id: "g6civics-30",
      order: 30,
      question: "ማህበራዊ ሚዲያ ለግለሰቦች የሚሰጠው እዎንታዊ ጥቅም የትኛው ነው?",
      options: [
        "ውሸትን ለማስፋፋት",
        "መረጃ ለመለዋወጥ",
        "ጊዜን ለማባአን",
        "ግጭት ለመፍጠሪያ"
      ],
      correctAnswer: "B",
      explanation: "ማህበራዊ ሚዲያ ለጥፋትም ለልማትም ሊያገለግል ይችላል፤ ነገርግን እንደ አዎንታዊ ወይም በጎ ጥቅም የሚጠቀሰው ፈጣንና ጠቃሚ የሆኑ ትምህርታዊና ማህበራዊ መረጃዎችን እርስ በእርስ ለመለዋወጥ ማስቻሉ ነው፡፡"
    },
    {
      id: "g6civics-31",
      order: 31,
      question: "ከሚከተሉት ውስጥ ህግን የሚያከብር ሰው ባህሪ የሆነው የትኛው ነው?",
      options: [
        "የግል ጥቅምን ማሰቀደም",
        "በኃይል/በጉልበት መመካት",
        "በህግና በመመሪያ መገዛት",
        "የእንቢተኝነት ስሜት መያዝ"
      ],
      correctAnswer: "C",
      explanation: "ህግ አክባሪ ዜጋ የሚለየው የግል ፍላጎቱ ወይም ጉልበቱ ምንም ይሁን ምን፤ ሁልጊዜም ለሀገሪቱ ህጎች፣ ደንቦችና መመሪያዎች ተገዥ በመሆን በስርዓት ውስጥ ብቻ ሲንቀሳቀስ ነው::"
    },
    {
      id: "g6civics-32",
      order: 32,
      question: "ከሚከተሉት ውስጥ የማህበራዊ ሚዲያ አጠቃቀም መርህ የሆነው የትኛው ነው?",
      options: [
        "የሰዎች ፈቃድ በማግኘት መረጃ ማጋራት",
        "ግጭትን የሚቀሰቅስ መልዕክት ማጋራት",
        "የሰዎች ሀሰተኛ መረጃዎችን ማጋራት",
        "የሰዎችን ስራ በቀጥታ መገልበጥ"
      ],
      correctAnswer: "A",
      explanation: "ማህበራዊ ሚዲያን በስነ-ምግባር ለመጠቀም የሰዎችን ግላዊ መብት ማክበር አለብን፣ ስለዚህ የሌሎችን መረጃ ወይም ፎቶ ከማጋራታችን በፊት የእነሱን ሙሉ ፈቃድ ማግኘት ዋነኛው መርህ ነው።"
    },
    {
      id: "g6civics-33",
      order: 33,
      question: "እንደ ተማሪነትህ/ሽ ወደ ሰባተኛ ክፍል በተሻለ ውጤት ለመሸጋገርአንተ/ች ምን ማድረግ አለብህ/ሽ?",
      options: [
        "ቴክኖሎጂን በመጠቀም መልስ መቅዳት",
        "አጠገቤ ከሚቀመጥ ተማሪ መኮረጅ",
        "ያለምንም ዝግጅት ፈተና መቀመጥ",
        "ጠንክሬ በማንበብ ለፈተና መቅረብ"
      ],
      correctAnswer: "D",
      explanation: "ወደ ቀጣዩ ክፍል በምርጥ ውጤት ለመሸጋገርና የተሳካ የትምህርት ህይወት ለመገንባት ማጭበርበር ወይም መኮረጅ ሳይሆን፤ አስቀድሞ በትጋትና በብርታት ጠንክሮ በማንበብና ተዘጋጅቶ ለፈተና መቅረብ ያስፈልጋል፡፡"
    },
    {
      id: "g6civics-34",
      order: 34,
      question: "ግብረገብነት የጎደለው ማህበራዊ ሚዲያን መጠቀም ስህተት የሚሆነው ለምንድን ነው?",
      options: [
        "የሰዎችን ክብር የሚጠብቅ በመሆነ",
        "ትምህርታዊ መረጃን ስለሚያጋራን",
        "የሌሎችን ስም ማጥፋት ስለሚችል",
        "እውነተኛ መረጃ መስጠት ስለሚችል"
      ],
      correctAnswer: "C",
      explanation: "ማህበራዊ ሚዲያን ያላግባብና ያለ ግብረገብ መጠቀም የሰዎችን ስምና ስብዕና በሀሰት ለማጠልሸት፣ ጥላቻን ለመዝራትና የሰዎችን ክብርና ሰላም ለማውደም ስለሚውል ትልቅ ስህተትና ወንጀል ነው፡፡"
    },
    {
      id: "g6civics-35",
      order: 35,
      question: "እንደ አንድ ግብረገባዊ ሃቀኛ ተማሪ እንድ ሰው የጓደኛችሁን ስም በከንቱ ሲያጠፋ ብትሰሙ ምን ታደርጋላችሁ?",
      options: [
        "ድርጊቱን እቃወማለሁ፡፡",
        "አብሬ አማለሁ፡፡",
        "ለታማው ሰው እነግረዋለሁ።",
        "ሚስጢር አባክናለሁ፡፡"
      ],
      correctAnswer: "A",
      explanation: "ሃቀኛና ግብረገባዊ ተማሪ በሌሉ ሰዎች ላይ የሚሰነዘርን የሀሰት ወሬና ስም ማጥፋት አይቀበልም፥ ስለዚህ ድርጊቱን በግንባር ቀደምትነት በመቃወም እውነቱን ማስረዳትና ስም ማጥፋቱን ማስቆም ይገባዋል፡፡"
    },
    {
      id: "g6civics-36",
      order: 36,
      question: "ወላጅ አባትህ/ሽ የባህል ፌስቲቫል ዝግጅት ላይ ወስዶ የተለያዩ ማህበረሰብ የባህል ዝግጅቶችን በሰፊው ተመለከታችሁ፡፡ ይህንን የባህል ፌስቲቫል እንዴት አየኸው/ሽው?",
      options: [
        "የራሴ ባህል ከሌላው የበለጠ እንደሆነ",
        "ለተለያዩ ባህሎች ክብር መስጠት እንዳለብን",
        "የሌሎች ባህል ከኛ ባህል ያነሰ መሆነ-",
        "የሌሎቹ ባህል ኋላቀር መሆናቸው"
      ],
      correctAnswer: "B",
      explanation: "የባህል ፌስቲቫሎች የሀገሪቱን ብዝሃነትና ውበት የሚያሳዩ ናቸው፥ እያንዳንዱ ባህል የየራሱ መገለጫና እሴት ስላለው፣ አንዱን ከእንዱ ሳናበላልጥ ለሁሉም ባህሎች እኩል አክብሮትና እውቅና መስጠት"
    },
    {
      id: "g6civics-37",
      order: 37,
      question: "ሁለት ጓደኞችህ/ሽ ከመኖርያ ቤትህ/ሽ አንተን እንችን ለመጠየቅ ቢመጡ፣ እንደ አንድ ትሁት ተማሪ ምን ታደርጋለህ/ሽ?",
      options: [
        "በአክብሮት መቀበል",
        "ጥላቻን ማሳየት",
        "አክብሮት መንፈግ",
        "ዝቅ አድረጎ ማየት"
      ],
      correctAnswer: "A",
      explanation: "እንግድን ማክበርና በደስታ መቀበል የመልካም ስነ-ምግባርና የትህትና መገለጫ ነው፥ ስለዚህ ሊጠይቁን የመጡ ጓደኞቻችንን በአክብሮትና በፍቅር ተቀብሎ ማስተናገድ ተገቢው ተግባር ነው።"
    },
    {
      id: "g6civics-38",
      order: 38,
      question: "በአካባቢያችን የሚካሄዱ የሽምግልና ተግባራት በባህል መካከል ለሚኖርአዎንታዊ ግንኙነት እንዴት ይጠቅማሉ?",
      options: [
        "የሽምግልና ስርዓት ዘመናዊነትን ያደናቅፋል፡፡",
        "ለተጋጩ ወገኖች ዘለቂ ስላምን ያመጣል፡፡",
        "የግለሰቦችን ጊዜያዊ ችግር ያወሳስባል፡፡",
        "የባህል ክፍተቶች እንዲሰፉ ያደርጋል፡፡"
      ],
      correctAnswer: "B",
      explanation: "ባህላዊ የሽምግልና ስርዓት በሰዎችና በማህበረሰቦች መካከል የሚነሱ ግጭቶችን በውይይት፣ በዕርቅና በይቅርታ ስለሚፈታ፤ ቂምና በቀልን አስወግዶ ለተጋጩ ወገኖች አስተማማኝና ዘላቂ ሰላምን ያሰፍናል፡፡"
    },
    {
      id: "g6civics-39",
      order: 39,
      question: "ከሚከተሉት ውስጥ የታማኝ ሰው ባህሪን የሚገልጸው የትኛው ነው?",
      options: [
        "እውነትን መናገር",
        "ለጓደኛ አለመታመን",
        "ስህተትን አለማመን",
        "ውሸትን መናገር"
      ],
      correctAnswer: "Α",
      explanation: "ታማኝነት በቅንነትና በእውነት ላይ የተመሰረተ ነው፤ አንድ ታማኝ ሰው በማንኛውም ሁኔታ ውስጥ ቢሆን እንኳ ከሀሰትና ከማታለል ይርቃል፤ ሁልጊዜም እውነትን በግልጽ ይናገራል፡፡"
    },
    {
      id: "g6civics-40",
      order: 40,
      question: "እንደ አንድ መልካም ዜጋ አንድ በቋንቋ ልዩነት ያለው ሰው ቢገጥምህ/ሽ ምን ታደርጋለህ/ሽ?",
      options: [
        "ሰውየውን ከናካቴው አለማየትና መርዳት አለመፈለግ",
        "የውሸት መረጃዎችን በመስጠት ሰውየውን ማሳሳት",
        "ሰውየውን በጥርጣሬ በማየት ከመርዳት መቆጠብ",
        "የስውየውን ቋንቋ ግምት ውስጥ ማስገባትና መርዳት"
      ],
      correctAnswer: "D",
      explanation: "ሰብአዊነትና መልካም ዜግነት በቋንቋ ወይም በባህል አይገደብም የተቸገረን ሰው ስናገኝ የሚናገረውን ቋንቋ ከግምት ውስጥ በማስገባት (በምልክትም ይሁን በሌላ መንገድ ለመረዳት በመሞከር) አቅማችን የፈቀደውን በጎ እገዛ ልናደርግለት ይገባል፡፡"
    }
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
