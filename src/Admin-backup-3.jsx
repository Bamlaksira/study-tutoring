import React, { useState } from "react";

const API = "https://studycare-backend.onrender.com";

const sections = [
  {
    title: "👤 Child Information",
    fields: [
      ["childName", "Child Name"],
      ["preferredName", "Preferred Name"],
      ["age", "Age"],
      ["dateOfBirth", "Date of Birth"],
      ["grade", "Grade"],
      ["school", "School"],
      ["gender", "Gender"],
    ],
  },
  {
    title: "👨‍👩‍👧 Parent Information",
    fields: [
      ["parentName", "Parent Name"],
      ["relationship", "Relationship"],
      ["phone", "Phone"],
      ["email", "Email"],
      ["city", "City"],
      ["heardAbout", "How They Heard About StudyCare"],
    ],
  },
  {
    title: "📚 Academic Information",
    fields: [
      ["subjects", "Subjects"],
      ["strongestSubjects", "Strongest Subjects"],
      ["interestedSubject", "Interested Subject"],
      ["strugglingSubject", "Struggling Subject"],
      ["currentPerformance", "Current Performance"],
      ["recentResults", "Recent Results"],
      ["difficultTopics", "Difficult Topics"],
      ["homeworkSituation", "Homework Situation"],
      ["academicConcern", "Academic Concern"],
    ],
  },
  {
    title: "💪 Strengths & Challenges",
    fields: [
      ["strengths", "Strengths"],
      ["learningChallenges", "Learning Challenges"],
      ["freeTimeActivities", "Free-Time Activities"],
      ["motivation", "What Motivates the Student"],
      ["dislikes", "What the Student Dislikes"],
    ],
  },
  {
    title: "📝 Study Habits",
    fields: [
      ["studyRoutine", "Study Routine"],
      ["studyDuration", "Study Duration"],
      ["concentration", "Concentration"],
      ["distractions", "Distractions"],
      ["independentStudy", "Independent Study"],
      ["examPreparation", "Exam Preparation"],
      ["homeworkHabits", "Homework Habits"],
    ],
  },
  {
    title: "🧠 Learning Preferences",
    fields: [
      ["learningStyle", "Learning Style"],
      ["helpfulSupport", "Helpful Support"],
    ],
  },
  {
    title: "🎯 Goals",
    fields: [
      ["goals", "Goals"],
      ["mainGoals", "Main Goals"],
      ["oneMonthGoal", "1-Month Goal"],
      ["threeMonthGoal", "3-Month Goal"],
      ["upcomingExam", "Upcoming Exam"],
      ["targetGrade", "Target Grade"],
      ["studentGoal", "Student's Goal"],
      ["studentDifficulty", "Student's Main Difficulty"],
    ],
  },
  {
    title: "🗓️ Schedule & Sessions",
    fields: [
      ["preferredStudyTime", "Preferred Study Time"],
      ["unavailableTimes", "Unavailable Times"],
      ["sessionsPerWeek", "Sessions Per Week"],
      ["sessionLength", "Session Length"],
      ["learningMode", "Learning Mode"],
    ],
  },
  {
    title: "💻 Learning Environment",
    fields: [
      ["quietPlace", "Quiet Place Available"],
      ["devices", "Available Devices"],
      ["internetConnection", "Internet Connection"],
    ],
  },
  {
    title: "👩‍🏫 Previous Tutoring",
    fields: [
      ["previousTutoring", "Previous Tutoring"],
      ["previousTutoringDetails", "Previous Tutoring Details"],
      ["whatWorked", "What Worked Before"],
      ["whatDidNotWork", "What Did Not Work"],
    ],
  },
  {
    title: "👨‍👩‍👧 Parent Expectations",
    fields: [
      ["parentConcern", "Parent's Main Concern"],
      ["parentExpectations", "Parent Expectations"],
      ["progressUpdates", "Progress Updates Preference"],
    ],
  },
  {
    title: "📌 Additional Information",
    fields: [
      ["additionalInformation", "Additional Information"],
      ["expectations", "Additional Expectations"],
      ["serviceStatus", "Service Status"],
      ["createdAt", "Submitted At"],
    ],
  },
];

