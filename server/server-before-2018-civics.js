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
  "grade6-2018-amharic": [
  {
    id: "g6am2018-4",
    question:
      "ምንባቡ የቀረበበት የአንቀጽ ማስፋፊያ ስልት የቱ ነው?",
    options: [
      "ሀ. አመዛዛኝ",
      "ለ. ተራኪ",
      "ሐ. አስረጅ",
      "መ. ገላጭ"
    ],
    correctAnswer: "ለ",
    explanation:
      "ጽሑፉ “ከዕለታት አንድ ቀን...” በማለት የድርጊቶችን ቅደም ተከተል ጠብቆ ታሪክን የሚያወራ ወይም የሚተርክ በመሆኑ የተራኪ አንቀጽ ማስፋፊያ ስልትን ተጠቅሟል።"
  },
  {
    id: "g6am2018-5",
    question:
      "ከላይ የቀረበው ምንባብ ዋነኛ መልዕክቱ (ጭብጡ) ምንድነው?",
    options: [
      "ሀ. የማር ጥቅምና አመራረት",
      "ለ. የንብ ቀፎ የአሰራር ሂደት",
      "ሐ. የንግስት ንቦች ተግባርና ሀላፊነት",
      "መ. የንቦች የተደራጀ የህብረት አኗኗር"
    ],
    correctAnswer: "መ",
    explanation:
      "ምንባቡ ስለ ንቦች ስርዓት፣ በሶስት ክፍል ተከፍለው በስራ ክፍፍልና በህብረት እንዴት ተደራጅተው እንደሚኖሩ የሚያብራራ በመሆኑ ጭብጡ የንቦች የተደራጀ የህብረት አኗኗር ነው።"
  },
  {
    id: "g6am2018-6",
    question:
      "ለምንባቡ ተስማሚ ሊሆን የሚችለው ርዕስ የትኛው ነው?",
    options: [
      "ሀ. የንቦች አኗኗር",
      "ለ. የንብ ቀፎ አሰራር",
      "ሐ. የንብ እርባታ",
      "መ. የማር አመራረት"
    ],
    correctAnswer: "ሀ",
    explanation:
      "ጽሑፉ በሙሉ ትኩረት አድርጎ የሚያስረዳው ስለ ንቦች ማህበራዊ አወቃቀር፣ ስራዎቻቸውና በህይወት ስለሚቆዩበት ሁኔታ ስለሆነ “የንቦች አኗኗር” የሚለው ርዕስ ተስማሚ ነው።"
  },
  {
    id: "g6am2018-7",
    question:
      "በምንባቡ መሰረት “ሰራዊት” የሚለው ቃል አውዳዊ ፍቺው ምንድነው?",
    options: [
      "ሀ. መከላከያ",
      "ለ. መንጋ",
      "ሐ. ሰራተኛ",
      "መ. ጭፍራ"
    ],
    correctAnswer: "ለ",
    explanation:
      "በአንድ ቀፎ ውስጥ በብዛት ተሰብስበው የሚኖሩትን የንብ ስብስብ ወይም ማህበር የሚገልጽ በመሆኑ ለእንስሳትና ነፍሳት ስብስብ የሚሰጠው አውዳዊ ፍቺ “መንጋ” የሚለው ነው።"
  },
  {
    id: "g6am2018-8",
    question:
      "ንግስት ንቦች በአንድ ተስማሚ ወቅት ውስጥ ምን ያህል እንቁላሎችን ይጥላሉ?",
    options: [
      "ሀ. 2ሺ",
      "ለ. 60ሺ",
      "ሐ. 250ሺ",
      "መ. 1ሚሊዮን"
    ],
    correctAnswer: "ሐ",
    explanation:
      "በምንባቡ ውስጥ ንግስቷ በቀን ከ2ሺ የሚበልጡ እንቁላሎችን እና በአንድ ተስማሚ ወቅት ውስጥ 250ሺ ያህል እንቁላሎችን እንደምትጥል ተገልጿል።"
  },
  {
    id: "g6am2018-9",
    question:
      "ከሚከተሉት አማራጮች መካከል አንዱ የሰራተኛ ንቦች ተግባር አይደለም።",
    options: [
      "ሀ. ምግብ ማቅረብ",
      "ለ. እንቁላል መጣል",
      "ሐ. ዝርያዎቻቸውን ከአጥቂዎች መከላከል",
      "መ. ከአበቦች ላይ ወለላ መቅሰም"
    ],
    correctAnswer: "ለ",
    explanation:
      "በምንባቡ መሰረት እንቁላል መጣል የንግስት ንብ ስራ ብቻ ሲሆን፣ ምግብ ማቅረብ፣ መከላከልና ወለላ መቅሰም ግን የሰራተኛ ንቦች ተግባራት ናቸው።"
  },
  {
    id: "g6am2018-10",
    question:
      "በአንድ ቀፎ ውስጥ የሚሰፍሩ ንቦች ብዛት ምን ያህል ይሆናል?",
    options: [
      "ሀ. 1 ሚሊዮን",
      "ለ. 250ሺ",
      "ሐ. 500ሺ",
      "መ. 60ሺ"
    ],
    correctAnswer: "መ",
    explanation:
      "በምንባቡ የመጨረሻ መስመር ላይ “በአንድ ቀፎ ውስጥ የሚሰፍሩት ንቦች ብዛትም እስከ 60ሺ ይደርሳል” ተብሎ በግልጽ ተጽፏል።"
  },
  {
    id: "g6am2018-11",
    question:
      "“ካነበባችሁት” የሚለው ቃል ተነጣጥሎ ሲጻፍ የሚሆነው የትኛው ነው?",
    options: [
      "ሀ. ከ - አነበባችሁ - ት",
      "ለ. ከ - እነበብ - ኣችሁት",
      "ሐ. ከ - አነበብ - ኣችሁ - ት",
      "መ. ካነበብ - ኣችሁ - ት"
    ],
    correctAnswer: "ሐ",
    explanation:
      "“ካነበባችሁት” የሚለው ቃል በተነጣጠለ መልኩ “ከ - አነበብ - ኣችሁ - ት” በሚል መልኩ ይከፈላል።"
  },
  {
    id: "g6am2018-12",
    question:
      "“እንደ-እየ-ባህሪ-ኣችን” የሚለው ቃል ተገጣጥሞ ሲነበብ የትኛው ይሆናል?",
    options: [
      "ሀ. እንደባህሪያችን",
      "ለ. እንደየባህሪያችን",
      "ሐ. እንደየባህሪያችንን",
      "መ. እየባህሪያችን"
    ],
    correctAnswer: "ለ",
    explanation:
      "የተሰጡትን ክፍሎች ስናገጣጥም “እንደ” እና “እየ” አንድ ላይ በመሆን “እንደየ” ይፈጥራሉ፤ “ባህሪ” ከ “ኣችን” ጋር ሲዋሃድ “ባህሪያችን” ስለሚሆን “እንደየባህሪያችን” የሚለው ትክክለኛ ቃል ይወጣል።"
  },
  {
    id: "g6am2018-13",
    question:
      "“ደባ” የሚለው ቃል መዝገበ ቃላዊ ፍቺው ምንድነው?",
    options: [
      "ሀ. ተንኮል",
      "ለ. በቀል",
      "ሐ. ፍርድ",
      "መ. ህብረት"
    ],
    correctAnswer: "ሀ",
    explanation:
      "“ደባ” ማለት በአንድ ሰው ላይ በምስጢር የሚሸረብ ወይም የሚደረግ ክፉ ስራ፣ ሴራ ወይም ተንኮል ማለት ነው።"
  },
  {
    id: "g6am2018-14",
    question:
      "“ቆፈን” ለሚለው ቃል ተቃራኒ ፍቺው ምንድነው?",
    options: [
      "ሀ. ቆዳ",
      "ለ. ቅርፊት",
      "ሐ. ብርድ",
      "መ. ሙቀት"
    ],
    correctAnswer: "መ",
    explanation:
      "“ቆፈን” ማለት ብርቱ የሆነ ቅዝቃዜ ወይም ብርድ ማለት በመሆኑ ቀጥተኛ ተቃራኒው “ሙቀት” የሚለው ቃል ይሆናል።"
  },
  {
    id: "g6am2018-15",
    question:
      "“ቀጣፊ” የሚለው ቃል ተመሳሳይ ፍቺው ምንድነው?",
    options: [
      "ሀ. ታማኝ",
      "ለ. ውሸታም",
      "ሐ. ነጣቂ",
      "መ. ሀቀኛ"
    ],
    correctAnswer: "ለ",
    explanation:
      "በአማርኛ ቋንቋ አጠቃቀም “ቀጣፊ” ማለት እውነታን የሚያጣምም፣ የማይደረገውን ሆነ የሚል ወይም “ውሸታም” ማለት ነው።"
  },
  {
    id: "g6am2018-16",
    question:
      "“ልጅቱ ቆቅ ናት።” በሚለው ዐረፍተ ነገር ውስጥ ቆቅ የሚለው ቃል ፍካሬያዊ ፍቺው ምንድነው?",
    options: [
      "ሀ. የወፍ ዝርያ",
      "ለ. ንቁ",
      "ሐ. በራሪ",
      "መ. ችኩል"
    ],
    correctAnswer: "ለ",
    explanation:
      "ቆቅ የተባለችው ወፍ አካባቢዋን ጠባቂና በቀላሉ የማትያዝ ፍጡር በመሆኗ በምሳሌያዊ ወይም ፍካሬያዊ አነጋገር አንድን በጣም ብልህ፣ አስተዋይና “ንቁ” የሆነን ሰው ለመግለጽ “ቆቅ ነው/ናት” ይባላል።"
  },
  {
    id: "g6am2018-17",
    question:
      "“ሥጋ” ለሚለው ቃል እማሬያዊ ፍቺው ምንድነው?",
    options: [
      "ሀ. ዘመድ",
      "ለ. ወዳጅ",
      "ሐ. ገንቢ ምግብ",
      "መ. ባዕድ"
    ],
    correctAnswer: "ሐ",
    explanation:
      "እማሬያዊ ፍቺ ማለት የአንድ ቃል ቀጥተኛ የመጀመሪያ መዝገበ-ቃላዊ ፍቺ ማለት ነው። “ሥጋ” የሚለው ቃል ቀጥተኛ ትርጉሙ ከእንስሳት የሚገኝ የሰውነት አካል ወይም “ገንቢ ምግብ” ሲሆን “ዘመድ” የሚለው ግን ፍካሬያዊ ፍቺው ነው።"
  },
  {
    id: "g6am2018-18",
    question:
      "“ፈለጠች” የሚለው ቃል የፊደላቱ ቅደም ተከተል ሲቀያየር የሚል ቃል ይሰጣል?",
    options: [
      "ሀ. ለፈጠች",
      "ለ. ፈጠለች",
      "ሐ. ጠፈለች",
      "መ. ጠለፈች"
    ],
    correctAnswer: "መ",
    explanation:
      "“ፈለጠች” በሚለው ቃል ውስጥ ያሉትን አራት ፊደላት ይዞ ቅደም ተከተላቸውን ብቻ በመቀየር ትርጉም ያለው ሌላ ቃል መስራት የሚቻለው “ጠለፈች” የሚለውን ነው።"
  },
  {
    id: "g6am2018-19",
    question:
      "“ስለቤተሰቦቻችን” በሚለው ቃል ውስጥ ነፃ ምዕላዱ የትኛው ነው?",
    options: [
      "ሀ. ስለቤተሰብ",
      "ለ. ቤተሰብ",
      "ሐ. ቤተሰቦች",
      "መ. ቤተሰቦቻችን"
    ],
    correctAnswer: "ለ",
    explanation:
      "ነፃ ምዕላድ ማለት ብቻውን ቆሞ ሙሉ ትርጉም መስጠት የሚችልና ሌላ ቅጥያ ያልገባበት የቃሉ መሰረት ነው። በዚህ ቃል ውስጥ “ስለ-” ቅድመ-ቅጥያ፣ “-ኦች” እና “-ኣችን” ድህረ-ቅጥያዎች ሲሆኑ ዋናው ነፃ ቃል “ቤተሰብ” ነው።"
  },
  {
    id: "g6am2018-20",
    question:
      "“መምህራችን” በሚለው ቃል ውስጥ ጥገኛ ምዕላዱ የትኛው ነው?",
    options: [
      "ሀ. መምህር -ኣችን",
      "ለ. መምህራችን -ኣችን",
      "ሐ. -ኣችን",
      "መ. -ችን"
    ],
    correctAnswer: "ሐ",
    explanation:
      "ጥገኛ ምዕላድ ማለት ብቻውን ሊቆም የማይችል፣ ከነፃ ምዕላድ ጋር ተቀጥሎ ሰዋሰዋዊ አገልግሎት የሚሰጥ ክፍል ነው። “መምህር” የሚለው ነፃ ምዕላድ ሲሆን የእኛነታችንን ባለቤትነት ለማሳየት የገባው ጥገኛ ምዕላድ “-ኣችን” የሚለው ነው።"
  },
  {
    id: "g6am2018-21",
    question:
      "የተለያዩ ምሳሌዎችንና መረጃዎችን በማቅረብ የአንቀጽን ዋና ሀሳብ ለማብራራት የሚጠቅም የአንቀጽ ተዋቃሪ አካል ምን በመባል ይታወቃል?",
    options: [
      "ሀ. ኃይለ ቃል",
      "ለ. መደምደሚያ ዓረፍተ ነገር",
      "ሐ. መዘርዝር ዓረፍተ ነገር",
      "መ. የመሀል ዓረፍተ ነገር"
    ],
    correctAnswer: "ሐ",
    explanation:
      "መዘርዝር ዓረፍተ ነገሮች (Supporting sentences) በአንቀጽ ውስጥ የተነሳውን ዋና ሀሳብ (ኃይለ ቃል) የተለያዩ ማብራሪያዎችን፣ ምሳሌዎችን እና ዝርዝር መረጃዎችን በመስጠት የሚያሰፉና የሚያጠናክሩ ተዋቃሪ አካላት ናቸው።"
  },
  {
    id: "g6am2018-22",
    question:
      "“ስልሳ ዓመት የሞላው፤ ኮሰስ ጎበጥ ያለ ቁመና ያለው፤ ራሰ በራ ሰው በሀሳባችሁ ለማየት ሞክሩ። ፊቱ በማድያት የክሰለ፥ በከፊል በረገፉ ሽፋሽፍቶች ስር የሚጉረጠረጡ ድፍርስ ዐይኖች ያሉት ሰው በዓይነ ህሊናችሁ እዩ። እኔን እንዳያችሁኝ ቁጠሩት።” ከዚህ በላይ የነበባችሁት ጽሑፍ በምን አይነት የአንቀጽ ማስፋፊያ ስልት የቀረበ ነው?",
    options: [
      "ሀ. በገላጭ",
      "ለ. በተራኪ",
      "ሐ. በማወዳደር",
      "መ. በማነፃፀር"
    ],
    correctAnswer: "ሀ",
    explanation:
      "ጽሑፉ የአንድን ሰው ውጫዊ ቁመና፣ የፊት ገጽታና ሁኔታ በዓይነ-ሕሊና ስዕል መስሎ ቁልጭ አድርጎ የሚያሳይ በመሆኑ የገላጭ (Descriptive) አንቀጽ ማስፋፊያ ስልት መገለጫ ነው።"
  },
  {
    id: "g6am2018-23",
    question:
      "አንድ ታሪክ፣ ድርጊት፣ ሁኔታ... መቼ እንደተከናወነ ለማመልከት ጉዳዩን በጊዜ ቅደም ተከተል ውስጥ አደራጅቶ የሚያሳይ የአንቀጽ ማስፋፊያ ስልት ምን በመባል ይታወቃል?",
    options: [
      "ሀ. ገላጭ",
      "ለ. እነፃፃሪ",
      "ሐ. እወዳዳሪ",
      "መ. ተራኪ"
    ],
    correctAnswer: "መ",
    explanation:
      "ድርጊቶችን ወይም ታሪኮችን የተፈጸሙበትን የጊዜ ቅደም ተከተል መሰረት በማድረግ ከመጀመሪያ እስከ መጨረሻ የሚያስነብብ የስነ-ጽሑፍ ስልት ተራኪ (Narrative) ይባላል።"
  },
  {
    id: "g6am2018-24",
    question:
      "ከሚከተሉት ዓረፍተ ነገሮች መካከል ትክክለኛው የስርዓተ ነጥብ አጠቃቀም የሚታይበት የትኛው ነው?",
    options: [
      "ሀ. ትምህርት ቤት ስትመጡ ደብተር፤ መጻሕፍትና እርሳስ ማሟላት አለባችሁ፡፡",
      "ለ. ትምህርት ቤት ስትመጡ ደብተር፥ መጻሕፍትና እርሳስ ማሟላት አለባችሁ።",
      "ሐ. ትምህርት ቤት ስትመጡ ደብተር! መጻሕፍትና እርሳስ ማሟላት አለባችሁ፡፡",
      "መ. ትምህርት ቤት ስትመጡ ደብተር መጻሕፍትና እርሳስ ማሟላት አለባችሁ፡፡"
    ],
    correctAnswer: "ሀ",
    explanation:
      "ተመሳሳይ የሆኑ ነገሮች ወይም ስሞች ተራ በተራ ተዘርዝረው ሲቀመጡ በመካከላቸው ነጠላ ሰረዝ መግባት ስላለበት በ “ደብተር” እና “መጻሕፍት” መካከል ነጠላ ሰረዝ የተጠቀመው አማራጭ ሀ ትክክለኛ ነው።"
  },
  {
    id: "g6am2018-25",
    question:
      "“ሠራተኞች ከመስራት ወደኋላ አላሉም-------ነገር ግን ድርጅቱ አላደገም።” በክፍት ቦታው ላይ መግባት ያለበት ስርዓተ ነጥብ የትኛው ነው?",
    options: [
      "ሀ. !",
      "ለ. ድርብ ሰረዝ",
      "ሐ. ነጠላ ሠረዝ",
      "መ. :–"
    ],
    correctAnswer: "ለ",
    explanation:
      "ድርብ ሰረዝ በአንድ ዓረፍተ ነገር ውስጥ ሁለት ተቃራኒ ወይም ተዛማጅ ሀሳቦች ያሏቸውን ዓረፍተ ነገሮች ለማያያዝ በተለይም እንደ “ነገር ግን” እና “ቢሆንም” ያሉ እያያዥ ቃላት በፊት ይገባል።"
  },
  {
    id: "g6am2018-26",
    question:
      "ከሚከተሉት መካከል ቢጋር የመንደፍ ጠቀሜታ የሆነው የቱ ነው?",
    options: [
      "ሀ. በጽሑፍ ውስጥ መካተት ያለባቸውን ሀሳቦች እንድንዘነጋ ያደርጋል።",
      "ለ. ከጽሑፉ ርዕስ ጉዳይ ውጭ የሆኑ ሀሳቦችን ለማካተት ያስችላል።",
      "ሐ. ሀሳቦችን በተገቢው ቅደም ተከተል ለማቅረብ ያስችላል።",
      "መ. የጽሑፉን ዋናና ዝርዝር ሀሳቦች እንዳንለይ ያደርጋል።"
    ],
    correctAnswer: "ሐ",
    explanation:
      "ቢጋር (Outline) የመንደፍ ዋና ጠቀሜታ የምንጽፈውን ጽሑፍ ከመጀመራችን በፊት ዋና ዋናና ዝርዝር ሀሳቦችን በስርዓት እና በተገቢው አመክንዮአዊ ቅደም ተከተል ለማደራጀት ማስቻሉ ነው።"
  },
  {
    id: "g6am2018-27",
    question:
      "“ኢ.ዜ.አ.” የሚለው አኅጽሮተ ቃል ተተንትኖ ሲጻፍ የሚሆነው የትኛው ነው?",
    options: [
      "ሀ. የኢትዮጵያ ዜና አገልግሎት",
      "ለ. የኢትዮጵያ ዜግነት አገልግሎት",
      "ሐ. የኢትዮጵያ ዜጎች አገልግሎት",
      "መ. የኢትዮጵያ ዜና አሰራጭ"
    ],
    correctAnswer: "ሀ",
    explanation:
      "“ኢ.ዜ.አ.” የሀገሪቱን ብሔራዊ የዜና ተቋም የሚወክል ሲሆን ሙሉ ትንታኔው “የኢትዮጵያ ዜና አገልግሎት” (Ethiopian News Agency) ነው።"
  },
  {
    id: "g6am2018-28",
    question:
      "“የትምህርት መሳሪያዎች ማምረቻና ማከፋፈያ ድርጅት” የሚለው ሀረግ በምህጻረ ቃል ሲጻፍ እንዴት ነው?",
    options: [
      "ሀ. የት.መ.ማም.ማ.ድ",
      "ለ. ት.መ.ማ.ማ.ድ.",
      "ሐ. ት.መ.ማም.ማከድ.",
      "መ. የት.መ.ማ.ማከ.ድ."
    ],
    correctAnswer: "ለ",
    explanation:
      "ምህጻረ ቃል ሲመሰረት የእያንዳንዱ ዋና ቃል የመጀመሪያ ፊደላት ተወስደው በአጭሩ ይጻፋሉ። በዚህ መሰረት ት.መ.ማ.ማ.ድ. ይሆናል።"
  },
  {
    id: "g6am2018-29",
    question:
      "ከሚከተሉት የደራሲያን አላባውያን መካከል በልቦለድ ውስጥ የቀረበው ታሪክ የተፈጸመበትን ጊዜና ቦታ የሚወክል እንዲሁም መቼና የት የሚሉ ቃላትን አጣምሮ የያዘ አላባ ምን በመባል ይታወቃል?",
    options: [
      "ሀ. ሴራ",
      "ለ. ታሪክ",
      "ሐ. ገፀ-ባህሪ",
      "መ. መቼት"
    ],
    correctAnswer: "መ",
    explanation:
      "በልቦለድ ስነ-ጽሑፍ ውስጥ ታሪኩ የተከናወነበትን አካባቢ (ቦታ) እና የተፈጸመበትን ዘመን (ጊዜ) የሚያመለክተው አላባ “መቼት” ይባላል።"
  },
  {
    id: "g6am2018-30",
    question:
      "በልቦለድ ዓለም ስጋ ለብሰው፣ ባህሪ ተጎናጽፈው፣ መኖሪያ ተዘጋጅቶላቸው የሚንቀሳቀሱ፣ እንደእውነተኛ ዓለም ሰዎች የሚኖሩና የሚሞቱ ሰዎች ምን በመባል ይጠራሉ?",
    options: [
      "ሀ. ታሪክ",
      "ለ. ትልም",
      "ሐ. ገፀ-ባህሪ",
      "መ. መቼት"
    ],
    correctAnswer: "ሐ",
    explanation:
      "በታሪክ ውስጥ በተግባር ተሳትፎ የሚያደርጉ፣ ክፉ ወይም ደግ ተግባር ተሰጥቷቸው በድርጊት የሚንቀሳቀሱት ሰዎች ወይም ፍጥረታት “ገፀ-ባህሪ” (Characters) ይባላሉ።"
  },
  {
    id: "g6am2018-31",
    question:
      "ከሚከተሉት መካከል ትክክለኛውን የአማርኛ ቋንቋ የአበዛዝ ስርዓት ተከትሎ ብዙ ቁጥር የሆነው ቃል የትኛው ነው?",
    options: [
      "ሀ. ከተሞች",
      "ለ. እጽዋቶች",
      "ሐ. ህጻናቶች",
      "መ. ሐረጋቶች"
    ],
    correctAnswer: "ሀ",
    explanation:
      "“ከተማ” የሚለው ነጠላ ቃል የብዙ ቁጥር ማሳያ “-ኦች” ሲገባበት “ከተሞች” ይሆናል። በአንፃሩ እጽዋት፣ ህጻናት እና ሐረጋት ቀድሞውኑ ብዙ ቁጥር ስለሆኑ ተጨማሪ ብዙ ቁጥር መጨመር ስህተት ይፈጥራል።"
  },
  {
    id: "g6am2018-32",
    question:
      "“ወንድሞችሽ” በሚለው ቃል ውስጥ ብዙ ቁጥር አመልካች ምዕላዱ የትኛው ነው?",
    options: [
      "ሀ. -ም",
      "ለ. -ኦችሽ",
      "ሐ. -ሽ",
      "መ. -ኦች"
    ],
    correctAnswer: "መ",
    explanation:
      "“ወንድም” ለሚለው ነጠላ ቃል ብዙ ቁጥር ለማድረግ የገባውና ዋናው የአበዛዝ ምዕላድ “-ኦች” የሚለው ሲሆን “-ሽ” የሚለው ግን የአንቺነት የባለቤትነት ማሳያ ነው።"
  },
  {
    id: "g6am2018-33",
    question:
      "“ማንበብ ሙሉ ሰው ያደርጋል።” በሚለው ዓረፍተ ነገር ውስጥ ግሱ የትኛው ነው?",
    options: [
      "ሀ. ሙሉ",
      "ለ. ማንበብ",
      "ሐ. ያደርጋል",
      "መ. ሰው"
    ],
    correctAnswer: "ሐ",
    explanation:
      "ግስ ማለት በአንድ ዓረፍተ ነገር ድርጊትን ወይም ሁነትን በመግለጽ ዓረፍተ ነገሩን የሚዘጋ የቃል ክፍል ነው። በዚህ ዓረፍተ ነገር “ያደርጋል” የሚለው ድርጊቱን ይገልጻል።"
  },
  {
    id: "g6am2018-34",
    question:
      "“ጽጌሬዳ ዛሬ ትምህርት ቤት አልመጣችም።” በዚህ ዓረፍተ ነገር ውስጥ የተጸውዖ ስም የሆነው የትኛው ነው?",
    options: [
      "ሀ. ዛሬ",
      "ለ. ጽጌሬዳ",
      "ሐ. አልመጣችም",
      "መ. ትምህርት"
    ],
    correctAnswer: "ለ",
    explanation:
      "የተጸውዖ ስም (Proper noun) ለአንድ የተወሰነ ሰው፣ ቦታ ወይም ቁስ ብቻ ተለይቶ የሚሰጥ መጠሪያ ስም ነው። “ጽጌሬዳ” የአንድን ሰው ለይቶ የጠቀሰ የተጸውዖ ስም ነው።"
  },
  {
    id: "g6am2018-35",
    question:
      "“የተሰጣችሁ ሰዓት ስላለቀ የፈተና ወረቀታችሁን ቶሎ መልሱ።” በሚለው ዓረፍተ ነገር የተሰመረበት (ቶሎ) ቃል ከየትኛው የቃል ክፍል ይመደባል?",
    options: [
      "ሀ. ከተውሳከ ግስ",
      "ለ. ከግስ",
      "ሐ. ከስም",
      "መ. ከተውላጠ ስም"
    ],
    correctAnswer: "ሀ",
    explanation:
      "ተውሳከ ግስ (Adverb) የግሱን አፈጻጸም ሁኔታ፣ ጊዜ፣ ቦታ ወይም መጠን የሚገልጽ የቃል ክፍል ነው። “ቶሎ” የሚለው ቃል “መልሱ” የሚለው ግስ በምን ያህል ፍጥነት መፈጸም እንዳለበት ስለሚያሳይ ከተውሳከ ግስ ይመደባል።"
  },
  {
    id: "g6am2018-36",
    question:
      "“እነሱ ሀገራቸውን በጣም ይወዳሉ።” በዚህ ዓረፍተ ነገር ውስጥ ተውላጠ ስሙ የትኛው ነው?",
    options: [
      "ሀ. ሀገራቸውን",
      "ለ. በጣም",
      "ሐ. ይወዳሉ",
      "መ. እነሱ"
    ],
    correctAnswer: "መ",
    explanation:
      "ተውላጠ ስም (Pronoun) የአንድን ስም ድግግሞሽ ለማስቀረት በስም ምትክ የሚገባ ቃል ነው። “እነሱ” የሚለው ቃል የሰዎችን ስም በመተካት የገባ ተውላጠ ስም ነው።"
  },
  {
    id: "g6am2018-37",
    question:
      "“ያቺ ጠይም ረዥም ልጅ አሁን ወደ ገቢያ ሄደች።” በዚህ ዓረፍተ ነገር ውስጥ መጠን አመልካች ቅጽል የሆነው የቱ ነው?",
    options: [
      "ሀ. ጠይም",
      "ለ. ያቺ",
      "ሐ. ረዥም",
      "መ. አሁን"
    ],
    correctAnswer: "ሐ",
    explanation:
      "መጠን አመልካች ቅጽል የአንድን ስም ርዝመት፣ ስፋት፣ ቁመት ወይም መጠን የሚገልጽ ነው። “ረዥም” የሚለው ቃል የልጅቷን የቁመት መጠን ስለሚገልጽ መጠን አመልካች ቅጽል ነው።"
  },
  {
    id: "g6am2018-38",
    question:
      "“ተወዳጇ ድምጻዊት ረዥም አረንጓዴ ቀሚስ ለብሳ ወደ መድረክ ወጣች።” በሚለው ዓረፍተ ነገር ውስጥ አይነት አመልካች ቅጽል የሆነው የትኛው ነው?",
    options: [
      "ሀ. ረዥም",
      "ለ. ድምጻዊት",
      "ሐ. ቀሚስ",
      "መ. አረንጓዴ"
    ],
    correctAnswer: "መ",
    explanation:
      "አይነት አመልካች ቅጽል የአንድን ነገር ቀለም፣ ጥራት ወይም መልክ የሚገልጽ ነው። “አረንጓዴ” የሚለው ቃል የቀሚሱን ቀለም ስለሚገልጽ አይነት አመልካች ቅጽል ይባላል።"
  },
  {
    id: "g6am2018-39",
    question:
      "ከሚከተሉት ዓረፍተ ነገሮች መካከል በማይሻገር/ኢ-ሳቢ ግስ የተዋቀረው የትኛው ነው?",
    options: [
      "ሀ. ለችግኝ መትከያ የሚሆን ጉድጓድ ቆፈረ።",
      "ለ. ነገሩ ስላስገረመው በጣም ሳቀ።",
      "ሐ. መምህር አበበ የፈተና ወረቀታችንን አረመ።",
      "መ. ታዋቂው ባለሀብት ትልቅ ሕንጻ አስገነባ።"
    ],
    correctAnswer: "ለ",
    explanation:
      "የማይሻገር (ኢ-ሳቢ/Intransitive) ግስ ማለት ድርጊቱ በባለቤቱ ላይ ብቻ የሚቀርና ድርጊቱን የሚቀበል ሌላ ቀጥተኛ ተሳቢ የማይፈልግ ግስ ነው። “ሳቀ” የሚለው ግስ ተሳቢ ስለማይፈልግ በማይሻገር ግስ የተዋቀረ ነው።"
  },
  {
    id: "g6am2018-40",
    question:
      "“የትምህርት ቤታችን ርዕሰ መምህር ለጎበዝ ተማሪዎች የምስክር ወረቀት ሸለሙ።” በዚህ ዓረፍተ ነገር የተሰመረበት ቃል ምን አይነት ግስ ነው?",
    options: [
      "ሀ. የማይሻገር",
      "ለ. የመሆን",
      "ሐ. ተሻጋሪ",
      "መ. የመኖር"
    ],
    correctAnswer: "ሐ",
    explanation:
      "ተሻጋሪ (ሳቢ/Transitive) ግስ ማለት ድርጊቱ ከባለቤቱ አልፎ ወደ ተሳቢ የሚሻገር ግስ ነው። “ሸለሙ” የሚለው ድርጊት ወደ “የምስክር ወረቀት” ተሳቢ ስለሚሻገር ግሱ ተሻጋሪ ግስ ይባላል።"
  }
],
  "grade6-2018-english": [
  {
    id: "g6e2018-4",
    order: 4,
    question: "What is the main idea of paragraph 3?",
    options: [
      "The role of effective study strategies",
      "The roles of diagrams and charts in learning",
      "The role of using different suitable learning methods",
      "Maintaining a healthy life style is part of effective study skills"
    ],
    correctAnswer:
      "The role of using different suitable learning methods",
    explanation:
      "Paragraph 3 discusses tailoring learning methods to individual needs, experimenting with different techniques, and reviewing regularly."
  },

  {
    id: "g6e2018-5",
    order: 5,
    question:
      "As used in paragraph 1, line 3, the pronoun 'they' refers to",
    options: [
      "study habits",
      "academic pursuits",
      "students",
      "clear goals"
    ],
    correctAnswer: "students",
    explanation:
      "The sentence says, 'When students know what they need to learn... they can manage their time.' The pronoun 'they' refers to students."
  },

  {
    id: "g6e2018-6",
    order: 6,
    question:
      "What does the pronoun 'This' in paragraph 2, line 2, refer to?",
    options: [
      "Finding a quiet and comfortable study place",
      "Managing time more effectively",
      "Developing good study habits",
      "Using active learning techniques"
    ],
    correctAnswer:
      "Finding a quiet and comfortable study place",
    explanation:
      "The pronoun 'This' refers to finding a quiet and comfortable place to study."
  },

  {
    id: "g6e2018-7",
    order: 7,
    question:
      "In paragraph 3, line 3, what does the pronoun 'others' refer to?",
    options: [
      "Study skills",
      "Learning methods",
      "Students who prefer listening or reading books",
      "Students who may benefit from visual aids"
    ],
    correctAnswer:
      "Students who prefer listening or reading books",
    explanation:
      "The passage says, 'Some students may benefit from visual aids like diagrams or charts, while others may prefer listening to lectures or reading textbooks.' 'Others' refers to students who prefer listening or reading books."
  },

  {
    id: "g6e2018-8",
    order: 8,
    question:
      "As used in paragraph 2, line 2, the word 'retain' means",
    options: [
      "keep",
      "lose",
      "release",
      "forget"
    ],
    correctAnswer: "keep",
    explanation:
      "To retain information means to keep or hold onto it in your memory."
  },

  {
    id: "g6e2018-9",
    order: 9,
    question:
      "In paragraph 2, line 4, the word 'enhance' means",
    options: [
      "diminish",
      "improve",
      "reduce",
      "hinder"
    ],
    correctAnswer: "improve",
    explanation:
      "To enhance understanding means to improve or increase its quality."
  },

  {
    id: "g6e2018-10",
    order: 10,
    question:
      "As used in paragraph 3, line 6, what does the word 'reinforce' mean?",
    options: [
      "Strengthen",
      "Erode",
      "Weaken",
      "Undermine"
    ],
    correctAnswer: "Strengthen",
    explanation:
      "Reinforcing learning means to strengthen or support it so it is not forgotten."
  },

  {
    id: "g6e2018-11",
    order: 11,
    question:
      "Farmers cultivate 'teff' and coffee in the fertile soil during the rainy season. In this sentence, the meaning of the word 'cultivate' is",
    options: [
      "grow",
      "destroy",
      "cut",
      "abandon"
    ],
    correctAnswer: "grow",
    explanation:
      "To cultivate crops means to plant and grow them."
  },

  {
    id: "g6e2018-12",
    order: 12,
    question:
      "Lack of water for their animals is one of the big challenges for people who live in deserts. In this sentence, the meaning of the word 'challenges' is",
    options: [
      "supports",
      "advantages",
      "resources",
      "problems"
    ],
    correctAnswer: "problems",
    explanation:
      "Challenges in this context refer to difficulties or problems faced by people."
  },

  {
    id: "g6e2018-13",
    order: 13,
    question:
      "Schools are the best places for students to gain the knowledge they need for their future careers. Here, the meaning of the word 'gain' can be",
    options: [
      "get",
      "forget",
      "lose",
      "control"
    ],
    correctAnswer: "get",
    explanation:
      "To gain knowledge means to acquire or get it."
  },

  {
    id: "g6e2018-14",
    order: 14,
    question:
      "Success in learning demands hard work, motivation and commitment from students. The word 'demands' in this sentence means",
    options: [
      "accepts",
      "avoids",
      "offers",
      "requires"
    ],
    correctAnswer: "requires",
    explanation:
      "To demand something in this context means it requires or calls for that effort."
  },

  {
    id: "g6e2018-15",
    order: 15,
    question:
      "One of the characteristics of honest students is that they don't deny the mistake they have made. What is the meaning of the word 'deny' in this sentence?",
    options: [
      "Admit",
      "Confirm",
      "Reject",
      "Accept"
    ],
    correctAnswer: "Reject",
    explanation:
      "Deny means to refuse to admit or accept something as true."
  },

  {
    id: "g6e2018-16",
    order: 16,
    question: "It is proved that water ________ at 100°C.",
    options: [
      "boils",
      "is boiling",
      "boiled",
      "boil"
    ],
    correctAnswer: "boils",
    explanation:
      "Scientific facts and universal truths are expressed using the simple present tense."
  },

  {
    id: "g6e2018-17",
    order: 17,
    question:
      "Mother: Is your brother at home? / Daughter: ________",
    options: [
      "Yes, he is not.",
      "No, he is.",
      "Yes, he does.",
      "Yes, he is."
    ],
    correctAnswer: "Yes, he is.",
    explanation:
      "The question uses the auxiliary verb 'is' with the subject 'he', making 'Yes, he is.' the correct positive short answer."
  },

  {
    id: "g6e2018-18",
    order: 18,
    question:
      "Among all the books I have read so far, this one is ________",
    options: [
      "more interesting",
      "the most interesting",
      "interesting",
      "less interesting"
    ],
    correctAnswer: "the most interesting",
    explanation:
      "When comparing one item against a group of all books, the superlative form 'the most interesting' is required."
  },

  {
    id: "g6e2018-19",
    order: 19,
    question:
      "Hanna: _________________________ / Beletu: No. I am doing my homework.",
    options: [
      "Have you washed your clothes?",
      "Are you washing your clothes?",
      "Were you washing your clothes?",
      "Did you wash your clothes?"
    ],
    correctAnswer: "Are you washing your clothes?",
    explanation:
      "The response uses the present continuous tense, 'I am doing', which matches a present continuous question."
  },

  {
    id: "g6e2018-20",
    order: 20,
    question:
      "Teacher: ________ students are there in the classroom? / Student: There are ten students.",
    options: [
      "How much",
      "How often",
      "How far",
      "How many"
    ],
    correctAnswer: "How many",
    explanation:
      "Students are countable nouns, so 'How many' is used."
  },

  {
    id: "g6e2018-21",
    order: 21,
    question:
      "Alemitu is a clever student and I like ________ handwriting.",
    options: [
      "hers",
      "she",
      "her",
      "herself"
    ],
    correctAnswer: "her",
    explanation:
      "The possessive adjective 'her' is needed before the noun 'handwriting'."
  },

  {
    id: "g6e2018-22",
    order: 22,
    question:
      "Alemu: I feel sick. / Zenaw: You had better go to hospital and see a doctor. / Alemu: Ok. Thanks. ________",
    options: [
      "What should I do?",
      "Do you feel the same?",
      "When should I go?",
      "Why I should go?"
    ],
    correctAnswer: "What should I do?",
    explanation:
      "The question asks for advice about what action should be taken."
  },

  {
    id: "g6e2018-23",
    order: 23,
    question:
      "Teacher: ________ the class work? / Students: No, we haven't.",
    options: [
      "Do you finish",
      "Did you finish",
      "Have you finished",
      "Will you finish"
    ],
    correctAnswer: "Have you finished",
    explanation:
      "The short answer uses 'haven't', which indicates the present perfect tense."
  },

  {
    id: "g6e2018-24",
    order: 24,
    question:
      "Almaz: ________ you come home and help me tomorrow? I have a lot to do. / Hanna: Ok.",
    options: [
      "Do",
      "Will",
      "Did",
      "Are"
    ],
    correctAnswer: "Will",
    explanation:
      "Tomorrow indicates a future action, and 'Will' is used for polite requests."
  },

  {
    id: "g6e2018-25",
    order: 25,
    question:
      "The baby ________ loudly immediately after its mother leaves.",
    options: [
      "cry",
      "cries",
      "crys",
      "cryes"
    ],
    correctAnswer: "cries",
    explanation:
      "The baby is third-person singular, so the verb 'cry' changes to 'cries' in the simple present tense."
  },

  {
    id: "g6e2018-26",
    order: 26,
    question:
      "There is a little cloud in the sky, but it ________ rain in the afternoon.",
    options: [
      "should",
      "has to",
      "may",
      "must"
    ],
    correctAnswer: "may",
    explanation:
      "'May' expresses possibility rather than certainty."
  },

  {
    id: "g6e2018-27",
    order: 27,
    question:
      "My brother is good at language. He ________ speak three languages fluently.",
    options: [
      "should",
      "could",
      "may",
      "can"
    ],
    correctAnswer: "can",
    explanation:
      "'Can' expresses present ability or skill."
  },

  {
    id: "g6e2018-28",
    order: 28,
    question:
      "Yesterday, we ________ to school early.",
    options: [
      "go",
      "went",
      "gone",
      "goes"
    ],
    correctAnswer: "went",
    explanation:
      "The time marker 'Yesterday' requires the simple past form 'went'."
  },

  {
    id: "g6e2018-29",
    order: 29,
    question:
      "Active Voice: Many people speak English. / Passive Voice:",
    options: [
      "English is spoken by many people.",
      "English has been spoken by many people.",
      "English was spoken by many people.",
      "English is being spoken by many people."
    ],
    correctAnswer: "English is spoken by many people.",
    explanation:
      "The active sentence is in the simple present tense. Its passive form is 'English is spoken by many people.'"
  },

  {
    id: "g6e2018-30",
    order: 30,
    question:
      "Which of the following is conditional sentence Type 1?",
    options: [
      "If she studies hard, she will pass the exam.",
      "If she studied hard, she would pass the exam.",
      "If she studied hard, she passed the exam.",
      "If she had studied hard, she would have passed the exam."
    ],
    correctAnswer:
      "If she studies hard, she will pass the exam.",
    explanation:
      "Type 1 conditionals follow the structure: If + present simple, will + base verb."
  },

  {
    id: "g6e2018-31",
    order: 31,
    question:
      "Student 1: _________________________ / Student 2: It is very warm.",
    options: [
      "Do you like the weather of your village?",
      "Do you think it will rain today?",
      "How's the weather of your village?",
      "Is the weather suitable to grow rice?"
    ],
    correctAnswer: "How's the weather of your village?",
    explanation:
      "The response 'It is very warm' directly answers a question about the condition of the weather."
  },

  {
    id: "g6e2018-32",
    order: 32,
    question:
      "I ________ today's lesson very much. It is very entertaining.",
    options: [
      "dislike",
      "like",
      "hate",
      "don't prefer"
    ],
    correctAnswer: "like",
    explanation:
      "A lesson described as 'very entertaining' logically pairs with liking it."
  },

  {
    id: "g6e2018-33",
    order: 33,
    question:
      "Belay: _________________________ / Henok: I like bread with rice.",
    options: [
      "When did you eat your breakfast?",
      "Do you like to eat your breakfast?",
      "What do you like for your breakfast?",
      "How often do you eat your breakfast?"
    ],
    correctAnswer: "What do you like for your breakfast?",
    explanation:
      "Henok names specific foods, 'bread with rice', so the question asks what he likes for breakfast."
  },

  {
    id: "g6e2018-34",
    order: 34,
    question:
      "Father: Do you like your new shoes? / Son: Yes. They ________ comfortable and attractive.",
    options: [
      "are",
      "can",
      "will",
      "have"
    ],
    correctAnswer: "are",
    explanation:
      "The adjectives 'comfortable and attractive' are linked to the subject using the verb 'are'."
  },

  {
    id: "g6e2018-35",
    order: 35,
    question:
      "Person 1: _________________________ it is wrong to allow children to use mobile phones. / Person 2: You are right. It is not good for their health.",
    options: [
      "I don't agree",
      "I don't believe",
      "In my opinion",
      "I don't care"
    ],
    correctAnswer: "In my opinion",
    explanation:
      "'In my opinion' is used to introduce a personal view, which Person 2 agrees with."
  },

  {
    id: "g6e2018-36",
    order: 36,
    question:
      "Student 1: Thanks to the government, these days big cities are becoming more attractive and comfortable. / Student 2: ________ and the same thing should be done to small cities.",
    options: [
      "I don't agree with you",
      "I agree with you",
      "Good morning to you",
      "I'm fine thank you"
    ],
    correctAnswer: "I agree with you",
    explanation:
      "Student 2 supports the first student's positive statement, so 'I agree with you' is correct."
  },

  {
    id: "g6e2018-37",
    order: 37,
    question:
      "Which sentence is correctly punctuated?",
    options: [
      "Do you know the answer of this question,",
      "All of you stand up,",
      "Our teacher is absent today;",
      "They love their country so much."
    ],
    correctAnswer: "They love their country so much.",
    explanation:
      "Option D is a complete sentence and ends correctly with a full stop."
  },

  {
    id: "g6e2018-38",
    order: 38,
    question:
      "Which one is the correct order of the above words to make a meaningful and grammatically correct negative statement?",
    options: [
      "Banana doesn't like my brother.",
      "My brother not does like banana.",
      "Banana my brother doesn't like.",
      "My brother doesn't like banana."
    ],
    correctAnswer: "My brother doesn't like banana.",
    explanation:
      "The sentence follows the correct Subject + Auxiliary + Negative + Main Verb + Object structure."
  },

  {
    id: "g6e2018-39",
    order: 39,
    question:
      "All the windows and the door are closed, ________ our classroom is very hot.",
    options: [
      "but",
      "so",
      "and",
      "for"
    ],
    correctAnswer: "so",
    explanation:
      "'So' expresses the cause-and-effect relationship between the closed windows and door and the classroom being hot."
  },

  {
    id: "g6e2018-40",
    order: 40,
    question:
      "My uncle is a very rich man, ________ he is not happy.",
    options: [
      "so",
      "and",
      "for",
      "yet"
    ],
    correctAnswer: "yet",
    explanation:
      "'Yet' connects two contrasting ideas: being rich and not being happy."
  }
],
  "grade6-2016-environmental-science": [
  {
    id: "g6es2016-4",
    order: 4,
    question:
      "ከሚከተሉት የምስራቅ አፍሪካ ሃገራት ውስጥ በእንጻራዊነት ወደ ምስራቅ አፍሪካ ጫፍ የሆነው የትኛው ነው?",
    options: [
      "ደቡብ ሱዳን",
      "ሶማሊያ",
      "ሞዛምቢክ",
      "ዚምባብዌ",
    ],
    correctAnswer: "ሶማሊያ",
    explanation:
      "ሶማሊያ በአፍሪካ ቀንድ ላይ በመገኘቷ በአንጻራዊነት የምስራቅ አፍሪካ ጫፍ ላይ ትገኛለች።",
  },

  {
    id: "g6es2016-5",
    order: 5,
    question:
      "በአፍሪካ ካርታ ላይ ምስራቅ አፍሪካን በሰሜን በኩል የሚጎራበተው ሐገር የትኛው ነው?",
    options: [
      "ናይጄሪያ",
      "አንጎላ",
      "ሱዳን",
      "ደቡብ አፍሪካ",
    ],
    correctAnswer: "ሱዳን",
    explanation:
      "ሱዳን ምስራቅ አፍሪካን በሰሜን በኩል የሚጎራበት ሀገር ነው።",
  },

  {
    id: "g6es2016-6",
    order: 6,
    question:
      "ጋሽ አበበ ልባቸውን ተመርምረው በኦክስጂን ያልበለፀገ ደም የሚይዙ የልብ ዋና ዋና ክፍሎች ተጎድቷል ቢባሉና አንተ ሃኪም ብትሆን ምን ታደርጋልህ?",
    options: [
      "ቀኝ ተቀባይ እና ቀኝ አቀባይ ልበ ገንዳዎችን አክማለሁ",
      "በቀኝና በግራ በኩል የሚገኙ ተቀባይ ልበ ገንዳዎችን አክማለሁ",
      "ግራ ተቀባይ እና ግራ አቀባይ ልበ ገንዳዎችን አክማለሁ",
      "ቀኝ አቀባይ እና ግራ አቀባይ ልበ ገንዳዎችን እክማለሁ",
    ],
    correctAnswer:
      "ቀኝ ተቀባይ እና ቀኝ አቀባይ ልበ ገንዳዎችን አክማለሁ",
    explanation:
      "በኦክስጂን ያልበለፀገ ደም የሚገኘው በቀኝ ተቀባይ እና በቀኝ አቀባይ ልበ ገንዳዎች ውስጥ ነው። ይህ ደም ወደ ሳንባ ይላካል።",
  },

  {
    id: "g6es2016-7",
    order: 7,
    question:
      "ቀይ የደም ህዋስ ኦክስጂንን መሸከም የሚችለው ለምንድን ነው?",
    options: [
      "ቀይ ቀለም ስላለው",
      "የዶናት ቅርጽ ስላለው",
      "ሄሞግሎቢን ስለያዘ",
      "በአጥንት መቅኔ ስለሚመረት",
    ],
    correctAnswer: "ሄሞግሎቢን ስለያዘ",
    explanation:
      "ቀይ የደም ህዋስ ሄሞግሎቢን ስለያዘ ከሳንባ የሚመጣውን ኦክስጂን በመያዝ ወደ ሰውነት ክፍሎች ያጓጉዛል።",
  },

  {
    id: "g6es2016-8",
    order: 8,
    question:
      "በጉርምስና ወቅት በሁለቱም ፆታዎች በተለያየ መልኩ የሚከሰት የስነ-ህይወታዊ ለውጥ የትኛው ነው?",
    options: [
      "የድምጽ ለውጥ",
      "የቁመት መጨመር",
      "የክብደት መጨመር",
      "የሰውነት እድገት",
    ],
    correctAnswer: "የድምጽ ለውጥ",
    explanation:
      "በጉርምስና ወቅት የወንዶች ድምጽ ይጠራል እና ይደበዝዛል፤ የሴቶች ድምጽ ደግሞ ይበልጥ ቀጭን ይሆናል።",
  },

  {
    id: "g6es2016-9",
    order: 9,
    question:
      "ድብልቅና ክፍሎቹ ተመሳሳይ ባህሪያት የሚያሳዩት ለምንድን ነው?",
    options: [
      "ኬሚካላዊ ጥምረት ስለሆነ",
      "ጥምረቱ አካላዊ ስለሆነ",
      "አዲስ ንጥረ ነገር ስለሚፈጠር",
      "ክፍሎቹ ስለሚጠፉ",
    ],
    correctAnswer: "ጥምረቱ አካላዊ ስለሆነ",
    explanation:
      "ድብልቅ የሚፈጠረው ንጥረ ነገሮች በአካላዊ ሁኔታ ሲዋሃዱ ስለሆነ እያንዳንዱ ክፍል የራሱን ባህሪ ይጠብቃል።",
  },

  {
    id: "g6es2016-10",
    order: 10,
    question: "ከሚከተሉት ውስጥ የተለያዩ ክፍሎች ያሉት ድብልቅ የትኛው ነው?",
    options: [
      "ውሃ እና ጨው",
      "ውሃ እና ስኳር",
      "አየር",
      "አሸዋ እና በቆሎ",
    ],
    correctAnswer: "አሸዋ እና በቆሎ",
    explanation:
      "አሸዋ እና በቆሎ በድብልቁ ውስጥ በግልጽ የሚለያዩ ክፍሎች ስላሏቸው ልዩ ድብልቅ ናቸው።",
  },

  {
    id: "g6es2016-11",
    order: 11,
    question:
      "ከስኳር፣ አሸዋ እና ውሃ የተዋቀረ ድብልቅ ውስጥ ስኳሩን ለይቶ ለማግኘት የሚከተለው ሂደት የትኛው ነው?",
    options: [
      "ማሟሟት → ማጣራት → ማትነን",
      "ማጣራት → ማሟሟት → ማትነን",
      "ማትነን → ማጣራት → ማሟሟት",
      "ማሟሟት → ማትነን → ማጣራት",
    ],
    correctAnswer: "ማሟሟት → ማጣራት → ማትነን",
    explanation:
      "መጀመሪያ ስኳሩን በውሃ እናሟሟለን። ከዚያ አሸዋውን በማጣራት እንለያለን። በመጨረሻም ውሃውን በማትነን ስኳሩን እናገኛለን።",
  },

  {
    id: "g6es2016-12",
    order: 12,
    question: "ከሚከተሉት ውስጥ ታዳሽ የኃይል ምንጭ የትኛው ነው?",
    options: [
      "ከሰል",
      "ነዳጅ",
      "የተፈጥሮ ጋዝ",
      "ንፋስ",
    ],
    correctAnswer: "ንፋስ",
    explanation:
      "ንፋስ በተፈጥሮ በቀጣይነት ስለሚገኝ ታዳሽ የኃይል ምንጭ ነው።",
  },

  {
    id: "g6es2016-13",
    order: 13,
    question:
      "በምስራቅ አፍሪካ የወቅታዊ አማካይ የሙቀት መጠን እስከ 6°C ዝቅ የሚልባቸው ቦታዎች የትኞቹ ናቸው?",
    options: [
      "ዝቅተኛ ቦታዎች",
      "ከፍተኛ ቦታዎች",
      "በረሃማ ቦታዎች",
      "የባህር ዳርቻዎች",
    ],
    correctAnswer: "ከፍተኛ ቦታዎች",
    explanation:
      "ከፍታ በጨመረ ቁጥር የሙቀት መጠን ይቀንሳል። ስለዚህ ከፍተኛ ቦታዎች ዝቅተኛ የሙቀት መጠን ይኖራቸዋል።",
  },

  {
    id: "g6es2016-14",
    order: 14,
    question:
      "ሰሜናዊ ምስራቅ አፍሪካን ጨምሮ ኢትዮጵያ ከሰኔ እስከ መስከረም የሚያገኘው ዝናብ ምን ያመለክታል?",
    options: [
      "በዚህ ወቅት ሙሉ በሙሉ ድርቅ እንደሚኖር",
      "የዝናብ ወቅት እንደሌለ",
      "ከሰኔ እስከ መስከረም በዝናብ የሚታረስ እርሻ ማምረት እንደሚቻል",
      "የእርሻ ምርት እንደማይኖር",
    ],
    correctAnswer:
      "ከሰኔ እስከ መስከረም በዝናብ የሚታረስ እርሻ ማምረት እንደሚቻል",
    explanation:
      "ከሰኔ እስከ መስከረም የሚገኘው ዝናብ በኢትዮጵያ በዝናብ የሚታመን እርሻ ለማምረት ያስችላል።",
  },

  {
    id: "g6es2016-15",
    order: 15,
    question:
      "በምስራቅ አፍሪካ ያለውን የሳቫና ሞቃታማ የአየር ንብረት ከበረሃማ የአየር ንብረት የሚለየው ምንድን ነው?",
    options: [
      "በረሃው በሳር የተሸፈነ መሆኑ",
      "ሳቫናው በአብዛኛው በሳር የተሸፈነ መሆኑ",
      "ሁለቱም በረሃ መሆናቸው",
      "ሁለቱም በዝናብ ብዙ መሆናቸው",
    ],
    correctAnswer: "ሳቫናው በአብዛኛው በሳር የተሸፈነ መሆኑ",
    explanation:
      "የሳቫና አካባቢዎች በአብዛኛው በሳር የተሸፈኑ ሲሆኑ የበረሃ አካባቢዎች ደግሞ በጣም ደረቅ ናቸው።",
  },

  {
    id: "g6es2016-16",
    order: 16,
    question:
      "እንደ ውሃ፣ አፈር፣ ማዕድናትና የዱር እንስሳት ያሉ የተፈጥሮ ሀብቶች በምስራቅ አፍሪካ በብዛት የሚገኙት ለምንድን ነው?",
    options: [
      "በረሃዎች ብቻ ስላሉ",
      "የባህር ዳርቻ ብቻ ስላለ",
      "ሁሉም አካባቢዎች ተመሳሳይ ስለሆኑ",
      "የተለያዩ ተራራዎች፣ አምባዎችና ቆላማ መሬቶች ስላሉ",
    ],
    correctAnswer:
      "የተለያዩ ተራራዎች፣ አምባዎችና ቆላማ መሬቶች ስላሉ",
    explanation:
      "በምስራቅ አፍሪካ የሚገኙት የተለያዩ የመሬት አቀማመጦች ለተለያዩ የተፈጥሮ ሀብቶች መኖር ምቹ ሁኔታ ይፈጥራሉ።",
  },

  {
    id: "g6es2016-17",
    order: 17,
    question:
      "ከሚከተሉት የምስራቅ አፍሪካ ሀገራት ውስጥ ወርቅ የማይገኝበት የትኛው ነው?",
    options: [
      "ኢትዮጵያ",
      "ታንዛኒያ",
      "ዩጋንዳ",
      "ሩዋንዳ",
    ],
    correctAnswer: "ሩዋንዳ",
    explanation:
      "በተሰጠው የፈተና ምንጭ መሠረት መልሱ ሩዋንዳ ነው።",
  },

  {
    id: "g6es2016-18",
    order: 18,
    question:
      "ከሚከተሉት ውስጥ የማዕድናት የኢኮኖሚ ጥቅም ያልሆነው የትኛው ነው?",
    options: [
      "የጤና አገልግሎት",
      "የስራ ዕድል መፍጠር",
      "የውጭ ምንዛሪ ማስገኘት",
      "የኢኮኖሚ እድገትን ማገዝ",
    ],
    correctAnswer: "የጤና አገልግሎት",
    explanation:
      "የጤና አገልግሎት በቀጥታ የማዕድናት የኢኮኖሚ ጥቅም አይደለም።",
  },

  {
    id: "g6es2016-19",
    order: 19,
    question:
      "ከሚከተሉት ውስጥ የተፈጥሮ ሀብትን የመጠበቂያ ዘዴ ያልሆነው የትኛው ነው?",
    options: [
      "ዛፎችን መትከል",
      "የተፈጥሮ ሀብቶችን በአግባቡ መጠቀም",
      "ሀብቶችን በዘፈቀደ መጠቀም",
      "የተፈጥሮ ሀብትን መጠበቅ",
    ],
    correctAnswer: "ሀብቶችን በዘፈቀደ መጠቀም",
    explanation:
      "የተፈጥሮ ሀብቶችን በዘፈቀደ መጠቀም ሀብቶችን ስለሚያሳንስ የጥበቃ ዘዴ አይደለም።",
  },

  {
    id: "g6es2016-20",
    order: 20,
    question:
      "ዝቅተኛ የዝናብ መጠን ባላቸው አካባቢዎች የሚገኙት የተክል ምድብ የትኛው ነው?",
    options: [
      "የደን ተክሎች",
      "የሳቫና ተክሎች",
      "የውሃ ተክሎች",
      "የሞቃታማ በረሃ ተክሎች",
    ],
    correctAnswer: "የሞቃታማ በረሃ ተክሎች",
    explanation:
      "ዝቅተኛ የዝናብ መጠን ባላቸው በረሃማ አካባቢዎች የበረሃ ተክሎች ይገኛሉ።",
  },

  {
    id: "g6es2016-21",
    order: 21,
    question:
      "ከሚከተሉት የማዕድንና የሀገር ግንኙነቶች ውስጥ የተሳሳተው የትኛው ነው?",
    options: [
      "ወርቅ – ኢትዮጵያ",
      "መዳብ – ኬንያ",
      "አልማዝ – ታንዛኒያ",
      "ወርቅ – ዩጋንዳ",
    ],
    correctAnswer: "መዳብ – ኬንያ",
    explanation:
      "በተሰጠው የፈተና ምንጭ መሠረት የተሳሳተው ግንኙነት መዳብ – ኬንያ ነው።",
  },

  {
    id: "g6es2016-22",
    order: 22,
    question:
      "እንደ Xer(o)sol፣ Lithosol፣ Yermosol እና Solonchak ያሉ የአፈር ዓይነቶች በሶማሊያና በኤርትራ በብዛት የሚገኙት ለምንድን ነው?",
    options: [
      "በጣም ብዙ ዝናብ ስለሚያገኙ",
      "ከፍተኛ ተራራዎች ብቻ ስላሏቸው",
      "በጣም የለማ መሬት ስላላቸው",
      "አካባቢዎቹ በአብዛኛው ዝቅተኛና በረሃማ ስለሆኑ",
    ],
    correctAnswer:
      "አካባቢዎቹ በአብዛኛው ዝቅተኛና በረሃማ ስለሆኑ",
    explanation:
      "ሶማሊያና ኤርትራ በአብዛኛው ዝቅተኛና ደረቃማ አካባቢዎች ስላሏቸው እነዚህ የአፈር ዓይነቶች በብዛት ይገኛሉ።",
  },

  {
    id: "g6es2016-23",
    order: 23,
    question:
      "በምስራቅ አፍሪካ ለማገዶ እንጨት ሲባል የሚከሰተውን የደን መጨፍጨፍ እንዴት መከላከል ይቻላል?",
    options: [
      "ብዙ ዛፎችን በመቁረጥ",
      "ለማብሰያ ታዳሽ የኃይል ምንጮችን በመጠቀም",
      "ብዙ እንጨት በመጠቀም",
      "የደን መሬትን ወደ እርሻ በመቀየር",
    ],
    correctAnswer:
      "ለማብሰያ ታዳሽ የኃይል ምንጮችን በመጠቀም",
    explanation:
      "ለማብሰያ ታዳሽ የኃይል ምንጮችን መጠቀም በማገዶ ላይ ያለውን ጥገኝነት በመቀነስ የደን መጨፍጨፍን ሊቀንስ ይችላል።",
  },

  {
    id: "g6es2016-24",
    order: 24,
    question:
      "ከሚከተሉት የምስራቅ አፍሪካ ሀገራት ውስጥ በደቡባዊ ንፍቀ ክበብ የሚገኘው የትኛው ነው?",
    options: [
      "ደቡብ ሱዳን",
      "ደቡብ አፍሪካ",
      "ዩጋንዳ",
      "ኢትዮጵያ",
    ],
    correctAnswer: "ደቡብ አፍሪካ",
    explanation:
      "ይህ የፈተናው የተሰጠው መልስ ነው። ማስታወሻ፦ ደቡብ አፍሪካ በአጠቃላይ የደቡብ አፍሪካ ቀጠና አካል እንጂ የምስራቅ አፍሪካ ሀገር ተብላ አትመደብም።",
  },

  {
    id: "g6es2016-25",
    order: 25,
    question:
      "ከምስራቅ አፍሪካ ሀገራት ውስጥ በህዝብ ብዛት ትንንሽ የሆኑት የትኞቹ ናቸው?",
    options: [
      "ሲሼልስ፣ ኮሞሮስ እና ሬዩኒየን",
      "ኢትዮጵያ፣ ኬንያ እና ታንዛኒያ",
      "ሱዳን፣ ኢትዮጵያ እና ሶማሊያ",
      "ዩጋንዳ፣ ሩዋንዳ እና ቡሩንዲ",
    ],
    correctAnswer: "ሲሼልስ፣ ኮሞሮስ እና ሬዩኒየን",
    explanation:
      "ሲሼልስ፣ ኮሞሮስ እና ሬዩኒየን በህዝብ ብዛት ከትንንሾቹ የምስራቅ አፍሪካ አካባቢዎች መካከል ናቸው።",
  },

  {
    id: "g6es2016-26",
    order: 26,
    question:
      "ከኑቢያ እና አክሱም ስልጣኔዎች ጋር በተያያዘ እውነት የሆነው የትኛው ነው?",
    options: [
      "የኑቢያ ስልጣኔ ከአክሱም በኋላ ተነሳ",
      "አክሱም የኑቢያን ስልጣኔ አልነካም",
      "የአክሱም መነሳት ለኑቢያ ስልጣኔ መውደቅ አንዱ ምክንያት ነበር",
      "ኑቢያ የአክሱምን ስልጣኔ አጠፋች",
    ],
    correctAnswer:
      "የአክሱም መነሳት ለኑቢያ ስልጣኔ መውደቅ አንዱ ምክንያት ነበር",
    explanation:
      "የአክሱም ስልጣኔ መነሳት ለኑቢያ ስልጣኔ መውደቅ ካስከተሉ ምክንያቶች አንዱ ነበር።",
  },

  {
    id: "g6es2016-27",
    order: 27,
    question: "በምስራቅ አፍሪካ ትልቁ ፏፏቴ የትኛው ነው?",
    options: [
      "ቱጌላ ፏፏቴ",
      "ቪክቶሪያ ፏፏቴ",
      "ብሉ ናይል ፏፏቴ",
      "ታዴሴ ፏፏቴ",
    ],
    correctAnswer: "ቪክቶሪያ ፏፏቴ",
    explanation:
      "ቪክቶሪያ ፏፏቴ በዛምቤዚ ወንዝ ላይ የሚገኝ ታዋቂ ትልቅ ፏፏቴ ነው።",
  },

  {
    id: "g6es2016-28",
    order: 28,
    question: "የቱሪዝም ኢኮኖሚያዊ ጠቀሜታ የትኛው ነው?",
    options: [
      "የሀገርን ገቢ መቀነስ",
      "የስራ ዕድልን መቀነስ",
      "የተፈጥሮ ሀብትን ማጥፋት",
      "ለሀገር የገቢ ምንጭ መሆን",
    ],
    correctAnswer: "ለሀገር የገቢ ምንጭ መሆን",
    explanation:
      "ቱሪዝም ለሀገር የውጭ ምንዛሪና የገቢ ምንጭ በመሆን ለኢኮኖሚው ጠቀሜታ ይኖረዋል።",
  },

  {
    id: "g6es2016-29",
    order: 29,
    question:
      "ከሚከተሉት ውስጥ በምስራቅ አፍሪካ ዋና የኢንዱስትሪ እንቅስቃሴ ያልሆነው የትኛው ነው?",
    options: [
      "የምግብ ማቀነባበር",
      "የጨርቃጨርቅ ማምረት",
      "የመኪና ማምረት",
      "የቆዳ ማቀነባበር",
    ],
    correctAnswer: "የመኪና ማምረት",
    explanation:
      "የመኪና ማምረት በምስራቅ አፍሪካ ከዋና ዋና የኢንዱስትሪ ስራዎች መካከል አይደለም።",
  },

  {
    id: "g6es2016-30",
    order: 30,
    question:
      "በምስራቅ አፍሪካ የክልላዊ የንግድ ልውውጥ ከምዕራባውያን ሀገራት ጋር ካለው ንግድ ያነሰ የሆነው ለምንድን ነው?",
    options: [
      "አብዛኛዎቹ ምርቶች የግብርና ምርቶች ስለሆኑ",
      "ምስራቅ አፍሪካ ምንም ምርት ስለማታመርት",
      "የሰላም እጦት ስላለ",
      "ሀ እና ሐ",
    ],
    correctAnswer: "ሀ እና ሐ",
    explanation:
      "በክልሉ ያሉ አብዛኛዎቹ ሀገራት ተመሳሳይ የግብርና ምርቶችን የሚያመርቱ መሆናቸውና የሰላም እጦት መኖሩ የክልላዊ ንግድን ያዳክማል።",
  },

  {
    id: "g6es2016-31",
    order: 31,
    question:
      "ከሚከተሉት ውስጥ በምስራቅ አፍሪካ ዋና የኢኮኖሚ እንቅስቃሴ ያልሆነው የትኛው ነው?",
    options: [
      "ግብርና",
      "የኢንተርኔት ቴክኖሎጂ",
      "ንግድ",
      "ቱሪዝም",
    ],
    correctAnswer: "የኢንተርኔት ቴክኖሎጂ",
    explanation:
      "የኢንተርኔት ቴክኖሎጂ በምስራቅ አፍሪካ ከዋና ዋና የኢኮኖሚ እንቅስቃሴዎች መካከል አይደለም።",
  },

  {
    id: "g6es2016-32",
    order: 32,
    question: "ኤች.አይ.ቪ/ኤድስን የሚያስከትለው ማይክሮ ኦርጋኒዝም የትኛው ነው?",
    options: [
      "ባክቴሪያ",
      "ፈንገስ",
      "ቫይረስ",
      "ፕሮቶዞዋ",
    ],
    correctAnswer: "ቫይረስ",
    explanation:
      "ኤች.አይ.ቪ (HIV) ቫይረስ ሲሆን የኤድስን ሕመም ያስከትላል።",
  },

  {
    id: "g6es2016-33",
    order: 33,
    question:
      "እራሳችንን ከኤች.አይ.ቪ/ኤድስ ለመጠበቅ ከሚከተሉት ውስጥ የትኛውን መከተል አለብን?",
    options: [
      "ከአደገኛ ወይም ጥንቃቄ ከሌለው የግብረ-ሥጋ ግንኙነት መታቀብ",
      "የግል እቃዎችን ማጋራት",
      "የህክምና መርፌን መጋራት",
      "ያለጥንቃቄ የግብረ-ሥጋ ግንኙነት ማድረግ",
    ],
    correctAnswer:
      "ከአደገኛ ወይም ጥንቃቄ ከሌለው የግብረ-ሥጋ ግንኙነት መታቀብ",
    explanation:
      "ከአደገኛ የግብረ-ሥጋ ግንኙነት መታቀብ ከHIV ለመከላከል ከሚረዱ ዋና ዋና ዘዴዎች አንዱ ነው።",
  },

  {
    id: "g6es2016-34",
    order: 34,
    question:
      "ቅጠሉና ቅርንጫፎቹ የሚታኘኩት የትኛው የግብርና ምርት ነው?",
    options: [
      "ቡና",
      "ሻይ",
      "ጫት",
      "ስንዴ",
    ],
    correctAnswer: "ጫት",
    explanation:
      "የጫት ቅጠሎችና ለስላሳ ቅርንጫፎች በመታኘክ ይጠቀማሉ።",
  },

  {
    id: "g6es2016-35",
    order: 35,
    question:
      "ጎጂ ባህላዊ ልማዶችን ለማስወገድ ምን ማድረግ ይገባል?",
    options: [
      "ልማዶቹን ማበረታታት",
      "ህብረተሰቡን ስለ ጉዳታቸው ማስተማር",
      "ልማዶቹን መደበቅ",
      "ህብረተሰቡን ከመረጃ ማራቅ",
    ],
    correctAnswer: "ህብረተሰቡን ስለ ጉዳታቸው ማስተማር",
    explanation:
      "ህብረተሰቡን ስለ ጎጂ ባህላዊ ልማዶች ጉዳት ማስተማር እነዚህን ልማዶች ለማስወገድ ይረዳል።",
  },

  {
    id: "g6es2016-36",
    order: 36,
    question:
      "በምስራቅ አፍሪካ በሚሊዮኖች የሚቆጠሩ ሰዎች ለረሃብ የሚጋለጡት ለምንድን ነው?",
    options: [
      "በክልሉ የሚከሰተው ያልተለመደ የዝናብ እጥረት",
      "ከመጠን በላይ ዝናብ ስለሚኖር",
      "በጣም ብዙ የእርሻ ምርት ስለሚኖር",
      "የሙቀት መጠን ስለሚቀንስ",
    ],
    correctAnswer: "በክልሉ የሚከሰተው ያልተለመደ የዝናብ እጥረት",
    explanation:
      "ያልተለመደ የዝናብ እጥረት ድርቅን ያስከትላል፤ ይህም የእርሻ ምርትን በመቀነስ ለረሃብ ሊያጋልጥ ይችላል።",
  },

  {
    id: "g6es2016-37",
    order: 37,
    question:
      "ከኢትዮጵያ፣ ሞዛምቢክ፣ ዛምቢያ እና ታንዛኒያ ውስጥ ለድርቅ የበለጠ ተጋላጭ የሆነችው ሀገር የትኛዋ ናት?",
    options: [
      "ኢትዮጵያ",
      "ሞዛምቢክ",
      "ዛምቢያ",
      "ታንዛኒያ",
    ],
    correctAnswer: "ኢትዮጵያ",
    explanation:
      "በተሰጠው የፈተና ምንጭ መሠረት መልሱ ኢትዮጵያ ነው።",
  },

  {
    id: "g6es2016-38",
    order: 38,
    question:
      "ከሚከተሉት ውስጥ ድርቅን ለመቋቋም የሚደረግ ባህላዊ ዘዴ ያልሆነው የትኛው ነው?",
    options: [
      "የተለያዩ የእርሻ ምርቶችን ማምረት",
      "ወደ ሌላ አካባቢ መሰደድ",
      "የእርሻ ዘዴን መቀየር",
      "ብዙ ልጆች መውለድ",
    ],
    correctAnswer: "ብዙ ልጆች መውለድ",
    explanation:
      "ብዙ ልጆች መውለድ ድርቅን ለመቋቋም የሚያገለግል የባህላዊ ዘዴ አይደለም።",
  },

  {
    id: "g6es2016-39",
    order: 39,
    question:
      "ከድርቅና ረሃብ ጋር በተያያዘ ትክክለኛው ጽንሰ-ሀሳብ የትኛው ነው?",
    options: [
      "ረሃብ ድርቅን ያስከትላል",
      "ድርቅና ረሃብ ምንም ግንኙነት የላቸውም",
      "ድርቅ የረሃብ መንስኤ ነው",
      "ረሃብ የዝናብ መጠንን ያሳድጋል",
    ],
    correctAnswer: "ድርቅ የረሃብ መንስኤ ነው",
    explanation:
      "ድርቅ የውሃ እጥረትንና የእርሻ ምርት መቀነስን በማስከተል ለረሃብ ሊዳርግ ይችላል።",
  },

  {
    id: "g6es2016-40",
    order: 40,
    question:
      "ከሚከተሉት ባህላዊ ተግባራት ውስጥ ለኤች.አይ.ቪ/ኤድስ በቀጥታ የማያጋልጠው የትኛው ነው?",
    options: [
      "አቻ ጋብቻ በመፍቀድ",
      "ግግ ማስነቀል",
      "የሴት ልጅ ጠለፋ",
      "የሴት ልጅ ግርዛት",
    ],
    correctAnswer: "አቻ ጋብቻ በመፍቀድ",
    explanation:
      "በተሰጠው የፈተና ምንጭ መሠረት መልሱ አቻ ጋብቻ በመፍቀድ ነው። እንደ ሹል መሳሪያዎች መጠቀም ያሉ ተግባራት ደም ንክኪን ሊያስከትሉ ስለሚችሉ የHIV ስርጭትን ሊጨምሩ ይችላሉ።",
  },
],
  "grade6-2016-civics": [
  {
    id: "g6c2016-4",
    order: 4,
    question:
      "ከሚከተሉት የግብረ ገብ ምሉዕነት ጠቀሜታ የሆነው የትኛው ነው?",
    options: [
      "በራሳቸው የሚተማመኑ ጠንካራ የስራ ባህል ያለው ማህበረሰብ ይፈጥራል",
      "በቀላሉ የገቡትን ቃል የሚያፈርሱ ግለሰቦች መበራከት",
      "ችግሮችን በብቃት የመፍታት አቅምን ያሳጣል",
      "መጥፎ ተግባራትን የሚያጋልጡ ግለሰቦች ማነስ"
    ],
    correctAnswer:
      "በራሳቸው የሚተማመኑ ጠንካራ የስራ ባህል ያለው ማህበረሰብ ይፈጥራል",
    explanation:
      "ግብረ ገብነትና ምሉዕነት በሰዎች መካከል እምነት እንዲኖር ያደርጋል። ይህም ጠንካራ የስራ ባህልና በራስ መተማመን ያለው ማህበረሰብ እንዲገነባ ይረዳል።"
  },
  {
    id: "g6c2016-5",
    order: 5,
    question:
      "ከሚከተሉት ውስጥ እውነተኛ ግብረገብነት የተላበሰ ሰው ባህሪ ያልሆነው የትኛው ነው?",
    options: [
      "ግብዝነት",
      "እውነተኛነት",
      "ብርታት",
      "ትህትና"
    ],
    correctAnswer: "ግብዝነት",
    explanation:
      "ግብዝነት ማለት ከውስጥ ሳይሆኑ በውጭ ሌላ ሆኖ መታየት በመሆኑ የመልካም ስነ-ምግባር ተቃራኒ ነው። እውነተኛነት፤ ብርታትና ትህትና ግን የመልካም ስነ-ምግባር መገለጫዎች ናቸው።"
  },
  {
    id: "g6c2016-6",
    order: 6,
    question:
      "ከሚከተሉት አንዱ ማጭበርበርና ስርቆትን በሚፈጽሙ ሰዎች ላይ የሚደርስ ጉዳት ነው?",
    options: [
      "ጠንካራ በራስ የመተማመን ችሎታን ያዳብራሉ",
      "መጥፎ ድርጊትን በድፍረት መቃወም ይችላሉ",
      "በዙሪያቸው ያሉ ሰዎችን እምነት አያገኙም",
      "እውነተኛ ወዳጅነትን ለመመስረት ይችላሉ"
    ],
    correctAnswer:
      "በዙሪያቸው ያሉ ሰዎችን እምነት አያገኙም",
    explanation:
      "አጭበርባሪና ሌባ ሰዎች በማህበረሰቡ ዘንድ አይታመኑም። እምነት ማጣት ደግሞ ማህበራዊ ግንኙነታቸውንና ክብራቸውን ይጎዳል።"
  },
  {
    id: "g6c2016-7",
    order: 7,
    question:
      "የህጎችን ምንነት በተመለከተ እውነት የሆነው የትኛው ነው?",
    options: [
      "ከዜጎች ጋር ጥብቅ ቁርኝት የላቸውም",
      "ጥቂት ዜጎች ሊከተሏቸው የሚገቡ የስነምግባር ደንቦች ናቸው",
      "በፍጥነት ተለዋዋጭና ወጥነት የላላቸው መመሪያዎች ናቸው",
      "የዜጎችን መብትና ግዴታ የሚያሳውቁ መመሪያዎች ናቸው"
    ],
    correctAnswer:
      "የዜጎችን መብትና ግዴታ የሚያሳውቁ መመሪያዎች ናቸው",
    explanation:
      "ህግ ማለት አንድ ዜጋ ሊኖረው የሚገባውን መብትና ሊወጣው የሚገባውን ግዴታ የሚወስን መመሪያ ነው። ህግ የሰዎችን ግንኙነት በስርዓት ለመምራት ይረዳል።"
  },
  {
    id: "g6c2016-8",
    order: 8,
    question:
      "ለህግ ተገዢ የሆኑ ዜጎች የቋንቋ፣ ሃይማኖትና የባህል ግጭቶችን በ--- ይፈታሉ።",
    options: [
      "በጦርነት",
      "በአድርባይነት",
      "በሰላም",
      "በቸልታ"
    ],
    correctAnswer: "በሰላም",
    explanation:
      "ለህግ የሚገዛ ዜጋ በማንኛውም ልዩነት ምክንያት የሚፈጠሩ ግጭቶችን በሰላማዊ ውይይትና በህጋዊ መንገድ ይፈታል። ኃይልን ወይም ጦርነትን መጠቀም ህገ-ወጥነት ነው።"
  },
  {
    id: "g6c2016-9",
    order: 9,
    question: "የህግ ተገዢነት ጠቀሜታ የሆነው የትኛው ነው?",
    options: [
      "ሙሉ ነጻነትና እኩልነት ማግኘት",
      "የሚፈልጉትን ሃይማኖት መከተል አለመቻል",
      "በፓለቲካ ለመሳተፍ ፈቃድ ማጣት",
      "የራስን የንግድ ስራ ለመስራት መከልከል"
    ],
    correctAnswer: "ሙሉ ነጻነትና እኩልነት ማግኘት",
    explanation:
      "ህግ ሲከበር የዜጎች መብት ይጠበቃል። ይህም ሙሉ ነጻነትና እኩልነት እንዲሰፍን ያደርጋል። ህግ ባለበት ቦታ ሁሉም ሰው በእኩልነት ይስተናገዳል።"
  },
  {
    id: "g6c2016-10",
    order: 10,
    question:
      "ከሚከተሉት ውስጥ ለህግ ተገዢ የሆኑ ሰዎች ባህሪ የሆነው የትኛው ነው?",
    options: [
      "መብትና ግዴታን ጠንቅቆ አለማወቅ",
      "ህግን ከማወቅና ከማክበር መቆጠብ",
      "ህግን እንደፈለጉ መጣስ",
      "ህግ ሲጣስ ለሚመለከተው ማሳወቅ"
    ],
    correctAnswer: "ህግ ሲጣስ ለሚመለከተው ማሳወቅ",
    explanation:
      "ለህግ ተገዢ የሆነ ሰው ህግ ሲጣስ ሲመለከት ለሚመለከተው አካል (ለምሳሌ ለፖሊስ) የመጠቆም ኃላፊነት አለበት። ይህም ህጋዊነትን ለማስፈን የሚደረግ ጥረት ነው።"
  },
  {
    id: "g6c2016-11",
    order: 11,
    question:
      "ከሚከተሉት ውስጥ ለህግ ተገዢ አለመሆን አሉታዊ ውጤት የሆነው የትኛው ነው?",
    options: [
      "የሰላም እጦት",
      "የዜጎች ፍላጎት መጠበቁ",
      "ፍትሃዊ የሀብት ክፍል መኖሩ",
      "የሰብአዊ መብቶች መከበር"
    ],
    correctAnswer: "የሰላም እጦት",
    explanation:
      "ህግ በማይከበርበት ቦታ ስርዓት አልበኝነት ስለሚነግስ ሰላም ይጠፋል። ሰላም ከሌለ ደግሞ እድገትና ደህንነት ሊታሰብ አይችልም።"
  },
  {
    id: "g6c2016-12",
    order: 12,
    question: "ከሚከተሉት አንዱ ለህግ ተገዢ የመሆን ውጤት ነው?",
    options: [
      "ስርአት አልበኝነት",
      "የሙስና መስፋፋት",
      "የመብቶች መጣስ",
      "በነጻነት መኖር"
    ],
    correctAnswer: "በነጻነት መኖር",
    explanation:
      "ህግ ሲከበር ዜጎች ያለ ምንም ስጋት መብታቸው ተጠብቆ በነጻነት መኖር ይችላሉ። ህግ የነጻነት ዋስትና ነው።"
  },
  {
    id: "g6c2016-13",
    order: 13,
    question:
      "ከሚከተሉት ውስጥ ግብርን የሚሰውሩ ሰዎች ባህሪ የሆነው የትኛው ነው?",
    options: [
      "ገቢን አሳንሰው እያቀረቡም",
      "የተጋነነ ወጪን ለማቅረብ ይቆጥባሉ",
      "ሀሰተኛ የግብር ሰነድ ማዘጋጀት",
      "ትክክለኛ ግብርን ማሳወቅና መክፈል"
    ],
    correctAnswer: "ሀሰተኛ የግብር ሰነድ ማዘጋጀት",
    explanation:
      "ግብር የሚሰውሩ ሰዎች ግብር ላለመክፈል ሲሉ የውሸት ሰነዶችን ያዘጋጃሉ። ይህም በሀገር ኢኮኖሚ ላይ ትልቅ ጉዳት የሚያደርስ ህገ-ወጥ ተግባር ነው።"
  },
  {
    id: "g6c2016-14",
    order: 14,
    question: "ከሚከተሉት የመልካም ስነምግባር የሆነው የትኛው ነው?",
    options: [
      "ትህትናን ማጣት",
      "በራስ አለመተማመን",
      "ስህተትን አለመቀበል",
      "ጥሩ ጓደኞችን መምረጥ"
    ],
    correctAnswer: "ጥሩ ጓደኞችን መምረጥ",
    explanation:
      "ጥሩ ጓደኛን መምረጥ ለመልካም ስነ-ምግባር መጎልበት መሰረት ነው። መልካም ጓደኛ ወደ በጎ ተግባር ስለሚመራን ስነ-ምግባራችን እንዲስተካከል ይረዳል።"
  },
  {
    id: "g6c2016-15",
    order: 15,
    question:
      "ከሚከተሉት መልካም ስነምግባር የተላበሰ ሰው ባህሪ የሆነው የትኛው ነው?",
    options: [
      "እራስ ወዳድነት",
      "ደግነት",
      "ማጭበርበር",
      "ፍርሃት"
    ],
    correctAnswer: "ደግነት",
    explanation:
      "ደግነት ሰዎችን መርዳትንና ለሌሎች ማሰብን የሚያካትት የመልካም ስነ-ምግባር ዋና መገለጫ ነው። ሌሎቹ አማራጮች (ራስ ወዳድነት፤ ማጭበርበር) መጥፎ ባህሪያት ናቸው።"
  },
  {
    id: "g6c2016-16",
    order: 16,
    question:
      "የመልካም ባህሪ መገለጫ ክብር መስጠት ውስጥ የማይካተተው የትኛው ነው?",
    options: [
      "ለአካባቢ ክብር መስጠት",
      "ለራስ ብቻ ክብር መስጠት",
      "ሰወላጅ ክብር መስጠት",
      "በሀላፊነት ላይ ለተቀመጡ ሰዎች ክብር መስጠት"
    ],
    correctAnswer: "ለራስ ብቻ ክብር መስጠት",
    explanation:
      "ክብር መስጠት ለራስ ብቻ ሳይሆን ለሌሎች ሰዎች፣ ለወላጆችና ለአካባቢም መሆን አለበት። ለራስ ብቻ ክብር መስጠት ወደ ራስ ወዳድነት ስለሚያደላ የመልካም ባህሪ መገለጫ ተደርጎ አይወሰድም።"
  },
  {
    id: "g6c2016-17",
    order: 17,
    question:
      "ከሚከተሉት የመልካም ስነ ምግባር ባለቤት መሆን ጠቀሜታ የሆነው የትኛው ነው?",
    options: [
      "ሰዎች ዘንድ አመኔታን ማግኘት",
      "የመልካም ግንኙነት መጓደል",
      "የጓደኛ እጦት",
      "ከሌሎች ሰዎች ጋር መጋጨት"
    ],
    correctAnswer: "ሰዎች ዘንድ አመኔታን ማግኘት",
    explanation:
      "መልካም ስነ-ምግባር ያለው ሰው በማህበረሰቡ ዘንድ ይወደዳል እንዲሁም ይታመናል። አመኔታ ማግኘት ለስኬታማ ማህበራዊ ኑሮ ቁልፍ ነው።"
  },
  {
    id: "g6c2016-18",
    order: 18,
    question:
      "አንድ ሰው ሀሳቡን ስሜቱን፤ ፍላጎቱንና ልምዶቹን የመቆጣጠር ብቃት ካለው የትኛውን የመልካም ስነ ምግባር ዘዴ አዳብሯል ማለት ይቻላል?",
    options: [
      "የትምህርት ቤት ህግና ደንብ ማክበር",
      "የማህበረሰብ እሴትን ማክበር",
      "ራስን መቆጣጠር",
      "ለህግ ተገዢነት"
    ],
    correctAnswer: "ራስን መቆጣጠር",
    explanation:
      "ራስን መቆጣጠር ማለት ስሜታችንና ፍላጎታችንን ለበጎ ነገር ማዋልና መጥፎ ድርጊቶችን መግታት መቻል ነው። ይህም ጠንካራ ስብዕናን ለመገንባት ይረዳል።"
  },
  {
    id: "g6c2016-19",
    order: 19,
    question:
      "ከመልካም ስነምግባር ማበልጸጊያ ዘዴዎች ውስጥ የሚካተተው የትኛው ነው?",
    options: [
      "የግበረገብ መርሆዎችን ለመተግበር የሚያስችል ብቃት አለማሳደግ",
      "ታማኝ መሆንና የገቡትን ቃል መጠበቅ የሚያስችል ብቃትን አለማዳበር",
      "አላስፈላጊ የሆኑ ምኞቶችንና ተግባሮችን ማከናወን",
      "ሃላፊነት መወጣትና ለተጠያቂነት መዘጋጀት"
    ],
    correctAnswer: "ሃላፊነት መወጣትና ለተጠያቂነት መዘጋጀት",
    explanation:
      "የተሰጠንን ኃላፊነት በአግባቡ መወጣትና ለስራችን ተጠያቂ መሆን ስነ-ምግባርን ለማበልጸግ ይረዳል። ይህም ታማኝነትንና ጥንካሬን ይገነባል።"
  },
  {
    id: "g6c2016-20",
    order: 20,
    question:
      "ከሚከተሉት ውስጥ የመልካም ስነ ምግባር አለመላበስ ውጤት የሆነው የትኛው ነው?",
    options: [
      "እውነተኛነት",
      "የእርስ በእርስ ግጭት",
      "ታማኘነት",
      "ሚስጢር ጠባቂነት"
    ],
    correctAnswer: "የእርስ በእርስ ግጭት",
    explanation:
      "መልካም ስነ-ምግባር በሌለበት ቦታ ጥላቻና አለመግባባት ስለሚሰፍን ሰዎች እርስ በእርስ ይጋጫሉ። ይህም የማህበረሰቡን ሰላምና አንድነት ያናጋል።"
  },
  {
    id: "g6c2016-21",
    order: 21,
    question:
      "ከሚከተሉት ውስጥ ማሀበራዊ ተሳትፎ ምሳሌ የሆነው የትኛው ነው?",
    options: [
      "ጫማ መጥረግ",
      "በጎ ፈቃደኛነት",
      "በሱቅ ላይ እቃ መሸጥ",
      "እርሻ ላይ መሰማራት"
    ],
    correctAnswer: "በጎ ፈቃደኛነት",
    explanation:
      "በጎ ፈቃደኝነት ያለ ምንም ክፍያ ማህበረሰቡን ለማገልገል የሚደረግ ተሳትፎ በመሆኑ የማህበራዊ ተሳትፎ ዋነኛ ምሳሌ ነው። ሌሎቹ አማራጮች የግል ገቢ ለማግኘት የሚሰሩ ስራዎች ናቸው።"
  },
  {
    id: "g6c2016-22",
    order: 22,
    question:
      "ከታች ከተጠቀሱት በማህበራዊ እንቅስቃሴ ውስጥ የሚካተተው የትኛው ነው?",
    options: [
      "የገንዘብ ልውውጥ ማድረግ",
      "ማህበራዊ ችግሮችን መፍታት",
      "ምርቶችን ማምረትና መሽጥ",
      "ገቢ ማግኘትና ሀብት ማፍራት"
    ],
    correctAnswer: "ማህበራዊ ችግሮችን መፍታት",
    explanation:
      "ማህበራዊ እንቅስቃሴ የሚባለው ማህበረሰቡን የሚጠቅሙና ችግሮችን የሚፈቱ ተግባራት ላይ መሳተፍ ነው። ለምሳሌ አካባቢን ማጽዳት ወይም ችግረኞችን መርዳት ሊሆን ይችላል።"
  },
  {
    id: "g6c2016-23",
    order: 23,
    question: "የበጎ አድራጎት ተግባራት ያልሆነው የቱ ነው?",
    options: [
      "ገንዘብና ሽልማት ተቀብሎ መስራት",
      "በሙሉ ፈቃደኝነት ማገልገል",
      "የአካባቢ ጥበቃ ስራ",
      "ድሃ የማህበረሰብ ክፍልን መርዳት"
    ],
    correctAnswer: "ገንዘብና ሽልማት ተቀብሎ መስራት",
    explanation:
      "በጎ አድራጎት ማለት በፈቃደኝነትና ያለ ጥቅም ለሌሎች መልካም ማድረግ ነው። ክፍያ ወይም ሽልማት ፈልጎ መስራት ግን በጎ አድራጎት አይባልም።"
  },
  {
    id: "g6c2016-24",
    order: 24,
    question:
      "ከሚከተሉት ውስጥ ስለበጎ ፈቃድ ማህበራዊ አገልግሎት እውነት የሆነው የትኛው ነው?",
    options: [
      "የማህበረሰብ አኗኗርን ለማሻሻል አስተዋፅኦ የለውም",
      "አካባቢያዊና ሀገራዊ እድገት አያመጣም",
      "የመንፈስ እርካታ ያስገኛል",
      "የግል ትርፍና ጥቅምን ያስገኛል"
    ],
    correctAnswer: "የመንፈስ እርካታ ያስገኛል",
    explanation:
      "በጎ ፈቃደኝነት ሰዎችን በመርዳት የሚገኝ ውስጣዊ ሰላምና የመንፈስ እርካታ ያስገኛል። ምንም እንኳን የግል የገንዘብ ጥቅም ባይኖረውም ለሰው ልጅ ትልቅ ደስታ ይሰጣል።"
  },
  {
    id: "g6c2016-25",
    order: 25,
    question:
      "ከሚከተሉት ውስጥ የጋራ ጥቅም ምሳሌ ያልሆነው የትኛው ነው?",
    options: [
      "መሰረተ ልማት",
      "የቤት መኪና",
      "ንጹህ አካባቢ",
      "ቤተ መጻህፍት"
    ],
    correctAnswer: "የቤት መኪና",
    explanation:
      "የጋራ ጥቅም ማለት ሁሉም ሰው በእኩልነት ሊገለገልበት የሚችል ነገር ነው። የቤት መኪና ግን የግል ንብረት በመሆኑ ለጋራ ጥቅም ምሳሌ አይሆንም።"
  },
  {
    id: "g6c2016-26",
    order: 26,
    question: "ግብርን በታማኝነት የመክፈል ጠቀሜታ የሆነው የትኛው ነው?",
    options: [
      "የዜጎች የመሰረተ ልማት ተደራሽነትን ያጓትታል",
      "የተለያዩ አገልግሎቶች ለመስጠት እንቀፋት ነው",
      "የግለሰቦች ገቢ እና ሀብት ያድግበታል",
      "ድህንነትን ለማስወገድ በከፍተኛ ሁኔታ ይረዳል"
    ],
    correctAnswer:
      "ድህንነትን ለማስወገድ በከፍተኛ ሁኔታ ይረዳል",
    explanation:
      "መንግስት ከዜጎች የሚሰበስበውን ግብር ለድህነት ቅነሳና ለልማት ስራዎች ያውለዋል። ስለዚህ ግብር መክፈል ድህነትን ለመዋጋት ትልቅ አስተዋጽኦ አለው።"
  },
  {
    id: "g6c2016-27",
    order: 27,
    question:
      "ከሚከተሉት ውስት የባህላዊ ቁጠባ ተቋም የሆነው የትኛው ነው?",
    options: [
      "ባንክ",
      "እቁብ",
      "እነስተኛ የፋይናንስ ተቋማት",
      "የመድህን ድርጅቶች"
    ],
    correctAnswer: "እቁብ",
    explanation:
      "እቁብ በኢትዮጵያ ማህበረሰብ ውስጥ ለዘመናት የቆየና ሰዎች ተሰባስበው ገንዘብ የሚቆጥቡበት ባህላዊ መንገድ ነው። ባንክና ሌሎች ተቋማት ግን ዘመናዊ የቁጠባ ተቋማት ናቸው።"
  },
  {
    id: "g6c2016-28",
    order: 28,
    question:
      "ከሚከተሉት ውስጥ የሀገር መውደድን የሚገልጽ የትኛው ነው?",
    options: [
      "ለሀገር ያለ የታማኝነት መንፈስ ማነስ",
      "የግል ጥቅምን ማስቀደም",
      "ለሀገር ጥልቅ ፍቅር ማሳየት",
      "ማህበረሰብን ለማገልገል ፍላጎት ማጣት"
    ],
    correctAnswer: "ለሀገር ጥልቅ ፍቅር ማሳየት",
    explanation:
      "ሀገር መውደድ (ፓትሪዮቲዝም) ማለት ለሀገር ያለ ጥልቅ ፍቅርና ኩራት ነው። ይህም ለሀገር እድገትና ደህንነት በቁርጠኝነት መስራትን ይጨምራል።"
  },
  {
    id: "g6c2016-29",
    order: 29,
    question: "ከሚከተሉት ውስጥ የሀገር ወዳድነት መገለጫ የሆነው?",
    options: [
      "የባለቤትነት ስሜት ማጣት",
      "በሀገር ሉአላዊነት አለመኩራት",
      "ሙስናን መፈፀም",
      "ጀግኖችን ማክበር"
    ],
    correctAnswer: "ጀግኖችን ማክበር",
    explanation:
      "ለሀገራቸው መስዋዕትነት የከፈሉ ጀግኖችን ማክበርና ታሪካቸውን ማስታወስ የሀገር ወዳድነት ዋነኛ መገለጫ ነው። ይህም ለሀገር ያለንን ክብር ያሳያል።"
  },
  {
    id: "g6c2016-30",
    order: 30,
    question:
      "ከሚከተሉት ውስጥ ሀገር ወዳድ የሆኑ ዜጎች መብዛት ለሀገር ከሚሰጠው ጠቀሜታ የሆነው የትኛው ነው?",
    options: [
      "የተንሸራሸረ አንድነት መኖር",
      "ፈጣን እድገት አለመኖር",
      "ለሌሎች ጥቃት መጋለጥ",
      "ሀገሩን የሚወድ መሪ መፈጠር"
    ],
    correctAnswer: "ሀገሩን የሚወድ መሪ መፈጠር",
    explanation:
      "ማህበረሰቡ ሀገር ወዳድ ከሆነ፤ ከዚሁ ማህበረሰብ የሚወጡ መሪዎችም ሀገራቸውን የሚወዱና ለህዝብ የሚያስቡ ይሆናሉ። ይህም ለሀገር እድገትና ሰላም ትልቅ አስተዋጽኦ አለው።"
  },
  {
    id: "g6c2016-31",
    order: 31,
    question: "ሀገር ወዳድ የሆኑ ግለሰቦች ሚና የሆነው የትኛው ነው?",
    options: [
      "የራስን ፍላጎት ብቻ ማራመድ",
      "ለሀገር እድገት አነስተኛ አስዋፅኦ ማድረግ",
      "የሙስናን ተግባርን ማስወገድ",
      "ስልጣንን ያለአግባቡ መጠቀም"
    ],
    correctAnswer: "የሙስናን ተግባርን ማስወገድ",
    explanation:
      "ሀገሩን የሚወድ ዜጋ ለሀገሩ ሃብት ስለሚቆረቆር ሙስናንና ብክነትን ይዋጋል። ታማኝነት የሀገር ወዳድነት አንዱ አካል ነው።"
  },
  {
    id: "g6c2016-32",
    order: 32,
    question:
      "ከታች ከቀረቡት ሀገርን መውደድ ውስጥ የሚካተተው የትኛው ነው?",
    options: [
      "ትውልድ ሀገሩን እንዲያውቅ ማድረግ",
      "በተግባር የሀገርን ፍቅር ለማሳየት መቸገር",
      "ሀገርን ለመጠበቅ ዝግጁ አለመሆን",
      "ከማህበረሰብ ራስን ማራቅ"
    ],
    correctAnswer: "ትውልድ ሀገሩን እንዲያውቅ ማድረግ",
    explanation:
      "አዲሱ ትውልድ ስለ ሀገሩ ታሪክ፣ ባህልና እሴት እንዲያውቅ ማድረግ ለሀገር ፍቅር መጎልበት ወሳኝ ነው። ሀገርን ማወቅ መውደድን ያመጣል።"
  },
  {
    id: "g6c2016-33",
    order: 33,
    question: "ከሚከተሉት ውስጥ የሰላማዊ ባህሪ ምሳሌ የትኛው ነው?",
    options: [
      "ጥላቻ",
      "የበታችነት ስሜት",
      "መከባበር",
      "አለመግባባት"
    ],
    correctAnswer: "መከባበር",
    explanation:
      "ሰዎች እርስ በእርስ ሲከባበሩና የሌሎችን መብት ሲያከብሩ ሰላም ይሰፍናል። መከባበር ለሰላማዊ ግንኙነት መሰረት ነው።"
  },
  {
    id: "g6c2016-34",
    order: 34,
    question: "የሰላም ጠቀሜታ የሆነው የትኛው ነው?",
    options: [
      "ችግሮችን በሃይል መፍታት",
      "የተግባቦት ክህሎት መበልፀግ",
      "በራስ መተማመን ማጣት",
      "የሁከትና መገለል መስፈን"
    ],
    correctAnswer: "የተግባቦት ክህሎት መበልፀግ",
    explanation:
      "ሰላም ባለበት ሁኔታ ሰዎች በግልጽ መነጋገርና ሃሳባቸውን መለዋወጥ ስለሚችሉ የመግባባት ክህሎታቸው ይዳብራል። ይህም ግጭቶችን በውይይት ለመፍታት ይረዳል።"
  },
  {
    id: "g6c2016-35",
    order: 35,
    question: "ከሚከተሉት ውስጥ መተባበርን የሚገልጽ የትኛው ነው?",
    options: [
      "እርስ በእርስ አለመረዳዳት",
      "አገልግሎቶችን አለማዳረስ",
      "የሌሎችን ሀዘንና ደስታ መካፈል",
      "ተራን ሳይጠብቁ መስተናገድ"
    ],
    correctAnswer: "የሌሎችን ሀዘንና ደስታ መካፈል",
    explanation:
      "መተባበር ማለት በችግር ጊዜ መረዳዳትና በደስታ ጊዜም አብሮ መሆን ነው። ይህም በማህበረሰቡ መካከል ያለውን ትስስር ያጠናክራል።"
  },
  {
    id: "g6c2016-36",
    order: 36,
    question:
      "ከሚከተሉት መተባበርን ለማሳየት የማይጠቅመው የትኛው ነው?",
    options: [
      "የሌሎችን ሚስጥር አሳልፎ መስጠት",
      "ከሌሎች ጋር መተማመን",
      "ምቹና ሰላማዊ የሆነ አካባቢ መፈጠር",
      "እርስ በእርስ መረዳዳት"
    ],
    correctAnswer: "የሌሎችን ሚስጥር አሳልፎ መስጠት",
    explanation:
      "የሰዎችን ሚስጥር አሳልፎ መስጠት እምነትን ስለሚያጠፋ በትብብር ላይ አሉታዊ ተጽዕኖ ይኖረዋል። መተባበር የሚገነባው በመተማመን ላይ ነው።"
  },
  {
    id: "g6c2016-37",
    order: 37,
    question: "ከሚከተሉት የመተባበር ጠቀሜታ የሆነው የትኛው ነው?",
    options: [
      "ከሌሎች ጋር ያለውን ተግባቦት ያዳብራል",
      "ሌሎችን ለማድመጥና ለመረዳት ያዳግታል",
      "በጥልቀት ማሰብን አያጎለብትም",
      "የራስ ወዳድነት ይንጸባረቅበታል"
    ],
    correctAnswer: "ከሌሎች ጋር ያለውን ተግባቦት ያዳብራል",
    explanation:
      "ሰዎች አብረው ሲሰሩና ሲተባበሩ ሃሳብ የመለዋወጥና የመግባባት ችሎታቸው ይጨምራል። ይህም ለጋራ ስኬት መንገድ ይከፍታል።"
  },
  {
    id: "g6c2016-38",
    order: 38,
    question: "ግልጽነት ምን ማለት ነው?",
    options: [
      "ስሜትን መደበቅ",
      "ሀሳብን በታማኝት መግለጽ",
      "ውሸትና ማስመሰል",
      "ሁሉንም ሀሳብ መቀበል"
    ],
    correctAnswer: "ሀሳብን በታማኝት መግለጽ",
    explanation:
      "ግልጽነት ማለት የምናስበውንና የሚሰማንን ነገር በትክክልና በታማኝነት ለሌሎች ማካፈል ነው። ይህም በሰዎች መካከል ጥርጣሬ እንዳይኖር ያደርጋል።"
  },
  {
    id: "g6c2016-39",
    order: 39,
    question: "የሰላምና ትብብር መኖር ውጤት የሆነው?",
    options: [
      "ግጭትና ጦርነት",
      "የሀገር አንድነት መጠናከር",
      "የመንግስታት መውደቅ",
      "የሰዎች ሞትና መፈናቀል"
    ],
    correctAnswer: "የሀገር አንድነት መጠናከር",
    explanation:
      "ሰላምና ትብብር ባለበት ሀገር ዜጎች ተከባብረውና ተረዳድተው ስለሚኖሩ የሀገር አንድነት ይጠነክራል። አንድነት ደግሞ ለሀገር ሉአላዊነትና እድገት ዋስትና ነው።"
  },
  {
    id: "g6c2016-40",
    order: 40,
    question:
      "ከታች ከቀረቡት ስለሰላምና ትብብር ስህተት የሆነው የትኛው ነው?",
    options: [
      "ሰላምና ትብብር የማይነጣጠሉ ጉዳዮች ናቸው",
      "ሰላምና ትብብር በጥቂቶች ርብርብ ይገኛሉ",
      "ሰላምና ትብብር የሰዎችን ደህንነት ያስከብራሉ",
      "ሰላምና ትብብር በዜጎች ትብብር ይረጋገጣሉ"
    ],
    correctAnswer:
      "ሰላምና ትብብር በጥቂቶች ርብርብ ይገኛሉ",
    explanation:
      "ሰላምና ትብብር የጥቂት ሰዎች ስራ ሳይሆን የሁሉም ዜጎች የጋራ ርብርብ ውጤት ነው። ሁሉም ሰው የበኩሉን ካላበረከተ ዘላቂ ሰላም ሊመጣ አይችልም።"
  }
    
],
  "grade6-2016-amharic": [
  {
    id: "g6a2016-4",
    question:
      "“ውጤት-ኣማ-ነት-ም” የሚለው ቃል በመገጣጠም እንዴት ይነበባል?",
    options: [
      "ሀ. ውጤታምነት",
      "ለ. ውጤትነትም",
      "ሐ. ውጤትአማነትም",
      "መ. ውጤታማነትም"
    ],
    correctAnswer: "መ. ውጤታማነትም",
    explanation:
      "የተነጣጠሉትን ምዕላዶች (ውጤት፣ አማ፤ ነት፣ ም) ስናገጣጥማቸው ውጤታማነትም የሚለውን ሙሉ ቃል ይሰጡናል፡፡"
  },
  {
    id: "g6a2016-5",
    question:
      "“ደራ” ለሚለው በፍቺ ተቃራኒው ቃል ነው፡፡",
    options: [
      "ሀ. ቀዘቀዘ",
      "ለ. ደመቀ",
      "ሐ. ሞቀ",
      "መ. ደረጀ"
    ],
    correctAnswer: "ሀ. ቀዘቀዘ",
    explanation:
      "‘’ደራ” ማለት ሞቀ፤ ደመቀ ወይም ተሟሟቀ ማለት ሲሆን፤ ተቃራኒው ደግሞ ቀዘቀዘ የሚለው ነው፡፡"
  },
  {
    id: "g6a2016-6",
    question:
      "መሬቱ ስለታረስ ጥሩ ምርት ሰጠ፡፡ የተሰመረበት ቃል ምን አይነት ፍቺ ይዟል?",
    options: [
      "ሀ. ፍካሬያዊ",
      "ለ. ስውር",
      "ሐ. እማሬያዊ",
      "መ. ድርብ"
    ],
    correctAnswer: "ሐ. እማሬያዊ",
    explanation:
      "‘ታረሰ” የሚለው ቃል በቀጥታ መዝገበ ቃላዊ ትርጉሙን (ለመዝራት ዝግጁ መሆንን) ስለገለጸ እማሬያዊ ፍቺ ይባላል፡፡"
  },
  {
    id: "g6a2016-7",
    question:
      "‘ዓይን’ ለሚለው ቃል ፍካሬያዊ ፍቺው __________ነው፡፡",
    options: [
      "ሀ. ማያ",
      "ለ. ዋና",
      "ሐ. የሰውነት አካል",
      "መ. መለያ"
    ],
    correctAnswer: "ለ. ዋና",
    explanation:
      "‘ዓይን” በቀጥታ የማያ እካል ቢሆንም፤ በፍካሬያዊ (ምሳሌያዊ) እነጋገር ለአንድ ነገር “ዋና” ወይም መሰረት የሆነውን ክፍል ለመግለጽ ያገለግላል፡፡"
  },
  {
    id: "g6a2016-8",
    question:
      "ልጁ ልብስ የለውም ቶሎ ይረሳል፡፡ ልብስ የሚለው ቃል በዚህ አረፍተ ነገር ውስጥ እንዴት ይነበባል?",
    options: [
      "ሀ. በዜማ",
      "ለ. ላልቶ",
      "ሐ. በመነጣጠል",
      "መ. ጠብቆ"
    ],
    correctAnswer: "መ. ጠብቆ",
    explanation:
      "በዚህ አውድ “ልብስ” የሚለው ቃል (ለበሰ ከሚለው ግስ የወጣ ሳይሆን ልብ ማለት ወይም ማስተዋልን ስለሚያመለክት) “ብ” ፊደል ጠብቃ ትነበባለች፡፡"
  },
  {
    id: "g6a2016-9",
    question:
      "“የህጻናትን” የሚለው ቃል በምዕላድ እንዴት ተከፋፍሎ ይጻፋል?",
    options: [
      "ሀ. የህጻናት-ን",
      "ለ. የ-ህጻን-ኣት-ን",
      "ሐ. የ-ህጻናትን",
      "መ. የ-ህጻናት-ን"
    ],
    correctAnswer: "ለ. የ-ህጻን-ኣት-ን",
    explanation:
      "ቃሉ ሲከፋፈል “የ(ቅድመ ተቀጽላ)፣ “ህጻን’ (ነጻ ምዕላድ)፣ “ኣት” (የብዙ ቁጥር አመልካች ጥገኛ ምዕላድ) እና “ን” (ተሳቢ አመልካች) ይሆናል፡፡"
  },
  {
    id: "g6a2016-10",
    question:
      "በየቤታችን ሄድን፡፡ “በየቤታችን” የሚለው ቃል ነጻ ምእላዱ የቱ ነው?",
    options: [
      "ሀ. ቤት",
      "ለ. የቤት",
      "ሐ. በቤት",
      "መ. ቤታ"
    ],
    correctAnswer: "ሀ. ቤት",
    explanation:
      "ነጻ ምዕላድ ማለት ለብቻው ቆሞ ትርጉም የሚሰጥ የቃሉ መሰረት ሲሆን፤ በዚህ ቃል ውስጥ መሰረቱ ‘ቤት’ ነው፡፡"
  },

  {
    id: "g6a2016-11",
    question:
      "ለዚህ ምንባብ ተስማሚው ርዕስ የቱ ነው?",
    passage:
      "ለበጎ ስሜትም ሆነ ለጨለምተኛ ስሜት መነሻ ምክንያቱ የታሰበ ሀሳብ ነው፡፡ ሀሳብ የህይወትን ፈተናዎች ለመሻገርና ራስንም ሆነ ሌሎችን በብቃት ለመምራት ያስችላል፣ በሌላ በኩል አንድ ሰው ተሽመድምዶ እንዲቀር ምክንያቱ የገዛ ራሱ ነው፡፡ ስለዚህ ሀሳብና አስተሳሰብ የማንነት የዕጣ ፈንታ መሰረት ነው ማለት ይቻላል፡፡\n\nየሰው ልጅ በጎ ሀሳብና ስሜት እንዲስማማው ሆኖ የተፈጠረ ነው፡፡ በጎ ሀሳብ በሚያስብበት ወቅት በጎ ስሜት ይሰማዋል፣ አእምሮውም በጤናማና ሰላማዊ ሁኔታ ይሰራል፡፡ በዚህ መሰረት ተቀባይነት ያለው በጎ ሀሳብ ብሩህ ተስፋና ተነሳሽነት እንዲፈጠር ያድርጋል፣ ወደ ስኬትም ያደርሳል፡፡\n\nበሌላ በኩል የተዛባና አሉታዊ ሀሳብ ለአሉታዊ ስሜት መፈጠር ምክንያት ነው፡፡ አሉታዊ ሀሳብ አሉታዊ ስሜት እንዲፈጠር በማድረግ የአእምሮ ሰላምን ይነሳል። ስብዕናን ያዛባል፡ ከስኬት ይልቅ ወደ አስከፊ ህይወት ውስጥ ለመኖር ምክንያት ይሆናል፡፡\n\nምንጭ (ሥነ አዕምሮ፣ ገጽ 14፣2007)",
    options: [
      "ሀ. አሉታዊ ስሜት",
      "ለ. አሉታዊ ሀሳብ",
      "ሐ. የሀሳብ ጉልበት",
      "መ. የሀሳብ መዘዝ"
    ],
    correctAnswer: "ሐ. የሀሳብ ጉልበት",
    explanation:
      "ምንባቡ የሀሳብ በሰው ህይወት፣ ስሜት እና ስኬት ላይ ያለውን ተፅዕኖ ያብራራል፡፡"
  },

  {
    id: "g6a2016-12",
    question:
      "አእምሮን በጤናማና ሰላማዊ ሁኔታ እንዲሰራ የሚያደርገው ምንድን ነው?",
    options: [
      "ሀ. የተመጣጠነ ምግብ",
      "ለ. አለመጨናነቅ",
      "ሐ. ስራ መስራት",
      "መ. በጎ ማሰብ"
    ],
    correctAnswer: "መ. በጎ ማሰብ",
    explanation:
      "ምንባቡ በጎ ሀሳብ ሲኖር አእምሮ በጤናማና ሰላማዊ ሁኔታ እንደሚሰራ ይገልጻል፡፡"
  },

  {
    id: "g6a2016-13",
    question:
      "ስብዕናን የሚያዛባው ምንድን ነው?",
    options: [
      "ሀ. ህመም",
      "ለ. አሉታዊ ሀሳብ",
      "ሐ. በጎ ሀሳብ",
      "መ. በጎነት"
    ],
    correctAnswer: "ለ. አሉታዊ ሀሳብ",
    explanation:
      "ምንባቡ አሉታዊ ሀሳብ ስብዕናን እንደሚያዛባ በግልጽ ይገልጻል፡፡"
  },

  {
    id: "g6a2016-14",
    question:
      "የምንባቡ ዋና መልዕክት ምንድን ነው?",
    options: [
      "ሀ. የሰው ልጅ የሀሳቡ ውጤት መሆኑን ማሳየት",
      "ለ. የሰው ልጅ ሀቀኛ እንዲሆን ማድረግ",
      "ሐ. የሰው ልጅ በርትቶ እንዲሰራ ማድረግ",
      "መ. የሰው ልጅ ተነሳሽ እንዲሆን ማድረግ"
    ],
    correctAnswer:
      "ሀ. የሰው ልጅ የሀሳቡ ውጤት መሆኑን ማሳየት",
    explanation:
      "ምንባቡ ሀሳብና አስተሳሰብ የሰው ማንነትና ዕጣ ፈንታ መሰረት መሆናቸውን ያሳያል፡፡"
  },

  {
    id: "g6a2016-15",
    question:
      "“ጨለምተኛ ስሜት” ለሚለው ቃል አውዳዊ ፍቺ፦",
    options: [
      "ሀ. ተስፋ ሰጪ",
      "ለ. ብሩህ ተስፋ",
      "ሐ. ደስተኛ ስሜት",
      "መ. ተስፋ አስቆራጭ"
    ],
    correctAnswer: "መ. ተስፋ አስቆራጭ",
    explanation:
      "“ጨለምተኛ ስሜት” በአውዱ ተስፋ የሚያስቆርጥ አሉታዊ ስሜትን ያመለክታል፡፡"
  },

  {
    id: "g6a2016-16",
    question:
      "“ስኬት” ለሚለው ቃል በፍቺ የሚመሳሰለው የቱ ነው?",
    options: [
      "ሀ. ውድቀት",
      "ለ. ደስተኛ",
      "ሐ. ውጤት",
      "መ. እድገት"
    ],
    correctAnswer: "ሐ. ውጤት",
    explanation:
      "ስኬት ግብን ማሳካትን ወይም የተፈለገውን ጥሩ ውጤት ማግኘትን ያመለክታል፡፡"
  },

  {
    id: "g6a2016-17",
    question:
      "ከ18 ዓመት በታች ያሉ ወጣቶች በወንጀል የሚሳተፉበትን ምክንያትና ሁኔታ የሚያብራራው ጽሁፍ የትኛው የአጻጻፍ ዘዴ ነው?",
    options: [
      "ሀ. በአመዛዛኝ",
      "ለ. በተራኪ",
      "ሐ. በገላጭ",
      "መ. ስዕላዊ"
    ],
    correctAnswer: "ሀ. በአመዛዛኝ",
    explanation:
      "ጽሁፉ የወጣቶችን ዕድሜ፣ ትክክልና ስህተትን የመለየት ችሎታ እና ወንጀልን በምክንያት ያብራራል፤ ስለዚህ በአመዛዛኝ አጻጻፍ ነው፡፡"
  },

  {
    id: "g6a2016-18",
    question:
      "ጀማሪ ወደ ቅኔ ቤት ሲገባ መጀመሪያ የግዕዝ ሰዋሰው ማጥናት እንደማያስፈልገው የሚከራከረው ጽሁፍ የትኛው የአጻጻፍ ዘዴ ነው?",
    options: [
      "ሀ. በገላጭ",
      "ለ. በተራኪ",
      "ሐ. በአከራካሪ",
      "መ. ስዕላዊ"
    ],
    correctAnswer: "ሐ. በአከራካሪ",
    explanation:
      "ጽሁፉ አንድን ሀሳብ በመቃወም እና “ምክንያቱም” በሚል ምክንያት በመስጠት የራሱን አቋም ያቀርባል፡፡"
  },

  {
    id: "g6a2016-19",
    question:
      "ጫት-__________ አልኮልና ሲጋራ የአእምሮ ስርዓትን ያዛባል፡፡ የሚገባው የስርዓተ ነጥብ ዓይነት የቱ ነው?",
    options: [
      "ሀ. :",
      "ለ. ድርብ ሰረዝ",
      "ሐ. ነጠላ ሠረዝ",
      "መ. !"
    ],
    correctAnswer: "ሐ. ነጠላ ሠረዝ",
    explanation:
      "ነጠላ ሰረዝ በዝርዝር የቀረቡ ተመሳሳይ ነገሮችን ለመለየት ያገለግላል፡፡"
  },

  {
    id: "g6a2016-20",
    question:
      "በርትቶ አጠና ------በፈተና ጥሩ ውጤት አመጣ፡፡ የሚገባው የስርዓተ ነጥብ ዓይነት የቱ ነው?",
    options: [
      "ሀ. :",
      "ለ. ድርብ ሠረዝ",
      "ሐ. ነጠላ ሠረዝ",
      "መ. !"
    ],
    correctAnswer: "ለ. ድርብ ሰረዝ",
    explanation:
      "ድርብ ሰረዝ በምክንያትና በውጤት የተያያዙ ሀሳቦችን ለማገናኘት ይረዳል፡፡"
  },

  {
    id: "g6a2016-21",
    question:
      "“ዶክተር” የሚለው ቃል በእዝባር አጥሮ ሲጻፍ-----ይሆናል፡፡",
    options: [
      "ሀ. ዶክ/ር",
      "ለ. ዶክ/ተር",
      "መ. ዶ/ር"
    ],
    correctAnswer: "መ. ዶ/ር",
    explanation:
      "በእዝባር አጭር ሲጻፍ የቃሉን የመጀመሪያና የመጨረሻ ክፍል በማስቀመጥ በስላሽ ይለያል፡፡"
  },

  {
    id: "g6a2016-22",
    question:
      "ሰውየው ጎበዝ ---ጥሩ ምርት አገኘ፡፡ የሚገባው እያያዥ ቃል የቱ ነው?",
    options: [
      "ሀ. ስለሆነ",
      "ለ. እንደሆነ",
      "ሐ. ከሆነ",
      "መ. ቢሆን"
    ],
    correctAnswer: "ሀ. ስለሆነ",
    explanation:
      "“ስለሆነ” መሆኑ ለተከተለው ውጤት ምክንያት መሆኑን ያሳያል፡፡"
  },

  {
    id: "g6a2016-23",
    question:
      "ሰውየው ጎበዝ ---ጥሩ ምርት አገኘ፡፡ የሚገባው እያያዥ ቃል የቱ ነው?",
    options: [
      "ሀ. ስለሆነ",
      "ለ. እንደሆነ",
      "ሐ. ከሆነ",
      "መ. ቢሆን"
    ],
    correctAnswer: "ሀ. ስለሆነ",
    explanation:
      "“ስለሆነ” መሆኑ ለተከተለው ውጤት ምክንያት መሆኑን ያሳያል፡፡"
  },

  {
    id: "g6a2016-24",
    question:
      "የተላከለትን ደብዳቤ________ የደብዳቤውን መልስ ጻፈ፡፡ የሚገባው እያያዥ ቃል የቱ ነው?",
    options: [
      "ሀ. ከተቀበለ",
      "ለ. በተቀበለ",
      "ሐ. እንደተቀበለ",
      "መ. የተቀበለ"
    ],
    correctAnswer: "ሐ. እንደተቀበለ",
    explanation:
      "“እንደተቀበለ” ደብዳቤውን መቀበልና መልሱን መጻፍ በተከታታይ መከናወናቸውን ያሳያል፡፡"
  },

  {
    id: "g6a2016-25",
    question:
      "በልቦለድ ውስጥ የሚገኘውን ታሪክ የሚላበስ የልቦለድ አላባ ምን ይባላል?",
    options: [
      "ሀ. መቼት",
      "ለ. ገጸባህሪ",
      "ሐ. ታሪክ",
      "መ. ጭብጥ"
    ],
    correctAnswer: "ለ. ገጸባህሪ",
    explanation:
      "ገጸባህሪያት ድርጊቶችን በመፈጸም ታሪኩን የሚያንቀሳቅሱና ህያው የሚያደርጉ ናቸው፡፡"
  },

  {
    id: "g6a2016-26",
    question:
      "በልቦለድ ውስጥ የሚተላለፈው መልዕክት የልቦለዱ---- ይባላል፡፡",
    options: [
      "ሀ. ጭብጥ",
      "ለ. ግጭት",
      "መ. መቼት"
    ],
    correctAnswer: "ሀ. ጭብጥ",
    explanation:
      "ጭብጥ ደራሲው ለአንባቢ ማስተላለፍ የሚፈልገውን ዋና መልዕክት ወይም ትምህርት ያመለክታል፡፡"
  },

  {
    id: "g6a2016-27",
    question:
      "ስለህይወት ታሪክ ጽሁፍ ትክክል ያልሆነው የቱ ነው?",
    options: [
      "ሀ. የባለታሪኩን የአስተዳደግ ሁኔታ ያካትታል፡፡",
      "ለ. የባለታሪኩን የትውልድ ዘመን ይይዛል፡፡",
      "ሐ. የስርአተ ነጥብ ህግን መከተል አያስፈልግም፡፡",
      "መ. የአረፍተ ነገር አገነባብ ህግን ይከተላል፡፡"
    ],
    correctAnswer:
      "ሐ. የስርአተ ነጥብ ህግን መከተል አያስፈልግም፡፡",
    explanation:
      "ማንኛውም ጽሁፍ የህይወት ታሪክን ጨምሮ የስርአተ ነጥብ ህጎችን መከተል አለበት፡፡"
  },

  {
    id: "g6a2016-28",
    question:
      "ከሚከተሉት ቃላት ውስጥ አንዱ የተጽኦ ስም ነው፡፡",
    options: [
      "ሀ. ውሻ",
      "ለ. አንተ",
      "መ. ድሬዳዋ"
    ],
    correctAnswer: "መ. ድሬዳዋ",
    explanation:
      "ድሬዳዋ የከተማ ልዩ ስም ስለሆነ የተጽኦ ስም ነው፡፡"
  },

  {
    id: "g6a2016-29",
    question:
      "የወል ስም የሆነው የቱ ነው?",
    options: [
      "ሀ. እኛ",
      "ለ. ሰው",
      "ሐ. ሣራ",
      "መ. ረጅም"
    ],
    correctAnswer: "ለ. ሰው",
    explanation:
      "“ሰው” ለሁሉም ሰዎች በጠቅላላ የሚጠቀም የወል ስም ነው፡፡"
  },

  {
    id: "g6a2016-30",
    question:
      "ጎበዙ ልጅ ወዲያው መጣ፤ የተሰመረበት ቃል የትኛው የተውሳከ ግስ ዓይነት ነው?",
    options: [
      "ሀ. የጊዜ",
      "ለ. የቦታ",
      "ሐ. የሁኔታ",
      "መ. የመጠን"
    ],
    correctAnswer: "ሀ. የጊዜ",
    explanation:
      "“ወዲያው” ድርጊቱ መቼ እንደተፈጸመ ስለሚያመለክት የጊዜ ተውሳከ ግስ ነው፡፡"
  },

  {
    id: "g6a2016-31",
    question:
      "ሁለቱ ልጆች______ ያጠናሉ፡፡ የሚገባው የጊዜ ተውሳከ ግስ የቱ ነው?",
    options: [
      "ሀ. በፍጥነት",
      "ለ. በዝግታ",
      "ሐ. ዛፍ ስር",
      "መ. ማታ ማታ"
    ],
    correctAnswer: "መ. ማታ ማታ",
    explanation:
      "“ማታ ማታ” ድርጊቱ የሚፈጸምበትን ጊዜ ስለሚያሳይ የጊዜ ተውሳከ ግስ ነው፡፡"
  },

  {
    id: "g6a2016-32",
    question:
      "“በየቤቱ” በሚለው ቃል ውስጥ ድህረ ግንድ ቅጥያ የቱ ነው?",
    options: [
      "ሀ. በ",
      "ለ. ኡ",
      "ሐ. ቱ",
      "መ. የ"
    ],
    correctAnswer: "ለ. ኡ",
    explanation:
      "“በ” እና “የ” ቅድመ ቅጥያዎች ሲሆኑ፣ “ቤት” የነጻ ምዕላድ መሰረት ነው፡፡ “ኡ” ደግሞ ከግንዱ በኋላ የሚጨመር ድህረ ግንድ ቅጥያ ነው፡፡"
  },

  {
    id: "g6a2016-33",
    question:
      "አለምነሽ በጊዜ ወደ ትምህርት ቤት ሄደች፡፡ የተሰመረበትን ስም የሚተካው ተውላጠ ስም የቱ ነው?",
    options: [
      "ሀ. አንተ",
      "ለ. አንቺ",
      "ሐ. እሷ",
      "መ. እኔ"
    ],
    correctAnswer: "ሐ. እሷ",
    explanation:
      "አለምነሽ ሴት ስም በመሆኑ የሚተካው የሦስተኛ መደብ ነጠላ ሴት ተውላጠ ስም “እሷ” ነው፡፡"
  },

  {
    id: "g6a2016-34",
    question:
      "ደግ ሰው ወድቆ አይወድቅም፡፡ የተሰመረበት ቃል የ----- ቅጽል ነው፡፡",
    options: [
      "ሀ. ባህሪ",
      "ለ. መጠን",
      "ሐ. አይነት",
      "መ. ቁጥር"
    ],
    correctAnswer: "ሀ. ባህሪ",
    explanation:
      "“ደግ” የሰውን ውስጣዊ ወይም ሥነ-ምግባራዊ ባህሪ ስለሚገልጽ የባህሪ ቅጽል ነው፡፡"
  },

  {
    id: "g6a2016-35",
    question:
      "ነጭ ልብስ ቆሻሻ አይችልም፡፡ የተሰመረበት ቃል የ----- ቅጽል ነው፡፡",
    options: [
      "ሀ. ባህሪ",
      "ለ. መጠን",
      "ሐ. ቁጥር",
      "መ. አይነት"
    ],
    correctAnswer: "ሀ. ባህሪ",
    explanation:
      "“ነጭ” የልብሱን ውጫዊ ባህሪ ስለሚገልጽ በዚህ የጥያቄ አጠቃቀም የባህሪ ቅጽል ነው፡፡"
  },

  {
    id: "g6a2016-36",
    question:
      "በተሻጋሪ ግስ የተመሰረተ አረፍተ ነገር የቱ ነው?",
    options: [
      "ሀ. ልጁ ተማሪ ነው፡፡",
      "ለ. ልጅቷ ሄደች፡፡",
      "ሐ. ልጅቷ ሸጠች።",
      "መ. ልጁ ቤት አለ፡፡"
    ],
    correctAnswer: "ሐ. ልጅቷ ሸጠች።",
    explanation:
      "“ሸጠች” የተሻጋሪ ግስ ሲሆን ድርጊቱ ወደ ተሳቢ ነገር ሊሸጋገር ይችላል፡፡"
  },

  {
    id: "g6a2016-37",
    question:
      "በማይሻገር ግስ የተመሰረተ አረፍተ ነገር የቱ ነው?",
    options: [
      "ሀ. ልጁ አነበበ።",
      "ለ. ልጁ ሮጠ።",
      "ሐ. ልጁ መዘገበ።",
      "መ. ልጁ ሰጠ።"
    ],
    correctAnswer: "ለ. ልጁ ሮጠ።",
    explanation:
      "“ሮጠ” ተሳቢ የማያስፈልገው ማይሻገር ግስ ነው፡፡"
  },

  {
    id: "g6a2016-38",
    question:
      "ይህ ቃላዊ ግጥም የሚባለው መቼ ነው?",
    passage:
      "ኧረ ተይ ዝንጀሮ ግፍ አትናገሪ አሁን ትገኛለሽ አውድማ ስትጭሪ ኧረ ተይ ዝንጀሮ ልቤን ቆርጠሺው ለፍቼ ለፍቼ ሰብሌን ጨረስሺው ማሽላውን ትታ ገብሱን ልትበላ ዝንጀሮ መንጃሮ\n\nበበላሽ ቀበሮ\n\nዝንጀሮ ከመጣ ሰብሉን ለመብላት በወንጭፍ ገባሁት ተመለስ በሉት ተይ ተመለሽ ዝንጀሮ ተንኮል ያጠፋሻል ነፍስሽን በጤና ብትይዥ ይሻላል",
    options: [
      "ሀ. በሰብል ጥበቃ ጊዜ",
      "ለ. ጉልጓሎ ጊዜ",
      "ሐ. በእርሻ ወቅት",
      "መ. በአጨዳ ጊዜ"
    ],
    correctAnswer: "ሀ. በሰብል ጥበቃ ጊዜ",
    explanation:
      "ግጥሙ ዝንጀሮ ሰብል እንዳትበላ መከላከልንና በወንጭፍ ማባረርን ስለሚገልጽ በሰብል ጥበቃ ጊዜ ይባላል፡፡"
  },

  {
    id: "g6a2016-39",
    question:
      "ዝንጀሮ ምን ብላ ነው ምላ የታረቀችው?",
    options: [
      "ሀ. ሰብሉን እንደማትበላ",
      "ለ. ዳግመኛ ላለመምጣት ነው",
      "ሐ. ማሽላውን ትታ ገብሱን ልትበላ",
      "መ. ገብሱን ትታ ማሽላውን ልትበላ"
    ],
    correctAnswer: "ሐ. ማሽላውን ትታ ገብሱን ልትበላ",
    explanation:
      "ግጥሙ “ማሽላውን ትታ ገብሱን ልትበላ” በማለት የዝንጀሮዋን ዓላማ ይገልጻል፡፡"
  },

  {
    id: "g6a2016-40",
    question:
      "‘ተንኮል ያጠፋሻል” ሲል --- ለማለት ነው።",
    options: [
      "ሀ. ተንኮል ያኖርሻል",
      "ለ. ተንኮል ይጎዳሻል",
      "ሐ. ተንኮል ስሪ",
      "መ. ተንኮል ያርቅሻል"
    ],
    correctAnswer: "ለ. ተንኮል ይጎዳሻል",
    explanation:
      "“ያጠፋሻል” በዚህ አውድ ተንኮል እንደሚጎዳት ወይም እንደሚያበላሽባት የሚያስጠነቅቅ አገላለጽ ነው፡፡"
  }
],
  "grade6-2016-english": [
  {
    id: "g6e2016-4",
    question: "Which drink contains minerals that build our body?",
    options: [
      "A. Milk",
      "B. Water",
      "C. Soft drinks",
      "D. Fruit juice"
    ],
    correctAnswer: "A",
    explanation:
      "The text states that milk is rich in Calcium, which helps us have strong bones and teeth."
  },

  {
    id: "g6e2016-5",
    question:
      "Absalat: Do you like going for vacation in winter?\n\nRediet: No,-------- Because winter is cold and rainy.",
    options: [
      "A. I dislike",
      "B. I like",
      "C. I love",
      "D. I want to"
    ],
    correctAnswer: "A",
    explanation:
      "Rediet begins with “No” and gives negative reasons, so “dislike” fits the context."
  },

  {
    id: "g6e2016-6",
    question:
      "Balmak:-----------\n\nLamrot: She is tall and slim.",
    options: [
      "A. How is your mom?",
      "B. What is your mom’s job?",
      "C. Where does your mom live?",
      "D. How can you describe your mom?"
    ],
    correctAnswer: "D",
    explanation:
      "Lamrot’s response describes physical characteristics, so the question asks how she can describe her mom."
  },

  {
    id: "g6e2016-7",
    question:
      "Simret: How does a chicken come in to being?\n\nSimon:_____________________",
    options: [
      "A. It comes from an egg",
      "B. A hen lays an egg. The eggs give a chick.",
      "C. It grows up from a hen’s egg within some weeks in the farm.",
      "D. First, a hen lays egg. Next, the egg is hatched. Then, the chick grows up"
    ],
    correctAnswer: "D",
    explanation:
      "This option gives a complete chronological explanation using sequence markers such as “First,” “Next,” and “Then.”"
  },

  {
    id: "g6e2016-8",
    question:
      "Dayamo:_______________\n\nMaria: In my view, it is good. It makes our capital more beautiful.",
    options: [
      "A. What is your opinion about the reform in the city?",
      "B. Do you agree with the reform in city?",
      "C. Who is reforming the city?",
      "D. How is the city today?"
    ],
    correctAnswer: "A",
    explanation:
      "Maria starts with “In my view,” which indicates that she is expressing an opinion."
  },

  {
    id: "g6e2016-9",
    question:
      "Siyane: Chance is better than hard work.\n\nFarid:___________________",
    options: [
      "A. Don’t you agree?",
      "B. I’m afraid, I disagree",
      "C. Yes, we must work hard.",
      "D. I want to be chanceful."
    ],
    correctAnswer: "B",
    explanation:
      "Farid disagrees with the statement that chance is better than hard work."
  },

  {
    id: "g6e2016-10",
    question:
      "Friend: I am feeling tired now. What should I do?\nYou:______________________",
    options: [
      "A. What is your advice?",
      "B. Can I help you?",
      "C. You had better drink tea.",
      "D. I think you are right."
    ],
    correctAnswer: "C",
    explanation:
      "The friend is asking for advice, and “You had better drink tea” gives a suggestion."
  },

  {
    id: "g6e2016-11",
    question:
      "You: What’s your feeling about “Unity”?\n\nFriend:___________",
    options: [
      "A. I should help you.",
      "B. I totally support this.",
      "C. I believe it is strength.",
      "D. You shouldn’t think that."
    ],
    correctAnswer: "C",
    explanation:
      "The question asks for a feeling or belief. “I believe it is strength” directly expresses an opinion about unity."
  },

  {
    id: "g6e2016-12",
    question:
      "You: Where do you think students should use mobile phones?\n\nFriend:_________________",
    options: [
      "A. This is wrong idea.",
      "B. I feel they should use it at home.",
      "C. We should use it in class for internet.",
      "D. I’m happy if we are allowed to use it in school."
    ],
    correctAnswer: "B",
    explanation:
      "The question asks “Where,” and option B gives a specific location: “at home.”"
  },

  {
    id: "g6e2016-13",
    question:
      "I and my friends_______ the Science Museum yesterday.",
    options: [
      "A. Visiting",
      "B. Visited",
      "C. Visits",
      "D. Visit"
    ],
    correctAnswer: "B",
    explanation:
      "The word “yesterday” indicates the simple past tense. “Visited” is the past tense form."
  },

  {
    id: "g6e2016-14",
    question:
      "Simret is busy now. She _______her English Assignment.",
    options: [
      "A. Does",
      "B. Did",
      "C. Will do",
      "D. Is doing"
    ],
    correctAnswer: "D",
    explanation:
      "The word “now” indicates an action happening at the moment, so the present continuous “is doing” is required."
  },

  {
    id: "g6e2016-15",
    question:
      "I am not sure, but Kenenisa_______ come tomorrow.",
    options: [
      "A. Will",
      "B. Can",
      "C. May",
      "D. Must"
    ],
    correctAnswer: "C",
    explanation:
      "“I am not sure” expresses uncertainty or possibility. “May” is used when something is possible but not certain."
  },

  {
    id: "g6e2016-16",
    question:
      "I completed my primary education. Now, I_______ summer language tutorial class.",
    options: [
      "A. Am going to attend",
      "B. Will attend",
      "C. Am attended",
      "D. Attended"
    ],
    correctAnswer: "A",
    explanation:
      "“Am going to” expresses a plan or intention for the near future that has already been decided."
  },

  {
    id: "g6e2016-17",
    question:
      "Rahel scored 10, and Loli scored 6 on their test. So, Rahel is_____ Loli.",
    options: [
      "A. As clever as",
      "B. The cleverest",
      "C. Cleverer than",
      "D. Most clever than"
    ],
    correctAnswer: "C",
    explanation:
      "The sentence compares two people. The comparative form of “clever” is “cleverer than.”"
  },

  {
    id: "g6e2016-18",
    question:
      "We_____ our homework. Let’s go and play.",
    options: [
      "A. Has done",
      "B. Have done",
      "C. Doing",
      "D. Does"
    ],
    correctAnswer: "B",
    explanation:
      "The plural subject “We” requires “have.” “Have done” is the present perfect form."
  },

  {
    id: "g6e2016-19",
    question:
      "Last week, my father______\n\nIn Gondar:",
    options: [
      "A. Is",
      "B. Will be",
      "C. Was",
      "D. Has been"
    ],
    correctAnswer: "C",
    explanation:
      "“Last week” requires the simple past tense. The past tense of “is” for “my father” is “was.”"
  },

  {
    id: "g6e2016-20",
    question:
      "Students_______ respect traffic rules while crossing roads.",
    options: [
      "A. Can",
      "B. Have to",
      "C. May",
      "D. Will"
    ],
    correctAnswer: "B",
    explanation:
      "“Have to” expresses strong obligation or a requirement, such as following traffic rules."
  },

  {
    id: "g6e2016-21",
    question:
      "Kedija______ Arabic before she went to Dubai.",
    options: [
      "A. Is learning",
      "B. Will learn",
      "C. Learned",
      "D. Had learned"
    ],
    correctAnswer: "D",
    explanation:
      "When two actions happened in the past, the action that happened first is expressed using the past perfect: “had learned.”"
  },

  {
    id: "g6e2016-22",
    question:
      "The room______ now by the students.",
    options: [
      "A. Is cleaning",
      "B. Was cleaned",
      "C. Is being cleaned",
      "D. Had been cleaned"
    ],
    correctAnswer: "C",
    explanation:
      "This is present continuous passive voice. The structure is is/am/are + being + past participle."
  },

  {
    id: "g6e2016-23",
    question:
      "If you come early, you_______ the bus.",
    options: [
      "A. Will not miss",
      "B. Would not miss",
      "C. Had missed",
      "D. Missed"
    ],
    correctAnswer: "A",
    explanation:
      "This is a Type 1 conditional: If + present simple, will + verb."
  },

  {
    id: "g6e2016-24",
    question:
      "She puts off the light. The word light is______",
    options: [
      "A. Adverb",
      "B. Verb",
      "C. Adjective",
      "D. Noun"
    ],
    correctAnswer: "D",
    explanation:
      "Here, “light” refers to a physical thing, so it functions as a noun."
  },

  {
    id: "g6e2016-25",
    question:
      "Feriyat_____ if she finished her work.",
    options: [
      "A. Sleeps",
      "B. Will sleep",
      "C. Would sleep",
      "D. Slept"
    ],
    correctAnswer: "C",
    explanation:
      "This is a Type 2 conditional expressing a hypothetical situation: would + verb, if + past simple."
  },

  {
    id: "g6e2016-26",
    question:
      "He drives fast. Fast is_____",
    options: [
      "A. Adverb",
      "B. Verb",
      "C. Adjective",
      "D. Noun"
    ],
    correctAnswer: "A",
    explanation:
      "“Fast” describes how he drives, so it functions as an adverb."
  },

  {
    id: "g6e2016-27",
    question:
      "Mom has bought the_____ version i-phone",
    options: [
      "A. Lately",
      "B. Later",
      "C. Late",
      "D. Latest"
    ],
    correctAnswer: "D",
    explanation:
      "“Latest” is the superlative form used to mean the most recent version available."
  },

  {
    id: "g6e2016-28",
    question:
      "If Sibamo _____His breakfast, he would have attended all the periods.",
    options: [
      "A. Had eaten",
      "B. Ate",
      "C. Eats",
      "D. Eaten"
    ],
    correctAnswer: "A",
    explanation:
      "This is a Type 3 conditional. The if-clause uses the past perfect: had + past participle."
  },

  {
    id: "g6e2016-29",
    question:
      "Abel was kind boy. But now he started going alone and became selfish.\n\nThis is his_______ behavior.",
    options: [
      "A. good",
      "B. strange",
      "C. old",
      "D. Happy"
    ],
    correctAnswer: "B",
    explanation:
      "Changing from kind to selfish and staying alone suggests an unusual or “strange” change in behavior."
  },

  {
    id: "g6e2016-30",
    question:
      "Warming up your body before you do exercises protects you from_______.",
    options: [
      "A. Sport",
      "B. Injury",
      "C. Running",
      "D. Damage"
    ],
    correctAnswer: "B",
    explanation:
      "In a physical exercise context, warming up is specifically done to prevent injury."
  },

  {
    id: "g6e2016-31",
    question:
      "Work hard! You will see the______ soon.",
    options: [
      "A. Goals",
      "B. Roles",
      "C. Fruits",
      "D. Products"
    ],
    correctAnswer: "C",
    explanation:
      "“See the fruits” is an expression meaning you will see the positive results or rewards of your hard work."
  },

  {
    id: "g6e2016-32",
    question:
      "We planted different vegetables in plastic pots and harvested good yield.",
    options: [
      "A. Put",
      "B. Bought",
      "C. Did",
      "D. Got"
    ],
    correctAnswer: "D",
    explanation:
      "In this context, “harvested” means to gather or get the crop that was grown."
  },

  {
    id: "g6e2016-33",
    question:
      "Dady parks his automobile in the parking site.",
    options: [
      "A. Puts",
      "B. Drives",
      "C. Stops",
      "D. Opens"
    ],
    correctAnswer: "C",
    explanation:
      "To park a car means to stop it and leave it in a certain place."
  },

  {
    id: "g6e2016-34",
    question:
      "The poultry farm has a factory that processes a balanced feed for the chickens.",
    options: [
      "A. Food",
      "B. Medicine",
      "C. Machine",
      "D. Meat"
    ],
    correctAnswer: "A",
    explanation:
      "In the context of animals and poultry, “feed” means food."
  },

  {
    id: "g6e2016-35",
    question:
      "Computer, Internet, mobile phones, smart TVs, are examples of modern inventions by engineers.",
    options: [
      "A. Information",
      "B. Innovations",
      "C. Schools",
      "D. Education"
    ],
    correctAnswer: "B",
    explanation:
      "“Innovations” and “inventions” both refer to new ideas, methods, or products created through study and experimentation."
  },

  {
    id: "g6e2016-36",
    passage:
      "The Seasons\n\nThe seasons have different weather conditions in different parts of the world. In most parts like America and Europe it looks as follows.\n\nSpring is the season in which everything is going green. The first flowers are blooming. The sun is shining. The weather is mild. The spring months are March, April and May.\n\nSummer: it is very hot and sunny. People wear T-shirts, shorts, sunglasses and hat. This time people go on vacation. The children are on vacation. The first fruits are ripe. The months in summer are June, July and August.\n\nAutumn: the weather is cold, windy and fogy. It rains a lot. Birds fly to warmer places. People wear raincoats, trousers and sweaters, and go for a walk. The leaves of trees become red, brown, yellow and orange then fall. Farmers pick apples.\n\nWinter: It is very cold. The temperature is below zero. It is snowing and freezing. Children can build a snowman. They go skiing. In December is Christmas. The winter months are December, January and February.",
    question: "How many seasons are there in the year?",
    options: [
      "A. One",
      "B. Three",
      "C. Four",
      "D. Twelve"
    ],
    correctAnswer: "C",
    explanation:
      "The passage describes four seasons: Spring, Summer, Autumn, and Winter."
  },

  {
    id: "g6e2016-37",
    passage:
      "The Seasons\n\nThe seasons have different weather conditions in different parts of the world. In most parts like America and Europe it looks as follows.\n\nSpring is the season in which everything is going green. The first flowers are blooming. The sun is shining. The weather is mild. The spring months are March, April and May.\n\nSummer: it is very hot and sunny. People wear T-shirts, shorts, sunglasses and hat. This time people go on vacation. The children are on vacation. The first fruits are ripe. The months in summer are June, July and August.\n\nAutumn: the weather is cold, windy and fogy. It rains a lot. Birds fly to warmer places. People wear raincoats, trousers and sweaters, and go for a walk. The leaves of trees become red, brown, yellow and orange then fall. Farmers pick apples.\n\nWinter: It is very cold. The temperature is below zero. It is snowing and freezing. Children can build a snowman. They go skiing. In December is Christmas. The winter months are December, January and February.",
    question: "In which season is Christmas?",
    options: [
      "A. Spring",
      "B. Summer",
      "C. Autumn",
      "D. Winter"
    ],
    correctAnswer: "D",
    explanation:
      "The passage states that Christmas is in December, which is included in the winter months."
  },

  {
    id: "g6e2016-38",
    passage:
      "The Seasons\n\nThe seasons have different weather conditions in different parts of the world. In most parts like America and Europe it looks as follows.\n\nSpring is the season in which everything is going green. The first flowers are blooming. The sun is shining. The weather is mild. The spring months are March, April and May.\n\nSummer: it is very hot and sunny. People wear T-shirts, shorts, sunglasses and hat. This time people go on vacation. The children are on vacation. The first fruits are ripe. The months in summer are June, July and August.\n\nAutumn: the weather is cold, windy and fogy. It rains a lot. Birds fly to warmer places. People wear raincoats, trousers and sweaters, and go for a walk. The leaves of trees become red, brown, yellow and orange then fall. Farmers pick apples.\n\nWinter: It is very cold. The temperature is below zero. It is snowing and freezing. Children can build a snowman. They go skiing. In December is Christmas. The winter months are December, January and February.",
    question: "Which one is true statement?",
    options: [
      "A. People wear trousers and sweaters in winter.",
      "B. Winter is good for plants and trees.",
      "C. Autumn is time for fruits.",
      "D. Summer is sunny season."
    ],
    correctAnswer: "D",
    explanation:
      "The passage explicitly states under the Summer section that it is very hot and sunny."
  },

  {
    id: "g6e2016-39",
    passage:
      "The Seasons\n\nThe seasons have different weather conditions in different parts of the world. In most parts like America and Europe it looks as follows.\n\nSpring is the season in which everything is going green. The first flowers are blooming. The sun is shining. The weather is mild. The spring months are March, April and May.\n\nSummer: it is very hot and sunny. People wear T-shirts, shorts, sunglasses and hat. This time people go on vacation. The children are on vacation. The first fruits are ripe. The months in summer are June, July and August.\n\nAutumn: the weather is cold, windy and fogy. It rains a lot. Birds fly to warmer places. People wear raincoats, trousers and sweaters, and go for a walk. The leaves of trees become red, brown, yellow and orange then fall. Farmers pick apples.\n\nWinter: It is very cold. The temperature is below zero. It is snowing and freezing. Children can build a snowman. They go skiing. In December is Christmas. The winter months are December, January and February.",
    question: "In which season do people become happy?",
    options: [
      "A. Spring",
      "B. Summer",
      "C. Winter",
      "D. Autumn"
    ],
    correctAnswer: "A",
    explanation:
      "The passage describes spring with blooming flowers, sunshine, and mild weather, which are associated with happiness and renewal."
  },

  {
    id: "g6e2016-40",
    passage:
      "The Seasons\n\nThe seasons have different weather conditions in different parts of the world. In most parts like America and Europe it looks as follows.\n\nSpring is the season in which everything is going green. The first flowers are blooming. The sun is shining. The weather is mild. The spring months are March, April and May.\n\nSummer: it is very hot and sunny. People wear T-shirts, shorts, sunglasses and hat. This time people go on vacation. The children are on vacation. The first fruits are ripe. The months in summer are June, July and August.\n\nAutumn: the weather is cold, windy and fogy. It rains a lot. Birds fly to warmer places. People wear raincoats, trousers and sweaters, and go for a walk. The leaves of trees become red, brown, yellow and orange then fall. Farmers pick apples.\n\nWinter: It is very cold. The temperature is below zero. It is snowing and freezing. Children can build a snowman. They go skiing. In December is Christmas. The winter months are December, January and February.",
    question: "Winter is",
    options: [
      "A. The hottest season",
      "B. Before spring",
      "C. A season for vacation",
      "D. Time to stay home"
    ],
    correctAnswer: "B",
    explanation:
      "In the seasonal cycle, winter comes immediately before spring."
  }
],
  "grade6-2017-civics": [
  {
    id: "g6c2017-4",
    question:
      "ከሚከተሉት ውስጥ የመጀመሪያ ደረጃ ተማሪዎች በማህበረሰባቸው ንቁ ተሳትፎ ማድረጋቸውን የሚያሳየው የቱ ነው?",
    options: [
      "ሀ. የበጎ አድራጎት ክለቦችን በመቀላቀል መሪነት ላለመፈለግ",
      "ለ. ግብር መክፈል የዜግነትና የግብረገብ ግዴታ መሆኑን ማወቅ",
      "ሐ. የተፈጥሮ ሀብትን ጥበቃ ማስተማርና መተግበር",
      "መ. የጥናት ቡድን አባል ሆኖ ረጅም ሰዓት መጫወት"
    ],
    correctAnswer: "ሐ",
    explanation:
      "የተፈጥሮ ሀብትን መጠበቅና ሌሎችን ስለዚህ ማስተማር በማህበረሰብ ውስጥ ንቁ ተሳትፎን ያሳያል።"
  },

  {
    id: "g6c2017-5",
    question:
      "ጠንካራ የሥራ ባህል የሚያሳየው የቱ ነው?",
    options: [
      "ሀ. የሥራ ሰዓትን ማክበርና ሥራውን ብቻውን መሥራት",
      "ለ. የተመደበለትን ሥራ በጊዜውና በትክክል መጨረስ",
      "ሐ. የማያደክም ሥራን ብቻ መምረጥ",
      "መ. ሥራውን በመሥራት አስፈላጊ እውቀትና ክህሎትን መማር"
    ],
    correctAnswer: "መ",
    explanation:
      "ለጥራት ያለው ሥራ የሚያስፈልጉ እውቀትና ክህሎቶችን በመሥራት ለማዳበር መጣር ጠንካራ የሥራ ባህልን ያሳያል።"
  },

  {
    id: "g6c2017-6",
    question:
      "የሥራ ባህልን መቼ ጀምሮ መማር ይገባል?",
    options: [
      "ሀ. ዜጎች ሥራ ሲይዙ",
      "ለ. ከተማሪነት ዘመን",
      "ሐ. አዋቂ ከሆኑ በኋላ",
      "መ. ከሀገር ከመውጣት በፊት"
    ],
    correctAnswer: "ለ",
    explanation:
      "የሥራ ባህል ከትምህርት ቤትና ከተማሪነት ዘመን ጀምሮ መማር እና ማዳበር ይገባል።"
  },

  {
    id: "g6c2017-7",
    question:
      "ታታሪ ተማሪዎች የሚያሳዩት ባህሪ የቱ ነው?",
    options: [
      "ሀ. ሥራን ከተከፋፈሉ በኋላ ጥቅሙን ብቻቸውን መውሰድ",
      "ለ. ለፈተና ሳይዘጋጁ መቅዳት",
      "ሐ. ብዙ መተኛትና በማለዳ አለመነሳት",
      "መ. ከመደበኛ ትምህርታቸው ውጭ መጻሕፍትን ማንበብ"
    ],
    correctAnswer: "መ",
    explanation:
      "ከመደበኛ ትምህርት ውጭ መጻሕፍትን ማንበብ ታታሪነትን ያሳያል።"
  },

  {
    id: "g6c2017-8",
    question:
      "አርአሳ መጻሕፍትን በጣም ትወዳለች፤ ነገር ግን በአልጋ ላይ ተኝታ፣ ጮክ ብላ እና ሳትቆራረጥ ለረጅም ሰዓት ታነባለች። ይህ የንባብ ልምድ ለምን ችግር ይሆናል?",
    options: [
      "ሀ. በየቀኑ ማንበብ ስለሚያደክማትና እንድትረሳ ስለሚያደርጋት",
      "ለ. ያለማቋረጥ ማንበብ መሰላቸትን ስለሚከላከል",
      "ሐ. ያለማቋረጥ ማንበብ ሀሳብን ስለሚከፋፍልና ትኩረትን ስለሚያሳጣ",
      "መ. ጮክ ብሎ ማንበብ የንባብ ፍጥነትን ስለሚጨምር"
    ],
    correctAnswer: "ሐ",
    explanation:
      "ያለማቋረጥ ማንበብና በአልጋ ላይ መንበብ ትኩረትን ሊቀንስና ሀሳብን ሊከፋፍል ይችላል።"
  },

  {
    id: "g6c2017-9",
    question:
      "ከአማራጮች መካከል በትክክል የመምረጥ ሂደት ምን ይባላል?",
    options: [
      "ሀ. ግብረገባዊ ውሳኔ አሰጣጥ",
      "ለ. ግብታዊ ውሳኔ አሰጣጥ",
      "ሐ. የዘልማድ ውሳኔ አሰጣጥ",
      "መ. አካታች ውሳኔ አሰጣጥ"
    ],
    correctAnswer: "ሀ",
    explanation:
      "ከአማራጮች መካከል ትክክለኛና ሞራላዊ ውሳኔ መምረጥ ግብረገባዊ ውሳኔ አሰጣጥ ይባላል።"
  },

  {
    id: "g6c2017-10",
    question:
      "ራሄል የፈተና ውጤቷ ቀንሷል። ለዚህ ችግር መፍትሔ ለመፈለግ መጀመሪያ ምን ማድረግ አለባት?",
    options: [
      "ሀ. በሌሎች ላይ መውቀስ",
      "ለ. የፈተናውን ውጤት መተው",
      "ሐ. ሌሎችን መከተል",
      "መ. ውጤቷ የቀነሰበትን ምክንያት መለየት"
    ],
    correctAnswer: "መ",
    explanation:
      "ችግርን ለመፍታት መጀመሪያ ዋናውን ምክንያት መለየት ያስፈልጋል።"
  },

  {
    id: "g6c2017-11",
    question:
      "ዳንኤል ታምሞ እያለ ጓደኞቹን ለማስደሰት እግር ኳስ ለመጫወት ወጣ። ይህ ምን ያሳያል?",
    options: [
      "ሀ. የቤተሰብ ተጽዕኖ",
      "ለ. የእኩዮች ተጽዕኖ",
      "ሐ. የመምህራን ተጽዕኖ",
      "መ. የሥራ ተጽዕኖ"
    ],
    correctAnswer: "ለ",
    explanation:
      "ዳንኤል ጓደኞቹን ለማስደሰት የጤናውን ሁኔታ ችላ ማለቱ የእኩዮች ተጽዕኖን ያሳያል።"
  },

  {
    id: "g6c2017-12",
    question:
      "ንጹህ አካባቢ ለጤናማ ሕይወት ምን ያስገኛል?",
    options: [
      "ሀ. ችግር",
      "ለ. ቆሻሻ",
      "ሐ. በሽታ",
      "መ. ጤናማ ሕይወት"
    ],
    correctAnswer: "መ",
    explanation:
      "ንጹህ አካባቢ በሽታን በመቀነስ ጤናማ ሕይወትን ያበረታታል።"
  },

  {
    id: "g6c2017-13",
    question:
      "የብዝሃ ሕይወት መጥፋት በሰዎች ላይ የሚያስከትለው ወጪ ምንድነው?",
    options: [
      "ሀ. የዕፅዋት፣ የእንስሳትና የአካባቢ ውበት መጥፋት",
      "ለ. የሰዎች ጤና መሻሻል",
      "ሐ. የተፈጥሮ ሀብት መጨመር",
      "መ. የአየር ጥራት መሻሻል"
    ],
    correctAnswer: "ሀ",
    explanation:
      "የብዝሃ ሕይወት መጥፋት የዕፅዋት፣ የእንስሳትና የአካባቢ ውበትን ያሳንሳል።"
  },

  {
    id: "g6c2017-14",
    question:
      "የማህበራዊ ሚዲያ ጥቅም የቱ ነው?",
    options: [
      "ሀ. መረጃን መዘግየት",
      "ለ. መረጃን በፍጥነት ማስተላለፍ",
      "ሐ. ሐሰተኛ መረጃን ማበዛት",
      "መ. ግላዊ መረጃን መጋለጥ"
    ],
    correctAnswer: "ለ",
    explanation:
      "ማህበራዊ ሚዲያ መረጃን በፍጥነት ለብዙ ሰዎች ማድረስ ያስችላል።"
  },

  {
    id: "g6c2017-15",
    question:
      "የማህበራዊ ሚዲያን በሥነምግባር ለመጠቀም ምን ማድረግ ይገባል?",
    options: [
      "ሀ. ማንኛውንም የግል መረጃ መለጠፍ",
      "ለ. ያልተረጋገጠ መረጃ ማሰራጨት",
      "ሐ. ሌሎችን ማንቋሸሽ",
      "መ. በቀን ምን ያህል ጊዜ ማህበራዊ ሚዲያን እንደሚጠቀሙ መወሰን"
    ],
    correctAnswer: "መ",
    explanation:
      "የማህበራዊ ሚዲያ ጊዜን መቆጣጠር ኃላፊነት ያለው አጠቃቀምን ያሳያል።"
  },

  {
    id: "g6c2017-16",
    question:
      "ማህበራዊ ሚዲያ የማህበራዊ ጫናን ሊያመጣ ቢችልም በትክክል መጠቀም ይገባል። የትኛው ምሳሌ ትክክል ነው?",
    options: [
      "ሀ. ማንኛውንም ይዘት ሳያስቡ መከተል",
      "ለ. የሌሎችን ሐሳብ ብቻ መከተል",
      "ሐ. ማህበራዊ ሚዲያን በኃላፊነት መጠቀም",
      "መ. የግል መረጃን ለማንም መስጠት"
    ],
    correctAnswer: "ሐ",
    explanation:
      "ማህበራዊ ሚዲያን በኃላፊነት መጠቀም ማህበራዊ ጫናን ለመቆጣጠር ይረዳል።"
  },

  {
    id: "g6c2017-17",
    question:
      "ከማያውቁት ሰው የጓደኝነት ጥያቄ መቀበል ምን አደጋ ሊያስከትል ይችላል?",
    options: [
      "ሀ. የግል መረጃን ለአጭበርባሪዎች ማጋለጥ",
      "ለ. ትምህርት መሻሻል",
      "ሐ. የጓደኞች ቁጥር መቀነስ",
      "መ. የግል ደህንነት መጨመር"
    ],
    correctAnswer: "ሀ",
    explanation:
      "የማያውቁትን ሰው መቀበል የግል መረጃን ለአጭበርባሪዎች ሊያጋልጥ ይችላል።"
  },

  {
    id: "g6c2017-18",
    question:
      "ባህላዊ ትስስር ማለት ምንድነው?",
    options: [
      "ሀ. ማህበረሰቦችን በባህላቸው ምክንያት ማራቅ",
      "ለ. የአንድን ባህል ብቻ እንዲከተሉ ማስገደድ",
      "ሐ. ማህበረሰቦች የተለያዩ እሴቶችን በመጠቀም መቀራረብ",
      "መ. ሌሎችን ባህሎች አለመቀበል"
    ],
    correctAnswer: "ሐ",
    explanation:
      "ባህላዊ ትስስር የተለያዩ ባህሎችን በመከባበር ማህበረሰቦችን ያቀራርባል።"
  },

  {
    id: "g6c2017-19",
    question:
      "ሌሎች ቋንቋዎችን፣ ታሪክንና ወጎችን መማር ለምን ይጠቅማል?",
    options: [
      "ሀ. ሌሎችን ማራቅ",
      "ለ. የራስን ባህል መጥላት",
      "ሐ. ቋንቋዎችን ማጥፋት",
      "መ. በማህበረሰቦች መካከል መግባባትን መፍጠር"
    ],
    correctAnswer: "መ",
    explanation:
      "ሌሎችን ቋንቋዎች፣ ታሪክና ወጎችን መማር በማህበረሰቦች መካከል መግባባትን ይፈጥራል።"
  },

  {
    id: "g6c2017-20",
    question:
      "የባህላዊ ትስስር መገለጫ የቱ ነው?",
    options: [
      "ሀ. የግንኙነት መቀነስ",
      "ለ. ማህበረሰቦችን ማግለል",
      "ሐ. የተሻሻለ ግንኙነትና መግባባት",
      "መ. የባህል ግጭትን ማባባስ"
    ],
    correctAnswer: "ሐ",
    explanation:
      "የተሻሻለ ግንኙነትና መግባባት የባህላዊ ትስስር ዋና መገለጫ ነው።"
  },

  {
    id: "g6c2017-21",
    question:
      "ከሚከተሉት አራት ሰዎች ማለትም X፣ Y፣ Z እና W ውስጥ ውጤታማ የባህል ትስስር ሊፈጥር የሚችለው ማን ነው?",
    options: [
      "ሀ. Y ወደ አዲስ ሀገር ሄደች፤ የሀገሩን ቋንቋ ለመናገር ትሞክራለች፤ የራሷን ባህላዊ እሴቶችንም ታከብራለች።",
      "ለ. W የአካባቢውን ልማዶች ችላ ትላለች እና ሁሉም ሰው የእሷን ባህላዊ ተግባሮች እንዲከተል ትፈልጋለች።",
      "ሐ. X ወደ አዲስ ሀገር ቢሄድም የአካባቢውን ቋንቋ ለመማር ፈቃደኛ አልሆነም።",
      "መ. Z ወደ ውጪ አገር ቢሄድም ከትውልድ አገሩ ሰዎች ጋር ብቻ መሆን ይፈልጋል፤ አዲስ ቋንቋ የመማር ፍላጎት የለውም።"
    ],
    correctAnswer: "ሀ",
    explanation:
      "Y የራሷን ማንነት ሳትተው የአዲሱን ሀገር ቋንቋና ባህል ለማወቅ መሞከሯ ውጤታማ ትስስርን ያሳያል።"
  },

  {
    id: "g6c2017-22",
    question:
      "መምህር X በአንድ ትምህርት ቤት የግብረገብ መምህር ሲሆኑ በቤተሰቦቻቸው፣ በጓደኞቻቸው እና በተማሪዎቻቸው ዘንድ ግብረገባዊ ምሉዕነት የተላበሱ እንደሆኑ ይነገራል። ከሚከተሉት ውስጥ የዚህ መምህር ባህሪ ሊሆን የሚችለው የቱ ነው?",
    options: [
      "ሀ. ለጎበዝ ተማሪዎች የሚያዳሉ እና የሚያበረታቱ",
      "ለ. አንዳንድ ጓደኞቻቸውን ብቻ በደንብ የሚያዳምጡ",
      "ሐ. ሃቀኛ፣ ታታሪ፣ ላመኑበት ነገር የማይለዋወጥ አቋም ያላቸው",
      "መ. ትክክል የሆነውን ከማድረግ ይልቅ ሌሎችን ማስደሰትን የሚያስቀድሙ"
    ],
    correctAnswer: "ሐ",
    explanation:
      "ሃቀኝነት፣ ታታሪነትና በትክክለኛ መርህ ላይ ጽኑ አቋም መኖር የግብረገብ ምሉዕነት መገለጫዎች ናቸው።"
  },

  {
    id: "g6c2017-23",
    question:
      "ከሚከተሉት ውስጥ የግብረገብ ምሉዕነት ያላቸው ተማሪዎች መገለጫ የቱ ነው?",
    options: [
      "ሀ. በቡድን ሥራ በንቃት አለመሳተፍ",
      "ለ. ለጓደኞች ችግር ትኩረት አለመስጠት",
      "ሐ. የቤት ሥራን ለውጤት ሲባል መቅዳት",
      "መ. ጓደኛን ሲያስከፉ ይቅርታ መጠየቅ"
    ],
    correctAnswer: "መ",
    explanation:
      "ስህተትን መቀበልና ይቅርታ መጠየቅ ግብረገባዊ ጥንካሬን ያሳያል።"
  },

  {
    id: "g6c2017-24",
    question:
      "በአንድ ሀገር ውስጥ የመንግስትን ህግ የሚያከብሩ ነገር ግን የራሳቸውን ጥቅም ብቻ የሚያሳድዱ ዜጎች ከበዙ፣",
    options: [
      "ሀ. ጠንካራ የማህበራዊ ሃላፊነት ያድጋል",
      "ለ. የማህበራዊ ትስስር ይዳከማል",
      "ሐ. በግለሰቦች መካከል መተማመን ይጨምራል",
      "መ. የአካባቢ ጥበቃና ዘላቂ አሰራር ይደራጃል"
    ],
    correctAnswer: "ለ",
    explanation:
      "ሁሉም ሰው የግል ጥቅሙን ብቻ ካሳደደ የማህበራዊ ትስስር ይዳከማል።"
  },

  {
    id: "g6c2017-25",
    question:
      "ከሚከተሉት ውስጥ የህግ ተገዢነትን የሚወክለው የቱ ነው?",
    options: [
      "ሀ. መንግስትም ሆነ ዜጎች በአገሪቱ ህጎች ሲመሩ",
      "ለ. ዜጎች በተመቻቸው ህጎች እራሳቸውን ሲያስተዳድሩ",
      "ሐ. በዜጎች መካከል እኩልነት ለማምጣት ሲያስቸግር",
      "መ. ዜጎች መብታቸውን ለማስከበር እርምጃ ሲወስዱ"
    ],
    correctAnswer: "ሀ",
    explanation:
      "የህግ ተገዢነት ማለት መንግስትና ዜጎች በአገሪቱ ህጎች እኩል መመራት ማለት ነው።"
  },

  {
    id: "g6c2017-26",
    question:
      "ከሚከተሉት ውስጥ ለህግ ተገዢ መሆን ለአንድ ሀገር ያለውን ጠቀሜታ የሚገልፀው የትኛው ነው?",
    options: [
      "ሀ. ማህበራዊ ልዩነቶችን ማስፋፋት",
      "ለ. ዜጎች ግብር ለመክፈል አለመፈለግ",
      "ሐ. ሰፊ የኢኮኖሚ ልዩነት መፍጠር",
      "መ. የሰው ልጆችን መብት ማክበርና መጠበቅ"
    ],
    correctAnswer: "መ",
    explanation:
      "ህግ በተከበረና በተገዛ ሀገር የሰው ልጆች መብቶች ይከበራሉ እና ይጠበቃሉ።"
  },

  {
    id: "g6c2017-27",
    question:
      "በ6ኛ ክፍል B ክፍል የተደነገጉ ህጎች መካከል ሰዓት ማርፈድ የለበትም፣ ቆሻሻ መጣል የለበትም፣ የቤት ሥራ መሥራትና መከባበር ይገባል ይላሉ። ከሚከተሉት የትኛው ተማሪ የክፍል ህጉን ያከብራል?",
    options: [
      "ሀ. Z በመጀመሪያ ፔርዮድ ክፍል አይገባም",
      "ለ. X አንዳንድ ጊዜ ከጓደኞቹ ጋር ይጣላል",
      "ሐ. Y ያለፈቃድ የጓደኞቹን ንብረት፣ እርሳስና እስክሪብቶ አይወስድም",
      "መ. W ያኝኮውን ማስቲካ በወንበሩ ላይ ይለጥፋል"
    ],
    correctAnswer: "ሐ",
    explanation:
      "የሌሎችን ንብረት ያለፈቃድ አለመውሰድ መከባበርንና የክፍል ህግን ማክበርን ያሳያል።"
  },

  {
    id: "g6c2017-28",
    question:
      "ከሚከተሉት መካከል ለህግ ተገዢ አለመሆን የሚያስከትለው ችግር ያልሆነው የቱ ነው?",
    options: [
      "ሀ. የእርስ በርስ ጦርነት",
      "ለ. የመሬት መንቀጥቀጥ",
      "ሐ. የዜጎች ስደት",
      "መ. ሕገወጥ የህፃናት ዝውውር"
    ],
    correctAnswer: "ለ",
    explanation:
      "የመሬት መንቀጥቀጥ ተፈጥሯዊ አደጋ ነው፤ በህግ አለመገዛት የሚመጣ ችግር አይደለም።"
  },

  {
    id: "g6c2017-29",
    question:
      "“ለራስ ክብር መስጠት” ማለት ምንድነው?",
    options: [
      "ሀ. የራሴ ሀሳብ ሁልጊዜ ይሻላል ብሎ ማሰብ",
      "ለ. ችሎታን መጠራጠርና በሌሎች ሀሳብ መመራት",
      "ሐ. በሌሎች ዘንድ ተወዳጅ ለመሆን የራስን ፍላጎትና ምርጫ መተው",
      "መ. ማንበብ፣ ችግርን በውይይት መፍታትና የግል ንፅህናን መጠበቅ"
    ],
    correctAnswer: "መ",
    explanation:
      "ራስን ማሻሻል፣ ችግሮችን በሰላማዊ ውይይት መፍታትና የግል ንፅህናን መጠበቅ ራስን ማክበርን ያሳያል።"
  },

  {
    id: "g6c2017-30",
    question:
      "ግልፍተኛ ባህሪ ያለው ተማሪ መልካም ባህሪ እንዲያጎለብት የሚረዳው ምንድነው?",
    options: [
      "ሀ. ከጓደኞችና መምህራን መራቅ",
      "ለ. ግንዛቤንና ይቅር ባይነትን ማዳበር",
      "ሐ. ስለ ልብስና ምግብ ግድ አለመስጠት",
      "መ. ስህተቶችን በጓደኞችና በቤተሰብ ላይ መወንጀል"
    ],
    correctAnswer: "ለ",
    explanation:
      "ሌሎችን መረዳትና ይቅር ባይነት ማዳበር ቁጣን ለመቆጣጠርና መልካም ባህሪን ለማዳበር ይረዳል።"
  },

  {
    id: "g6c2017-31",
    question:
      "ከሚከተሉት ውስጥ በማህበራዊና ኢኮኖሚያዊ ተሳትፎ ውስጥ የሚመደበው የቱ ነው?",
    options: [
      "ሀ. መሸጥና መግዛት",
      "ለ. ማምረትና ማከፋፈል",
      "ሐ. ሀብትን ወይም ንብረትን ማከማቸት",
      "መ. ትምህርትና ክህሎት ማዳበር"
    ],
    correctAnswer: "ሀ/ለ",
    explanation:
      "መሸጥና መግዛት፣ ማምረትና ማከፋፈል ዋና ዋና የኢኮኖሚ ተሳትፎዎች ናቸው።"
  },

  {
    id: "g6c2017-32",
    question:
      "አንድ ጠበቃ ነፃ የህግ አገልግሎት ሲሰጥ ምን ሊባል ይገባል?",
    options: [
      "ሀ. በፈቃደኝነት አገልግሎት ስለሰጠ ሊመሰገንና ሊከበር ይገባል",
      "ለ. ነፃ አገልግሎቱ ሰዎችን ያሳስታል",
      "ሐ. ሕጋዊ አገልግሎት ስላልሆነ ችግር ነው",
      "መ. ነፃ የህግ አገልግሎት መስጠት ስህተት ነው"
    ],
    correctAnswer: "ሀ",
    explanation:
      "የሙያ እውቀቱን በነፃ መስጠት የፈቃደኝነት አገልግሎት ስለሆነ የሚመሰገን ተግባር ነው።"
  },

  {
    id: "g6c2017-33",
    question:
      "የABC ትምህርት ቤት ተማሪዎች በበጋ ወቅት ችግኝ ተከላ ያደርጋሉ። ይህ ምን ያሳያል?",
    options: [
      "ሀ. ጊዜን ማባከን",
      "ለ. ጊዜን ለጋራ ማህበረሰብ ጥቅም መጠቀም",
      "ሐ. ከአቅም በላይ ሀላፊነት መውሰድ",
      "መ. ቤተሰብንና መምህራንን ማስቸገር"
    ],
    correctAnswer: "ለ",
    explanation:
      "ችግኝ ተከላ አካባቢን ለመጠበቅና ለጋራ ማህበረሰብ ጥቅም የሚውል መልካም ተግባር ነው።"
  },

  {
    id: "g6c2017-34",
    question:
      "ታማኝ ግብር ከፋዮች በማህበራዊና ኢኮኖሚያዊ ተግባራት ውስጥ ምን ሚና ይጫወታሉ?",
    options: [
      "ሀ. የገቢና የሀብት እኩልነት አለመመጣጠንን መቀነስ",
      "ለ. በአገራት መካከል የንግድ ግንኙነትን መቀነስ",
      "ሐ. ማህበራዊ ሀላፊነት ያላቸውን ሰዎች መቀነስ",
      "መ. የመንግስት ተጠያቂነትንና ግልፅነትን መቀነስ"
    ],
    correctAnswer: "ሀ",
    explanation:
      "ግብርን በትክክል መክፈል ለልማት የሚውል ገቢ ያስገኛል እና የሀብት ልዩነትን ለመቀነስ ይረዳል።"
  },

  {
    id: "g6c2017-35",
    question:
      "አንድ ሰው ለሀገሩ ያለውን ፍቅር እንዴት ያሳያል?",
    options: [
      "ሀ. ስለሀገራዊ ታሪክ፣ ወግና ሥርዓት አሉታዊ እይታ መያዝ",
      "ለ. የማህበረሰብና የሀገር ህጎችን አለማክበር",
      "ሐ. ለዜጎች ፍቅርና ክብር ማሳየት እና አካባቢን መንከባከብ",
      "መ. ስለራስ ጥቅም ብቻ ማሰብና የሀገር ምልክቶችን አለማክበር"
    ],
    correctAnswer: "ሐ",
    explanation:
      "ለዜጎች ፍቅርና ክብር ማሳየት እና አካባቢን መንከባከብ ለሀገር ፍቅርን ያሳያል።"
  },

  {
    id: "g6c2017-36",
    question:
      "አንድ ሰው በትጋት በመሥራት አርበኝነቱን እንዴት ሊያሳይ ይችላል?",
    options: [
      "ሀ. ጊዜን ማባከንና መማርን ወይም መሥራትን መተው",
      "ለ. የሀገርን ሀብት በአግባቡ በመጠቀም ልማትን ማምጣትና ኑሮን ማሻሻል",
      "ሐ. ሀላፊነትን ትቶ ሌሎች እንዲፈቱ መጠበቅ",
      "መ. ለሁሉም ነገር የውጭ እርዳታን መጠበቅ"
    ],
    correctAnswer: "ለ",
    explanation:
      "የሀገርን ሀብት በአግባቡ መጠቀምና በትጋት መሥራት ለሀገር ልማት ያበረክታል።"
  },

  {
    id: "g6c2017-37",
    question:
      "አርበኛ ሰው ኢትዮጵያን የሚጎበኙ የሌሎች ሀገራት ዜጎችን እንዴት ይመለከታል?",
    options: [
      "ሀ. የሀገሩን ችግሮች ዘርዝሮ ምስጢሮችን ማጋራት",
      "ለ. እንዲጠራጠሩና ወደ ሀገራቸው እንዲመለሱ ማድረግ",
      "ሐ. ከእነሱ ጋር መሥራትና መማር አለመፈለግ",
      "መ. መብታቸውንና ባህላቸውን በእኩልነት ማክበር"
    ],
    correctAnswer: "መ",
    explanation:
      "የሌሎች ሀገራት ዜጎችን መብትና ባህል ማክበር የሥነዜጋነትና የአርበኝነት እሴትን ያሳያል።"
  },

  {
    id: "g6c2017-38",
    question:
      "ሰላም ለኢኮኖሚ ዕድገት እንዴት ያበረክታል?",
    options: [
      "ሀ. ዜጎች በትጋት እንዲሠሩና እንዲማሩ ምቹ ሁኔታ ይፈጥራል",
      "ለ. ዜጎች በመንግስት እርዳታ ብቻ እንዲመሰረቱ ያደርጋል",
      "ሐ. ስደትና ስንፍናን ያመጣል",
      "መ. የሀገር ሀብትን ለጥቂት ሰዎች ይሰጣል"
    ],
    correctAnswer: "ሀ",
    explanation:
      "ሰላም ዜጎች በሰላም እንዲሠሩና እንዲማሩ ምቹ ሁኔታ ስለሚፈጥር ለኢኮኖሚ ዕድገት ያበረክታል።"
  },

  {
    id: "g6c2017-39",
    question:
      "በማህበረሰብ ውስጥ ፍትህን የሚያጠናክር ሰላማዊ ባህሪ የቱ ነው?",
    options: [
      "ሀ. ለአንዳንድ ሰዎች ልዩ አያያዝ ማድረግ",
      "ለ. ሐቀኝነትና የሰዎችን መብት ማክበር",
      "ሐ. ከህገወጥ ተግባራት ጋር መተባበር",
      "መ. የተለያየ ባህል ያላቸውን ሰዎች መጠራጠር"
    ],
    correctAnswer: "ለ",
    explanation:
      "ሐቀኝነትና የሰዎችን መብት ማክበር ፍትህን ያጠናክራል።"
  },

  {
    id: "g6c2017-40",
    question:
      "በድህነት የሚኖር ማህበረሰብ ችግሮቹን እንዴት ሊወጣ ይችላል?",
    options: [
      "ሀ. ግለሰቦችን ብቻቸውን እንዲሠሩና ችግሮቻቸውን እንዲፈቱ ማበረታታት",
      "ለ. በቁሳቁስ ዋጋ ላይ በማህበረሰቦች መካከል ፉክክርን ማሳደግ",
      "ሐ. የጋራ ሀብትን፣ ክህሎትንና እውቀትን በማሰባሰብ መፍትሔ ማምጣት",
      "መ. የጋራ ሀብትን ለአንድ የማህበረሰብ ክፍል ብቻ መጠቀም"
    ],
    correctAnswer: "ሐ",
    explanation:
      "የጋራ ሀብት፣ ክህሎትና እውቀትን በማሰባሰብ በመተባበር ችግሮችን መፍታት ይቻላል።"
  }
],
  "grade6-2017-amharic": [
  {
    id: "g6a2017-4",
    question:
      "ከሚከተሉት አንዱ በአንቀጽ ሶስት ውስጥ የተገለጸን ሐሳብ አልያዘም፡፡",
    options: [
      "ሀ. ባህል በተለያዩ ተለዋዋጮች አማካይነት እንደገና ይፈጠራል፡፡",
      "ለ. ማህበራዊ፣ ኢኮኖሚያዊና ፖለቲካዊ ለውጦች ባህልን ይቀይሩታል፡፡",
      "ሐ. የተሳታፊዎች ተራክቦ ባህልን እንዲለወጥ ያደርጋል፡፡",
      "መ. ስለሰው ልጅ መሰረታዊ መብት ያስረዳል፡፡"
    ],
    correctAnswer: "መ",
    explanation:
      "ስለሰው ልጅ መሰረታዊ መብቶች የተጠቀሰው በአንቀጽ አንድ ውስጥ እንጂ በአንቀጽ ሶስት ውስጥ አይደለም፡፡ እንቀጽ ሶስት የሚያተኩረው በባህል ለውጥ ላይ ነው፡፡"
  },

  {
    id: "g6a2017-5",
    question:
      "ከላይ የቀረበው ምንባብ መሰረታዊ ትኩረቱ ምንድን ነው?",
    options: [
      "ሀ. ባህል መለወጥ እንደሌለበት ያሳያል፡፡",
      "ለ. የባህል መገለጫዎችን ማስገንዘብ።",
      "ሐ. ባህል ለለውጥ ዝግጁ መሆኑን ማስረዳት",
      "መ. ልክና ስህተት የሚባል ባህል አለመኖሩን መንገር"
    ],
    correctAnswer: "ለ",
    explanation:
      "ምንባቡ በአጠቃላይ ስለባህል ትርጓሜና ስለተለያዩት የባህል መገለጫዎች (ባህሪያት) ግንዛቤ ለመፍጠር የቀረበ ነው፡፡"
  },

  {
    id: "g6a2017-6",
    question:
      "የአንቀጽ አራት ዋና ሐሳብ ምንድን ነው?",
    options: [
      "ሀ. በአንድ ቦታ ብዙ አይነት ባህሎች መኖራቸውን",
      "ለ. ግለሰቦች ከእንድ በላይ ለሆኑ ባህሎች መጋለጣቸውን",
      "ሐ. የባህል ባህሪያትን ማሳየት",
      "መ. የባህልን ምንነት ማስረዳት"
    ],
    correctAnswer: "ለ",
    explanation:
      "አራተኛው አንቀጽ አንድ ሰው በአንድ ጊዜ ከአንድ በላይ ለሆኑ ባህሎች ሊጋለጥ እንደሚችል ይገልጻል፡፡"
  },

  {
    id: "g6a2017-7",
    question:
      "በአንቀጽ ሶስትና አራት መካከል መሸጋገሪያ ሆኖ ያገለገለው የቱ ነው?",
    options: [
      "ሀ. የባህል መገለጫዎች",
      "ለ. የሰው ልጅ የሰራው ሁሉ ባህል መሆኑ",
      "ሐ. በአውድ መከበቡ",
      "መ. የባህል ለውጥ ማስረጃ መሆኑ"
    ],
    correctAnswer: "ሀ",
    explanation:
      "አንቀጽ ሶስት እና አራት የባህልን መገለጫዎች (ባህሪያት) ዘርዝረው የሚያብራሩ በመሆናቸው የባህል መገለጫዎች የሚለው ነጥብ እንደ መሸጋገሪያ ያገለግላል፡፡"
  },

  {
    id: "g6a2017-8",
    question:
      "ከላይ የቀረበው ምንባብ ምን ዓይነት ድርሰት ነው?",
    options: [
      "ሀ. ተራኪ",
      "ለ. ገላጭ",
      "ሐ. እስረጂ",
      "መ. አመዛዛኝ"
    ],
    correctAnswer: "ሐ",
    explanation:
      "ድርሰቱ ስለባህል ትርጉምና ባህሪያት መረጃዎችንና ትንታኔዎችን በማቅረብ ግንዛቤ ስለሚሰጥ እስረጂ ድርሰት ይባላል፡፡"
  },

  {
    id: "g6a2017-9",
    question:
      "ከላይ ለቀረበው ምንባብ ርዕስ ሊሆን የሚችለው የቱ ነው?",
    options: [
      "ሀ. ባህልና ዓይነቶቹ",
      "ለ. ባህልና ትርጓሚዎቹ",
      "ሐ. ባህልና መገለጫው",
      "መ. ባህልና ጥቅሞቼ"
    ],
    correctAnswer: "ሐ",
    explanation:
      "ምንባቡ ባህል ምን እንደሆነና የተለያዩ መገለጫዎቹ ምን ምን እንደሆኑ በዝርዝር ስለሚገልጽ ይህ ርዕስ ተስማሚ ነው፡፡"
  },

  {
    id: "g6a2017-10",
    question:
      "“መጋፈጥ” ለሚለው ቃል አውዳዊ ፍች የቱ ነው?",
    options: [
      "ሀ. መሸሽ",
      "ለ. መፋለም",
      "ሐ. መስማማት",
      "መ. መተው"
    ],
    correctAnswer: "ለ",
    explanation:
      "በምንባቡ ውስጥ መጋፈጥ ማለት ተፈጥሮ የሚያመጣውን ተጽዕኖ ተቋቁሞ መፋለም ማለት ነው፡፡"
  },

  {
    id: "g6a2017-11",
    question:
      "“አብነት” ለሚለው ቃል አውዳዊ ፍች የቱ ነው?",
    options: [
      "ሀ. ትልቅ",
      "ለ. ምሳሌ",
      "ሐ. የሰፈር ስም",
      "መ. ዋና"
    ],
    correctAnswer: "ለ",
    explanation:
      "“እንደ አብነት” ሲል “እንደ ምሳሌ” ማለቱ ነው፡፡"
  },

  {
    id: "g6a2017-12",
    question:
      "“ማዕድ” ለሚለው እውዳዊ ፍች የቱ ነው?",
    options: [
      "ሀ. ልማድ",
      "ለ. የተፈጥሮ ሐብት",
      "ሐ. እሴት",
      "መ. ምግብ"
    ],
    correctAnswer: "መ",
    explanation:
      "በምንባቡ ውስጥ ማዕድ የሚለው ቃል ሰዎች ለሚመገቡበት ሁኔታ ስለገባ ምግብን ያመለክታል፡፡"
  },

  {
    id: "g6a2017-13",
    question:
      "“መግለጫዎች” በምዕላድ ተነጣጥሎ ሲጻፍ የቱ ነው?",
    options: [
      "ሀ. መግለጭ-ኣ-ዎች",
      "ለ. መግለጫ-ዎች",
      "ሐ. መግለ-ጭዎች",
      "መ. መግለጭ-ዎች"
    ],
    correctAnswer: "ለ",
    explanation:
      "“መግለጫ” የሚለው ቃል ነፃ ምዕላድ ሲሆን “ዎች” ደግሞ ብዙ ቁጥር አመልካች ጥገኛ ምዕላድ ነው፡፡"
  },

  {
    id: "g6a2017-14",
    question:
      "ስለ አንቀጽ አካላት ትክክል የሆነው የቱ ነው?",
    options: [
      "ሀ. በመግቢያው ውስጥ ዋና ዋና ሐሳቦች ይብራራሉ፡፡",
      "ለ. በማጠቃለያ ክፍሉ የተዘነጉ ነጥቦች ይነሳሉ።",
      "ሐ. በመግቢያው ላይ ስለሚነሱ ነጥቦች ጥቆማ ይሰጣል፡፡",
      "መ. በሐተታው ክፍል ዋና ዋና ነጥቦች ተጨምቀው ይገባሉ፡፡"
    ],
    correctAnswer: "ሐ",
    explanation:
      "የአንቀጽ መግቢያ ክፍል አንባቢው ወደ ሐሳቡ እንዲገባ ጥቆማ ወይም ፍንጭ የሚሰጥበት ክፍል ነው፡፡"
  },

  {
    id: "g6a2017-15",
    question:
      "የሚከተለውን ቅንጭብ በማንበብ የድርሰት ዓይነቱን ለዩ፦ “የተወለደችው የዛሬ 13 ዓመት ገደማ ሲሆን እናትና አባትዋን በመኪና አደጋ አጣቻቸው፡፡ ከዚያም በጉዲፈቻ ወደ ጣሊያን ሀገር ተሰደደች።”",
    options: [
      "ሀ. ተራኪ",
      "ለ. ገላጭ",
      "ሐ. አመዛዛኝ",
      "መ. አስረጂ"
    ],
    correctAnswer: "ሀ",
    explanation:
      "ይህ ቅንጭብ የሰውን ታሪክ በቅደም ተከተል ስለሚተርክ ተራኪ ድርሰት ይባላል፡፡"
  },

  {
    id: "g6a2017-16",
    question:
      "ትክክለኛውን የግል ደብዳቤ የአጻጻፍ ቅርጽ ያልያዘው የቱ ነው?",
    options: [
      "ሀ. በደብዳቤው መጨረሻ ቁጥር ይጻፋል",
      "ለ. በመግቢያው ሰላምታ ይገለጻል",
      "ሐ. በግራ ራስጌ በመጀመሪያ የተቀባይ ስም ይጻፋል",
      "መ. በቀኝ ራስጌ ቀን ይጻፋል"
    ],
    correctAnswer: "ሀ",
    explanation:
      "ቁጥር (የመዝገብ ቁጥር) የሚጻፈው በመደበኛ ወይም በቢሮ ደብዳቤ ላይ እንጂ በግል ደብዳቤ ላይ አይደለም፡፡"
  },

  {
    id: "g6a2017-17",
    question:
      "በትክክለኛው የምዕላድ አተናተን የተጻፈው የቱ ነው?",
    options: [
      "ሀ. ከምፒተር-ኦች-ኣችን",
      "ለ. ቤተሙከራዎች",
      "ሐ. ልብስ-ኦች-ኣችሁ",
      "መ. አባል-እች"
    ],
    correctAnswer: "መ",
    explanation:
      "“አባል” ነፃ ምዕላድ ሲሆን “ኦች” ደግሞ ብዙ ቁጥር አመልካች ጥገኛ ምዕላድ ሆኖ በትክክል ተለይቷል፡፡"
  },

  {
    id: "g6a2017-18",
    question:
      "ትክክለኛው የስርዓተ ነጥብ አጠቃቀም የቱ ነው?",
    options: [
      "ሀ. ሚኒስትሩ፤ “የተማሪዎችን የመማር አቅም ለማሳደግ ዘመናዊ ግብዓቶችን (ቴክኖሎጂዎችን) በ2018 ዓ.ም እንጠቀማለን፡፡” አሉ፡፡",
      "ለ. ሚኒስትሩ፣ “የተማሪዎችን የመማር አቅም ለማሳደግ ዘመናዊ ግብዓቶችን (ቴክኖሎጂዎችን) በ2018 ዓ.ም እንጠቀማለን፡፡” አሉ፡፡",
      "ሐ. ሚኒስትሩ፣ የተማሪዎችን የመማር አቅም ለማሳደግ ዘመናዊ ግብዓቶችን ቴክኖሎጂዎችን በ2018 ዓ.ም እንጠቀማለን፡፡” አሉ፡፡",
      "መ. ሚኒስትሩ፤ “የተማሪዎችን የመማር አቅም ለማሳደግ ዘመናዊ ግብዓቶችን (ቴክኖሎጂዎችን) በ2018 ዓ.ም እንጠቀማለን”፡፡ አሉ፡፡"
    ],
    correctAnswer: "መ",
    explanation:
      "ቀጥተኛ ንግግር በትምህርተ ጥቅስ መከበብ አለበት፣ ከመጠቀሱ በፊት ደግሞ ነጠላ ሰረዝ (፤) መግባት ይኖርበታል፡፡"
  },

  {
    id: "g6a2017-19",
    question:
      "ሁለት ሐሳቦችን በመውሰድ ተራ በተራ የሚገልጽ የድርሰት ዓይነት የቱ ነው?",
    options: [
      "ሀ. ገላጭ",
      "ለ. አመዛዛኝ",
      "ሐ. ተራኪ",
      "መ. አስረጂ"
    ],
    correctAnswer: "ለ",
    explanation:
      "አመዛዛኝ ድርሰት በሁለት ነገሮች መካከል ያለውን ተመሳሳይነትና ልዩነት በማነጻጸር ተራ በተራ የሚገልጽ የድርሰት ዓይነት ነው፡፡"
  },

  {
    id: "g6a2017-20",
    question:
      "የሚከተለው ቅንጭብ አገልግሎቱ ምንድን ነው? “የሰው ልጅ ብዙ ምኞቶች አሉት፡፡ ከምኞቶቹ መካከል፦ እውሮፕላን አብራሪ መሆን፤ የመድኃኒት ባለሙያ መሆን፤ አስተማሪ መሆን፣ ወታደር መሆን፣ ወዘተ ናቸው፡፡ እነዚህን ምኞቶች ለማሳካት የሚሰራቸውን ተግባራት ቀጥሎ እናያለን።”",
    options: [
      "ሀ. መግቢያ",
      "ለ. መሸጋገሪያ",
      "ሐ. ሐተታ",
      "መ. መደምደሚያ"
    ],
    correctAnswer: "ለ",
    explanation:
      "“ቀጥሎ እናያለን” የሚለው ሐረግ ከአንድ ሐሳብ ወደ ሌላኛው ሐሳብ ለመሸጋገር የሚያገለግል በመሆኑ መሸጋገሪያ ይባላል፡፡"
  },

  {
    id: "g6a2017-21",
    question:
      "በግለሰብ ደብዳቤ ውስጥ የማይካተተው የቱ ነው?",
    options: [
      "ሀ. ቁጥር",
      "ለ. ቀን",
      "ሐ. ተቀባይ",
      "መ. ጉዳይ"
    ],
    correctAnswer: "ሀ",
    explanation:
      "የመዝገብ ቁጥር በቢሮ ደብዳቤዎች ላይ እንጂ በግል ደብዳቤ ላይ አያስፈልግም፡፡"
  },

  {
    id: "g6a2017-22",
    question:
      "“እንከን” ለሚለው ቃል ተመሳሳይ የቱ ነው?",
    options: [
      "ሀ. ነገር",
      "ለ. ችግር",
      "ሐ. ጥፋት",
      "መ. ኃጢኣት"
    ],
    correctAnswer: "ለ",
    explanation:
      "እንከን ማለት ጉድለት ወይም ችግር ማለት ነው፡፡"
  },

  {
    id: "g6a2017-23",
    question:
      "“ራደ” ለሚለው ቃል ተመሳሳይ የቱ ነው?",
    options: [
      "ሀ. ተቆጣ",
      "ለ. ተቀየመ",
      "ሐ. ፈራ",
      "መ. ተበሳጨ"
    ],
    correctAnswer: "ሐ",
    explanation:
      "በዐውዱ መሠረት ራደ የሚለው ቃል መንቀጥቀጥ ወይም መፍራት ጋር ተያይዞ ሊመጣ ይችላል፡፡"
  },

  {
    id: "g6a2017-24",
    question:
      "“ለመለመ” ለሚለው ቃል ተቃራኒ የቱ ነው?",
    options: [
      "ሀ. ጠወለገ",
      "ለ. አፈራ",
      "ሐ. ቅጠል እወጣ",
      "መ. ተቀጠፈ"
    ],
    correctAnswer: "ሀ",
    explanation:
      "ለመለመ ማለት ማበብ ወይም ማደግ ሲሆን፤ ተቃራኒው ደግሞ መድረቅ ወይም መጠውለግ ነው፡፡"
  },

  {
    id: "g6a2017-25",
    question:
      "ልዩ የሆነው የቱ ነው?",
    options: [
      "ሀ. አሽከር",
      "ለ. የዱር እንስሳ",
      "ሐ. አለቃ",
      "መ. ጭፍራ"
    ],
    correctAnswer: "ለ",
    explanation:
      "አሽከር፣ ጭፍራ እና አለቃ ሰዎች ሲሆኑ፤ የዱር እንስሳ ግን ሰው ባለመሆኑ ከሌሎቹ ይለያል፡፡"
  },

  {
    id: "g6a2017-26",
    question:
      "የጅብ ፍካሬያዊ ፍች የቱ ነው?",
    options: [
      "ሀ. አስፈራ",
      "ለ. ሆዳም",
      "ሐ. ብልጥ",
      "መ. ለፍላፊ"
    ],
    correctAnswer: "ለ",
    explanation:
      "ጅብ በባህላዊ አነጋገር ለሆዳም ወይም ለስግብግብ ሰው ምሳሌ ሆኖ ይገባል፡፡"
  },

  {
    id: "g6a2017-27",
    question:
      "“እባብ” ለሚለው እማሬያዊ ፍች የቱ ነው?",
    options: [
      "ሀ. ተንኮለኛ የሆነ",
      "ለ. ተሳቢ እንስሳ",
      "ሐ. ብልጥ",
      "መ. ተራማጅ እንስሳ"
    ],
    correctAnswer: "ለ",
    explanation:
      "እማሬያዊ ፍች ማለት ቀጥተኛ ትርጉሙ በመሆኑ፣ እባብ ተሳቢ እንስሳ ነው የሚለው ትክክል ነው፡፡"
  },

  {
    id: "g6a2017-28",
    question:
      "ጥምር ቃል ያልሆነው የቱ ነው?",
    options: [
      "ሀ. አምባሳደር",
      "ለ. መዝገበ ቃላት",
      "ሐ. ፍኖተ ካርታ",
      "መ. የቤተ-መጽሐፍት"
    ],
    correctAnswer: "ሀ",
    explanation:
      "አምባሳደር አንድ ቃል ሲሆን፤ መዝገበ ቃላትና ፍኖተ ካርታ ከሁለት ቃላት የተጣመሩ ናቸው፡፡"
  },

  {
    id: "g6a2017-29",
    question:
      "“እብድ” ለሚለው ቃል ተቃራኒ የቱ ነው?",
    options: [
      "ሀ. የተረጋጋ",
      "ለ. ወፈፌ",
      "ሐ. የተቀወሰ",
      "መ. ንክ"
    ],
    correctAnswer: "ሀ",
    explanation:
      "እብድ ማለት አእምሮው የተረበሸ ሲሆን፤ ተቃራኒው ደግሞ ጤነኛ ወይም የተረጋጋ ነው፡፡"
  },

  {
    id: "g6a2017-30",
    question:
      "የወል ስም የሆነው የቱ ነው?",
    options: [
      "ሀ. የአባይ ግድብ",
      "ለ. ህዝቅኤል",
      "ሐ. መምህር",
      "መ. አዲስ አበባ"
    ],
    correctAnswer: "ሐ",
    explanation:
      "መምህር የሚለው ስም ለሁሉም መምህራን በጋራ የሚያገለግል የወል ስም ነው፡፡"
  },

  {
    id: "g6a2017-31",
    question:
      "“መንገዶቻችን” በሚለው ቃል ውስጥ ብዙ ቁጥር አመልካች ምዕላዱ የቱ ነው?",
    options: [
      "ሀ. መንገድ",
      "ለ. -አች",
      "ሐ. -ኣችን",
      "መ. -ኦች ኣችን"
    ],
    correctAnswer: "ለ",
    explanation:
      "“-ኦች” በአማርኛ ቋንቋ የብዙ ቁጥር ምልክት ምዕላድ ነው፡፡"
  },

  {
    id: "g6a2017-32",
    question:
      "“ሙሉጌታ በፍጥነት ወደ ትምህርት ቤት ሄደ፡፡” በዚህ ዓረፍተ ነገር ውስጥ ተውሳከ ግስ የቱ ነው?",
    options: [
      "ሀ. ወደ",
      "ለ. ትምህርት ቤት",
      "ሐ. ተማሪ",
      "መ. በፍጥነት"
    ],
    correctAnswer: "መ",
    explanation:
      "“በፍጥነት ሄደ” የሚለውን ግስ ሁኔታ ስለሚገልጽ ተውሳከ ግስ ነው፡፡"
  },

  {
    id: "g6a2017-33",
    question:
      "ትክክለኛውን የእበዛዝ ሥርዓትን ተከትሎ ብዙ ቁጥር የሆነው የቱ ነው?",
    options: [
      "ሀ. ተማሪዎች",
      "ለ. አናብስቶች",
      "ሐ. ቃላቶች",
      "መ. መምህራኖች"
    ],
    correctAnswer: "ሀ",
    explanation:
      "“ተማሪ” የሚለው ቃል “ዎች” ሲጨመርበት በትክክል ይበዛል፡፡"
  },

  {
    id: "g6a2017-34",
    question:
      "ከሚከተሉት ዓረፍተ ነገሮች መካከል በኃላፊ ጊዜ የተገለጸው የቱ ነው?",
    options: [
      "ሀ. እናቴ ከነገ ወዲያ ትመጣለች፡፡",
      "ለ. በደንብ ስለእነበብኩ ፈተናውን እሰራዋለሁ፡፡",
      "ሐ. ቁርሴን በልቻለሁ፡፡",
      "መ. ልብስ እያጠብኩ ነው፡፡"
    ],
    correctAnswer: "ሐ",
    explanation:
      "“በልቻለሁ” የሚለው ድርጊቱ ተከናውኖ መጠናቀቁን ስለሚያሳይ የኃላፊ ጊዜ አመልካች ነው፡፡"
  },

  {
    id: "g6a2017-35",
    question:
      "“አቤል መጓጓዣ በመቸገሩ ወደ ክፍለ ሀገር ሳይሔድ ቀረ።” በሚለው ዓረፍተ ነገር ውስጥ የተጽዖ ስም የቱ ነው?",
    options: [
      "ሀ. መጓጓዣ",
      "ለ. አቤል",
      "ሐ. ክፍለ ሀገር",
      "መ. መቸገር"
    ],
    correctAnswer: "ሀ",
    explanation:
      "መጓጓዣ ከ“መጓዝ” ግስ የወጣ ስም በመሆኑ የተጽዖ ስም ይባላል፡፡"
  },

  {
    id: "g6a2017-36",
    question:
      "“ጎበዝ ተማሪዎች ዘወትር ያነባሉ፡፡” በሚለው ዓረፍተ ነገር ውስጥ ጊዜ አመልካች ተውሳከ ግስ የቱ ነው?",
    options: [
      "ሀ. ጎበዝ",
      "ለ. ተማሪ",
      "ሐ. ዘወትር",
      "መ. ያነባሉ"
    ],
    correctAnswer: "ሐ",
    explanation:
      "“ዘወትር” ድርጊቱ የሚከናወንበትን ጊዜ ስለሚያሳይ የጊዜ ተውሳከ ግስ ነው፡፡"
  },

  {
    id: "g6a2017-37",
    question:
      "“እኛ ተማሪዎች በርትተን በመስራት ሀገራችንን መለወጥ ይጠበቅብናል፡፡” በሚለው ውስጥ ተውላጠ ስም የሚሆነው የቱ ነው?",
    options: [
      "ሀ. ተማሪዎች",
      "ለ. በርትተን",
      "ሐ. መስራት",
      "መ. እኛ"
    ],
    correctAnswer: "መ",
    explanation:
      "“እኛ” በሰዎች ስም ምትክ የገባ ተውላጠ ስም ነው፡፡"
  },

  {
    id: "g6a2017-38",
    question:
      "“ነጭ ቀሚስ የለበሰችዋ ልጅ የምትኖረው ከእኛ ሰፈር ነው።” በዚህ ዓረፍተ ነገር ውስጥ ገላጭ (ቅጽል) ሆኖ የገባው የቱ ነው?",
    options: [
      "ሀ. ልጅ",
      "ለ. ቀሚስ",
      "ሐ. ነጭ",
      "መ. ሰፈር"
    ],
    correctAnswer: "ሐ",
    explanation:
      "“ነጭ” የሚለው ቃል የቀሚሱን ቀለም ስለሚገልጽ ቅጽል ወይም ገላጭ ቃል ነው፡፡"
  },

  {
    id: "g6a2017-39",
    question:
      "“ልጆቹ ጥሩ ውጤት አስመዝግበዋል፡፡” የሚለው ዓረፍተ ነገር የተነገረበት ጊዜ የቱ ነው?",
    options: [
      "ሀ. ሀላፊነት",
      "ለ. የአሁን ጊዜ",
      "ሐ. የወደፊት ጊዜ",
      "መ. የዘንድ አንቀጽ"
    ],
    correctAnswer: "ሀ",
    explanation:
      "“አስመዝግበዋል” የሚለው ድርጊቱ ተፈጽሞ ማለቁን ስለሚገልጽ የኃላፊ ጊዜ ነው፡፡"
  },

  {
    id: "g6a2017-40",
    question:
      "ቀጥተኛ ያልሆነ (ተገብሮ) አገላለጽ የቱ ነው?",
    options: [
      "ሀ. ሐኪሙ ህመምተኞቹን እያገላበጠ መረመራቸው፡፡",
      "ለ. እናቴ ምሳዬን ሰጠችኝ።",
      "ሐ. መምህራችን ለተሳሳትንባቸው ጥያቄዎች እርማት ሰጡን፡፡",
      "መ. ተዘበራርቀው የተቀመጡት ወንበሮች በአስተናጋጁ ተስተካከሉ፡፡"
    ],
    correctAnswer: "መ",
    explanation:
      "ድርጊቱ የተከናወነበት “በአስተናጋጁ” በሚል ተገብሮ (Passive) ስለቀረበ ቀጥተኛ ያልሆነ አገላለጽ ይባላል፡፡"
  }
    
],
  "grade6-2017-english": [
  {
    id: "g6e2017-4",
    question:
      'What does the pronoun "they" in paragraph 3, line 2 refer to?',
    options: [
      "A. Apps and websites",
      "B. Teachers",
      "C. Students",
      "D. Skills"
    ],
    correctAnswer: "C",
    explanation:
      'The sentence says, "they can search for answers on their own." The previous sentence identifies students as the ones becoming independent learners. Therefore, "they" refers to students.'
  },

  {
    id: "g6e2017-5",
    question:
      'What does "it" in paragraph 5, line 2 refer to?',
    options: [
      "A. Education",
      "B. Learning",
      "C. Technology",
      "D. Knowledge"
    ],
    correctAnswer: "C",
    explanation:
      'The passage says technology is a powerful tool and then says students should learn to use "it" responsibly. The pronoun "it" refers to technology.'
  },

  {
    id: "g6e2017-6",
    question:
      'What does "balanced way" mean in paragraph 4, line 1?',
    options: [
      "A. Spend all day outside.",
      "B. Focus only on studying.",
      "C. Use technology all the time.",
      "D. Manage time between online and offline activities"
    ],
    correctAnswer: "D",
    explanation:
      'The passage explains balance as making time for outdoor activities, exercise, and family while avoiding too much time online.'
  },

  {
    id: "g6e2017-7",
    question:
      '"Teachers can also use technology to create more engaging lessons." What does "engaging" mean in the sentence?',
    options: [
      "A. Interesting and exciting",
      "B. Boring and hard",
      "C. Expensive and unnecessary",
      "D. Quick and easy"
    ],
    correctAnswer: "A",
    explanation:
      '"Engaging" describes something that holds a person’s attention and interest. In education, an engaging lesson is interesting and enjoyable.'
  },

  {
    id: "g6e2017-8",
    question:
      'What does "independent" mean in the sentence "Technology also helps students become more independent learners"?',
    options: [
      "A. Depend on others for help",
      "B. Work and find answers on their own",
      "C. Only learn in groups",
      "D. Avoid studying"
    ],
    correctAnswer: "B",
    explanation:
      'The passage explains that independent learners can search for answers on their own instead of always waiting for a teacher.'
  },

  {
    id: "g6e2017-9",
    question:
      '"Finally, while technology is a powerful tool for education, students should learn to use it responsibly." What does "responsibly" mean in the sentence?',
    options: [
      "A. Carelessly and without thinking",
      "B. In a safe and thoughtful way",
      "C. To play games and chat online",
      "D. To spend all day on devices"
    ],
    correctAnswer: "B",
    explanation:
      'The passage connects responsibility with avoiding distractions and using technology wisely for helpful purposes.'
  },

  {
    id: "g6e2017-10",
    question:
      "Teacher: What do you do every day?\nStudent: I ______ a book every day.",
    options: [
      "A. am reading",
      "B. will read",
      "C. reads",
      "D. read"
    ],
    correctAnswer: "D",
    explanation:
      'The phrase "every day" shows a daily habit, so the Simple Present is required. With "I," we use the base form "read."'
  },

  {
    id: "g6e2017-12",
    question:
      "Teacher: Do I need to bring my lunch today?\nStudent: Yes, you ______ bring your lunch today because there is no food at school.",
    options: [
      "A. has",
      "B. have to",
      "C. have",
      "D. has to"
    ],
    correctAnswer: "B",
    explanation:
      '"Have to" expresses necessity or obligation. With the subject "you," the correct form is "have to."'
  },

  {
    id: "g6e2017-13",
    question:
      "Student A: I have never visited the zoo.\nStudent B: Oh, really? I ______ (not/visit) the zoo either.",
    options: [
      "A. have not visited",
      "B. did not visit",
      "C. have visited",
      "D. visit"
    ],
    correctAnswer: "A",
    explanation:
      'Student A uses the Present Perfect, so Student B should also use the Present Perfect. "Have not visited" is the correct negative form for "I."'
  },

  {
    id: "g6e2017-14",
    question:
      "Student A: ______ you ______ (finish) your homework yet?\nStudent B: I have already finished my homework.",
    options: [
      "A. Do/finish",
      "B. Did/finish",
      "C. Have/finished",
      "D. Have/finish"
    ],
    correctAnswer: "C",
    explanation:
      'The word "yet" commonly appears in Present Perfect questions. The correct structure is "Have + subject + past participle"; "finished" is the past participle.'
  },

  {
    id: "g6e2017-15",
    question:
      "Student A: Who will send the letter?\nStudent B: The letter ______ (send) by the post office tomorrow.",
    options: [
      "A. sent",
      "B. will send",
      "C. is sent",
      "D. will be sent"
    ],
    correctAnswer: "D",
    explanation:
      'The letter receives the action, so the sentence is passive. For the Future Passive, use "will + be + past participle": "will be sent."'
  },

  {
    id: "g6e2017-16",
    question:
      "Student A: I will study for the test tonight.\nStudent B: I ______ (practice) the piano later.",
    options: [
      "A. will practice",
      "B. practice",
      "C. is practicing",
      "D. practiced"
    ],
    correctAnswer: "A",
    explanation:
      'The word "later" refers to a future time. "Will practice" is the correct Simple Future form with the subject "I."'
  },

  {
    id: "g6e2017-17",
    question:
      "Student A: This book is good, but the other one is better.\nStudent B: Yes, but the first book is the ______ of the three.",
    options: [
      "A. good",
      "B. better",
      "C. best",
      "D. more better"
    ],
    correctAnswer: "C",
    explanation:
      'When comparing three or more things, we use the superlative. The superlative of "good" is "best."'
  },

  {
    id: "g6e2017-18",
    question:
      "Student A: This car is fast, but the red one is faster.\nStudent B: I agree, but the blue car is the ______ of all.",
    options: [
      "A. fastest",
      "B. faster",
      "C. most fast",
      "D. fast"
    ],
    correctAnswer: "A",
    explanation:
      'When comparing more than two things, we use the superlative. For "fast," the superlative is "fastest."'
  },

  {
    id: "g6e2017-19",
    question:
      "Student A: I am going to Addis Ababa next week.\nStudent B: Wow! I heard Addis Ababa is a beautiful city. Is it your first time there? Which of the following is a proper noun in this dialogue?",
    options: [
      "A. city",
      "B. week",
      "C. Addis Ababa",
      "D. heard"
    ],
    correctAnswer: "C",
    explanation:
      'A proper noun is the specific name of a person, place, or organization. "Addis Ababa" is the specific name of a city.'
  },

  {
    id: "g6e2017-20",
    question:
      "Student A: She writes a letter to her friend every week.\nStudent B: The letter ______ (write) by her every week.",
    options: [
      "A. writes",
      "B. was written",
      "C. will be written",
      "D. is written"
    ],
    correctAnswer: "D",
    explanation:
      'The original sentence is Simple Present. The Present Passive uses "is/am/are + past participle." Therefore, "is written" is correct.'
  },

  {
    id: "g6e2017-21",
    question:
      "Student A: If it rains tomorrow, I will stay at home.\nStudent B: But if it ______, we can go outside.",
    options: [
      "A. does not rain",
      "B. did not rain",
      "C. will not rain",
      "D. has not rained"
    ],
    correctAnswer: "A",
    explanation:
      'This is a First Conditional sentence. The if-clause uses the Simple Present, so "does not rain" is correct.'
  },

  {
    id: "g6e2017-22",
    question:
      "Student A: I love playing football with my friends.\nStudent B: I also enjoy playing football. It is so much fun! Which sentence shows the correct way to express liking something?",
    options: [
      "A. I dislike playing football.",
      "B. I enjoy playing football.",
      "C. I hate playing football.",
      "D. I never play football."
    ],
    correctAnswer: "B",
    explanation:
      '"Enjoy" expresses liking or finding an activity pleasurable.'
  },

  {
    id: "g6e2017-23",
    question:
      "Student A: Excuse me, can you tell me how to get to the library?\nStudent B: Sure! Go straight, and then turn left at the traffic light. The library is on your right. Which of the following correctly describes the directions?",
    options: [
      "A. Turn right at the traffic light, and then go straight.",
      "B. Go straight, then turn left, and the library will be on the left.",
      "C. Go straight, turn left at the traffic light, and the library will be on your right.",
      "D. Go left, then turn right, and the library is on your left."
    ],
    correctAnswer: "C",
    explanation:
      'Option C repeats the exact sequence given: go straight, turn left at the traffic light, and the library is on the right.'
  },

  {
    id: "g6e2017-24",
    question:
      "Student A: I think the movie was great! The acting was amazing.\nStudent B: I agree with you. I also think the special effects were fantastic. Which expresses Student B's opinion?",
    options: [
      "A. I think the movie was boring.",
      "B. I believe the movie was too long.",
      "C. I did not like the movie.",
      "D. I agree with you. The special effects were fantastic."
    ],
    correctAnswer: "D",
    explanation:
      'Student B agrees with Student A and describes the special effects as fantastic, showing a positive opinion.'
  },

  {
    id: "g6e2017-25",
    question:
      "Student A: I believe that eating healthy food is very important for our health.\nStudent B: I totally agree with you. Eating healthy food gives us energy and keeps us strong. How does Student B express agreement?",
    options: [
      "A. Student B disagrees with Student A.",
      "B. Student B agrees and gives reasons.",
      "C. Student B changes the topic to something else.",
      "D. Student B says he/she does not know much about the topic."
    ],
    correctAnswer: "B",
    explanation:
      'Student B says "I totally agree with you" and then gives reasons: healthy food gives energy and keeps us strong.'
  },

  {
    id: "g6e2017-26",
    question:
      "She ______ when I called her last night.",
    options: [
      "A. was studying",
      "B. studied",
      "C. has studied",
      "D. is studying"
    ],
    correctAnswer: "A",
    explanation:
      'The action "was studying" was in progress when the shorter past action "I called her" happened. Therefore, Past Continuous is required.'
  },

  {
    id: "g6e2017-27",
    question:
      "I was walking in the park when it ______ raining.",
    options: [
      "A. was starting",
      "B. starts",
      "C. starting",
      "D. started"
    ],
    correctAnswer: "D",
    explanation:
      '"Was walking" is the continuous past action, while "started" is the shorter action that happened at that time.'
  },

  {
    id: "g6e2017-28",
    question:
      "If I were rich, I ______ travel around the world.",
    options: [
      "A. am",
      "B. are",
      "C. will",
      "D. would"
    ],
    correctAnswer: "D",
    explanation:
      'This is the Second Conditional: If + past form, would + base verb. Therefore, "would travel" is correct.'
  },

  {
    id: "g6e2017-29",
    question:
      "She sang the song beautifully. Which word in the sentence is an adverb of manner?",
    options: [
      "A. the song",
      "B. sang",
      "C. beautifully",
      "D. song"
    ],
    correctAnswer: "C",
    explanation:
      '"Beautifully" describes how she sang, so it is an adverb of manner.'
  },

  {
    id: "g6e2017-30",
    question:
      "I need a new toothbrush. My old one is broken. Which of the following is a compound noun?",
    options: [
      "A. new",
      "B. toothbrush",
      "C. broken",
      "D. old one"
    ],
    correctAnswer: "B",
    explanation:
      '"Toothbrush" is a compound noun formed from "tooth" + "brush."'
  },

  {
    id: "g6e2017-31",
    question:
      "Which of the following sentences is correctly written in the passive voice?",
    options: [
      "A. A new school was built by them last year.",
      "B. A new school built by them last year.",
      "C. A new school is built last year by them.",
      "D. A new school were built by them last year."
    ],
    correctAnswer: "A",
    explanation:
      'Past Passive uses "was/were + past participle." "A new school was built" is correct because "school" is singular.'
  },

  {
    id: "g6e2017-32",
    question:
      "Which one of the following sentences is constructed in the negative form of Present Perfect tense?",
    options: [
      "A. I have not finished my homework.",
      "B. I did not finish my homework.",
      "C. I am not finishing my homework.",
      "D. I will not finish my homework."
    ],
    correctAnswer: "A",
    explanation:
      'The Present Perfect uses "have/has + past participle." The negative form places "not" after have/has.'
  },

  {
    id: "g6e2017-33",
    question:
      "Which sentence is written in the Present Perfect interrogative form?",
    options: [
      "A. Did he gone to school?",
      "B. Has he gone to school?",
      "C. He does not go to school.",
      "D. Is he going to school?"
    ],
    correctAnswer: "B",
    explanation:
      'Present Perfect questions begin with "Have/Has," followed by the subject and past participle. Therefore, "Has he gone to school?" is correct.'
  },

  {
    id: "g6e2017-34",
    question:
      "Identify the Simple Future Passive sentence.",
    options: [
      "A. The students complete the project next week.",
      "B. The students will complete the project next week.",
      "C. The project completed by the students next week.",
      "D. The project will be completed by the students next week."
    ],
    correctAnswer: "D",
    explanation:
      'Simple Future Passive uses "will be + past participle." Therefore, "will be completed" is correct.'
  },

  {
    id: "g6e2017-35",
    question:
      "Which of the following sentences is in the Simple Future Passive tense?",
    options: [
      "A. The letter will be sent by the post office.",
      "B. The post office will send the letter.",
      "C. The letter is being sent by the post office.",
      "D. The letter was sent by the post office."
    ],
    correctAnswer: "A",
    explanation:
      '"Will be sent" is the Simple Future Passive form.'
  },

  {
    id: "g6e2017-36",
    question:
      "Which sentence is written in the First Conditional form?",
    options: [
      "A. If it rained tomorrow, I will stay home.",
      "B. If it rains tomorrow, I stayed home.",
      "C. If it rains tomorrow, I will stay home.",
      "D. If it will rain tomorrow, I would stay home."
    ],
    correctAnswer: "C",
    explanation:
      'The First Conditional uses If + Simple Present + will + base verb. Option C follows this structure.'
  },

  {
    id: "g6e2017-37",
    question:
      "Which sentence is written in the Second Conditional form?",
    options: [
      "A. If I had you, I would study harder.",
      "B. If I would be you, I will study harder.",
      "C. If I am you, I will study harder.",
      "D. If I were you, I would study harder."
    ],
    correctAnswer: "D",
    explanation:
      'The Second Conditional uses If + past form, would + base verb. "If I were you, I would study harder" follows this structure.'
  },

  {
    id: "g6e2017-38",
    question:
      "I went to the supermarket, and I bought apples bananas grapes and oranges. Which punctuation mark is used to separate items in a list?",
    options: [
      "A. Period (.)",
      "B. Comma (,)",
      "C. Colon (:)",
      "D. Semicolon (;)"
    ],
    correctAnswer: "B",
    explanation:
      'Commas are used to separate three or more items in a list, such as "apples, bananas, grapes, and oranges."'
  },

  {
    id: "g6e2017-39",
    question:
      "Which of the following is a simple sentence?",
    options: [
      "A. I love reading books, but I also enjoy watching movies.",
      "B. She goes to the park every day.",
      "C. He went to the store, and she stayed home.",
      "D. I like pizza, so I eat it every weekend."
    ],
    correctAnswer: "B",
    explanation:
      'A simple sentence contains one independent clause. Option B has one subject and one main action.'
  },

  {
    id: "g6e2017-40",
    question:
      'Which of the following properly joins these two simple sentences into a compound sentence? "I went to bed early. I finished my homework."',
    options: [
      "A. I finished my homework because I went to bed early.",
      "B. I went to bed early because I finished my homework.",
      "C. I finished my homework, and I went to bed early.",
      "D. I finished my homework, after I went to bed early."
    ],
    correctAnswer: "C",
    explanation:
      'A compound sentence joins two independent clauses with a comma and a coordinating conjunction such as "and." Option C does this correctly.'
  }
],
  "grade6-2017-environmental-science": [
  {
    id: "g6es2017-4",
    question:
      "ተማሪ መስፍን የኢትዮጵያን ንድፍ ካርታ ሲስራ የትግራይ ክልል ከአዲስ አበባ ጋር ያለውን አንጻራዊ መገኛ ለማሳየት የሚያስፈልገው ምንድን ነው?",
    options: [
      "ሀ. ትግራይን ከአዲስ አበባ ደቡብ-ምሥራቅ ላይ ማስቀመጥ",
      "ለ. ትግራይን ከአዲስ አበባ ሰሜን-ምዕራብ ላይ ማስቀመጥ",
      "ሐ. ትግራይን ከአዲስ አበባ ደቡብ-ምሥራቅ ላይ ማስቀመጥ",
      "መ. ትግራይን ከአዲስ አበባ ሰሜን ላይ ማስቀመጥ"
    ],
    correctAnswer: "መ",
    explanation:
      "አንጻራዊ መገኛ የሚገለጸው በአቅጣጫዎች ነው፡፡ የትግራይ ክልል ከአዲስ አበባ በሰሜን በኩል ይገኛል፡፡"
  },

  {
    id: "g6es2017-5",
    question:
      "ቁስ አካል ምን ማለት ነው?",
    options: [
      "ሀ. ማንኛውም ቦታ የሚይዝና መጠነ-ቁስ ያለው",
      "ለ. ቀለም ወይም ግርዶሽ ያለው",
      "ሐ. ኃይል የሚፈጥር",
      "መ. ቅርጽ ወይም መጠን ያለው"
    ],
    correctAnswer: "ሀ",
    explanation:
      "ቁስ አካል ማለት መጠነ-ቁስ ያለውና ቦታ የሚይዝ ነገር ነው፡፡"
  },

  {
    id: "g6es2017-6",
    question:
      "ሁለትና ከሁለት በላይ ከሆነ ንጥረ ነገሮች በኬሚካዊ መስተጋብርየሚፈጠር ልዩ ቁስ የሆነው የቱ ነው?",
    options: [
      "ሀ. ቤዝ",
      "ለ. ጨው",
      "ሐ. ውህድ",
      "መ. ኦክሳይዶች"
    ],
    correctAnswer: "ሐ",
    explanation:
      "ሁለት ወይም ከሁለት በላይ ንጥረ ነገሮች በኬሚካዊ መስተጋብር ሲጣመሩ ውህድ ይፈጠራል፡፡"
  },

  {
    id: "g6es2017-7",
    question:
      "አሲድ ከቤዝ ጋር ሲፀገበር ምን ይፈጠራል?",
    options: [
      "ሀ. እክሳይድ",
      "ለ. ጨው",
      "ሐ. ቤዝ",
      "መ. አሲድ"
    ],
    correctAnswer: "ለ",
    explanation:
      "አሲድ ከቤዝ ጋር ሲገናኝ የጨውና የውሃ መፈጠርን የሚያመጣ የneutralization ሂደት ይከሰታል፡፡"
  },

  {
    id: "g6es2017-8",
    question:
      "የጉልበት ምንጭ የሆነው የቱ ነው?",
    options: [
      "ሀ. ውሃ",
      "ለ. ፕላስቲክ",
      "ሐ. ብርጭቆ",
      "መ. ወረቀት"
    ],
    correctAnswer: "ሀ",
    explanation:
      "ውሃ የኃይል ምንጭ ሲሆን በውሃ ኃይል ኤሌክትሪክ ማመንጨት ይቻላል፡፡"
  },

  {
    id: "g6es2017-9",
    question:
      "ድምጽ በየትኛው ቁስ በፍጥነት ይተላለፋል?",
    options: [
      "ሀ. በአየር",
      "ለ. በውሃ",
      "ሐ. በብረት",
      "መ. በባዶ"
    ],
    correctAnswer: "ሐ",
    explanation:
      "ድምጽ በጠንካራ ቁሶች ውስጥ ከፈሳሽና ከጋዝ ይልቅ በፍጥነት ይተላለፋል፡፡"
  },

  {
    id: "g6es2017-10",
    question:
      "ከሚከተሉት ውስጥ በኢትዮጵያ ከዋና ዋና የአየር ንብረት ዓይነቶች ውስጥ የሚመደበው የቱ ነው?",
    options: [
      "ሀ. ሞቃታማ እና ደረቃማ",
      "ለ. ቀዝቃዛ እና እርጥበታማ",
      "ሐ. ሞቃታማ እና እርጥበታማ",
      "መ. ሞቃታማ እና ደረቅ"
    ],
    correctAnswer: "ሐ",
    explanation:
      "በኢትዮጵያ የሚገኙ የአየር ንብረት ዓይነቶች ከሙቀትና ከዝናብ መጠን ጋር የተያያዙ ናቸው፡፡"
  },

  {
    id: "g6es2017-11",
    question:
      "የኢትዮጵያን የእየር ንብረት በዋናነት የሚቆጣጠረው ምንድነው?",
    options: [
      "ሀ. የውቅያኖስ ፍሰቶች",
      "ለ. ከኢኳተር ርቀት",
      "ሐ. የአፈር አይነት",
      "መ. ኤክሮስ እና ከፍታ"
    ],
    correctAnswer: "መ",
    explanation:
      "ከፍታ በኢትዮጵያ የአየር ንብረት ላይ ትልቅ ተጽዕኖ ያለው ሲሆን ከፍታ ሲጨምር የሙቀት መጠን ይቀንሳል፡፡"
  },

  {
    id: "g6es2017-12",
    question:
      "በኢትዮጵያ ስምጥ ሸለቆ ውስጥ የሚገኙ ሐይቆች የተለመደ ባህሪአቸው የሆነው ?",
    options: [
      "ሀ. ሁሉም የጣፋጭ ውሃ ሐይቆች ናቸው",
      "ለ. ከፍተኛ ቦታዎች ላይ ይገኛሉ",
      "ሐ. ዝቅተኛ ቦታዎች ላይ እና ብዙውን ጊዜ ጠባብ ናቸው",
      "መ. በየወቅቱ በሚከሰት ለውጥ አይጎዱም"
    ],
    correctAnswer: "ሐ",
    explanation:
      "የስምጥ ሸለቆ ሐይቆች በዝቅተኛ ቦታዎች ላይ የሚገኙ ሲሆን ብዙዎቹ ጠባብ ናቸው፡፡"
  },

  {
    id: "g6es2017-13",
    question:
      "ለአካባቢ ብክለት ዋና ምክንያቶች የትኞቹ ናቸው?",
    options: [
      "ሀ. ዛፎችን መትከልና መንከባከብ",
      "ለ. ፕላስቲክና ቆሻሻን በአግባቡ አለመጣል",
      "ሐ. እንደገና መጠቀምና ማደስ",
      "መ. ሀብትን በአግባቡ መጠቀም"
    ],
    correctAnswer: "ለ",
    explanation:
      "ፕላስቲክና ቆሻሻን በአግባቡ አለመጣል ለአካባቢ ብክለት ዋና ምክንያት ነው፡፡"
  },

  {
    id: "g6es2017-14",
    question:
      "በሰሜን ኢትዮጲያ በጣም የተለመዱ ባህላዊ ክንዋኔዎች የሆኑት የትኛዎቹ ናቸው?",
    options: [
      "ሀ. ገና እና ቡሄ",
      "ለ. አሸንዳ፣ ሻደይ እና ሶለል",
      "ሐ. ጨምበላላ እና የለቅሶ ሥነ-ሥርዓቶች",
      "መ. የሰርግ ሥነ ሥርዓቶች እና በዓላት"
    ],
    correctAnswer: "ለ",
    explanation:
      "አሸንዳ፣ ሻደይ እና ሶለል በሰሜን ኢትዮጵያ ከሚታወቁ ባህላዊ ክንዋኔዎች መካከል ናቸው፡፡"
  },

  {
    id: "g6es2017-15",
    question:
      "የኢትዮጵያ የቋንቋ ቤተሰብ የሆነው የትኛው ነው?",
    options: [
      "ሀ. Indo-European/Sino-Tibetan",
      "ለ. Austronesian/Niger-Congo",
      "ሐ. Afro-Asiatic/Nilo-Saharan",
      "መ. Dravidian/Uralic"
    ],
    correctAnswer: "ሐ",
    explanation:
      "የኢትዮጵያ ቋንቋዎች በዋናነት ከAfro-Asiatic እና Nilo-Saharan የቋንቋ ቤተሰቦች ጋር ይያያዛሉ፡፡"
  },

  {
    id: "g6es2017-16",
    question:
      "የኢትዮጵያ የተፈጥሮ የቱሪስት መስህብ የሆነው የትኛው ነው?",
    options: [
      "ሀ. ታሪካዊ ቦታዎች እንደ ላሊበላ",
      "ለ. ባህላዊ ቅርሶችና የእደ ጥበብ ሥራዎች",
      "ሐ. ሙዚየሞችና መታሰቢያዎች",
      "መ. ልዩ የመሬት አቀማመጥ"
    ],
    correctAnswer: "መ",
    explanation:
      "ልዩ የመሬት አቀማመጥ የተፈጥሮ የቱሪስት መስህብ ሲሆን የኢትዮጵያ ልዩ የመሬት አቀማመጦች ቱሪስቶችን ይስባሉ፡፡"
  },

  {
    id: "g6es2017-17",
    question:
      "የቱሪዝም ኢንዱስትሪን የሚጎዳ ተግዳሮት የሆነው የትኛው ነው?",
    options: [
      "ሀ. የመስህቦች ደካማ ማስተዋወቅና ግብይት",
      "ለ. የቱሪስቶች መጨመር",
      "ሐ. ከፍተኛ የመጓጓዣ ወጪ",
      "መ. ብዙ የአገር ውስጥ ባህላዊ በዓላት"
    ],
    correctAnswer: "ሀ",
    explanation:
      "የቱሪስት መስህቦች በቂ በሆነ መልኩ አለመተዋወቃቸውና አለመስተዋወቃቸው የቱሪዝም ኢንዱስትሪን የሚጎዳ ተግዳሮት ነው፡፡"
  },

  {
    id: "g6es2017-18",
    question:
      "በሀገራችን የሚገኙ ጎጂ ልማዳዊ ድርጊቶች የትኞቹ ናቸው?",
    options: [
      "ሀ. የአበባ በዓል",
      "ለ. ባህላዊ ሙዚቃ",
      "ሐ. የዕለት ገበያ ጉብኝት",
      "መ. የሴት ልጅ ግርዛት"
    ],
    correctAnswer: "መ",
    explanation:
      "የሴት ልጅ ግርዛት ጎጂ ልማዳዊ ድርጊት ነው፡፡"
  },

  {
    id: "g6es2017-19",
    question:
      "በኢትዮጵያ የድርቅ ምክንያት የሆነው የቱ ነው?",
    options: [
      "ሀ. የዝናብ መጨመር",
      "ለ. የደን መስፋፋት",
      "ሐ. የአየር ንብረት/የአየር ሁኔታ ለውጥ",
      "መ. የውሃ ሀብት አስተዳደር መሻሻል"
    ],
    correctAnswer: "ሐ",
    explanation:
      "የአየር ንብረትና የአየር ሁኔታ ለውጥ ለድርቅ መከሰት ከሚያበረክቱ ምክንያቶች ናቸው፡፡"
  },

  {
    id: "g6es2017-20",
    question:
      "በበለጸጉ ሀገራት ድርቅ ከተከሰተ በኋላ ረሀብ የማይከሰትባቸው ምክንያት ምንድን ነው?",
    options: [
      "ሀ. መሰረታዊ ፍላጎቶችን በተለያዩ የኢኮኖሚ እንቅስቃሴዎች ማሟላት ስለሚችሉ",
      "ለ. ሙሉ በሙሉ በግብርና ላይ ስለሚመሰረቱ",
      "ሐ. ድርቅ በጭራሽ ስለማይከሰት",
      "መ. ምግብን በሙሉ ከውጭ ስለሚያስገቡ"
    ],
    correctAnswer: "ሀ",
    explanation:
      "የበለጸጉ ሀገራት ኢኮኖሚያቸው የተለያዩ በመሆኑ መሰረታዊ ፍላጎቶቻቸውን ከተለያዩ የኢኮኖሚ እንቅስቃሴዎች ማሟላት ይችላሉ፡፡"
  },

  {
    id: "g6es2017-21",
    question:
      "ካርታን በማንበብ እና በመጠቀም ምን መረጃ መለዋወጥ ይቻላል?",
    options: [
      "ሀ. የገንዘብ ሂሳቦች",
      "ለ. የመሬት አቀማመጥ/የመሬት ቅርጾች",
      "ሐ. ሰው ሰራሽ ምልከታዎች",
      "መ. የአመጋገብ መረጃ"
    ],
    correctAnswer: "ለ",
    explanation:
      "ካርታ የመሬት አቀማመጥን፣ የመሬት ቅርጾችን እና ሌሎች የጂኦግራፊያዊ መረጃዎችን ለማሳየት ይረዳል፡፡"
  },

  {
    id: "g6es2017-22",
    question:
      "ከበደ አንድን ሀገር በአፍሪካ ካርታ ላይ ለማሳየት ከ15° ደቡብ ኬክሮስ እና 45 ምሥራቅ ኬንትሮስ መጠኖችን ተጠቅሟል:: ይህ ሀገር በምን ዓይነት ክልል ውስጥ ይገኛል?",
    options: [
      "ሀ. ሰሜን አፍሪካ",
      "ለ. ምዕራብ አፍሪካ",
      "ሐ. ምሥራቅ አፍሪካ",
      "መ. ደቡብ አፍሪካ"
    ],
    correctAnswer: "ሐ",
    explanation:
      "15° ደቡብ ኬክሮስ እና 45° ምሥራቅ ኬንትሮስ በምሥራቅ አፍሪካ አካባቢ ይገኛሉ፡፡"
  },

  {
    id: "g6es2017-23",
    question:
      "አለማየሁ የምስራቅ አፍሪካ ሀገራትን በአፍሪካ ካርታ ላይለማሳየት ኬክሮስ (ላቲቱድ) እና ኬክሮስ (ሎንግቱድ) በመጠቀም እየሰራ ነው፡፡ ከታች ከተሰጡት መጠኖች ውስጥ የትኛው ለኬንያ ትክክለኛ መገኛ ይሆናል?",
    options: [
      "ሀ. 5 N; 38 E",
      "ለ. 10 S; 15 W",
      "ሐ. 25 N; 55 E",
      "መ. 30 S; 10 W"
    ],
    correctAnswer: "ሀ",
    explanation:
      "የኬንያ መገኛ በአጠቃላይ 5° ሰሜን እና 38° ምሥራቅ አካባቢ ነው፡፡"
  },

  {
    id: "g6es2017-24",
    question:
      "በምሥራቅ አፍሪካ አጎራባች ሀገራት ዝርዝር ውስጥ የተካተተው ሀገር የትኛው ነው?",
    options: [
      "ሀ. ኢትዮጵያ",
      "ለ. ሶማሊያ",
      "ሐ. ሱዳን",
      "መ. ኬንያ"
    ],
    correctAnswer: "ሀ/ለ/ሐ/መ",
    explanation:
      "ኢትዮጵያ፣ ሶማሊያ፣ ሱዳን እና ኬንያ በምሥራቅ አፍሪካ የሚካተቱ ሀገራት ናቸው፡፡"
  },

  {
    id: "g6es2017-25",
    question:
      "ዋና ዋና የደም ህዋሶች የሆኑት የትኞቹ ናቸው?",
    options: [
      "ሀ. ፕላዝማ/ኦክሲጅን/ካርቦን ዳይኦክሳይድ",
      "ለ. ቀይ የደም ህዋሶች፣ ነጭ የደም ህዋሶች እና ፕሌትሌቶች",
      "ሐ. ፕላዝማ/ፕሌትሌቶች/ሄሞግሎቢን",
      "መ. ውሃ/ንጥረ ምግቦች/ተህዋሲያን"
    ],
    correctAnswer: "ለ",
    explanation:
      "ዋና ዋና የደም ህዋሶች ቀይ የደም ህዋሶች፣ ነጭ የደም ህዋሶች እና ፕሌትሌቶች ናቸው፡፡"
  },

  {
    id: "g6es2017-26",
    question:
      "ከተሰጡት የጉልበት ምንጮች መካከል የቱ ታዳሽ የጉልበት ምንጮችን ብቻ ያካትታል?",
    options: [
      "ሀ. ሶላር/ንፋስ/ባትሪ ድንጋይ",
      "ለ. ሶላር/ንፋስ/የሚፈስ ውሃ",
      "ሐ. የማገዶ እንጨት/የተፈጥሮ ጋዝ/ከሰል",
      "መ. ቤንዚን/ነጭ ጋዝ/ኤሌክትሪክ"
    ],
    correctAnswer: "ለ",
    explanation:
      "ሶላር፣ ንፋስ እና የሚፈስ ውሃ ታዳሽ የኃይል ምንጮች ናቸው፡፡"
  },

  {
    id: "g6es2017-27",
    question:
      "የቀላል መኪናዎች ዋና ዓላማቸው ምንድነው?",
    options: [
      "ሀ. ኃይልን መጨመር",
      "ለ. የጊዜ ፍጆታን መጨመር",
      "ሐ. የነዳጅ ፍጆታን መቀነስ",
      "መ. ሥራን ማቅለል"
    ],
    correctAnswer: "መ",
    explanation:
      "ቀላል መኪናዎች ዋና ዓላማቸው ሥራን ማቅለል ነው፡፡"
  },

  {
    id: "g6es2017-28",
    question:
      "በምሥራቅ አፍሪካ ክፍሎች ውስጥ ከሰኔ እስከ መስከረም ባለው ወቅት በየትኛው አካባቢ ዝናብ ይከሰታል?",
    options: [
      "ሀ. ኢኳቶሪያል ሀገራት",
      "ለ. ሰሜናዊ ምሥራቅ አፍሪካ",
      "ሐ. ከኢኳተር በስተደቡብ ያሉ ሀገራት",
      "መ. ደረቃማ ክልሎች"
    ],
    correctAnswer: "ለ",
    explanation:
      "ከሰኔ እስከ መስከረም ባለው ወቅት በሰሜናዊ ምሥራቅ አፍሪካ የዝናብ ወቅት ይከሰታል፡፡"
  },

  {
    id: "g6es2017-29",
    question:
      "ከምሥራቅ አፍሪካ ሀገራት ውስጥ የትኛው በብረት እና በወርቅ ማዕድናት ይታወቃል?",
    options: [
      "ሀ. ኢትዮጵያ",
      "ለ. ሶማሊያ",
      "ሐ. ኡጋንዳ",
      "መ. ቡሩንዲ"
    ],
    correctAnswer: "ሀ/ሐ",
    explanation:
      "ኢትዮጵያ በወርቅ ማዕድን ትታወቃለች፣ ኡጋንዳም የተለያዩ ማዕድናት ያሏት ሀገር ናት፡፡"
  },

  {
    id: "g6es2017-30",
    question:
      "የአፈር መሸርሸርን ለመከላከል ከሚጠቅሙ ዘዴዎች ውስጥ የትኛው ዘዴ ዘሮችን በተለያዩ ዓመታት በማሳው ላይ መዝራትን ያካትታል?",
    options: [
      "ሀ. ዳግም ድነና",
      "ለ. ድነና",
      "ሐ. ዘር ማፈራረቅ",
      "መ. የእርከን ሥራ"
    ],
    correctAnswer: "ሐ",
    explanation:
      "ዘር ማፈራረቅ በተለያዩ ዓመታት በማሳው ላይ የተለያዩ ዘሮችን መዝራት ሲሆን የአፈር ጤናን ለመጠበቅ ይረዳል፡፡"
  },

  {
    id: "g6es2017-31",
    question:
      "በምሥራቅ አፍሪካ ውስጥ የሚገኝ እና በዓለም በርዝመቱ ትልቁ ወንዝ የትኛው ነው?",
    options: [
      "ሀ. ዛምቤዚ",
      "ለ. ጄናሌ",
      "ሐ. አባይ",
      "መ. ሴቤ"
    ],
    correctAnswer: "ሐ",
    explanation:
      "አባይ (Blue Nile) በምሥራቅ አፍሪካ ከሚገኙ ዋና ዋና ወንዞች አንዱ ነው፡፡"
  },

  {
    id: "g6es2017-32",
    question:
      "በምስራቅ አፍሪካ የውሃ ሃብት አጠቃቀም ዋና ፈተና የሆነው ምንድን ነው?",
    options: [
      "ሀ. የኢንዱስትሪ ብክለት",
      "ለ. ከመጠን በላይ ማጥመድ",
      "ሐ. የኢኳቶሪያል መሬት ምልክት",
      "መ. የደን መትከል"
    ],
    correctAnswer: "ሀ",
    explanation:
      "የኢንዱስትሪ ብክለት በምሥራቅ አፍሪካ የውሃ ሀብት ጥበቃና አጠቃቀም ላይ ዋና ፈተና ነው፡፡"
  },

  {
    id: "g6es2017-33",
    question:
      "ባህላዊ ቅርሶች የምጣኔ ሀብት ዕቅድን ለማሳደግ ከሚከተሉት ውስጥ የትኛውን ያካትታሉ?",
    options: [
      "ሀ. የአገር ውስጥና የውጭ ቱሪስቶችን መሳብ",
      "ለ. የውጭ ንግድ ቅናሾችን መጨመር",
      "ሐ. የግብርና ምርታማነትን መጨመር",
      "መ. የኤሌክትሪክ አጠቃቀምን መቀነስ"
    ],
    correctAnswer: "ሀ",
    explanation:
      "ባህላዊ ቅርሶች የአገር ውስጥና የውጭ ቱሪስቶችን በመሳብ ለኢኮኖሚ እድገት ያበረክታሉ፡፡"
  },

  {
    id: "g6es2017-34",
    question:
      "በምሥራቅ አፍሪካ የቱሪዝም ምጣኔ ሀብታዊ ጠቀሜታ ምንድነው?",
    options: [
      "ሀ. የመንግስት የውጭ ምንዛሪን ይቀንሳል",
      "ለ. የአካባቢ ባህልን ይጎዳል",
      "ሐ. የሥራ ዕድሎችን ይፈጥራል",
      "መ. ግብርናን ይጎዳል"
    ],
    correctAnswer: "ሐ",
    explanation:
      "ቱሪዝም በምሥራቅ አፍሪካ የሥራ ዕድሎችን በመፍጠር ለኢኮኖሚ እድገት ያበረክታል፡፡"
  },

  {
    id: "g6es2017-35",
    question:
      "በምስራቅ አፍሪካ የአትክልት እርባታ ኢንዱስትሪ የሚያጋጥመው ዋና ፈተና የሆነው የቱ ነው?",
    options: [
      "ሀ. በመጓጓዣ ወቅት በቂ የማቀዝቀዣ እጥረት",
      "ለ. ዝቅተኛ የአገር ውስጥ ፍላጎት",
      "ሐ. ከፍተኛ የሰብል ግብይት ወጪ",
      "መ. የሰለጠነ የሰው ኃይል እጥረት"
    ],
    correctAnswer: "ሀ",
    explanation:
      "በመጓጓዣ ወቅት በቂ የማቀዝቀዣ አለመኖር የአትክልት ምርቶችን ጥራት ሊያሳንስ ይችላል፡፡"
  },

  {
    id: "g6es2017-36",
    question:
      "የውስጥ ንግድ ዋናው ባህሪው ምንድን ነው?",
    options: [
      "ሀ. በአንድ አህጉር ውስጥ ባሉ ሀገራት መካከል ንግድ",
      "ለ. በአንድ ሀገር ውስጥ ባሉ ሰዎች መካከል የሚካሄድ የንግድ እንቅስቃሴ",
      "ሐ. በምሥራቅ አፍሪካና በምዕራባዊ ሀገራት መካከል ንግድ",
      "መ. ምርቶችንና ሰብሎችን የሚያካትት ንግድ"
    ],
    correctAnswer: "ለ",
    explanation:
      "የውስጥ ንግድ ማለት በአንድ ሀገር ውስጥ ባሉ ሰዎች፣ ከተሞች ወይም ክልሎች መካከል የሚካሄድ ንግድ ነው፡፡"
  },

  {
    id: "g6es2017-37",
    question:
      "ጫት ውስጥ የሚገኝ ኬሚካል ምን ይባላል?",
    options: [
      "ሀ. ኒኮቲን",
      "ለ. ካቲኒን",
      "ሐ. ሞርፊን",
      "መ. ኢታኖል"
    ],
    correctAnswer: "ለ",
    explanation:
      "ጫት ውስጥ ካቲኖን (Cathinone) የተባለ አነቃቂ ኬሚካል ይገኛል፡፡"
  },

  {
    id: "g6es2017-38",
    question:
      "ድርቅ የሚለው ቃል ዋናው ትርጉም ምንድን ነው?",
    options: [
      "ሀ. ድንገተኛ ዝናብ",
      "ለ. እንደ ካንሰር መስፋፋት",
      "ሐ. ያልተለመደ የዝናብ እጥረት / ረዥም ጊዜ ያለ ዝናብ",
      "መ. የምግብ ምርት መጨመር"
    ],
    correctAnswer: "ሐ",
    explanation:
      "ድርቅ ማለት ያልተለመደ የዝናብ እጥረት ወይም ረዥም ጊዜ ዝናብ ሳይኖር መቆየት ነው፡፡"
  },

  {
    id: "g6es2017-39",
    question:
      "በምስራቅ አፍሪካ የአፈር መሸርሸር በመጨመር እና የአካባቢውን የውሃ ዑደት በማዛባት ድርቅን የሚያስከትለው የቱ ነው ?",
    options: [
      "ሀ. የደን መውደም",
      "ለ. የኢንዱስትሪ መቀነስ",
      "ሐ. ከመጠን በታች በእንስሳት ማስጋጥ",
      "መ. የህዝብ ቁጥር መቀነሰ"
    ],
    correctAnswer: "ሀ",
    explanation:
      "የደን መውደም የአፈር መሸርሸርን በመጨመር እና የውሃ ዑደትን በማዛባት ለድርቅ እንዲከሰት ሊያደርግ ይችላል፡፡"
  },

  {
    id: "g6es2017-40",
    question:
      "የምስራቅ አፍሪካ አገሮች(ኢትዮጵያ፣ሶማሊያ፣ኡጋንዳ፤ኬኒያ ፣ጂቡቲ) እንደ ድርቅ ተጋላጭ ክልሎች የሚያገናኛቸው የጂኦግራፊያዊ ባህሪ ምንድን ነው?",
    options: [
      "ሀ. የሆርን ኦፍ አፍሪካ እና የምሥራቅ አፍሪካ ስምጥ ሸለቆ",
      "ለ. የሳሃራ በረሃ",
      "ሐ. የአትላንቲክ የባህር ዳርቻ",
      "መ. በሞቃታማ ደን ላይ መመርኮዝ"
    ],
    correctAnswer: "ሀ",
    explanation:
      "የሆርን ኦፍ አፍሪካና የምሥራቅ አፍሪካ ስምጥ ሸለቆ አካባቢዎች ለድርቅ ተጋላጭ ናቸው፡፡"
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

        const paidQuestionsKey =
      productId === "grade6-2018-english"
        ? "grade6-english"
        : productId;

    const questions = paidExamQuestions[paidQuestionsKey] || [];

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
