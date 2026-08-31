import { useState } from "react";

function Admin() {
  const [adminKey, setAdminKey] = useState("");
  const [leads, setLeads] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadLeads = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://studycare-backend.onrender.com/api/leads",
        {
          headers: {
            "x-admin-key": adminKey,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load leads");
      }

      setLeads(data);
      setLoggedIn(true);
    } catch (err) {
      setError("Invalid admin key or server error.");
      setLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  if (!loggedIn) {
    return (
      <div style={styles.loginPage}>
        <div style={styles.loginCard}>
          <div style={styles.icon}>🔐</div>

          <h1>StudyCare Admin</h1>

          <p>Enter your admin key to view parent leads.</p>

          <input
            type="password"
            placeholder="Admin key"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            style={styles.input}
          />

          <button onClick={loadLeads} style={styles.button}>
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
          <p>Parent Leads</p>
        </div>

        <button
          onClick={() => {
            setLoggedIn(false);
            setAdminKey("");
            setLeads([]);
          }}
          style={styles.logout}
        >
          Logout
        </button>
      </div>

      <div style={styles.stats}>
        <div style={styles.statCard}>
          <strong>{leads.length}</strong>
          <span>Total Leads</span>
        </div>
      </div>

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
                    <td>{lead.parentName}</td>
                    <td>{lead.phone}</td>
                    <td>{lead.grade}</td>
                    <td>{lead.subject || "-"}</td>
                    <td>
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
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
    width: "100%",
    padding: "13px",
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
  },

  logout: {
    padding: "10px 18px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },

  stats: {
    marginBottom: "25px",
  },

  statCard: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    width: "180px",
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
    minWidth: "700px",
  },
};

export default Admin;
