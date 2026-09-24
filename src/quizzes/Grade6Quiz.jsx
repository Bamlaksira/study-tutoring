import React, { useState } from "react";
import grade6QuizData from "./quizData";

const API_URL = "https://studycare-backend.onrender.com";

const SUBJECTS = [
  {
    id: "english",
    name: "English",
    description: "Grade 6 English",
    icon: "📘",
  },
  {
    id: "mathematics",
    name: "Mathematics",
    description: "Grade 6 Mathematics",
    icon: "➗",
  },
  {
    id: "amharic",
    name: "Amharic",
    description: "Grade 6 አማርኛ",
    icon: "📝",
  },
  {
    id: "civics",
    name: "ግብረ ገብ",
    description: "Grade 6 Moral Education",
    icon: "🤝",
  },
  {
    id: "environmentalScience",
    name: "አካባቢ ሳይንስ",
    description: "Grade 6 Environmental Science",
    icon: "🌱",
  },
];

function Grade6Quiz() {
  const [step, setStep] = useState("info");

  const [studentInfo, setStudentInfo] = useState({
    studentName: "",
    parentName: "",
    parentPhone: "",
    parentEmail: "",
    region: "",
    city: "",
    preferredLanguage: "",
    marketingConsent: false,
  });

  const [subject, setSubject] = useState("amharic");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const questions = grade6QuizData[subject] || [];
  const question = questions[currentQuestion];

  const selectedSubject =
    SUBJECTS.find((item) => item.id === subject) || SUBJECTS[0];

  const handleInfoChange = (event) => {
    const { name, value, type, checked } = event.target;

    setStudentInfo((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const startSubjectSelection = (event) => {
    event.preventDefault();

    setCurrentQuestion(0);
    setSelectedAnswer("");
    setAnswered(false);
    setScore(0);
    setSaveError("");

    setStep("subject");
  };

  const chooseSubject = (subjectId) => {
    setSubject(subjectId);
    setCurrentQuestion(0);
    setSelectedAnswer("");
    setAnswered(false);
    setScore(0);
    setSaveError("");
    setStep("quiz");
  };

  const chooseAnswer = (answer) => {
    if (answered) return;

    setSelectedAnswer(answer);
    setAnswered(true);

    if (answer === question.correctAnswer) {
      setScore((previous) => previous + 1);
    }
  };

  const getResultMessage = (finalScore, total) => {
    const percentage = (finalScore / total) * 100;

    if (percentage >= 90) {
      return "🌟 Excellent work! You did very well.";
    }

    if (percentage >= 70) {
      return "🎉 Great job! Keep practicing to improve even more.";
    }

    if (percentage >= 50) {
      return "👍 Good start! A little more practice can help you improve.";
    }

    return "💪 Keep going! Practice helps you improve.";
  };

  const finishQuiz = async (finalScore) => {
    setStep("result");
    setSaving(true);
    setSaveError("");

    const totalQuestions = questions.length;
    const percentage = Math.round((finalScore / totalQuestions) * 100);

    try {
      const response = await fetch(`${API_URL}/api/free-quiz-leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...studentInfo,
          subject: selectedSubject.name,
          score: finalScore,
          totalQuestions,
          percentage,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to save quiz result."
        );
      }
    } catch (error) {
      console.error("Quiz result save error:", error);
      setSaveError(
        "Your result is ready, but we could not save it right now."
      );
    } finally {
      setSaving(false);
    }
  };

  const nextQuestion = () => {
    if (!answered) return;

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((previous) => previous + 1);
      setSelectedAnswer("");
      setAnswered(false);
      return;
    }

    const finalScore =
      score +
      (selectedAnswer === question.correctAnswer ? 1 : 0);

    finishQuiz(finalScore);
  };

  const tryAnotherSubject = () => {
    setCurrentQuestion(0);
    setSelectedAnswer("");
    setAnswered(false);
    setScore(0);
    setSaveError("");
    setStep("subject");
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer("");
    setAnswered(false);
    setScore(0);
    setSaveError("");
    setStep("info");
  };

  const getAnswerStyle = (option) => {
    if (!answered) {
      return styles.optionButton;
    }

    if (option === question.correctAnswer) {
      return {
        ...styles.optionButton,
        ...styles.correctOption,
      };
    }

    if (option === selectedAnswer) {
      return {
        ...styles.optionButton,
        ...styles.incorrectOption,
      };
    }

    return {
      ...styles.optionButton,
      opacity: 0.65,
    };
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {step === "info" && (
          <div style={styles.card}>
            <div style={styles.badge}>FREE GRADE 6 QUIZ</div>

            <h1 style={styles.title}>
              StudyCare Grade 6 Challenge
            </h1>

            <p style={styles.subtitle}>
              Test your knowledge, get instant feedback, and discover
              what you already know.
            </p>

            <form onSubmit={startSubjectSelection}>
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>
                  Student Information
                </h2>

                <div style={styles.field}>
                  <label style={styles.label}>
                    Student Name *
                  </label>
                  <input
                    type="text"
                    name="studentName"
                    value={studentInfo.studentName}
                    onChange={handleInfoChange}
                    placeholder="Enter student's name"
                    required
                    style={styles.input}
                  />
                </div>

                <div style={styles.grid}>
                  <div style={styles.field}>
                    <label style={styles.label}>Region *</label>
                    <input
                      type="text"
                      name="region"
                      value={studentInfo.region}
                      onChange={handleInfoChange}
                      placeholder="e.g. Amhara"
                      required
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.field}>
                    <label style={styles.label}>
                      City / Town *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={studentInfo.city}
                      onChange={handleInfoChange}
                      placeholder="e.g. Gondar"
                      required
                      style={styles.input}
                    />
                  </div>
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>
                    Preferred Language
                  </label>

                  <select
                    name="preferredLanguage"
                    value={studentInfo.preferredLanguage}
                    onChange={handleInfoChange}
                    style={styles.input}
                  >
                    <option value="">
                      Select preferred language
                    </option>
                    <option value="Amharic">Amharic</option>
                    <option value="English">English</option>
                    <option value="Both">Both</option>
                  </select>
                </div>
              </div>

              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>
                  Parent / Guardian Information
                </h2>

                <div style={styles.field}>
                  <label style={styles.label}>
                    Parent / Guardian Name *
                  </label>
                  <input
                    type="text"
                    name="parentName"
                    value={studentInfo.parentName}
                    onChange={handleInfoChange}
                    placeholder="Enter parent or guardian name"
                    required
                    style={styles.input}
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    name="parentPhone"
                    value={studentInfo.parentPhone}
                    onChange={handleInfoChange}
                    placeholder="Enter phone or WhatsApp number"
                    required
                    style={styles.input}
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    name="parentEmail"
                    value={studentInfo.parentEmail}
                    onChange={handleInfoChange}
                    placeholder="Enter email address"
                    style={styles.input}
                  />
                </div>

                <label style={styles.checkboxRow}>
                  <input
                    type="checkbox"
                    name="marketingConsent"
                    checked={studentInfo.marketingConsent}
                    onChange={handleInfoChange}
                  />

                  <span>
                    I agree to receive StudyCare updates,
                    educational resources, and offers through
                    WhatsApp or SMS.
                  </span>
                </label>
              </div>

              <button type="submit" style={styles.primaryButton}>
                Continue to Subject Selection →
              </button>
            </form>
          </div>
        )}

        {step === "subject" && (
          <div style={styles.card}>
            <div style={styles.badge}>GRADE 6 CHALLENGE</div>

            <h1 style={styles.title}>
              Choose Your Subject
            </h1>

            <p style={styles.subtitle}>
              Welcome, {studentInfo.studentName}! Choose a subject
              and test your Grade 6 knowledge.
            </p>

            <div style={styles.subjectGrid}>
              {SUBJECTS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => chooseSubject(item.id)}
                  style={styles.subjectCard}
                >
                  <div style={styles.subjectIcon}>
                    {item.icon}
                  </div>

                  <div>
                    <h3 style={styles.subjectName}>
                      {item.name}
                    </h3>

                    <p style={styles.subjectDescription}>
                      {item.description}
                    </p>
                  </div>

                  <span style={styles.subjectArrow}>→</span>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setStep("info")}
              style={styles.secondaryButton}
            >
              ← Back to Information
            </button>
          </div>
        )}

        {step === "quiz" && question && (
          <div style={styles.card}>
            <div style={styles.quizTop}>
              <div>
                <div style={styles.badge}>
                  GRADE 6 • {selectedSubject.name.toUpperCase()}
                </div>

                <h1 style={styles.quizTitle}>
                  {selectedSubject.name} Quiz
                </h1>
              </div>

              <div style={styles.progressText}>
                Question {currentQuestion + 1} / {questions.length}
              </div>
            </div>

            <div style={styles.progressTrack}>
              <div
                style={{
                  ...styles.progressBar,
                  width: `${
                    ((currentQuestion + 1) / questions.length) * 100
                  }%`,
                }}
              />
            </div>

            <div style={styles.questionNumber}>
              Question {currentQuestion + 1}
            </div>

            <h2 style={styles.question}>
              {question.question}
            </h2>

            <div style={styles.options}>
              {question.options.map((option, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => chooseAnswer(option)}
                  disabled={answered}
                  style={getAnswerStyle(option)}
                >
                  <span style={styles.optionLetter}>
                    {String.fromCharCode(65 + index)}
                  </span>

                  <span>{option}</span>
                </button>
              ))}
            </div>

            {answered && (
              <div
                style={
                  selectedAnswer === question.correctAnswer
                    ? styles.feedbackCorrect
                    : styles.feedbackIncorrect
                }
              >
                <div style={styles.feedbackTitle}>
                  {selectedAnswer === question.correctAnswer
                    ? "✅ Correct!"
                    : "❌ Not quite."}
                </div>

                {selectedAnswer !== question.correctAnswer && (
                  <p style={styles.feedbackText}>
                    <strong>Correct answer:</strong>{" "}
                    {question.correctAnswer}
                  </p>
                )}

                <p style={styles.feedbackText}>
                  <strong>Explanation:</strong>{" "}
                  {question.explanation}
                </p>
              </div>
            )}

            {answered && (
              <button
                type="button"
                onClick={nextQuestion}
                style={styles.primaryButton}
              >
                {currentQuestion < questions.length - 1
                  ? "Next Question →"
                  : "See My Result →"}
              </button>
            )}
          </div>
        )}

        {step === "quiz" && !question && (
          <div style={styles.card}>
            <h1 style={styles.title}>
              Questions Coming Soon
            </h1>

            <p style={styles.subtitle}>
              This subject does not have questions available yet.
            </p>

            <button
              type="button"
              onClick={tryAnotherSubject}
              style={styles.primaryButton}
            >
              ← Choose Another Subject
            </button>
          </div>
        )}

        {step === "result" && (
          <div style={styles.card}>
            <div style={styles.resultHeader}>
              <div style={styles.resultIcon}>🎉</div>

              <div style={styles.badge}>
                QUIZ COMPLETE
              </div>

              <h1 style={styles.title}>
                Well done, {studentInfo.studentName}!
              </h1>

              <p style={styles.subtitle}>
                You completed the Grade 6 {selectedSubject.name} quiz.
              </p>
            </div>

            <div style={styles.scoreBox}>
              <div style={styles.scoreLabel}>
                YOUR SCORE
              </div>

              <div style={styles.score}>
                {score} / {questions.length}
              </div>

              <div style={styles.scorePercentage}>
                {Math.round(
                  (score / questions.length) * 100
                )}
                %
              </div>
            </div>

            <div style={styles.resultMessage}>
              {getResultMessage(score, questions.length)}
            </div>

            <div style={styles.recommendation}>
              <div style={styles.recommendationIcon}>
                📚
              </div>

              <div>
                <h2 style={styles.recommendationTitle}>
                  Want more Grade 6 practice?
                </h2>

                <p style={styles.recommendationText}>
                  Try Ministry Exam questions with answers and
                  detailed explanations to prepare more effectively.
                </p>
              </div>
            </div>

            <a
              href="/exams"
              style={styles.examButton}
            >
              Practice Ministry Exams →
            </a>

            {saving && (
              <p style={styles.savingText}>
                Saving your result...
              </p>
            )}

            {saveError && (
              <p style={styles.errorText}>
                {saveError}
              </p>
            )}

            <div style={styles.resultActions}>
              <button
                type="button"
                onClick={tryAnotherSubject}
                style={styles.primaryButton}
              >
                Try Another Subject →
              </button>

              <button
                type="button"
                onClick={restartQuiz}
                style={styles.secondaryButton}
              >
                Start Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f7fb",
    padding: "40px 16px",
    boxSizing: "border-box",
  },

  container: {
    width: "100%",
    maxWidth: "900px",
    margin: "0 auto",
  },

  card: {
    background: "#ffffff",
    borderRadius: "20px",
    padding: "32px",
    boxShadow: "0 10px 35px rgba(23, 32, 51, 0.08)",
  },

  badge: {
    display: "inline-block",
    background: "#eaf2ff",
    color: "#1769e0",
    padding: "7px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "800",
    letterSpacing: "0.5px",
    marginBottom: "14px",
  },

  title: {
    margin: "0 0 12px",
    color: "#172033",
    fontSize: "34px",
    lineHeight: "1.15",
  },

  subtitle: {
    margin: "0 0 30px",
    color: "#667085",
    fontSize: "16px",
    lineHeight: "1.6",
  },

  section: {
    marginBottom: "30px",
    paddingBottom: "24px",
    borderBottom: "1px solid #e6eaf0",
  },

  sectionTitle: {
    margin: "0 0 20px",
    color: "#172033",
    fontSize: "21px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
  },

  field: {
    marginBottom: "18px",
  },

  label: {
    display: "block",
    marginBottom: "8px",
    color: "#344054",
    fontSize: "14px",
    fontWeight: "700",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px 14px",
    border: "1px solid #d0d5dd",
    borderRadius: "10px",
    fontSize: "15px",
    color: "#172033",
    background: "#ffffff",
    outline: "none",
  },

  checkboxRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    color: "#475467",
    fontSize: "14px",
    lineHeight: "1.5",
    cursor: "pointer",
  },

  primaryButton: {
    width: "100%",
    border: "none",
    borderRadius: "12px",
    padding: "15px 20px",
    background: "#1769e0",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "800",
    cursor: "pointer",
    marginTop: "10px",
  },

  secondaryButton: {
    width: "100%",
    border: "1px solid #d0d5dd",
    borderRadius: "12px",
    padding: "14px 20px",
    background: "#ffffff",
    color: "#344054",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
    marginTop: "12px",
  },

  subjectGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "16px",
    marginBottom: "25px",
  },

  subjectCard: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    width: "100%",
    textAlign: "left",
    padding: "20px",
    border: "1px solid #dce3ed",
    borderRadius: "15px",
    background: "#ffffff",
    cursor: "pointer",
    boxShadow: "0 5px 18px rgba(23, 32, 51, 0.05)",
  },

  subjectIcon: {
    width: "52px",
    height: "52px",
    borderRadius: "14px",
    background: "#edf4ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "25px",
    flexShrink: 0,
  },

  subjectName: {
    margin: "0 0 5px",
    color: "#172033",
    fontSize: "17px",
  },

  subjectDescription: {
    margin: 0,
    color: "#667085",
    fontSize: "13px",
  },

  subjectArrow: {
    marginLeft: "auto",
    color: "#1769e0",
    fontSize: "22px",
    fontWeight: "800",
  },

  quizTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
    marginBottom: "16px",
  },

  quizTitle: {
    margin: "0",
    color: "#172033",
    fontSize: "28px",
  },

  progressText: {
    color: "#667085",
    fontWeight: "700",
    fontSize: "14px",
    whiteSpace: "nowrap",
    paddingTop: "8px",
  },

  progressTrack: {
    width: "100%",
    height: "8px",
    background: "#e6eaf0",
    borderRadius: "999px",
    overflow: "hidden",
    marginBottom: "30px",
  },

  progressBar: {
    height: "100%",
    background: "#1769e0",
    borderRadius: "999px",
    transition: "width 0.3s ease",
  },

  questionNumber: {
    color: "#1769e0",
    fontSize: "14px",
    fontWeight: "800",
    marginBottom: "10px",
  },

  question: {
    margin: "0 0 24px",
    color: "#172033",
    fontSize: "23px",
    lineHeight: "1.5",
  },

  options: {
    display: "grid",
    gap: "12px",
    marginBottom: "20px",
  },

  optionButton: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "13px",
    textAlign: "left",
    border: "1px solid #d9e0ea",
    borderRadius: "12px",
    padding: "15px",
    background: "#ffffff",
    color: "#172033",
    fontSize: "15px",
    cursor: "pointer",
  },

  optionLetter: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "#eef3f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    fontWeight: "800",
  },

  correctOption: {
    background: "#e9f8ef",
    border: "2px solid #24a148",
    color: "#176b36",
  },

  incorrectOption: {
    background: "#fff0f0",
    border: "2px solid #d92d20",
    color: "#b42318",
  },

  feedbackCorrect: {
    background: "#e9f8ef",
    border: "1px solid #a8dfbb",
    borderRadius: "14px",
    padding: "18px",
    marginBottom: "18px",
  },

  feedbackIncorrect: {
    background: "#fff5f5",
    border: "1px solid #f1b5b0",
    borderRadius: "14px",
    padding: "18px",
    marginBottom: "18px",
  },

  feedbackTitle: {
    fontSize: "18px",
    fontWeight: "800",
    marginBottom: "8px",
  },

  feedbackText: {
    margin: "7px 0",
    color: "#344054",
    lineHeight: "1.6",
  },

  resultHeader: {
    textAlign: "center",
  },

  resultIcon: {
    fontSize: "50px",
    marginBottom: "10px",
  },

  scoreBox: {
    textAlign: "center",
    background: "#f4f7fb",
    borderRadius: "18px",
    padding: "28px",
    margin: "25px 0",
  },

  scoreLabel: {
    color: "#667085",
    fontSize: "12px",
    fontWeight: "800",
    letterSpacing: "1px",
  },

  score: {
    color: "#1769e0",
    fontSize: "48px",
    fontWeight: "900",
    margin: "5px 0",
  },

  scorePercentage: {
    color: "#344054",
    fontSize: "18px",
    fontWeight: "700",
  },

  resultMessage: {
    textAlign: "center",
    color: "#172033",
    fontSize: "18px",
    fontWeight: "700",
    marginBottom: "25px",
  },

  recommendation: {
    display: "flex",
    alignItems: "flex-start",
    gap: "15px",
    background: "#fff8e7",
    border: "1px solid #f2d58a",
    borderRadius: "15px",
    padding: "20px",
    marginBottom: "18px",
  },

  recommendationIcon: {
    fontSize: "30px",
  },

  recommendationTitle: {
    margin: "0 0 7px",
    color: "#172033",
    fontSize: "19px",
  },

  recommendationText: {
    margin: 0,
    color: "#667085",
    lineHeight: "1.6",
  },

  examButton: {
    display: "block",
    width: "100%",
    boxSizing: "border-box",
    textAlign: "center",
    textDecoration: "none",
    borderRadius: "12px",
    padding: "15px 20px",
    background: "#172033",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "800",
    marginBottom: "18px",
  },

  savingText: {
    textAlign: "center",
    color: "#667085",
    fontSize: "14px",
  },

  errorText: {
    textAlign: "center",
    color: "#b42318",
    fontSize: "14px",
    marginBottom: "15px",
  },

  resultActions: {
    marginTop: "15px",
  },
};

export default Grade6Quiz;