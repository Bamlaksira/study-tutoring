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

function displayValue(value) {
  if (value === undefined || value === null || value === "") return "—";
  if (Array.isArray(value)) return value.length ? value.join(", ") : "—";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

function StatusBadge({ status }) {
  return (
    <span
      style={{
        background: `${statusColors[status] || "#64748b"}18`,
        color: statusColors[status] || "#64748b",
        border: `1px solid ${statusColors[status] || "#64748b"}40`,
        padding: "5px 9px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 700,
        whiteSpace: "nowrap",
      }}
    >
      {status || "New"}
    </span>
  );
}

function App() {
  const [adminKey, setAdminKey] = useState(
    sessionStorage.getItem("studycareAdminKey") || ""
  );

  const [loggedIn, setLoggedIn] = useState(
    !!sessionStorage.getItem("studycareAdminKey")
  );

  const [leads, setLeads] = useState([]);
  const [onboardings, setOnboardings] = useState([]);
  const [examPurchases, setExamPurchases] = useState([]);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);

  const [activeTab, setActiveTab] = useState("leads");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadData(key = adminKey) {
    if (!key) return;

    setLoading(true);
    setError("");

    try {
      const headers = {
        "x-admin-key": key,
      };

      const [leadResponse, onboardingResponse, examPurchaseResponse] =
        await Promise.all([
          fetch(`${API}/api/leads`, { headers }),
          fetch(`${API}/api/onboarding`, { headers }),
          fetch(`${API}/api/exam-purchases`, { headers }),
        ]);

      if (
        leadResponse.status === 401 ||
        onboardingResponse.status === 401 ||
        examPurchaseResponse.status === 401
      ) {
        sessionStorage.removeItem("studycareAdminKey");
        setLoggedIn(false);
        setError("Invalid admin key.");
        return;
      }

      if (!leadResponse.ok) {
        throw new Error("Could not load leads.");
      }

      if (!onboardingResponse.ok) {
        throw new Error("Could not load onboardings.");
      }

      if (!examPurchaseResponse.ok) {
        throw new Error("Could not load exam purchases.");
      }

      const leadData = await leadResponse.json();
      const onboardingData = await onboardingResponse.json();
      const examPurchaseData = await examPurchaseResponse.json();

      setLeads(
        Array.isArray(leadData)
          ? leadData
          : leadData.leads || []
      );

      setOnboardings(
        Array.isArray(onboardingData)
          ? onboardingData
          : onboardingData.onboardings || []
      );

      setExamPurchases(
        Array.isArray(examPurchaseData)
          ? examPurchaseData
          : examPurchaseData.purchases || []
      );
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (loggedIn && adminKey) {
      loadData(adminKey);
    }
  }, [loggedIn]);

  function login(e) {
    e.preventDefault();

    if (!adminKey.trim()) {
      setError("Enter the admin key.");
      return;
    }

    sessionStorage.setItem(
      "studycareAdminKey",
      adminKey.trim()
    );

    setAdminKey(adminKey.trim());
    setLoggedIn(true);
    setError("");
  }

  function logout() {
    sessionStorage.removeItem("studycareAdminKey");

    setLoggedIn(false);
    setLeads([]);
    setOnboardings([]);
    setExamPurchases([]);
    setSelectedLead(null);
    setSelectedStudent(null);
    setActiveTab("leads");
  }

  async function updateStatus(id, status) {
    try {
      const response = await fetch(
        `${API}/api/leads/${id}/status`,
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
        throw new Error("Could not update lead status.");
      }

      setLeads((current) =>
        current.map((lead) =>
          lead._id === id
            ? { ...lead, leadStatus: status }
            : lead
        )
      );

      if (selectedLead?._id === id) {
        setSelectedLead((current) =>
          current
            ? { ...current, leadStatus: status }
            : current
        );
      }
    } catch (err) {
      setError(err.message);
    }
  }

  async function updateExamPurchaseStatus(
    id,
    paymentStatus
  ) {
    try {
      const response = await fetch(
        `${API}/api/exam-purchases/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-admin-key": adminKey,
          },
          body: JSON.stringify({ paymentStatus }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Could not update exam purchase status."
        );
      }

      setExamPurchases((current) =>
        current.map((purchase) =>
          purchase._id === id
            ? data.purchase
            : purchase
        )
      );

      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  const filteredLeads = useMemo(() => {
    const term = search.toLowerCase().trim();

    return leads.filter((lead) => {
      const status = lead.leadStatus || "New";

      if (
        statusFilter !== "All" &&
        status !== statusFilter
      ) {
        return false;
      }

      if (!term) return true;

      const text = [
        lead.parentName,
        lead.phone,
        lead.grade,
        lead.subject,
        lead.city,
        lead.location,
        lead.area,
        lead.country,
        lead.mainLearningChallenge,
        lead.marketingSource,
        lead.heardAbout,
        lead.preferredLanguage,
      ]
        .map(displayValue)
        .join(" ")
        .toLowerCase();

      return text.includes(term);
    });
  }, [leads, search, statusFilter]);

  const statusCounts = useMemo(() => {
    const counts = {
      All: leads.length,
    };

    STATUSES.forEach((status) => {
      counts[status] = leads.filter(
        (lead) =>
          (lead.leadStatus || "New") === status
      ).length;
    });

    return counts;
  }, [leads]);

  if (!loggedIn) {
    return (
      <div style={styles.loginPage}>
        <form onSubmit={login} style={styles.loginCard}>
          <div style={styles.logo}>StudyCare</div>

          <h1 style={styles.loginTitle}>
            Admin Dashboard
          </h1>

          <p style={styles.muted}>
            Sign in to manage parent leads, paid
            onboarding profiles, and exam purchases.
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
            <div style={styles.error}>
              {error}
            </div>
          )}

          <button
            type="submit"
            style={styles.primaryButton}
          >
            Sign In
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div>
          <div style={styles.logo}>StudyCare</div>
          <div style={styles.headerSubtitle}>
            Admin Dashboard
          </div>
        </div>

        <div style={styles.headerActions}>
          <button
            onClick={() => loadData()}
            style={styles.secondaryButton}
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>

          <button
            onClick={logout}
            style={styles.logoutButton}
          >
            Logout
          </button>
        </div>
      </header>

      <main style={styles.container}>
        {error && (
          <div style={styles.errorBox}>
            {error}

            <button
              onClick={() => setError("")}
              style={styles.closeError}
            >
              ×
            </button>
          </div>
        )}

        <section style={styles.statsGrid}>
          <StatCard
            title="Total Leads"
            value={leads.length}
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
          <button
            onClick={() => setActiveTab("leads")}
            style={{
              ...styles.tab,
              ...(activeTab === "leads"
                ? styles.activeTab
                : {}),
            }}
          >
            Parent Leads ({leads.length})
          </button>

          <button
            onClick={() =>
              setActiveTab("onboarding")
            }
            style={{
              ...styles.tab,
              ...(activeTab === "onboarding"
                ? styles.activeTab
                : {}),
            }}
          >
            Paid Onboardings ({onboardings.length})
          </button>

          <button
            onClick={() =>
              setActiveTab("purchases")
            }
            style={{
              ...styles.tab,
              ...(activeTab === "purchases"
                ? styles.activeTab
                : {}),
            }}
          >
            Exam Purchases ({examPurchases.length})
          </button>
        </div>

        {activeTab === "leads" ? (
          <>
            <section style={styles.toolbar}>
              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search parent, phone, grade, city, challenge..."
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
            </section>

            <div style={styles.statusScroller}>
              {["All", ...STATUSES].map(
                (status) => (
                  <button
                    key={status}
                    onClick={() =>
                      setStatusFilter(status)
                    }
                    style={{
                      ...styles.statusFilterButton,
                      ...(statusFilter === status
                        ? styles.statusFilterActive
                        : {}),
                    }}
                  >
                    {status}:{" "}
                    {statusCounts[status] || 0}
                  </button>
                )
              )}
            </div>

            <section style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <h2 style={styles.sectionTitle}>
                    Parent Leads
                  </h2>

                  <p style={styles.muted}>
                    Showing{" "}
                    {filteredLeads.length} of{" "}
                    {leads.length} leads
                  </p>
                </div>
              </div>

              {filteredLeads.length === 0 ? (
                <div style={styles.empty}>
                  No leads found.
                </div>
              ) : (
                <>
                  <div
                    style={styles.desktopTable}
                  >
                    <table style={styles.table}>
                      <thead>
                        <tr>
                          <th style={styles.th}>
                            Parent
                          </th>

                          <th style={styles.th}>
                            Phone
                          </th>

                          <th style={styles.th}>
                            Grade
                          </th>

                          <th style={styles.th}>
                            Location
                          </th>

                          <th style={styles.th}>
                            Source
                          </th>

                          <th style={styles.th}>
                            Status
                          </th>

                          <th style={styles.th}>
                            Date
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {filteredLeads.map(
                          (lead) => (
                            <tr
                              key={lead._id}
                              onClick={() =>
                                setSelectedLead(
                                  lead
                                )
                              }
                              style={
                                styles.tableRow
                              }
                            >
                              <td style={styles.td}>
                                <strong>
                                  {displayValue(
                                    lead.parentName
                                  )}
                                </strong>
                              </td>

                              <td style={styles.td}>
                                {displayValue(
                                  lead.phone
                                )}
                              </td>

                              <td style={styles.td}>
                                {displayValue(
                                  lead.grade
                                )}
                              </td>

                              <td style={styles.td}>
                                {displayValue(
                                  lead.city ||
                                    lead.location
                                )}

                                {lead.area && (
                                  <div
                                    style={
                                      styles.smallText
                                    }
                                  >
                                    {lead.area}
                                  </div>
                                )}
                              </td>

                              <td style={styles.td}>
                                {displayValue(
                                  lead.marketingSource ||
                                    lead.heardAbout
                                )}
                              </td>

                              <td
                                style={styles.td}
                                onClick={(e) =>
                                  e.stopPropagation()
                                }
                              >
                                <select
                                  value={
                                    lead.leadStatus ||
                                    "New"
                                  }
                                  onChange={(e) =>
                                    updateStatus(
                                      lead._id,
                                      e.target.value
                                    )
                                  }
                                  style={{
                                    ...styles.statusSelect,
                                    borderColor:
                                      statusColors[
                                        lead.leadStatus ||
                                          "New"
                                      ] ||
                                      "#64748b",
                                  }}
                                >
                                  {STATUSES.map(
                                    (status) => (
                                      <option
                                        key={status}
                                        value={status}
                                      >
                                        {status}
                                      </option>
                                    )
                                  )}
                                </select>
                              </td>

                              <td style={styles.td}>
                                {formatDate(
                                  lead.createdAt
                                )}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div
                    style={styles.mobileCards}
                  >
                    {filteredLeads.map(
                      (lead) => (
                        <div
                          key={lead._id}
                          onClick={() =>
                            setSelectedLead(
                              lead
                            )
                          }
                          style={
                            styles.leadMobileCard
                          }
                        >
                          <div
                            style={
                              styles.mobileTop
                            }
                          >
                            <strong>
                              {displayValue(
                                lead.parentName
                              )}
                            </strong>

                            <StatusBadge
                              status={
                                lead.leadStatus ||
                                "New"
                              }
                            />
                          </div>

                          <div
                            style={
                              styles.mobileInfo
                            }
                          >
                            📞{" "}
                            {displayValue(
                              lead.phone
                            )}
                          </div>

                          <div
                            style={
                              styles.mobileInfo
                            }
                          >
                            🎓 Grade{" "}
                            {displayValue(
                              lead.grade
                            )}
                          </div>

                          <div
                            style={
                              styles.mobileInfo
                            }
                          >
                            📍{" "}
                            {displayValue(
                              lead.city ||
                                lead.location
                            )}
                          </div>

                          <div
                            style={
                              styles.mobileInfo
                            }
                          >
                            📣{" "}
                            {displayValue(
                              lead.marketingSource ||
                                lead.heardAbout
                            )}
                          </div>

                          <select
                            value={
                              lead.leadStatus ||
                              "New"
                            }
                            onChange={(e) => {
                              e.stopPropagation();

                              updateStatus(
                                lead._id,
                                e.target.value
                              );
                            }}
                            onClick={(e) =>
                              e.stopPropagation()
                            }
                            style={
                              styles.mobileStatusSelect
                            }
                          >
                            {STATUSES.map(
                              (status) => (
                                <option
                                  key={status}
                                  value={status}
                                >
                                  {status}
                                </option>
                              )
                            )}
                          </select>
                        </div>
                      )
                    )}
                  </div>
                </>
              )}
            </section>
          </>
        ) : activeTab === "onboarding" ? (
          <section style={styles.card}>
            <div style={styles.cardHeader}>
              <div>
                <h2 style={styles.sectionTitle}>
                  Paid Onboardings
                </h2>

                <p style={styles.muted}>
                  Detailed student profiles
                  submitted after enrollment.
                </p>
              </div>
            </div>

            {onboardings.length === 0 ? (
              <div style={styles.empty}>
                No paid onboardings yet.
              </div>
            ) : (
              <div style={styles.studentGrid}>
                {onboardings.map(
                  (student) => (
                    <button
                      key={student._id}
                      onClick={() =>
                        setSelectedStudent(
                          student
                        )
                      }
                      style={
                        styles.studentCard
                      }
                    >
                      <div
                        style={
                          styles.studentName
                        }
                      >
                        {displayValue(
                          student.childName
                        )}
                      </div>

                      {student.preferredName && (
                        <div
                          style={
                            styles.smallText
                          }
                        >
                          Preferred name:{" "}
                          {
                            student.preferredName
                          }
                        </div>
                      )}

                      <div
                        style={
                          styles.studentLine
                        }
                      >
                        Grade{" "}
                        {displayValue(
                          student.grade
                        )}
                      </div>

                      <div
                        style={
                          styles.studentLine
                        }
                      >
                        Parent:{" "}
                        {displayValue(
                          student.parentName
                        )}
                      </div>

                      <div
                        style={
                          styles.studentLine
                        }
                      >
                        📞{" "}
                        {displayValue(
                          student.phone
                        )}
                      </div>

                      <div
                        style={
                          styles.studentDate
                        }
                      >
                        Submitted{" "}
                        {formatDate(
                          student.createdAt
                        )}
                      </div>
                    </button>
                  )
                )}
              </div>
            )}
          </section>
        ) : (
          <section style={styles.card}>
            <div style={styles.cardHeader}>
              <div>
                <h2 style={styles.sectionTitle}>
                  Exam Purchases
                </h2>

                <p style={styles.muted}>
                  Review CBE transfer submissions
                  and manage exam access.
                </p>
              </div>
            </div>

            {examPurchases.length === 0 ? (
              <div style={styles.empty}>
                No exam purchases yet.
              </div>
            ) : (
              <div style={styles.purchaseGrid}>
                {examPurchases.map(
                  (purchase) => (
                    <div
                      key={purchase._id}
                      style={
                        styles.purchaseCard
                      }
                    >
                      <div
                        style={
                          styles.studentName
                        }
                      >
                        {displayValue(
                          purchase.customerName
                        )}
                      </div>

                      <div
                        style={
                          styles.studentLine
                        }
                      >
                        📚{" "}
                        {displayValue(
                          purchase.productName
                        )}
                      </div>

                      <div
                        style={
                          styles.studentLine
                        }
                      >
                        💰{" "}
                        {displayValue(
                          purchase.amount
                        )}{" "}
                        ETB
                      </div>

                      <div
                        style={
                          styles.studentLine
                        }
                      >
                        📞{" "}
                        {displayValue(
                          purchase.phone
                        )}
                      </div>

                      {purchase.email && (
                        <div
                          style={
                            styles.studentLine
                          }
                        >
                          ✉️{" "}
                          {displayValue(
                            purchase.email
                          )}
                        </div>
                      )}

                      <div
                        style={
                          styles.referenceBox
                        }
                      >
                        <div
                          style={
                            styles.referenceLabel
                          }
                        >
                          Transaction Reference
                        </div>

                        <div
                          style={
                            styles.referenceValue
                          }
                        >
                          {displayValue(
                            purchase.transactionReference
                          )}
                        </div>
                      </div>

                      <div
                        style={
                          styles.purchaseStatusRow
                        }
                      >
                        <div>
                          <div
                            style={
                              styles.referenceLabel
                            }
                          >
                            Payment
                          </div>

                          <strong>
                            {displayValue(
                              purchase.paymentStatus
                            )}
                          </strong>
                        </div>

                        <div>
                          <div
                            style={
                              styles.referenceLabel
                            }
                          >
                            Access
                          </div>

                          <strong>
                            {displayValue(
                              purchase.accessStatus
                            )}
                          </strong>
                        </div>
                      </div>

                      <div
                        style={
                          styles.studentDate
                        }
                      >
                        Submitted{" "}
                        {formatDate(
                          purchase.createdAt
                        )}
                      </div>

                      <div
                        style={
                          styles.purchaseActions
                        }
                      >
                        <button
                          type="button"
                          onClick={() =>
                            updateExamPurchaseStatus(
                              purchase._id,
                              "Approved"
                            )
                          }
                          disabled={
                            purchase.paymentStatus ===
                            "Approved"
                          }
                          style={{
                            ...styles.approveButton,
                            opacity:
                              purchase.paymentStatus ===
                              "Approved"
                                ? 0.5
                                : 1,
                          }}
                        >
                          Approve Payment
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            updateExamPurchaseStatus(
                              purchase._id,
                              "Rejected"
                            )
                          }
                          disabled={
                            purchase.paymentStatus ===
                            "Rejected"
                          }
                          style={{
                            ...styles.rejectButton,
                            opacity:
                              purchase.paymentStatus ===
                              "Rejected"
                                ? 0.5
                                : 1,
                          }}
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
      </main>

      {selectedLead && (
        <Modal
          onClose={() =>
            setSelectedLead(null)
          }
        >
          <h2 style={styles.modalTitle}>
            Parent Lead Details
          </h2>

          <DetailSection
            title="Parent & Contact"
            data={{
              "Parent Name":
                selectedLead.parentName,
              Phone: selectedLead.phone,
              Email: selectedLead.email,
              Grade: selectedLead.grade,
              "Preferred Language":
                selectedLead.preferredLanguage,
            }}
          />

          <DetailSection
            title="Location"
            data={{
              City:
                selectedLead.city ||
                selectedLead.location,
              Area: selectedLead.area,
              Country:
                selectedLead.country,
            }}
          />

          <DetailSection
            title="Learning Need"
            data={{
              "Main Challenge":
                selectedLead.mainLearningChallenge,
              Subject: selectedLead.subject,
            }}
          />

          <DetailSection
            title="Marketing"
            data={{
              Source:
                selectedLead.marketingSource ||
                selectedLead.heardAbout,
              UTMSource:
                selectedLead.utmSource,
              UTMMedium:
                selectedLead.utmMedium,
              UTMCampaign:
                selectedLead.utmCampaign,
              LandingPage:
                selectedLead.landingPage,
              Referrer:
                selectedLead.referrer,
            }}
          />

          <DetailSection
            title="Lead Status"
            data={{
              Status:
                selectedLead.leadStatus ||
                "New",
              "Created At":
                formatDate(
                  selectedLead.createdAt
                ),
              "Updated At":
                formatDate(
                  selectedLead.updatedAt
                ),
            }}
          />

          <button
            onClick={() =>
              setSelectedLead(null)
            }
            style={styles.primaryButton}
          >
            Close
          </button>
        </Modal>
      )}

      {selectedStudent && (
        <Modal
          onClose={() =>
            setSelectedStudent(null)
          }
        >
          <h2 style={styles.modalTitle}>
            {displayValue(
              selectedStudent.childName
            )}
          </h2>

          <p style={styles.muted}>
            Complete personalized
            onboarding profile
          </p>

          <DetailSection
            title="Child Information"
            data={{
              "Child Name":
                selectedStudent.childName,
              "Preferred Name":
                selectedStudent.preferredName,
              Age: selectedStudent.age,
              "Date of Birth":
                selectedStudent.dateOfBirth,
              Grade: selectedStudent.grade,
              School: selectedStudent.school,
              Gender: selectedStudent.gender,
            }}
          />

          <DetailSection
            title="Parent Information"
            data={{
              "Parent Name":
                selectedStudent.parentName,
              Relationship:
                selectedStudent.relationship,
              Phone: selectedStudent.phone,
              Email: selectedStudent.email,
              City: selectedStudent.city,
              Area: selectedStudent.area,
              "Heard About":
                selectedStudent.heardAbout,
            }}
          />

          <DetailSection
            title="Academic Performance"
            data={{
              Academics:
                selectedStudent.academics,
              Strengths:
                selectedStudent.strengths,
              Challenges:
                selectedStudent.challenges,
              Subjects:
                selectedStudent.subjects,
            }}
          />

          <DetailSection
            title="Study Habits"
            data={{
              "Study Habits":
                selectedStudent.studyHabits,
              "Study Routine":
                selectedStudent.studyRoutine,
              "Learning Preferences":
                selectedStudent.learningPreferences,
              "Effective Support":
                selectedStudent.effectiveSupport,
              "Ineffective Support":
                selectedStudent.ineffectiveSupport,
            }}
          />

          <DetailSection
            title="Goals"
            data={{
              Goals: selectedStudent.goals,
              Interests:
                selectedStudent.interests,
              "Target / Expectations":
                selectedStudent.parentExpectations,
            }}
          />

          <DetailSection
            title="Schedule & Sessions"
            data={{
              Schedule:
                selectedStudent.schedule,
              "Preferred Time":
                selectedStudent.preferredTime,
              "Previous Support":
                selectedStudent.previousSupport,
              Sessions:
                selectedStudent.sessions,
            }}
          />

          <DetailSection
            title="Learning Environment"
            data={{
              Environment:
                selectedStudent.environment,
              Resources:
                selectedStudent.resources,
              "Parent Involvement":
                selectedStudent.parentInvolvement,
            }}
          />

          <DetailSection
            title="Additional Information"
            data={{
              Additional:
                selectedStudent.additional,
              "Progress / Notes":
                selectedStudent.progress,
            }}
          />

          <button
            onClick={() =>
              setSelectedStudent(null)
            }
            style={styles.primaryButton}
          >
            Close
          </button>
        </Modal>
      )}
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div style={styles.statCard}>
      <div style={styles.statValue}>
        {value}
      </div>

      <div style={styles.statTitle}>
        {title}
      </div>
    </div>
  );
}

function DetailSection({ title, data }) {
  return (
    <section style={styles.detailSection}>
      <h3 style={styles.detailTitle}>
        {title}
      </h3>

      <div style={styles.detailGrid}>
        {Object.entries(data).map(
          ([key, value]) => (
            <div
              key={key}
              style={styles.detailItem}
            >
              <div
                style={styles.detailLabel}
              >
                {key}
              </div>

              <div
                style={styles.detailValue}
              >
                {displayValue(value)}
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
}

function Modal({ children, onClose }) {
  return (
    <div
      style={styles.overlay}
      onClick={onClose}
    >
      <div
        style={styles.modal}
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        <button
          onClick={onClose}
          style={styles.modalClose}
        >
          ×
        </button>

        {children}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f7fb",
    color: "#172033",
    fontFamily:
      "Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
  },

  header: {
    background: "#ffffff",
    borderBottom:
      "1px solid #e5e7eb",
    padding: "18px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    position: "sticky",
    top: 0,
    zIndex: 20,
  },

  logo: {
    fontSize: 22,
    fontWeight: 800,
    color: "#173f8a",
  },

  headerSubtitle: {
    color: "#64748b",
    fontSize: 13,
    marginTop: 2,
  },

  headerActions: {
    display: "flex",
    gap: 8,
  },

  container: {
    maxWidth: 1400,
    margin: "0 auto",
    padding: 24,
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, minmax(0, 1fr))",
    gap: 16,
    marginBottom: 24,
  },

  statCard: {
    background: "#ffffff",
    border:
      "1px solid #e5e7eb",
    borderRadius: 16,
    padding: 20,
  },

  statValue: {
    fontSize: 30,
    fontWeight: 800,
    color: "#173f8a",
  },

  statTitle: {
    marginTop: 5,
    color: "#64748b",
    fontSize: 14,
  },

  tabs: {
    display: "flex",
    gap: 8,
    marginBottom: 18,
    borderBottom:
      "1px solid #e5e7eb",
    overflowX: "auto",
  },

  tab: {
    border: 0,
    background: "transparent",
    padding: "12px 16px",
    cursor: "pointer",
    color: "#64748b",
    fontWeight: 700,
    fontSize: 14,
    whiteSpace: "nowrap",
  },

  activeTab: {
    color: "#173f8a",
    borderBottom:
      "3px solid #173f8a",
  },

  toolbar: {
    display: "flex",
    gap: 12,
    marginBottom: 12,
  },

  searchInput: {
    flex: 1,
    minWidth: 0,
    border:
      "1px solid #d8dee9",
    borderRadius: 10,
    padding: "12px 14px",
    fontSize: 14,
    outline: "none",
    background: "#fff",
  },

  select: {
    border:
      "1px solid #d8dee9",
    borderRadius: 10,
    padding: "12px 14px",
    fontSize: 14,
    background: "#fff",
  },

  statusScroller: {
    display: "flex",
    gap: 8,
    overflowX: "auto",
    paddingBottom: 14,
  },

  statusFilterButton: {
    border:
      "1px solid #d8dee9",
    background: "#fff",
    borderRadius: 999,
    padding: "7px 11px",
    fontSize: 12,
    fontWeight: 700,
    whiteSpace: "nowrap",
    cursor: "pointer",
  },

  statusFilterActive: {
    background: "#173f8a",
    color: "#fff",
    borderColor: "#173f8a",
  },

  card: {
    background: "#fff",
    border:
      "1px solid #e5e7eb",
    borderRadius: 16,
    overflow: "hidden",
  },

  cardHeader: {
    padding: 20,
    borderBottom:
      "1px solid #edf0f4",
  },

  sectionTitle: {
    margin: 0,
    fontSize: 20,
  },

  muted: {
    color: "#64748b",
    fontSize: 14,
    lineHeight: 1.5,
  },

  desktopTable: {
    width: "100%",
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: 900,
  },

  th: {
    textAlign: "left",
    padding: "13px 16px",
    background: "#f8fafc",
    color: "#64748b",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: ".04em",
    whiteSpace: "nowrap",
  },

  td: {
    padding: "14px 16px",
    borderTop:
      "1px solid #edf0f4",
    fontSize: 13,
    verticalAlign: "top",
  },

  tableRow: {
    cursor: "pointer",
  },

  smallText: {
    color: "#64748b",
    fontSize: 12,
    marginTop: 3,
  },

  statusSelect: {
    border: "1px solid",
    borderRadius: 8,
    padding: "6px 8px",
    background: "#fff",
    fontSize: 12,
    fontWeight: 700,
  },

  mobileCards: {
    display: "none",
  },

  leadMobileCard: {
    borderTop:
      "1px solid #edf0f4",
    padding: 16,
  },

  mobileTop: {
    display: "flex",
    justifyContent:
      "space-between",
    gap: 10,
    alignItems: "center",
    marginBottom: 12,
  },

  mobileInfo: {
    color: "#475569",
    fontSize: 13,
    marginBottom: 7,
  },

  mobileStatusSelect: {
    width: "100%",
    marginTop: 8,
    padding: 10,
    borderRadius: 8,
    border:
      "1px solid #d8dee9",
    background: "#fff",
  },

  empty: {
    padding: 40,
    textAlign: "center",
    color: "#64748b",
  },

  studentGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, minmax(0, 1fr))",
    gap: 16,
    padding: 20,
  },

  purchaseGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, minmax(0, 1fr))",
    gap: 16,
    padding: 20,
  },

  studentCard: {
    textAlign: "left",
    background: "#fff",
    border:
      "1px solid #e2e8f0",
    borderRadius: 14,
    padding: 18,
    cursor: "pointer",
  },

  purchaseCard: {
    background: "#fff",
    border:
      "1px solid #e2e8f0",
    borderRadius: 14,
    padding: 18,
  },

  studentName: {
    fontSize: 18,
    fontWeight: 800,
    color: "#173f8a",
    marginBottom: 7,
  },

  studentLine: {
    fontSize: 13,
    color: "#475569",
    marginTop: 7,
  },

  studentDate: {
    fontSize: 11,
    color: "#94a3b8",
    marginTop: 14,
  },

  referenceBox: {
    background: "#f8fafc",
    borderRadius: 10,
    padding: 12,
    marginTop: 14,
  },

  referenceLabel: {
    color: "#64748b",
    fontSize: 11,
    fontWeight: 700,
    marginBottom: 5,
  },

  referenceValue: {
    color: "#172033",
    fontSize: 13,
    fontWeight: 700,
    wordBreak: "break-word",
  },

  purchaseStatusRow: {
    display: "grid",
    gridTemplateColumns:
      "1fr 1fr",
    gap: 10,
    marginTop: 14,
  },

  purchaseActions: {
    display: "flex",
    gap: 8,
    marginTop: 16,
  },

  approveButton: {
    flex: 1,
    border: 0,
    borderRadius: 9,
    padding: "10px 12px",
    background: "#16a34a",
    color: "#fff",
    fontWeight: 800,
    cursor: "pointer",
  },

  rejectButton: {
    flex: 1,
    border: 0,
    borderRadius: 9,
    padding: "10px 12px",
    background: "#dc2626",
    color: "#fff",
    fontWeight: 800,
    cursor: "pointer",
  },

  primaryButton: {
    width: "100%",
    border: 0,
    borderRadius: 10,
    padding: "12px 16px",
    background: "#173f8a",
    color: "#fff",
    fontWeight: 800,
    cursor: "pointer",
  },

  secondaryButton: {
    border:
      "1px solid #d8dee9",
    borderRadius: 9,
    padding: "9px 13px",
    background: "#fff",
    color: "#334155",
    fontWeight: 700,
    cursor: "pointer",
  },

  logoutButton: {
    border:
      "1px solid #fecaca",
    borderRadius: 9,
    padding: "9px 13px",
    background: "#fff",
    color: "#dc2626",
    fontWeight: 700,
    cursor: "pointer",
  },

  errorBox: {
    background: "#fef2f2",
    color: "#b91c1c",
    border:
      "1px solid #fecaca",
    borderRadius: 10,
    padding: 12,
    marginBottom: 18,
    display: "flex",
    justifyContent:
      "space-between",
  },

  closeError: {
    border: 0,
    background: "transparent",
    color: "#b91c1c",
    fontSize: 20,
    cursor: "pointer",
  },

  loginPage: {
    minHeight: "100vh",
    background: "#f5f7fb",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    fontFamily:
      "Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
  },

  loginCard: {
    width: "100%",
    maxWidth: 420,
    background: "#fff",
    border:
      "1px solid #e5e7eb",
    borderRadius: 18,
    padding: 28,
    boxShadow:
      "0 15px 40px rgba(15,23,42,.08)",
  },

  loginTitle: {
    marginBottom: 8,
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    border:
      "1px solid #d8dee9",
    borderRadius: 10,
    padding: "13px 14px",
    margin: "12px 0",
    fontSize: 15,
  },

  error: {
    color: "#b91c1c",
    background: "#fef2f2",
    border:
      "1px solid #fecaca",
    padding: 10,
    borderRadius: 8,
    fontSize: 13,
    marginBottom: 12,
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background:
      "rgba(15,23,42,.6)",
    zIndex: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },

  modal: {
    width: "100%",
    maxWidth: 850,
    maxHeight: "92vh",
    overflowY: "auto",
    background: "#fff",
    borderRadius: 18,
    padding: 24,
    position: "relative",
  },

  modalClose: {
    position: "absolute",
    right: 14,
    top: 10,
    border: 0,
    background: "transparent",
    fontSize: 30,
    color: "#64748b",
    cursor: "pointer",
  },

  modalTitle: {
    marginTop: 0,
    paddingRight: 40,
  },

  detailSection: {
    margin: "22px 0",
  },

  detailTitle: {
    fontSize: 15,
    color: "#173f8a",
    borderBottom:
      "1px solid #e5e7eb",
    paddingBottom: 8,
  },

  detailGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: 12,
  },

  detailItem: {
    background: "#f8fafc",
    borderRadius: 10,
    padding: 12,
  },

  detailLabel: {
    color: "#64748b",
    fontSize: 11,
    fontWeight: 700,
    marginBottom: 5,
  },

  detailValue: {
    color: "#172033",
    fontSize: 13,
    lineHeight: 1.5,
    wordBreak: "break-word",
  },
};

export default App;