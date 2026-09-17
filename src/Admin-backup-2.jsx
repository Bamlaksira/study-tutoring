import { useState } from "react";

const API = "https://studycare-backend.onrender.com";

function Admin() {
  const [adminKey, setAdminKey] = useState("");
  const [leads, setLeads] = useState([]);
  const [onboardings, setOnboardings] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("leads");
  const [selectedStudent, setSelectedStudent] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const headers = {
        "x-admin-key": adminKey,
      };

      const [leadsResponse, onboardingResponse] = await Promise.all([
        fetch(`${API}/api/leads`, { headers }),
        fetch(`${API}/api/onboarding`, { headers }),
      ]);

      const leadsData = await leadsResponse.json();
      const onboardingData = await onboardingResponse.json();

      if (!leadsResponse.ok) {
        throw new Error(leadsData.message || "Unable to load leads");
      }

      if (!onboardingResponse.ok) {
        throw new Error(
          onboardingData.message || "Unable to load onboarding data"
        );
      }

      setLeads(leadsData);
      setOnboardings(onboardingData);
      setLoggedIn(true);
    } catch (err) {
      console.error(err);
      setError("Invalid admin key or server error.");
      setLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setLoggedIn(false);
    setAdminKey("");
    setLeads([]);
    setOnboardings([]);
    setSelectedStudent(null);
  };

  if (!loggedIn) {
    return (
      <div style={styles.loginPage}>
        <div style={styles.loginCard}>
          <div style={styles.icon}>🔐</div>

          <h1>StudyCare Admin</h1>

          <p>Enter your admin key to access your dashboard.</p>

          <input
            type="password"
            placeholder="Admin key"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") loadData();
            }}
            style={styles.input}
          />

          <button onClick={loadData} style={styles.button}>
            {loading ? "Loading..." : "Login"}
          </button>

          {error && <p style={styles.error}>{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.dashboard}>
      <div style={styles.header}>
        <div>
          <h1>📚 StudyCare Admin</h1>
          <p>Manage your leads and paid clients</p>
        </div>

        <button onClick={logout} style={styles.logout}>
          Logout
        </button>
      </div>

      <div style={styles.stats}>
        <div style={styles.statCard}>
          <strong>{leads.length}</strong>
          <span>Parent Leads</span>
        </div>

        <div style={styles.statCard}>
          <strong>{onboardings.length}</strong>
          <span>Paid Onboardings</span>
        </div>
      </div>

      <div style={styles.tabs}>
        <button
          onClick={() => {
            setActiveTab("leads");
            setSelectedStudent(null);
          }}
          style={{
            ...styles.tab,
            ...(activeTab === "leads" ? styles.activeTab : {}),
          }}
        >
          📋 Parent Leads
        </button>

        <button
          onClick={() => {
            setActiveTab("onboarding");
            setSelectedStudent(null);
          }}
          style={{
            ...styles.tab,
            ...(activeTab === "onboarding" ? styles.activeTab : {}),
          }}
        >
          🎓 Paid Client Onboarding
        </button>
      </div>

      {activeTab === "leads" && (
        <div style={styles.tableContainer}>
          <h2>Parent Leads</h2>

          {leads.length === 0 ? (
            <p>No leads yet.</p>
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
                  {leads.map((lead) => (
                    <tr key={lead._id}>
                      <td>{lead.parentName || "-"}</td>
                      <td>{lead.phone || "-"}</td>
                      <td>{lead.grade || "-"}</td>
                      <td>{lead.subject || "-"}</td>
                      <td>
                        {lead.createdAt
                          ? new Date(lead.createdAt).toLocaleDateString()
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === "onboarding" && (
        <div style={styles.tableContainer}>
          <h2>🎓 Paid Client Onboarding</h2>

          {onboardings.length === 0 ? (
            <p>No paid client onboarding submissions yet.</p>
          ) : (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Grade</th>
                    <th>Parent</th>
                    <th>Phone</th>
                    <th>Goals</th>
                    <th>Date</th>
                    <th>Details</th>
                  </tr>
                </thead>

                <tbody>
                  {onboardings.map((student) => (
                    <tr key={student._id}>
                      <td>{student.childName || "-"}</td>
                      <td>{student.grade || "-"}</td>
                      <td>{student.parentName || "-"}</td>
                      <td>{student.phone || "-"}</td>
                      <td>
                        {student.goals
                          ? String(student.goals).slice(0, 50) +
                            (String(student.goals).length > 50 ? "..." : "")
                          : "-"}
                      </td>
                      <td>
                        {student.createdAt
                          ? new Date(
                              student.createdAt
                            ).toLocaleDateString()
                          : "-"}
                      </td>
                      <td>
                        <button
                          onClick={() => setSelectedStudent(student)}
                          style={styles.viewButton}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {selectedStudent && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <div>
                <h2>🎓 Student Onboarding</h2>
                <p>
                  {selectedStudent.childName || "Student"} — Grade{" "}
                  {selectedStudent.grade || "-"}
                </p>
              </div>

              <button
                onClick={() => setSelectedStudent(null)}
                style={styles.closeButton}
              >
                ✕
              </button>
            </div>

            <div style={styles.detailsGrid}>
              <Detail
                label="Student Name"
                value={selectedStudent.childName}
              />
              <Detail label="Grade" value={selectedStudent.grade} />
              <Detail
                label="Parent Name"
                value={selectedStudent.parentName}
              />
              <Detail label="Phone" value={selectedStudent.phone} />
              <Detail label="Email" value={selectedStudent.email} />
              <Detail
                label="School"
                value={selectedStudent.school}
              />
              <Detail
                label="Current Performance"
                value={selectedStudent.currentPerformance}
              />
              <Detail
                label="Strengths"
                value={selectedStudent.strengths}
              />
              <Detail
                label="Challenges / Needs"
                value={selectedStudent.challenges}
              />
              <Detail
                label="Interests"
                value={selectedStudent.interests}
              />
              <Detail
                label="Goals"
                value={selectedStudent.goals}
              />
              <Detail
                label="Study Habits"
                value={selectedStudent.studyHabits}
              />
              <Detail
                label="Learning Preferences"
                value={selectedStudent.learningPreferences}
              />
              <Detail
                label="What Has Worked"
                value={selectedStudent.effectiveSupports}
              />
              <Detail
                label="What Has Not Worked"
                value={selectedStudent.ineffectiveSupports}
              />
              <Detail
                label="Availability / Schedule"
                value={selectedStudent.schedule}
              />
              <Detail
                label="Learning Environment"
                value={selectedStudent.learningEnvironment}
              />
              <Detail
                label="Previous Tutoring"
                value={selectedStudent.previousTutoring}
              />
              <Detail
                label="Parent Expectations"
                value={selectedStudent.parentExpectations}
              />
              <Detail
                label="Parent Involvement"
                value={selectedStudent.parentInvolvement}
              />
              <Detail
                label="Assessment / Progress Information"
                value={selectedStudent.progressAssessment}
              />
              <Detail
                label="Additional Information"
                value={selectedStudent.additionalInformation}
              />
            </div>

            <div style={styles.modalFooter}>
              <p>
                Submitted:{" "}
                {selectedStudent.createdAt
                  ? new Date(
                      selectedStudent.createdAt
                    ).toLocaleString()
                  : "-"}
              </p>

              <button
                onClick={() => setSelectedStudent(null)}
                style={styles.button}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Detail({ label, value }) {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return null;
  }

  return (
    <div style={styles.detailCard}>
      <strong>{label}</strong>
      <p>{String(value)}</p>
    </div>
  );
}

const styles = {
  loginPage: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f7fb",
    padding: "20px",
  },

  loginCard: {
    width: "100%",
    maxWidth: "400px",
    background: "white",
    padding: "35px",
    borderRadius: "15px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    textAlign: "center",
  },

  icon: {
    fontSize: "45px",
  },

  input: {
    width: "100%",
    padding: "13px",
    marginTop: "15px",
    marginBottom: "12px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxSizing: "border-box",
  },

  button: {
    padding: "13px 20px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    background: "#2563eb",
    color: "white",
    fontWeight: "bold",
  },

  error: {
    color: "red",
    marginTop: "15px",
  },

  dashboard: {
    minHeight: "100vh",
    background: "#f5f7fb",
    padding: "25px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
    gap: "20px",
  },

  logout: {
    padding: "10px 18px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },

  stats: {
    display: "flex",
    gap: "15px",
    flexWrap: "wrap",
    marginBottom: "25px",
  },

  statCard: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    minWidth: "160px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  },

  tabs: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },

  tab: {
    padding: "12px 18px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    background: "white",
    fontWeight: "bold",
  },

  activeTab: {
    background: "#2563eb",
    color: "white",
  },

  tableContainer: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    overflow: "hidden",
  },

  tableWrapper: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "900px",
  },

  viewButton: {
    padding: "8px 14px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    background: "#2563eb",
    color: "white",
    fontWeight: "bold",
  },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.55)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    zIndex: 1000,
  },

  modal: {
    background: "white",
    width: "100%",
    maxWidth: "900px",
    maxHeight: "90vh",
    overflowY: "auto",
    borderRadius: "15px",
    padding: "25px",
    boxSizing: "border-box",
  },

  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
    marginBottom: "20px",
  },

  closeButton: {
    border: "none",
    background: "#f1f1f1",
    borderRadius: "50%",
    width: "35px",
    height: "35px",
    cursor: "pointer",
    fontSize: "16px",
  },

  detailsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "15px",
  },

  detailCard: {
    background: "#f8fafc",
    padding: "15px",
    borderRadius: "10px",
  },

  modalFooter: {
    marginTop: "25px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    flexWrap: "wrap",
  },
};

export default Admin;