function displayValue(value) {
  if (value === null || value === undefined || value === "") {
    return "Not provided";
  }

  if (Array.isArray(value)) {
    return value.length ? value.join(", ") : "Not provided";
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}

function formatDate(value) {
  if (!value) return "Not provided";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString();
}

function App() {
  const [adminKey, setAdminKey] = useState(
    sessionStorage.getItem("studycareAdminKey") || ""
  );

  const [loggedIn, setLoggedIn] = useState(
    Boolean(sessionStorage.getItem("studycareAdminKey"))
  );

  const [leads, setLeads] = useState([]);
  const [onboardings, setOnboardings] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [activeTab, setActiveTab] = useState("leads");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadData(key = adminKey) {
    setLoading(true);
    setError("");

    try {
      const headers = {
        "x-admin-key": key,
      };

      const [leadsResponse, onboardingResponse] = await Promise.all([
        fetch(`${API}/api/leads`, { headers }),
        fetch(`${API}/api/onboarding`, { headers }),
      ]);

      if (leadsResponse.status === 401 || onboardingResponse.status === 401) {
        throw new Error("Invalid admin key.");
      }

      if (!leadsResponse.ok || !onboardingResponse.ok) {
        throw new Error("Could not load StudyCare data.");
      }

      const leadsData = await leadsResponse.json();
      const onboardingData = await onboardingResponse.json();

      setLeads(
        Array.isArray(leadsData)
          ? leadsData
          : leadsData.leads || leadsData.data || []
      );

      setOnboardings(
        Array.isArray(onboardingData)
          ? onboardingData
          : onboardingData.onboardings ||
            onboardingData.onboarding ||
            onboardingData.data ||
            []
      );

      setLoggedIn(true);
      sessionStorage.setItem("studycareAdminKey", key);
    } catch (err) {
      setError(err.message || "Something went wrong.");
      setLoggedIn(false);
      sessionStorage.removeItem("studycareAdminKey");
    } finally {
      setLoading(false);
    }
  }

  function login(e) {
    e.preventDefault();
    if (!adminKey.trim()) return;
    loadData(adminKey.trim());
  }

  function logout() {
    sessionStorage.removeItem("studycareAdminKey");
    setAdminKey("");
    setLoggedIn(false);
    setLeads([]);
    setOnboardings([]);
    setSelectedStudent(null);
  }

  if (!loggedIn) {
    return (
      <div style={styles.loginPage}>
        <form onSubmit={login} style={styles.loginCard}>
          <h1 style={{ marginTop: 0 }}>StudyCare Admin</h1>
          <p style={{ color: "#666" }}>
            Enter your admin key to view parent leads and paid client
            onboarding information.
          </p>

          <input
            type="password"
            placeholder="Admin key"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            style={styles.input}
          />

          <button type="submit" style={styles.primaryButton}>
            {loading ? "Checking..." : "Login"}
          </button>

          {error && <p style={styles.error}>{error}</p>}
        </form>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div>
          <h1 style={{ margin: 0 }}>StudyCare Admin</h1>
          <p style={{ margin: "6px 0 0", opacity: 0.8 }}>
            Manage parent leads and personalized student onboarding
          </p>
        </div>

        <div style={styles.headerButtons}>
          <button
            onClick={() => loadData()}
            style={styles.refreshButton}
            disabled={loading}
          >
            {loading ? "Loading..." : "↻ Refresh"}
          </button>

          <button onClick={logout} style={styles.logoutButton}>
            Logout
          </button>
        </div>
      </header>

      <main style={styles.container}>
        {error && <div style={styles.errorBox}>{error}</div>}

        <div style={styles.stats}>
          <div style={styles.statCard}>
            <span style={styles.statNumber}>{leads.length}</span>
            <span>Parent Leads</span>
          </div>

          <div style={styles.statCard}>
            <span style={styles.statNumber}>{onboardings.length}</span>
            <span>Paid Onboardings</span>
          </div>
        </div>

        <div style={styles.tabs}>
          <button
            onClick={() => setActiveTab("leads")}
            style={{
              ...styles.tab,
              ...(activeTab === "leads" ? styles.activeTab : {}),
            }}
          >
            📋 Parent Leads
          </button>

          <button
            onClick={() => setActiveTab("onboarding")}
            style={{
              ...styles.tab,
              ...(activeTab === "onboarding" ? styles.activeTab : {}),
            }}
          >
            🎓 Paid Client Onboarding
          </button>
        </div>

        {activeTab === "leads" && (
          <section style={styles.card}>
            <h2>Parent Leads</h2>

            {leads.length === 0 ? (
              <p style={styles.empty}>No parent leads found.</p>
            ) : (
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th>Parent</th>
                      <th>Phone</th>
                      <th>Grade</th>
                      <th>Subject</th>
                      <th>Date</th>
                    </tr>
                  </thead>

                  <tbody>
                    {leads.map((lead, index) => (
                      <tr key={lead._id || index}>
                        <td>{displayValue(lead.parentName)}</td>
                        <td>{displayValue(lead.phone)}</td>
                        <td>{displayValue(lead.grade)}</td>
                        <td>
                          {displayValue(
                            lead.subject || lead.interestedSubject
                          )}
                        </td>
                        <td>{formatDate(lead.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {activeTab === "onboarding" && (
          <section style={styles.card}>
            <div style={styles.sectionHeader}>
              <div>
                <h2 style={{ marginBottom: 5 }}>Paid Client Onboarding</h2>
                <p style={{ marginTop: 0, color: "#666" }}>
                  Click a student to view the complete personalized
                  onboarding information.
                </p>
              </div>
            </div>

            {onboardings.length === 0 ? (
              <p style={styles.empty}>No onboarding submissions found.</p>
            ) : (
              <div style={styles.studentGrid}>
                {onboardings.map((student, index) => (
                  <div
                    key={student._id || index}
                    style={styles.studentCard}
                    onClick={() => setSelectedStudent(student)}
                  >
                    <h3 style={{ marginTop: 0 }}>
                      {displayValue(student.childName)}
                    </h3>

                    <p>
                      <strong>Grade:</strong>{" "}
                      {displayValue(student.grade)}
                    </p>

                    <p>
                      <strong>Parent:</strong>{" "}
                      {displayValue(student.parentName)}
                    </p>

                    <p>
                      <strong>Phone:</strong>{" "}
                      {displayValue(student.phone)}
                    </p>

                    <p>
                      <strong>Main Goal:</strong>{" "}
                      {displayValue(student.mainGoals)}
                    </p>

                    <p style={styles.date}>
                      Submitted: {formatDate(student.createdAt)}
                    </p>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedStudent(student);
                      }}
                      style={styles.viewButton}
                    >
                      View Complete Profile →
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      {selectedStudent && (
        <div
          style={styles.modalOverlay}
          onClick={() => setSelectedStudent(null)}
        >
          <div
            style={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={styles.modalHeader}>
              <div>
                <h2 style={{ margin: 0 }}>
                  {displayValue(selectedStudent.childName)}
                </h2>
                <p style={{ margin: "5px 0 0", color: "#666" }}>
                  Complete StudyCare onboarding profile
                </p>
              </div>

              <button
                onClick={() => setSelectedStudent(null)}
                style={styles.closeButton}
              >
                ×
              </button>
            </div>

            {sections.map((section) => (
              <div key={section.title} style={styles.infoSection}>
                <h3 style={styles.sectionTitle}>{section.title}</h3>

                <div style={styles.infoGrid}>
                  {section.fields.map(([key, label]) => {
                    let value = selectedStudent[key];

                    if (key === "createdAt") {
                      value = formatDate(value);
                    } else {
                      value = displayValue(value);
                    }

                    return (
                      <div key={key} style={styles.infoItem}>
                        <div style={styles.infoLabel}>{label}</div>
                        <div style={styles.infoValue}>{value}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f7fb",
    color: "#172033",
  },

  header: {
    background: "#172033",
    color: "white",
    padding: "22px 5%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
    flexWrap: "wrap",
  },

  headerButtons: {
    display: "flex",
    gap: 10,
  },

  container: {
    width: "90%",
    maxWidth: 1200,
    margin: "30px auto",
  },

  stats: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 18,
    marginBottom: 25,
  },

  statCard: {
    background: "white",
    padding: 22,
    borderRadius: 14,
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },

  statNumber: {
    fontSize: 30,
    fontWeight: "bold",
  },

  tabs: {
    display: "flex",
    gap: 10,
    marginBottom: 20,
    flexWrap: "wrap",
  },

  tab: {
    padding: "12px 18px",
    border: "1px solid #ddd",
    background: "white",
    borderRadius: 10,
    cursor: "pointer",
    fontSize: 15,
  },

  activeTab: {
    background: "#172033",
    color: "white",
    borderColor: "#172033",
  },

  card: {
    background: "white",
    borderRadius: 14,
    padding: 22,
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
  },

  tableWrapper: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: 700,
  },

  studentGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 18,
  },

  studentCard: {
    border: "1px solid #e1e5ec",
    borderRadius: 14,
    padding: 18,
    cursor: "pointer",
    background: "#fff",
  },

  viewButton: {
    width: "100%",
    marginTop: 10,
    padding: "11px 14px",
    border: "none",
    borderRadius: 9,
    background: "#172033",
    color: "white",
    cursor: "pointer",
  },

  date: {
    color: "#777",
    fontSize: 13,
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: 15,
    marginBottom: 15,
  },

  loginPage: {
    minHeight: "100vh",
    background: "#f5f7fb",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  loginCard: {
    width: "100%",
    maxWidth: 420,
    background: "white",
    padding: 30,
    borderRadius: 16,
    boxShadow: "0 5px 25px rgba(0,0,0,0.08)",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: 13,
    marginBottom: 12,
    border: "1px solid #ccc",
    borderRadius: 9,
    fontSize: 16,
  },

  primaryButton: {
    width: "100%",
    padding: 13,
    border: "none",
    borderRadius: 9,
    background: "#172033",
    color: "white",
    cursor: "pointer",
    fontSize: 16,
  },

  refreshButton: {
    padding: "10px 15px",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },

  logoutButton: {
    padding: "10px 15px",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },

  error: {
    color: "#c62828",
    marginTop: 12,
  },

  errorBox: {
    background: "#ffe9e9",
    color: "#a40000",
    padding: 14,
    borderRadius: 10,
    marginBottom: 20,
  },

  empty: {
    color: "#777",
    padding: 20,
    textAlign: "center",
  },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.65)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    zIndex: 1000,
  },

  modal: {
    background: "white",
    width: "100%",
    maxWidth: 1000,
    maxHeight: "92vh",
    overflowY: "auto",
    borderRadius: 16,
    padding: 25,
    boxSizing: "border-box",
  },

  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 15,
    marginBottom: 25,
    paddingBottom: 15,
    borderBottom: "1px solid #ddd",
  },

  closeButton: {
    border: "none",
    background: "#eee",
    borderRadius: "50%",
    width: 38,
    height: 38,
    fontSize: 25,
    cursor: "pointer",
  },

  infoSection: {
    marginBottom: 28,
    paddingBottom: 20,
    borderBottom: "1px solid #eee",
  },

  sectionTitle: {
    marginBottom: 15,
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: 12,
  },

  infoItem: {
    background: "#f7f8fa",
    borderRadius: 9,
    padding: 13,
  },

  infoLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 5,
  },

  infoValue: {
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    lineHeight: 1.5,
  },
};

export default App;
