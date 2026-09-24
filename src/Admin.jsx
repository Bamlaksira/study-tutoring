import React, { useEffect, useMemo, useState } from "react";

const API = "https://studycare-backend.onrender.com";

const STATUSES = [
  "New",
  "Contacted",
  "Interested",
  "Consultation",
  "Enrolled",
  "Active",
  "Completed",
  "Lost",
];

const statusColors = {
  New: "#2563eb",
  Contacted: "#7c3aed",
  Interested: "#d97706",
  Consultation: "#0891b2",
  Enrolled: "#16a34a",
  Active: "#059669",
  Completed: "#64748b",
  Lost: "#dc2626",
};

export default function Admin() {
  const [adminKey, setAdminKey] = useState(
    sessionStorage.getItem("studycareAdminKey") || ""
  );

  const [loggedIn, setLoggedIn] = useState(
    !!sessionStorage.getItem("studycareAdminKey")
  );

  const [leads, setLeads] = useState([]);
  const [freeQuizLeads, setFreeQuizLeads] = useState([]);
  const [onboardings, setOnboardings] = useState([]);
  const [examPurchases, setExamPurchases] = useState([]);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  const [selectedQuizLead, setSelectedQuizLead] = useState(null);

  const [activeTab, setActiveTab] = useState("leads");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (loggedIn && adminKey) {
      loadData(adminKey);
    }
  }, [loggedIn]);

  async function getJson(url, headers) {
    const response = await fetch(url, { headers });

    if (!response.ok) {
      const error = new Error(`Request failed: ${response.status}`);
      error.status = response.status;
      throw error;
    }

    return response.json();
  }

  async function loadData(key = adminKey) {
    if (!key) return;

    setLoading(true);
    setError("");

    const headers = {
      "x-admin-key": key,
    };

    const results = await Promise.allSettled([
      getJson(`${API}/api/leads`, headers),
      getJson(`${API}/api/free-quiz-leads`, headers),
      getJson(`${API}/api/onboarding`, headers),
      getJson(`${API}/api/exam-purchases`, headers),
    ]);

    const [
      leadResult,
      freeQuizResult,
      onboardingResult,
      examPurchaseResult,
    ] = results;

    const hasUnauthorized = results.some(
      (result) =>
        result.status === "rejected" &&
        result.reason?.status === 401
    );

    if (hasUnauthorized) {
      sessionStorage.removeItem("studycareAdminKey");
      setLoggedIn(false);
      setError("Invalid admin key.");
      setLoading(false);
      return;
    }

    const errors = [];

    if (leadResult.status === "fulfilled") {
      const data = leadResult.value;

      setLeads(
        Array.isArray(data)
          ? data
          : data.leads || []
      );
    } else {
      errors.push("Parent leads could not be loaded.");
    }

    if (freeQuizResult.status === "fulfilled") {
      const data = freeQuizResult.value;

      setFreeQuizLeads(
        Array.isArray(data)
          ? data
          : data.leads || []
      );
    } else {
      setFreeQuizLeads([]);

      errors.push(
        "Free quiz leads could not be loaded yet."
      );
    }

    if (onboardingResult.status === "fulfilled") {
      const data = onboardingResult.value;

      setOnboardings(
        Array.isArray(data)
          ? data
          : data.onboardings || []
      );
    } else {
      errors.push(
        "Paid onboardings could not be loaded."
      );
    }

    if (examPurchaseResult.status === "fulfilled") {
      const data = examPurchaseResult.value;

      setExamPurchases(
        Array.isArray(data)
          ? data
          : data.purchases || []
      );
    } else {
      errors.push(
        "Exam purchases could not be loaded."
      );
    }

    if (errors.length > 0) {
      setError(errors.join(" "));
    }

    setLoading(false);
  }

  function login(e) {
    e.preventDefault();

    if (!adminKey.trim()) {
      setError("Please enter your admin key.");
      return;
    }

    sessionStorage.setItem(
      "studycareAdminKey",
      adminKey.trim()
    );

    setAdminKey(adminKey.trim());
    setLoggedIn(true);
  }

  function logout() {
    sessionStorage.removeItem("studycareAdminKey");

    setLoggedIn(false);
    setLeads([]);
    setFreeQuizLeads([]);
    setOnboardings([]);
    setExamPurchases([]);

    setSelectedLead(null);
    setSelectedStudent(null);
    setSelectedQuizLead(null);

    setActiveTab("leads");
  }

  async function updateLeadStatus(leadId, status) {
    try {
      const response = await fetch(
        `${API}/api/leads/${leadId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-admin-key": adminKey,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to update lead status."
        );
      }

      setLeads((current) =>
        current.map((lead) =>
          lead._id === leadId
            ? { ...lead, status }
            : lead
        )
      );

      if (selectedLead?._id === leadId) {
        setSelectedLead((current) =>
          current
            ? { ...current, status }
            : current
        );
      }
    } catch (err) {
      setError(
        err.message || "Could not update lead."
      );
    }
  }

  async function updatePurchaseStatus(id, status) {
    try {
      const response = await fetch(
        `${API}/api/exam-purchases/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-admin-key": adminKey,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to update purchase."
        );
      }

      setExamPurchases((current) =>
        current.map((purchase) =>
          purchase._id === id
            ? { ...purchase, status }
            : purchase
        )
      );
    } catch (err) {
      setError(
        err.message || "Could not update purchase."
      );
    }
  }

  const statusCounts = useMemo(() => {
    return leads.reduce((acc, lead) => {
      const status = lead.status || "New";

      acc[status] = (acc[status] || 0) + 1;

      return acc;
    }, {});
  }, [leads]);

  const filteredLeads = useMemo(() => {
    const query = search.trim().toLowerCase();

    return leads.filter((lead) => {
      const matchesStatus =
        statusFilter === "All" ||
        (lead.status || "New") === statusFilter;

      if (!matchesStatus) return false;

      if (!query) return true;

      return [
        lead.parentName,
        lead.phone,
        lead.whatsapp,
        lead.grade,
        lead.city,
        lead.area,
        lead.language,
        lead.challenge,
        lead.source,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value)
            .toLowerCase()
            .includes(query)
        );
    });
  }, [leads, search, statusFilter]);

  function formatDate(date) {
    if (!date) return "—";

    try {
      return new Date(date).toLocaleString();
    } catch {
      return "—";
    }
  }

  function formatPercent(value) {
    if (
      value === undefined ||
      value === null ||
      value === ""
    ) {
      return "—";
    }

    return `${value}%`;
  }

  if (!loggedIn) {
    return (
      <div style={styles.loginPage}>
        <form
          onSubmit={login}
          style={styles.loginCard}
        >
          <div style={styles.logo}>
            StudyCare
          </div>

          <h1 style={styles.loginTitle}>
            Admin Dashboard
          </h1>

          <p style={styles.loginText}>
            Enter your admin key to continue.
          </p>

          <input
            type="password"
            placeholder="Admin key"
            value={adminKey}
            onChange={(e) =>
              setAdminKey(e.target.value)
            }
            style={styles.input}
          />

          {error && (
            <div style={styles.errorBox}>
              {error}
            </div>
          )}

          <button
            type="submit"
            style={styles.primaryButton}
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div>
          <div style={styles.logo}>
            StudyCare
          </div>

          <h1 style={styles.title}>
            Admin Dashboard
          </h1>

          <p style={styles.subtitle}>
            Manage parent leads, quiz leads,
            onboardings, and exam purchases.
          </p>
        </div>

        <div style={styles.headerActions}>
          <button
            onClick={() => loadData()}
            style={styles.secondaryButton}
            disabled={loading}
          >
            {loading
              ? "Refreshing..."
              : "Refresh"}
          </button>

          <button
            onClick={logout}
            style={styles.logoutButton}
          >
            Logout
          </button>
        </div>
      </header>

      {error && (
        <div style={styles.errorBox}>
          {error}
        </div>
      )}

      <section style={styles.statsGrid}>
        <StatCard
          title="Total Leads"
          value={leads.length}
        />

        <StatCard
          title="Free Quiz Leads"
          value={freeQuizLeads.length}
        />

        <StatCard
          title="Paid Onboardings"
          value={onboardings.length}
        />

        <StatCard
          title="Exam Purchases"
          value={examPurchases.length}
        />

        <StatCard
          title="Enrolled"
          value={statusCounts.Enrolled || 0}
        />
      </section>

      <div style={styles.tabs}>
        <TabButton
          active={activeTab === "leads"}
          onClick={() => setActiveTab("leads")}
        >
          Parent Leads ({leads.length})
        </TabButton>

        <TabButton
          active={activeTab === "freeQuiz"}
          onClick={() =>
            setActiveTab("freeQuiz")
          }
        >
          Free Quiz Leads (
          {freeQuizLeads.length})
        </TabButton>

        <TabButton
          active={activeTab === "onboarding"}
          onClick={() =>
            setActiveTab("onboarding")
          }
        >
          Paid Onboardings (
          {onboardings.length})
        </TabButton>

        <TabButton
          active={activeTab === "purchases"}
          onClick={() =>
            setActiveTab("purchases")
          }
        >
          Exam Purchases (
          {examPurchases.length})
        </TabButton>
      </div>

      {activeTab === "leads" ? (
        <section>
          <div style={styles.toolbar}>
            <input
              type="text"
              placeholder="Search parents, phone, grade, city..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              style={styles.searchInput}
            />

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              style={styles.select}
            >
              <option value="All">
                All statuses
              </option>

              {STATUSES.map((status) => (
                <option
                  key={status}
                  value={status}
                >
                  {status} (
                  {statusCounts[status] || 0})
                </option>
              ))}
            </select>
          </div>

          {filteredLeads.length === 0 ? (
            <EmptyState text="No parent leads found." />
          ) : (
            <div style={styles.cardGrid}>
              {filteredLeads.map((lead) => (
                <div
                  key={lead._id}
                  style={styles.card}
                  onClick={() =>
                    setSelectedLead(lead)
                  }
                >
                  <div style={styles.cardTop}>
                    <div>
                      <h3
                        style={styles.cardTitle}
                      >
                        {lead.parentName ||
                          "Unnamed Parent"}
                      </h3>

                      <p
                        style={styles.cardMeta}
                      >
                        Grade {lead.grade || "—"}
                      </p>
                    </div>

                    <StatusBadge
                      status={
                        lead.status || "New"
                      }
                    />
                  </div>

                  <div
                    style={styles.infoList}
                  >
                    <div>
                      📞{" "}
                      {lead.phone ||
                        lead.whatsapp ||
                        "—"}
                    </div>

                    <div>
                      📍{" "}
                      {[
                        lead.city,
                        lead.area,
                      ]
                        .filter(Boolean)
                        .join(", ") || "—"}
                    </div>

                    <div>
                      🌐{" "}
                      {lead.language || "—"}
                    </div>

                    <div>
                      🎯{" "}
                      {lead.challenge ||
                        "No challenge provided"}
                    </div>
                  </div>

                  <div
                    style={styles.cardFooter}
                  >
                    {formatDate(
                      lead.createdAt
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      ) : activeTab === "freeQuiz" ? (
        <section>
          <div style={styles.sectionHeader}>
            <div>
              <h2
                style={styles.sectionTitle}
              >
                Free Quiz Leads
              </h2>

              <p
                style={
                  styles.sectionSubtitle
                }
              >
                Students who completed the
                Grade 6 free quiz.
              </p>
            </div>
          </div>

          {freeQuizLeads.length === 0 ? (
            <EmptyState text="No free quiz leads yet." />
          ) : (
            <div style={styles.cardGrid}>
              {freeQuizLeads.map((lead) => (
                <div
                  key={lead._id}
                  style={styles.card}
                  onClick={() =>
                    setSelectedQuizLead(lead)
                  }
                >
                  <div style={styles.cardTop}>
                    <div>
                      <h3
                        style={styles.cardTitle}
                      >
                        {lead.studentName ||
                          "Unnamed Student"}
                      </h3>

                      <p
                        style={styles.cardMeta}
                      >
                        Grade 6 •{" "}
                        {lead.subject || "—"}
                      </p>
                    </div>

                    <div
                      style={
                        styles.scoreBadge
                      }
                    >
                      {lead.percentage ?? 0}%
                    </div>
                  </div>

                  <div
                    style={
                      styles.quizScoreBox
                    }
                  >
                    <strong>
                      🎯 Score:{" "}
                      {lead.score ?? 0}/
                      {lead.totalQuestions ??
                        0}
                    </strong>

                    <span>
                      {formatPercent(
                        lead.percentage
                      )}
                    </span>
                  </div>

                  <div
                    style={styles.infoList}
                  >
                    <div>
                      👤 Parent:{" "}
                      {lead.parentName ||
                        "—"}
                    </div>

                    <div>
                      📞{" "}
                      {lead.parentPhone ||
                        "—"}
                    </div>

                    <div>
                      📍{" "}
                      {[
                        lead.city,
                        lead.region,
                      ]
                        .filter(Boolean)
                        .join(", ") || "—"}
                    </div>

                    {lead.preferredLanguage && (
                      <div>
                        🌐{" "}
                        {lead.preferredLanguage}
                      </div>
                    )}

                    {lead.parentEmail && (
                      <div>
                        ✉️{" "}
                        {lead.parentEmail}
                      </div>
                    )}
                  </div>

                  <div
                    style={
                      styles.quizPermission
                    }
                  >
                    <span>
                      StudyCare Updates
                    </span>

                    <strong
                      style={{
                        color:
                          lead.marketingConsent
                            ? "#15803d"
                            : "#64748b",
                      }}
                    >
                      {lead.marketingConsent
                        ? "Allowed"
                        : "Not allowed"}
                    </strong>
                  </div>

                  <div
                    style={styles.cardFooter}
                  >
                    Submitted{" "}
                    {formatDate(
                      lead.createdAt
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      ) : activeTab === "onboarding" ? (
        <section>
          <div style={styles.sectionHeader}>
            <div>
              <h2
                style={styles.sectionTitle}
              >
                Paid Onboardings
              </h2>

              <p
                style={
                  styles.sectionSubtitle
                }
              >
                Students who have completed
                the paid onboarding process.
              </p>
            </div>
          </div>

          {onboardings.length === 0 ? (
            <EmptyState text="No paid onboardings yet." />
          ) : (
            <div style={styles.cardGrid}>
              {onboardings.map((student) => (
                <div
                  key={student._id}
                  style={styles.card}
                  onClick={() =>
                    setSelectedStudent(
                      student
                    )
                  }
                >
                  <h3
                    style={styles.cardTitle}
                  >
                    {student.studentName ||
                      student.name ||
                      "Unnamed Student"}
                  </h3>

                  <p
                    style={styles.cardMeta}
                  >
                    Grade{" "}
                    {student.grade || "—"}
                  </p>

                  <div
                    style={styles.infoList}
                  >
                    <div>
                      👤 Parent:{" "}
                      {student.parentName ||
                        "—"}
                    </div>

                    <div>
                      📞{" "}
                      {student.parentPhone ||
                        student.phone ||
                        "—"}
                    </div>

                    <div>
                      📚{" "}
                      {student.subject ||
                        "Multiple subjects"}
                    </div>

                    <div>
                      🗓️{" "}
                      {formatDate(
                        student.createdAt
                      )}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();

                      setSelectedStudent(
                        student
                      );
                    }}
                    style={
                      styles.secondaryButton
                    }
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      ) : (
        <section>
          <div style={styles.sectionHeader}>
            <div>
              <h2
                style={styles.sectionTitle}
              >
                Exam Purchases
              </h2>

              <p
                style={
                  styles.sectionSubtitle
                }
              >
                Review and approve exam
                practice purchases.
              </p>
            </div>
          </div>

          {examPurchases.length === 0 ? (
            <EmptyState text="No exam purchases yet." />
          ) : (
            <div style={styles.cardGrid}>
              {examPurchases.map(
                (purchase) => (
                  <div
                    key={purchase._id}
                    style={styles.card}
                  >
                    <div
                      style={
                        styles.cardTop
                      }
                    >
                      <div>
                        <h3
                          style={
                            styles.cardTitle
                          }
                        >
                          {purchase.parentName ||
                            purchase.studentName ||
                            "Exam Purchase"}
                        </h3>

                        <p
                          style={
                            styles.cardMeta
                          }
                        >
                          {purchase.examTitle ||
                            purchase.examName ||
                            "Exam Practice"}
                        </p>
                      </div>

                      <StatusBadge
                        status={
                          purchase.status ||
                          "Pending"
                        }
                      />
                    </div>

                    <div
                      style={
                        styles.infoList
                      }
                    >
                      <div>
                        👤 Student:{" "}
                        {purchase.studentName ||
                          "—"}
                      </div>

                      <div>
                        📞{" "}
                        {purchase.phone ||
                          purchase.parentPhone ||
                          "—"}
                      </div>

                      <div>
                        💰 Amount:{" "}
                        {purchase.amount
                          ? `${purchase.amount} ETB`
                          : "—"}
                      </div>

                      <div>
                        🗓️{" "}
                        {formatDate(
                          purchase.createdAt
                        )}
                      </div>
                    </div>

                    <div
                      style={
                        styles.purchaseActions
                      }
                    >
                      <button
                        onClick={() =>
                          updatePurchaseStatus(
                            purchase._id,
                            "Approved"
                          )
                        }
                        style={
                          styles.approveButton
                        }
                        disabled={
                          purchase.status ===
                          "Approved"
                        }
                      >
                        Approve
                      </button>

                      <button
                        onClick={() =>
                          updatePurchaseStatus(
                            purchase._id,
                            "Rejected"
                          )
                        }
                        style={
                          styles.rejectButton
                        }
                        disabled={
                          purchase.status ===
                          "Rejected"
                        }
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </section>
      )}

      {selectedLead && (
        <Modal
          title={
            selectedLead.parentName ||
            "Parent Lead"
          }
          onClose={() =>
            setSelectedLead(null)
          }
        >
          <DetailSection title="Parent Information">
            <DetailRow
              label="Parent Name"
              value={
                selectedLead.parentName
              }
            />

            <DetailRow
              label="Phone / WhatsApp"
              value={
                selectedLead.phone ||
                selectedLead.whatsapp
              }
            />

            <DetailRow
              label="Grade"
              value={selectedLead.grade}
            />

            <DetailRow
              label="City"
              value={selectedLead.city}
            />

            <DetailRow
              label="Area"
              value={selectedLead.area}
            />

            <DetailRow
              label="Preferred Language"
              value={
                selectedLead.language
              }
            />
          </DetailSection>

          <DetailSection title="Learning Need">
            <DetailRow
              label="Main Challenge"
              value={
                selectedLead.challenge
              }
            />

            <DetailRow
              label="How They Heard About StudyCare"
              value={selectedLead.source}
            />
          </DetailSection>

          <DetailSection title="Lead Status">
            <select
              value={
                selectedLead.status || "New"
              }
              onChange={(e) =>
                updateLeadStatus(
                  selectedLead._id,
                  e.target.value
                )
              }
              style={styles.select}
            >
              {STATUSES.map((status) => (
                <option
                  key={status}
                  value={status}
                >
                  {status}
                </option>
              ))}
            </select>
          </DetailSection>

          <DetailSection title="Submitted">
            <DetailRow
              label="Date"
              value={formatDate(
                selectedLead.createdAt
              )}
            />
          </DetailSection>
        </Modal>
      )}

      {selectedQuizLead && (
        <Modal
          title={
            selectedQuizLead.studentName ||
            "Free Quiz Lead"
          }
          onClose={() =>
            setSelectedQuizLead(null)
          }
        >
          <DetailSection title="Student & Quiz">
            <DetailRow
              label="Student Name"
              value={
                selectedQuizLead.studentName
              }
            />

            <DetailRow
              label="Grade"
              value="Grade 6"
            />

            <DetailRow
              label="Subject"
              value={
                selectedQuizLead.subject
              }
            />

            <DetailRow
              label="Score"
              value={`${selectedQuizLead.score ?? 0}/${selectedQuizLead.totalQuestions ?? 0}`}
            />

            <DetailRow
              label="Percentage"
              value={formatPercent(
                selectedQuizLead.percentage
              )}
            />
          </DetailSection>

          <DetailSection title="Parent & Contact">
            <DetailRow
              label="Parent Name"
              value={
                selectedQuizLead.parentName
              }
            />

            <DetailRow
              label="Phone / WhatsApp"
              value={
                selectedQuizLead.parentPhone
              }
            />

            <DetailRow
              label="Email"
              value={
                selectedQuizLead.parentEmail
              }
            />
          </DetailSection>

          <DetailSection title="Location & Language">
            <DetailRow
              label="Region"
              value={selectedQuizLead.region}
            />

            <DetailRow
              label="City / Town"
              value={selectedQuizLead.city}
            />

            <DetailRow
              label="Preferred Language"
              value={
                selectedQuizLead.preferredLanguage
              }
            />
          </DetailSection>

          <DetailSection title="StudyCare Updates">
            <DetailRow
              label="Updates Permission"
              value={
                selectedQuizLead.marketingConsent
                  ? "Allowed"
                  : "Not allowed"
              }
            />

            <DetailRow
              label="Permission Given At"
              value={
                selectedQuizLead.marketingConsentAt
                  ? formatDate(
                      selectedQuizLead.marketingConsentAt
                    )
                  : "Not given"
              }
            />
          </DetailSection>

          <DetailSection title="Submission">
            <DetailRow
              label="Submitted"
              value={formatDate(
                selectedQuizLead.createdAt
              )}
            />
          </DetailSection>
        </Modal>
      )}

      {selectedStudent && (
        <Modal
          title={
            selectedStudent.studentName ||
            selectedStudent.name ||
            "Student"
          }
          onClose={() =>
            setSelectedStudent(null)
          }
        >
          <DetailSection title="Student">
            <DetailRow
              label="Student Name"
              value={
                selectedStudent.studentName ||
                selectedStudent.name
              }
            />

            <DetailRow
              label="Grade"
              value={
                selectedStudent.grade
              }
            />

            <DetailRow
              label="Subject"
              value={
                selectedStudent.subject
              }
            />
          </DetailSection>

          <DetailSection title="Parent">
            <DetailRow
              label="Parent Name"
              value={
                selectedStudent.parentName
              }
            />

            <DetailRow
              label="Phone"
              value={
                selectedStudent.parentPhone ||
                selectedStudent.phone
              }
            />
          </DetailSection>

          <DetailSection title="Submitted">
            <DetailRow
              label="Date"
              value={formatDate(
                selectedStudent.createdAt
              )}
            />
          </DetailSection>
        </Modal>
      )}
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div style={styles.statCard}>
      <div style={styles.statTitle}>
        {title}
      </div>

      <div style={styles.statValue}>
        {value}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}) {
  return (
    <button
      onClick={onClick}
      style={{
        ...styles.tabButton,
        ...(active
          ? styles.activeTabButton
          : {}),
      }}
    >
      {children}
    </button>
  );
}

function StatusBadge({ status }) {
  const color =
    statusColors[status] || "#64748b";

  return (
    <span
      style={{
        ...styles.statusBadge,
        color,
        background: `${color}15`,
      }}
    >
      {status}
    </span>
  );
}

function EmptyState({ text }) {
  return (
    <div style={styles.emptyState}>
      {text}
    </div>
  );
}

function Modal({
  title,
  onClose,
  children,
}) {
  return (
    <div
      style={styles.modalOverlay}
      onClick={onClose}
    >
      <div
        style={styles.modal}
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>
            {title}
          </h2>

          <button
            onClick={onClose}
            style={styles.closeButton}
          >
            ×
          </button>
        </div>

        <div style={styles.modalBody}>
          {children}
        </div>
      </div>
    </div>
  );
}

function DetailSection({
  title,
  children,
}) {
  return (
    <div style={styles.detailSection}>
      <h3
        style={
          styles.detailSectionTitle
        }
      >
        {title}
      </h3>

      <div style={styles.detailGrid}>
        {children}
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div style={styles.detailRow}>
      <span style={styles.detailLabel}>
        {label}
      </span>

      <span style={styles.detailValue}>
        {value || "—"}
      </span>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    color: "#0f172a",
    padding: "24px",
    boxSizing: "border-box",
  },

  header: {
    maxWidth: "1400px",
    margin: "0 auto 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
    flexWrap: "wrap",
  },

  logo: {
    fontSize: "22px",
    fontWeight: 800,
    color: "#0f766e",
    marginBottom: "8px",
  },

  title: {
    margin: 0,
    fontSize: "32px",
    fontWeight: 800,
  },

  subtitle: {
    margin: "8px 0 0",
    color: "#64748b",
  },

  headerActions: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },

  statsGrid: {
    maxWidth: "1400px",
    margin: "0 auto 24px",
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "14px",
  },

  statCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "20px",
    boxShadow:
      "0 4px 14px rgba(15, 23, 42, 0.05)",
  },

  statTitle: {
    fontSize: "14px",
    color: "#64748b",
    marginBottom: "8px",
  },

  statValue: {
    fontSize: "30px",
    fontWeight: 800,
  },

  tabs: {
    maxWidth: "1400px",
    margin: "0 auto 24px",
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },

  tabButton: {
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    color: "#334155",
    padding: "11px 15px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: 700,
  },

  activeTabButton: {
    background: "#0f766e",
    color: "#ffffff",
    borderColor: "#0f766e",
  },

  toolbar: {
    maxWidth: "1400px",
    margin: "0 auto 20px",
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },

  searchInput: {
    flex: 1,
    minWidth: "240px",
    padding: "12px 14px",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    fontSize: "15px",
    boxSizing: "border-box",
  },

  select: {
    padding: "12px 14px",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    background: "#ffffff",
    fontSize: "15px",
  },

  cardGrid: {
    maxWidth: "1400px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "16px",
  },

  card: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "18px",
    cursor: "pointer",
    boxShadow:
      "0 4px 14px rgba(15, 23, 42, 0.04)",
  },

  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px",
    marginBottom: "14px",
  },

  cardTitle: {
    margin: 0,
    fontSize: "18px",
    fontWeight: 800,
  },

  cardMeta: {
    margin: "5px 0 0",
    color: "#64748b",
    fontSize: "14px",
  },

  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "6px 9px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 800,
    whiteSpace: "nowrap",
  },

  scoreBadge: {
    minWidth: "50px",
    textAlign: "center",
    padding: "7px 9px",
    borderRadius: "10px",
    background: "#ecfdf5",
    color: "#047857",
    fontWeight: 800,
  },

  quizScoreBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
    padding: "12px",
    borderRadius: "12px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    marginBottom: "14px",
  },

  infoList: {
    display: "grid",
    gap: "9px",
    color: "#334155",
    fontSize: "14px",
    lineHeight: 1.4,
  },

  cardFooter: {
    marginTop: "16px",
    paddingTop: "12px",
    borderTop: "1px solid #e2e8f0",
    color: "#94a3b8",
    fontSize: "12px",
  },

  quizPermission: {
    marginTop: "14px",
    paddingTop: "12px",
    borderTop: "1px solid #e2e8f0",
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
    fontSize: "13px",
  },

  sectionHeader: {
    maxWidth: "1400px",
    margin: "0 auto 18px",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "24px",
    fontWeight: 800,
  },

  sectionSubtitle: {
    margin: "6px 0 0",
    color: "#64748b",
  },

  purchaseActions: {
    display: "flex",
    gap: "10px",
    marginTop: "16px",
  },

  primaryButton: {
    width: "100%",
    padding: "13px 16px",
    border: "none",
    borderRadius: "10px",
    background: "#0f766e",
    color: "#ffffff",
    fontWeight: 800,
    cursor: "pointer",
    fontSize: "15px",
  },

  secondaryButton: {
    padding: "10px 14px",
    border: "1px solid #cbd5e1",
    borderRadius: "9px",
    background: "#ffffff",
    color: "#334155",
    fontWeight: 700,
    cursor: "pointer",
  },

  logoutButton: {
    padding: "10px 14px",
    border: "1px solid #fecaca",
    borderRadius: "9px",
    background: "#fff1f2",
    color: "#be123c",
    fontWeight: 700,
    cursor: "pointer",
  },

  approveButton: {
    flex: 1,
    padding: "10px 14px",
    border: "none",
    borderRadius: "9px",
    background: "#16a34a",
    color: "#ffffff",
    fontWeight: 800,
    cursor: "pointer",
  },

  rejectButton: {
    flex: 1,
    padding: "10px 14px",
    border: "none",
    borderRadius: "9px",
    background: "#dc2626",
    color: "#ffffff",
    fontWeight: 800,
    cursor: "pointer",
  },

  emptyState: {
    maxWidth: "1400px",
    margin: "0 auto",
    background: "#ffffff",
    border: "1px dashed #cbd5e1",
    borderRadius: "16px",
    padding: "50px 20px",
    textAlign: "center",
    color: "#64748b",
  },

  errorBox: {
    maxWidth: "1400px",
    margin: "0 auto 20px",
    padding: "12px 14px",
    borderRadius: "10px",
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#b91c1c",
  },

  loginPage: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    background: "#f8fafc",
    boxSizing: "border-box",
  },

  loginCard: {
    width: "100%",
    maxWidth: "420px",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "18px",
    padding: "28px",
    boxShadow:
      "0 10px 30px rgba(15, 23, 42, 0.08)",
    boxSizing: "border-box",
  },

  loginTitle: {
    margin: "0 0 8px",
    fontSize: "26px",
  },

  loginText: {
    margin: "0 0 20px",
    color: "#64748b",
  },

  input: {
    width: "100%",
    padding: "13px 14px",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    fontSize: "15px",
    boxSizing: "border-box",
    marginBottom: "14px",
  },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15, 23, 42, 0.55)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    zIndex: 1000,
    boxSizing: "border-box",
  },

  modal: {
    width: "100%",
    maxWidth: "700px",
    maxHeight: "90vh",
    overflowY: "auto",
    background: "#ffffff",
    borderRadius: "18px",
    boxShadow:
      "0 20px 60px rgba(15, 23, 42, 0.25)",
  },

  modalHeader: {
    padding: "18px 20px",
    borderBottom: "1px solid #e2e8f0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
  },

  modalTitle: {
    margin: 0,
    fontSize: "22px",
    fontWeight: 800,
  },

  closeButton: {
    width: "36px",
    height: "36px",
    border: "none",
    borderRadius: "50%",
    background: "#f1f5f9",
    color: "#334155",
    fontSize: "24px",
    cursor: "pointer",
  },

  modalBody: {
    padding: "20px",
  },

  detailSection: {
    marginBottom: "22px",
  },

  detailSectionTitle: {
    margin: "0 0 12px",
    fontSize: "16px",
    fontWeight: 800,
    color: "#0f766e",
  },

  detailGrid: {
    display: "grid",
    gap: "10px",
  },

  detailRow: {
    display: "grid",
    gridTemplateColumns:
      "minmax(140px, 0.8fr) minmax(0, 1.5fr)",
    gap: "15px",
    padding: "10px 0",
    borderBottom: "1px solid #f1f5f9",
  },

  detailLabel: {
    color: "#64748b",
    fontSize: "14px",
  },

  detailValue: {
    color: "#0f172a",
    fontWeight: 600,
    wordBreak: "break-word",
  },
};