import { useEffect, useState } from "react";
import { EXAM_GRADES, getProductsByGrade } from "./examData";

const FREE_QUESTIONS = 3;
const API_URL = "https://studycare-backend.onrender.com";

const CBE_ACCOUNT_NAME = "StudyCare";
const CBE_ACCOUNT_NUMBER = "1000";

const YEARS = ["2016", "2017", "2018"];

export default function ExamPractice() {
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showExplanation, setShowExplanation] = useState(false);

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [paidQuestions, setPaidQuestions] = useState([]);

  const [showPurchase, setShowPurchase] = useState(false);
  const [showAccessCheck, setShowAccessCheck] = useState(false);

  const [studentName, setStudentName] = useState("");
const [parentName, setParentName] = useState("");
const [phone, setPhone] = useState("");
const [email, setEmail] = useState("");
const [grade, setGrade] = useState("");
const [city, setCity] = useState("");
const [preferredLanguage, setPreferredLanguage] = useState("English");
const [transactionReference, setTransactionReference] = useState("");
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [accessLoading, setAccessLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [view, setView] = useState("grades");
const [pendingPurchase, setPendingPurchase] = useState(false);
  const products = selectedGrade
    ? getProductsByGrade(selectedGrade)
    : [];

  /*
    Products without a year in their ID are the 2018 exams.

    grade6-amharic       -> 2018
    grade6-english       -> 2018
    grade6-mathematics   -> 2018
    grade6-science       -> 2018
    grade6-civics        -> 2018

    Year-specific products:

    grade6-2016-amharic  -> 2016
    grade6-2017-amharic  -> 2017
  */
  const getProductYear = (product) => {
    const match = product.id.match(/-(20\d{2})-/);

    return match ? match[1] : "2018";
  };

  const yearProducts = selectedYear
    ? products.filter(
        (product) => getProductYear(product) === selectedYear
      )
    : [];

  const questions = selectedProduct
    ? [
        ...(selectedProduct.questions || []),
        ...paidQuestions,
      ]
    : [];

  const currentQuestionData = questions[currentQuestion];

  useEffect(() => {
    if (!selectedProduct) {
      setPaidQuestions([]);
      setIsUnlocked(false);
      return;
    }

    setPaidQuestions([]);
    setIsUnlocked(false);
    setCurrentQuestion(0);
    setAnswers({});
    setShowExplanation(false);
    setMessage("");
    setMessageType("");
  }, [selectedProduct]);

  useEffect(() => {
  if (
    !pendingPurchase ||
    !selectedProduct ||
    !phone.trim() ||
    !transactionReference.trim()
  ) {
    return;
  }

  const checkApproval = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/exam-purchases/check-access`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone: phone.trim(),
            transactionReference: transactionReference.trim(),
            productId: selectedProduct.id,
          }),
        }
      );

      const data = await response.json();

      if (
        data.success &&
        (data.accessStatus === "Unlocked" ||
          data.accessStatus === "Approved")
      ) {
        setPendingPurchase(false);
        setIsUnlocked(true);

        await loadPaidQuestions(selectedProduct.id);

        setShowPurchase(false);
        setShowAccessCheck(false);

        // Open Q4 immediately
        setCurrentQuestion(FREE_QUESTIONS);

        setShowExplanation(false);
        setMessage("Payment approved! Your full exam is now unlocked.");
        setMessageType("success");
      }
    } catch (error) {
      console.error("Automatic approval check failed:", error);
    }
  };

  checkApproval();

  const interval = setInterval(checkApproval, 5000);

  return () => clearInterval(interval);
}, [
  pendingPurchase,
  selectedProduct,
  phone,
  transactionReference,
]);
  const resetExamState = () => {
    setSelectedProduct(null);
    setPaidQuestions([]);
    setIsUnlocked(false);
    setCurrentQuestion(0);
    setAnswers({});
    setShowExplanation(false);
    setShowPurchase(false);
    setShowAccessCheck(false);
    setPhone("");
    setTransactionReference("");
    setMessage("");
    setMessageType("");
    setStudentName("");
setParentName("");
setPhone("");
setEmail("");
setGrade("");
setCity("");
setPreferredLanguage("English");
setTransactionReference("");
  };

  const handleGradeSelect = (grade) => {
    setSelectedGrade(grade);
    setSelectedYear("");
    resetExamState();
    setView("years");
  };

  const handleYearSelect = (year) => {
    setSelectedYear(year);
    resetExamState();
    setView("subjects");
  };

  const handleProductSelect = (product) => {
    resetExamState();
    setSelectedProduct(product);
    setView("exam");
  };

  const goBackToGrades = () => {
    resetExamState();
    setSelectedGrade("");
    setSelectedYear("");
    setView("grades");
  };

  const goBackToYears = () => {
    resetExamState();
    setSelectedYear("");
    setView("years");
  };

  const goBackToSubjects = () => {
    resetExamState();
    setView("subjects");
  };

  const handleAnswer = (answer) => {
    if (!currentQuestionData) return;

    setAnswers((prev) => ({
      ...prev,
      [currentQuestionData.id]: answer,
    }));

    setShowExplanation(true);
  };

  const goNextQuestion = () => {
  if (currentQuestion >= FREE_QUESTIONS - 1 && !isUnlocked) {
    setShowPurchase(true);
    setShowExplanation(false);
    setMessage("");
    return;
  }

  if (currentQuestion < questions.length - 1) {
    setCurrentQuestion((prev) => prev + 1);
    setShowExplanation(false);
  }
};

  const goPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
      setShowExplanation(false);
    }
  };

  const loadPaidQuestions = async (productId) => {
    try {
      const response = await fetch(
        `${API_URL}/api/exams/paid-content`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId,
          }),
        }
      );

      const data = await response.json();

      if (data.success && Array.isArray(data.questions)) {
        setPaidQuestions(data.questions);
      }
    } catch (error) {
      console.error("Failed to load paid questions:", error);
    }
  };
const handlePurchase = async () => {
  if (!selectedProduct) return;

  if (!studentName.trim()) {
    setMessage("Please enter the student's full name.");
    setMessageType("error");
    return;
  }

  if (!parentName.trim()) {
    setMessage("Please enter the parent/guardian's full name.");
    setMessageType("error");
    return;
  }

  if (!phone.trim()) {
    setMessage("Please enter your phone number.");
    setMessageType("error");
    return;
  }

  if (!city.trim()) {
    setMessage("Please enter your city/town.");
    setMessageType("error");
    return;
  }

  if (!preferredLanguage.trim()) {
    setMessage("Please select your preferred language.");
    setMessageType("error");
    return;
  }

  if (!transactionReference.trim()) {
    setMessage("Please enter your CBE transaction reference.");
    setMessageType("error");
    return;
  }

  setPurchaseLoading(true);
  setMessage("");

  try {
    const response = await fetch(`${API_URL}/api/exam-purchases`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customerName: parentName.trim(),
        studentName: studentName.trim(),
        parentName: parentName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        grade: selectedGrade,
        city: city.trim(),
        preferredLanguage: preferredLanguage.trim(),
        productId: selectedProduct.id,
        productName: selectedProduct.title,
        amount: selectedProduct.price,
        transactionReference: transactionReference.trim(),
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || "Unable to submit your payment information."
      );
    }

    setMessage(
      "Payment information submitted successfully. We are waiting for payment approval."
    );
    setMessageType("success");

    setPendingPurchase(true);
  } catch (error) {
    console.error(error);
    setMessage(
      error.message || "Something went wrong while submitting your payment."
    );
    setMessageType("error");
  } finally {
    setPurchaseLoading(false);
  }
};

  const handleAccessCheck = async () => {
    if (!selectedProduct) return;

    if (!phone.trim()) {
      setMessage("Please enter your phone number.");
      setMessageType("error");
      return;
    }

    if (!transactionReference.trim()) {
      setMessage("Please enter your transaction reference.");
      setMessageType("error");
      return;
    }

    setAccessLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/api/exam-purchases/check-access`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone: phone.trim(),
            transactionReference: transactionReference.trim(),
            productId: selectedProduct.id,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to check your purchase."
        );
      }

      if (
  data.accessStatus === "Unlocked" ||
  data.accessStatus === "Approved"
) {
  setIsUnlocked(true);
  setPendingPurchase(false);
  setShowAccessCheck(false);

  await loadPaidQuestions(selectedProduct.id);

  setCurrentQuestion(FREE_QUESTIONS);
  setShowExplanation(false);

  setMessage("Your exam has been unlocked successfully.");
  setMessageType("success");
      }else if (data.accessStatus === "Pending") {
        setMessage(
          "Your payment is still being reviewed. Please try again after it has been approved."
        );
        setMessageType("warning");
      } else {
        setMessage(
          "We could not unlock this exam with the information provided."
        );
        setMessageType("error");
      }
    } catch (error) {
      console.error(error);

      setMessage(
        error.message ||
          "Something went wrong while checking your access."
      );
      setMessageType("error");
    } finally {
      setAccessLoading(false);
    }
  };

  const questionLocked =
    currentQuestionData &&
    currentQuestionData.order > FREE_QUESTIONS &&
    !isUnlocked;

  const selectedAnswer = currentQuestionData
    ? answers[currentQuestionData.id]
    : null;

  const getMessageStyle = () => {
    if (messageType === "success") {
      return {
        ...styles.message,
        ...styles.success,
      };
    }

    if (messageType === "error") {
      return {
        ...styles.message,
        ...styles.error,
      };
    }

    if (messageType === "warning") {
      return {
        ...styles.message,
        ...styles.warning,
      };
    }

    return styles.message;
  };

  const getOptionStyle = (option) => {
    const base = {
      ...styles.option,
    };

    if (!showExplanation) {
      return base;
    }

    if (
      option === currentQuestionData.correctAnswer
    ) {
      return {
        ...base,
        border: "2px solid #22c55e",
        background: "#f0fdf4",
      };
    }

    if (option === selectedAnswer) {
      return {
        ...base,
        border: "2px solid #ef4444",
        background: "#fef2f2",
      };
    }

    return base;
  };

  const renderGrades = () => {
    return (
      <div style={styles.page}>
        <div style={styles.header}>
          <p style={styles.eyebrow}>
            STUDYCARE
          </p>

          <h1 style={styles.title}>
            Exam Practice
          </h1>

          <p style={styles.subtitle}>
            Choose a grade to practice Ministry Exams.
          </p>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            Choose your grade
          </h2>

          <div style={styles.gradeGrid}>
            {EXAM_GRADES.map((grade) => (
              <button
                key={grade}
                style={styles.gradeCard}
                onClick={() => handleGradeSelect(grade)}
              >
                <div style={styles.gradeIcon}>
                  📚
                </div>

                <div style={styles.gradeContent}>
                  <h3 style={styles.gradeName}>
                    {grade}
                  </h3>

                  <p style={styles.cardText}>
                    Practice Ministry Exams
                  </p>
                </div>

                <span style={styles.arrow}>
                  →
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderYears = () => {
    return (
      <div style={styles.page}>
        <div style={styles.topBar}>
          <button
            style={styles.backButton}
            onClick={goBackToGrades}
          >
            ← Back
          </button>
        </div>

        <div style={styles.header}>
          <p style={styles.eyebrow}>
            STUDYCARE • {selectedGrade}
          </p>

          <h1 style={styles.title}>
            Choose a Year
          </h1>

          <p style={styles.subtitle}>
            Select the Ministry Exam year you want to practice.
          </p>
        </div>

        <div style={styles.yearGrid}>
          {YEARS.map((year) => (
            <button
              key={year}
              style={styles.yearCard}
              onClick={() => handleYearSelect(year)}
            >
              <div style={styles.yearNumber}>
                {year}
              </div>

              <div style={styles.yearLabel}>
                {selectedGrade} Ministry Exam
              </div>

              <div style={styles.yearAction}>
                View {year} exam subjects →
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderSubjects = () => {
    return (
      <div style={styles.page}>
        <div style={styles.topBar}>
          <button
            style={styles.backButton}
            onClick={goBackToYears}
          >
            ← Back to years
          </button>
        </div>

        <div style={styles.header}>
          <p style={styles.eyebrow}>
            STUDYCARE • {selectedGrade} • {selectedYear}
          </p>

          <h1 style={styles.title}>
            Choose a Subject
          </h1>

          <p style={styles.subtitle}>
            Select the subject you want to practice.
          </p>
        </div>

        {yearProducts.length === 0 ? (
          <div style={styles.emptyBox}>
            <div style={styles.emptyIcon}>
              📚
            </div>

            <h2 style={styles.emptyTitle}>
              Exams coming soon
            </h2>

            <p style={styles.emptyText}>
              We are preparing the {selectedGrade}{" "}
              {selectedYear} Ministry Exam subjects for
              StudyCare.
            </p>

            <button
              style={styles.secondaryButton}
              onClick={goBackToYears}
            >
              Choose another year
            </button>
          </div>
        ) : (
          <div style={styles.productGrid}>
            {yearProducts.map((product) => {
              const questionCount =
                product.questions?.length || 0;

              return (
                <button
                  key={product.id}
                  style={styles.productCard}
                  onClick={() =>
                    handleProductSelect(product)
                  }
                >
                  <div style={styles.subjectIcon}>
                    {getSubjectIcon(product.subject)}
                  </div>

                  <h3 style={styles.subjectName}>
                    {product.subject}
                  </h3>

                  <p style={styles.productTitle}>
                    {product.title}
                  </p>

                  <div style={styles.productInfo}>
                    <span>
                      {questionCount > 0
                        ? `${questionCount}+ questions`
                        : "Questions coming soon"}
                    </span>

                    <span>
                      {product.price} ETB
                    </span>
                  </div>

                  <div style={styles.cardAction}>
                    Practice / View Exam →
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const renderExam = () => {
    if (!selectedProduct) {
      return null;
    }

    if (!currentQuestionData) {
      return (
        <div style={styles.page}>
          <div style={styles.topBar}>
            <button
              style={styles.backButton}
              onClick={goBackToSubjects}
            >
              ← Back to subjects
            </button>
          </div>

          <div style={styles.emptyBox}>
            <h2 style={styles.emptyTitle}>
              Questions are coming soon
            </h2>

            <p style={styles.emptyText}>
              This exam does not have questions available yet.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div style={styles.page}>
        <div style={styles.topBar}>
          <button
            style={styles.backButton}
            onClick={goBackToSubjects}
          >
            ← Back to subjects
          </button>
        </div>

        <div style={styles.examHeader}>
          <div>
            <p style={styles.eyebrow}>
              {selectedGrade} • {selectedYear}
            </p>

            <h1 style={styles.examTitle}>
              {selectedProduct.subject}
            </h1>

            <p style={styles.examSubtitle}>
              {selectedProduct.title}
            </p>
          </div>

          <div style={styles.priceBadge}>
            {selectedProduct.price} ETB
          </div>
        </div>

        {message && (
          <div style={getMessageStyle()}>
            {message}
          </div>
        )}

        <div style={styles.progressBox}>
          <div style={styles.progressTop}>
            <span>
              Question {currentQuestion + 1} of{" "}
              {questions.length}
            </span>

            <span>
              {currentQuestionData.order <=
              FREE_QUESTIONS
                ? "Free"
                : isUnlocked
                ? "Unlocked"
                : "Paid"}
            </span>
          </div>

          <div style={styles.progressTrack}>
            <div
              style={{
                ...styles.progressFill,
                width: `${
                  ((currentQuestion + 1) /
                    questions.length) *
                  100
                }%`,
              }}
            />
          </div>
        </div>

        {questionLocked ? (
          <div style={styles.lockedBox}>
            <div style={styles.lockIcon}>
              🔒
            </div>

            <h2 style={styles.lockedTitle}>
              Unlock the Full Exam
            </h2>

            <p style={styles.lockedText}>
              Questions 1–3 are free. Unlock the full{" "}
              {selectedYear}{" "}
              {selectedProduct.subject} Ministry Exam
              to continue.
            </p>

            <div style={styles.purchaseDetails}>
              <div>
                <span style={styles.detailLabel}>
                  Exam
                </span>

                <strong style={styles.detailValue}>
                  {selectedProduct.title}
                </strong>
              </div>

              <div>
                <span style={styles.detailLabel}>
                  Price
                </span>

                <strong style={styles.detailValue}>
                  {selectedProduct.price} ETB
                </strong>
              </div>
            </div>

            <button
              style={styles.primaryButton}
              onClick={() => {
                setShowPurchase(true);
                setMessage("");
              }}
            >
              Purchase Full Exam
            </button>

            <button
              style={styles.secondaryButton}
              onClick={() => {
                setShowAccessCheck(true);
                setMessage("");
              }}
            >
              I Already Purchased
            </button>
          </div>
        ) : (
          <div style={styles.questionBox}>
            <div style={styles.questionNumber}>
              Question {currentQuestionData.order}
            </div>

            <h2 style={styles.question}>
              {currentQuestionData.question}
            </h2>

            <div style={styles.options}>
              {currentQuestionData.options.map(
                (option, index) => {
                  const letter =
                    option.charAt(0);

                  return (
                    <button
                      key={index}
                      style={getOptionStyle(letter)}
                      onClick={() =>
                        handleAnswer(letter)
                      }
                      disabled={showExplanation}
                    >
                      <span
                        style={styles.optionLetter}
                      >
                        {letter}
                      </span>

                      <span
                        style={styles.optionText}
                      >
                        {option.substring(3)}
                      </span>
                    </button>
                  );
                }
              )}
            </div>

            {showExplanation && (
              <div
                style={{
                  ...styles.explanationBox,
                  background:
                    selectedAnswer ===
                    currentQuestionData.correctAnswer
                      ? "#ecfdf3"
                      : "#fff1f2",
                  borderColor:
                    selectedAnswer ===
                    currentQuestionData.correctAnswer
                      ? "#86efac"
                      : "#fda4af",
                }}
              >
                <strong
                  style={
                    selectedAnswer ===
                    currentQuestionData.correctAnswer
                      ? styles.correctText
                      : styles.incorrectText
                  }
                >
                  {selectedAnswer ===
                  currentQuestionData.correctAnswer
                    ? "✓ Correct"
                    : "✕ Not quite"}
                </strong>

                <p style={styles.explanationText}>
                  {currentQuestionData.explanation}
                </p>
              </div>
            )}

            <div style={styles.navigation}>
              <button
                style={
                  currentQuestion === 0
                    ? styles.disabledButton
                    : styles.secondaryButton
                }
                onClick={goPreviousQuestion}
                disabled={currentQuestion === 0}
              >
                ← Previous
              </button>

              {currentQuestion <
              questions.length - 1 ? (
                <button
                  style={
                    showExplanation
                      ? styles.primaryButton
                      : styles.disabledButton
                  }
                  onClick={goNextQuestion}
                  disabled={!showExplanation}
                >
                  Next Question →
                </button>
              ) : (
                <button
                  style={styles.primaryButton}
                  onClick={goBackToSubjects}
                >
                  Finish Exam
                </button>
              )}
            </div>
          </div>
        )}

        {showPurchase && (
  <div style={styles.modalOverlay}>
    <div
      style={{
        ...styles.modal,
        maxWidth: "650px",
        width: "95%",
        maxHeight: "90vh",
        overflowY: "auto",
      }}
    >
      <button
        onClick={() => setShowPurchase(false)}
        style={{
          ...styles.closeButton,
          float: "right",
        }}
      >
        ×
      </button>

      <h2 style={{ marginTop: 0 }}>Unlock Full Access</h2>

      <p>
        Complete your payment information below to unlock all questions in
        this {selectedProduct?.title}.
      </p>

      <div style={styles.paymentBox}>
        <h3>Payment Instructions</h3>

        <p>
          <strong>Amount:</strong> {selectedProduct?.price} ETB
        </p>

        <p>
          <strong>Bank:</strong> Commercial Bank of Ethiopia (CBE)
        </p>

        <p>
          <strong>Account Name:</strong> {CBE_ACCOUNT_NAME}
        </p>

        <p>
          <strong>Account Number:</strong> {CBE_ACCOUNT_NUMBER}
        </p>

        <p style={{ marginBottom: 0 }}>
          After making the transfer, enter the transaction reference below.
        </p>
      </div>

      <h3>Student Information</h3>

      <label style={styles.label}>Student Full Name *</label>
      <input
        style={styles.input}
        value={studentName}
        onChange={(e) => setStudentName(e.target.value)}
        placeholder="Student full name"
      />

      <label style={styles.label}>Parent/Guardian Full Name *</label>
      <input
        style={styles.input}
        value={parentName}
        onChange={(e) => setParentName(e.target.value)}
        placeholder="Parent or guardian full name"
      />

      <label style={styles.label}>Phone / WhatsApp *</label>
      <input
        style={styles.input}
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Phone or WhatsApp number"
      />

      <label style={styles.label}>City / Town *</label>
      <input
        style={styles.input}
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="City or town"
      />

      <label style={styles.label}>Preferred Language *</label>
      <select
        style={styles.input}
        value={preferredLanguage}
        onChange={(e) => setPreferredLanguage(e.target.value)}
      >
        <option value="English">English</option>
        <option value="Amharic">Amharic</option>
        <option value="Afaan Oromo">Afaan Oromo</option>
        <option value="Tigrinya">Tigrinya</option>
      </select>

      <label style={styles.label}>Email (Optional)</label>
      <input
        type="email"
        style={styles.input}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email address"
      />

      <label style={styles.label}>CBE Transaction Reference *</label>
      <input
        style={styles.input}
        value={transactionReference}
        onChange={(e) => setTransactionReference(e.target.value)}
        placeholder="Enter CBE transaction reference"
      />

      {message && (
        <div
          style={{
            marginTop: "12px",
            padding: "12px",
            borderRadius: "8px",
            background:
              messageType === "error" ? "#fee2e2" : "#dcfce7",
            color:
              messageType === "error" ? "#991b1b" : "#166534",
          }}
        >
          {message}
        </div>
      )}

      <button
        onClick={handlePurchase}
        disabled={purchaseLoading}
        style={{
          ...styles.primaryButton,
          width: "100%",
          marginTop: "18px",
        }}
      >
        {purchaseLoading
          ? "Submitting..."
          : "Submit Payment Information"}
      </button>

      <button
        onClick={() => {
          setShowPurchase(false);
          setShowAccessCheck(true);
          setMessage("");
        }}
        style={{
          ...styles.secondaryButton,
          width: "100%",
          marginTop: "10px",
        }}
      >
        I Already Purchased
      </button>

      <p
        style={{
          fontSize: "13px",
          color: "#666",
          marginTop: "15px",
          textAlign: "center",
        }}
      >
        Your exam will unlock after your payment is approved.
      </p>
    </div>
  </div>
)}
        {showAccessCheck && (
          <div style={styles.modalOverlay}>
            <div style={styles.modal}>
              <button
                style={styles.closeButton}
                onClick={() =>
                  setShowAccessCheck(false)
                }
              >
                ×
              </button>

              <h2 style={styles.modalTitle}>
                Unlock Your Exam
              </h2>

              <p style={styles.modalText}>
                Enter the same phone number and CBE
                transaction reference you used for your
                purchase.
              </p>

              <label style={styles.label}>
                Phone number
              </label>

              <input
                style={styles.input}
                type="tel"
                placeholder="09XXXXXXXX"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value)
                }
              />

              <label style={styles.label}>
                Transaction reference
              </label>

              <input
                style={styles.input}
                type="text"
                placeholder="Enter transaction reference"
                value={transactionReference}
                onChange={(e) =>
                  setTransactionReference(
                    e.target.value
                  )
                }
              />

              <button
                style={styles.primaryButtonFull}
                onClick={handleAccessCheck}
                disabled={accessLoading}
              >
                {accessLoading
                  ? "Checking..."
                  : "Check My Access"}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (view === "grades") {
    return renderGrades();
  }

  if (view === "years") {
    return renderYears();
  }

  if (view === "subjects") {
    return renderSubjects();
  }

  return renderExam();
}

function getSubjectIcon(subject) {
  const value = String(subject || "").toLowerCase();

  if (
    value.includes("amharic") ||
    value.includes("አማርኛ")
  ) {
    return "📝";
  }

  if (
    value.includes("math") ||
    value.includes("ሂሳብ")
  ) {
    return "🔢";
  }

  if (
    value.includes("english") ||
    value.includes("እንግሊዝኛ")
  ) {
    return "📖";
  }

  if (
    value.includes("science") ||
    value.includes("ሳይንስ")
  ) {
    return "🔬";
  }

  if (
    value.includes("civics") ||
    value.includes("ግብረ")
  ) {
    return "🏛️";
  }

  return "📚";
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)",
    padding: "32px 20px 70px",
    color: "#0f172a",
    boxSizing: "border-box",
  },

  topBar: {
    maxWidth: "1050px",
    margin: "0 auto 20px",
  },

  backButton: {
    border: "none",
    background: "transparent",
    color: "#2563eb",
    fontWeight: 800,
    cursor: "pointer",
    padding: "8px 0",
    fontSize: "14px",
  },

  header: {
    maxWidth: "1050px",
    margin: "0 auto 35px",
    color: "#0f172a",
  },

  eyebrow: {
    color: "#2563eb",
    fontWeight: 900,
    fontSize: "12px",
    letterSpacing: "1.5px",
    margin: "0 0 8px",
  },

  title: {
    margin: "0",
    color: "#0f172a",
    fontSize: "clamp(30px, 5vw, 46px)",
    lineHeight: 1.1,
    fontWeight: 900,
  },

  subtitle: {
    margin: "12px 0 0",
    color: "#64748b",
    fontSize: "16px",
    lineHeight: 1.6,
  },

  section: {
    maxWidth: "1050px",
    margin: "0 auto",
  },

  sectionTitle: {
    color: "#0f172a",
    fontSize: "22px",
    margin: "0 0 18px",
    fontWeight: 850,
  },

  gradeGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(230px, 1fr))",
    gap: "18px",
    maxWidth: "1050px",
    margin: "0 auto",
  },

  gradeCard: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    textAlign: "left",
    padding: "24px",
    borderRadius: "18px",
    border: "1px solid #e2e8f0",
    background: "#ffffff",
    color: "#0f172a",
    boxShadow:
      "0 8px 30px rgba(15, 23, 42, 0.06)",
    cursor: "pointer",
  },

  gradeIcon: {
    width: "52px",
    height: "52px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#eff6ff",
    fontSize: "26px",
    flexShrink: 0,
  },

  gradeContent: {
    minWidth: 0,
    flex: 1,
  },

  gradeName: {
    margin: "0 0 6px",
    color: "#0f172a",
    fontSize: "19px",
    fontWeight: 900,
    lineHeight: 1.2,
  },

  cardText: {
    margin: 0,
    color: "#64748b",
    fontSize: "14px",
    lineHeight: 1.5,
  },

  arrow: {
    marginLeft: "auto",
    color: "#2563eb",
    fontSize: "24px",
    fontWeight: 900,
    flexShrink: 0,
  },

  yearGrid: {
    maxWidth: "1050px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
  },

  yearCard: {
    textAlign: "left",
    border: "1px solid #dbe3ef",
    background: "#ffffff",
    color: "#0f172a",
    borderRadius: "20px",
    padding: "28px",
    cursor: "pointer",
    boxShadow:
      "0 10px 30px rgba(15, 23, 42, 0.07)",
  },

  yearNumber: {
    color: "#2563eb",
    fontSize: "40px",
    fontWeight: 900,
    marginBottom: "10px",
    lineHeight: 1,
  },

  yearLabel: {
    color: "#0f172a",
    fontSize: "17px",
    fontWeight: 850,
    marginBottom: "18px",
  },

  yearAction: {
    color: "#64748b",
    fontSize: "14px",
    fontWeight: 750,
  },

  productGrid: {
    maxWidth: "1050px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "18px",
  },

  productCard: {
    textAlign: "left",
    border: "1px solid #dbe3ef",
    background: "#ffffff",
    color: "#0f172a",
    borderRadius: "18px",
    padding: "24px",
    cursor: "pointer",
    boxShadow:
      "0 8px 30px rgba(15, 23, 42, 0.06)",
  },

  subjectIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "14px",
    background: "#eff6ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    marginBottom: "16px",
  },

  subjectName: {
    color: "#0f172a",
    margin: "0 0 8px",
    fontSize: "19px",
    fontWeight: 900,
  },

  productTitle: {
    margin: "0 0 18px",
    color: "#64748b",
    fontSize: "14px",
    lineHeight: 1.5,
  },

  productInfo: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
    fontSize: "13px",
    fontWeight: 750,
    color: "#475569",
    marginBottom: "18px",
  },

  cardAction: {
    color: "#2563eb",
    fontWeight: 850,
    fontSize: "14px",
  },

  emptyBox: {
    maxWidth: "600px",
    margin: "50px auto",
    textAlign: "center",
    background: "#ffffff",
    color: "#0f172a",
    border: "1px solid #e2e8f0",
    borderRadius: "20px",
    padding: "40px 25px",
    boxShadow:
      "0 10px 30px rgba(15, 23, 42, 0.06)",
  },

  emptyIcon: {
    fontSize: "45px",
    marginBottom: "15px",
  },

  emptyTitle: {
    color: "#0f172a",
    margin: "0 0 10px",
    fontSize: "24px",
    fontWeight: 850,
  },

  emptyText: {
    color: "#64748b",
    lineHeight: 1.6,
    marginBottom: "25px",
  },

  examHeader: {
    maxWidth: "1050px",
    margin: "0 auto 25px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
    flexWrap: "wrap",
  },

  examTitle: {
    margin: 0,
    color: "#0f172a",
    fontSize: "clamp(28px, 5vw, 40px)",
    fontWeight: 900,
  },

  examSubtitle: {
    margin: "8px 0 0",
    color: "#64748b",
  },

  priceBadge: {
    background: "#eff6ff",
    color: "#1d4ed8",
    padding: "10px 15px",
    borderRadius: "999px",
    fontWeight: 800,
  },

  progressBox: {
    maxWidth: "1050px",
    margin: "0 auto 20px",
    background: "#ffffff",
    color: "#0f172a",
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    padding: "15px",
  },

  progressTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "15px",
    marginBottom: "10px",
    fontSize: "13px",
    color: "#64748b",
    fontWeight: 700,
  },

  progressTrack: {
    width: "100%",
    height: "7px",
    borderRadius: "999px",
    background: "#e2e8f0",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    background: "#2563eb",
    borderRadius: "999px",
    transition: "width 0.3s ease",
  },

  questionBox: {
    maxWidth: "850px",
    margin: "0 auto",
    background: "#ffffff",
    color: "#0f172a",
    border: "1px solid #e2e8f0",
    borderRadius: "20px",
    padding: "28px",
    boxShadow:
      "0 10px 35px rgba(15, 23, 42, 0.06)",
  },

  questionNumber: {
    color: "#2563eb",
    fontWeight: 850,
    fontSize: "14px",
    marginBottom: "12px",
  },

  question: {
    margin: "0 0 25px",
    color: "#0f172a",
    fontSize: "22px",
    lineHeight: 1.5,
    fontWeight: 800,
  },

  options: {
    display: "grid",
    gap: "12px",
  },

  option: {
    width: "100%",
    display: "flex",
    alignItems: "flex-start",
    gap: "14px",
    padding: "16px",
    borderRadius: "12px",
    border: "1px solid #dbe3ef",
    background: "#ffffff",
    color: "#0f172a",
    textAlign: "left",
    cursor: "pointer",
    fontSize: "15px",
    lineHeight: 1.5,
  },

  optionLetter: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "#eff6ff",
    color: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 850,
    flexShrink: 0,
  },

  optionText: {
    flex: 1,
    color: "#0f172a",
    paddingTop: "5px",
  },

  explanationBox: {
    marginTop: "20px",
    padding: "16px",
    borderRadius: "12px",
    border: "1px solid",
    lineHeight: 1.6,
  },

  explanationText: {
    color: "#334155",
    marginBottom: 0,
  },

  correctText: {
    color: "#166534",
  },

  incorrectText: {
    color: "#991b1b",
  },

  navigation: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    marginTop: "25px",
    flexWrap: "wrap",
  },

  primaryButton: {
    border: "none",
    borderRadius: "10px",
    padding: "13px 20px",
    background: "#2563eb",
    color: "#ffffff",
    fontWeight: 850,
    cursor: "pointer",
  },

  primaryButtonFull: {
    width: "100%",
    border: "none",
    borderRadius: "10px",
    padding: "14px 20px",
    background: "#2563eb",
    color: "#ffffff",
    fontWeight: 850,
    cursor: "pointer",
    marginTop: "10px",
  },

  secondaryButton: {
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    padding: "12px 18px",
    background: "#ffffff",
    color: "#334155",
    fontWeight: 750,
    cursor: "pointer",
    marginTop: "10px",
  },

  disabledButton: {
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    padding: "12px 18px",
    background: "#f1f5f9",
    color: "#94a3b8",
    fontWeight: 750,
    cursor: "not-allowed",
  },

  lockedBox: {
    maxWidth: "700px",
    margin: "40px auto",
    textAlign: "center",
    background: "#ffffff",
    color: "#0f172a",
    border: "1px solid #e2e8f0",
    borderRadius: "20px",
    padding: "40px 25px",
    boxShadow:
      "0 10px 35px rgba(15, 23, 42, 0.07)",
  },

  lockIcon: {
    fontSize: "42px",
    marginBottom: "15px",
  },

  lockedTitle: {
    margin: "0 0 12px",
    color: "#0f172a",
    fontSize: "25px",
    fontWeight: 850,
  },

  lockedText: {
    color: "#64748b",
    lineHeight: 1.7,
    marginBottom: "25px",
  },

  purchaseDetails: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "12px",
    textAlign: "left",
    marginBottom: "25px",
  },

  detailLabel: {
    display: "block",
    color: "#94a3b8",
    fontSize: "12px",
    marginBottom: "4px",
  },

  detailValue: {
    color: "#0f172a",
  },

  message: {
    maxWidth: "850px",
    margin: "0 auto 20px",
    padding: "14px 16px",
    borderRadius: "10px",
    background: "#f8fafc",
    color: "#334155",
    border: "1px solid #e2e8f0",
    lineHeight: 1.5,
  },

  success: {
    color: "#166534",
    background: "#f0fdf4",
    borderColor: "#86efac",
  },

  error: {
    color: "#991b1b",
    background: "#fef2f2",
    borderColor: "#fca5a5",
  },

  warning: {
    color: "#92400e",
    background: "#fffbeb",
    borderColor: "#fcd34d",
  },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15, 23, 42, 0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    zIndex: 1000,
  },

  modal: {
    position: "relative",
    width: "100%",
    maxWidth: "500px",
    maxHeight: "90vh",
    overflowY: "auto",
    background: "#ffffff",
    color: "#0f172a",
    borderRadius: "20px",
    padding: "30px",
    boxSizing: "border-box",
  },

  closeButton: {
    position: "absolute",
    right: "15px",
    top: "12px",
    border: "none",
    background: "transparent",
    color: "#64748b",
    fontSize: "28px",
    cursor: "pointer",
  },

  modalTitle: {
    margin: "0 0 10px",
    color: "#0f172a",
    fontSize: "25px",
    fontWeight: 850,
    paddingRight: "30px",
  },

  modalText: {
    color: "#64748b",
    lineHeight: 1.6,
    marginBottom: "20px",
  },

  paymentBox: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "18px",
    marginBottom: "20px",
    lineHeight: 1.6,
  },

  paymentTitle: {
    color: "#0f172a",
    marginTop: 0,
  },

  paymentText: {
    color: "#334155",
  },

  label: {
    display: "block",
    color: "#334155",
    fontWeight: 750,
    fontSize: "14px",
    marginBottom: "7px",
    marginTop: "15px",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px 14px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    outline: "none",
    fontSize: "15px",
    color: "#0f172a",
    background: "#ffffff",
  },
};