import React from "react";

const subjects = [
  {
    id: "amharic",
    name: "Amharic",
    amharic: "አማርኛ",
  },
  {
    id: "mathematics",
    name: "Mathematics",
    amharic: "ሂሳብ",
  },
  {
    id: "english",
    name: "English",
    amharic: "እንግሊዝኛ",
  },
  {
    id: "science",
    name: "Environmental Science",
    amharic: "አካባቢ ሳይንስ",
  },
  {
    id: "civics",
    name: "Civics",
    amharic: "ግብረ ገብ",
  },
];

const availableYears = [2015, 2016, 2017, 2018];

const availableSubjectsByYear = {
  2015: ["amharic", "mathematics", "english", "science"],
  2016: ["amharic", "mathematics", "english", "science", "civics"],
  2017: ["amharic", "mathematics", "english", "science", "civics"],
  2018: ["amharic", "mathematics", "science", "civics"],
};

function ModelExams() {
  const path = window.location.pathname;
  const parts = path.split("/").filter(Boolean);

  const year = parts[1];
  const subjectId = parts[2];

  const subject = subjects.find((item) => item.id === subjectId);

  const isSubjectAvailable =
    year &&
    subject &&
    availableSubjectsByYear[year]?.includes(subject.id);

  const subjectPdf = isSubjectAvailable
    ? `/model-exams/${year}/${subject.id}.pdf`
    : null;

  // Subject page
  if (year && subjectId && subject) {
    return (
      <div style={styles.page}>
        <header style={styles.header}>
          <a href="/model-exams" style={styles.logo}>
            StudyCare
          </a>
        </header>

        <main style={styles.container}>
          <a href={`/model-exams/${year}`} style={styles.back}>
            ← Back to {year} Model Exams
          </a>

          {!isSubjectAvailable ? (
            <div style={styles.centerBox}>
              <div style={styles.bigIcon}>📄</div>

              <div style={styles.year}>{year}</div>

              <h1>Grade 6 {subject.name}</h1>

              <p style={styles.muted}>{subject.amharic}</p>

              <p style={styles.description}>
                The {year} Grade 6 {subject.name} model exam is not available
                yet.
              </p>

              <p style={styles.muted}>
                Please check back later for this subject.
              </p>

              <a
                href={`/model-exams/${year}`}
                style={styles.button}
              >
                Back to {year} Exams
              </a>
            </div>
          ) : (
            <>
              <div style={styles.center}>
                <div style={styles.year}>{year}</div>

                <h1>Grade 6 {subject.name}</h1>

                <p style={styles.muted}>{subject.amharic}</p>

                <p style={styles.description}>
                  Free Grade 6 {subject.name} model exam from {year}.
                </p>
              </div>

              <div style={styles.pdfContainer}>
                <iframe
                  src={subjectPdf}
                  title={`${year} Grade 6 ${subject.name} Model Exam`}
                  style={styles.pdf}
                />
              </div>

              <div style={styles.download}>
                <a
                  href={subjectPdf}
                  download
                  style={styles.outlineButton}
                >
                  Download PDF
                </a>
              </div>

              {/* Promotion after the free exam */}
              <section style={styles.promotion}>
                <div style={styles.bigIcon}>🎯</div>

                <h2>Finished the Free Model Exam?</h2>

                <p>
                  Ready to prepare more seriously for the Grade 6 Ministry
                  Exam? Continue your preparation with StudyCare's Grade 6
                  Ministry Exam Practice.
                </p>

                <a href="/exams" style={styles.lightButton}>
                  Practice the Ministry Exam →
                </a>
              </section>
            </>
          )}
        </main>
      </div>
    );
  }

  // Year page
  if (year) {
    const yearSubjects = availableSubjectsByYear[year] || [];

    return (
      <div style={styles.page}>
        <header style={styles.header}>
          <a href="/model-exams" style={styles.logo}>
            StudyCare
          </a>
        </header>

        <main style={styles.container}>
          <a href="/model-exams" style={styles.back}>
            ← Back to Model Exam Years
          </a>

          <div style={styles.center}>
            <div style={styles.year}>{year}</div>

            <h1>Grade 6 Model Exams</h1>

            <p style={styles.description}>
              Choose a subject and practice with a free Grade 6 model exam.
            </p>
          </div>

          <div style={styles.grid}>
            {subjects.map((item) => {
              const isAvailable = yearSubjects.includes(item.id);

              return (
                <div key={item.id} style={styles.card}>
                  <div style={styles.cardIcon}>📄</div>

                  <h2>{item.name}</h2>

                  <p style={styles.muted}>{item.amharic}</p>

                  {isAvailable ? (
                    <>
                      <p style={styles.available}>
                        Free model exam available
                      </p>

                      <a
                        href={`/model-exams/${year}/${item.id}`}
                        style={styles.button}
                      >
                        Open Exam
                      </a>
                    </>
                  ) : (
                    <>
                      <p style={styles.comingSoon}>
                        Coming soon
                      </p>

                      <span style={styles.disabled}>
                        Not Available Yet
                      </span>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          <section style={styles.bottomPromotion}>
            <h2>Want more Grade 6 exam practice?</h2>

            <p>
              StudyCare also provides Grade 6 Ministry Exam Practice with
              questions, answers, and explanations.
            </p>

            <a href="/exams" style={styles.button}>
              Explore Ministry Exam Practice →
            </a>
          </section>
        </main>
      </div>
    );
  }

  // Main page
  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <a href="/" style={styles.logo}>
          StudyCare
        </a>
      </header>

      <main style={styles.container}>
        <div style={styles.center}>
          <div style={styles.bigIcon}>📚</div>

          <h1>Free Grade 6 Model Exams</h1>

          <p style={styles.description}>
            Practice Grade 6 model exams from different years, organized by
            year and subject.
          </p>
        </div>

        <h2 style={styles.sectionTitle}>
          Choose a Year
        </h2>

        <div style={styles.yearGrid}>
          {availableYears.map((item) => (
            <a
              key={item}
              href={`/model-exams/${item}`}
              style={styles.yearCard}
            >
              <strong style={styles.yearCardStrong}>
                {item}
              </strong>

              <span>
                Grade 6 Model Exams
              </span>

              <span style={styles.arrow}>→</span>
            </a>
          ))}
        </div>

        <section style={styles.bottomPromotion}>
          <h2>
            Preparing for the Grade 6 Ministry Exam?
          </h2>

          <p>
            Use these free model exams for practice, then continue with
            StudyCare's Grade 6 Ministry Exam Practice.
          </p>

          <a href="/exams" style={styles.button}>
            Practice the Ministry Exam →
          </a>
        </section>
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f7f8fa",
    color: "#172033",
    fontFamily:
      "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },

  header: {
    height: "70px",
    display: "flex",
    alignItems: "center",
    padding: "0 6%",
    background: "#fff",
    borderBottom: "1px solid #e8ebf0",
  },

  logo: {
    textDecoration: "none",
    fontSize: "24px",
    fontWeight: "800",
    color: "#0f5132",
  },

  container: {
    width: "92%",
    maxWidth: "1150px",
    margin: "0 auto",
    padding: "40px 0 70px",
  },

  center: {
    textAlign: "center",
    marginBottom: "40px",
  },

  centerBox: {
    maxWidth: "650px",
    margin: "60px auto",
    padding: "45px 25px",
    background: "#fff",
    borderRadius: "20px",
    textAlign: "center",
    boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
  },

  bigIcon: {
    fontSize: "48px",
    marginBottom: "10px",
  },

  year: {
    display: "inline-block",
    padding: "8px 18px",
    borderRadius: "30px",
    background: "#e9f5ee",
    color: "#0f5132",
    fontWeight: "800",
    marginBottom: "12px",
  },

  description: {
    maxWidth: "700px",
    margin: "0 auto",
    color: "#667085",
    fontSize: "17px",
    lineHeight: "1.6",
  },

  muted: {
    color: "#667085",
  },

  back: {
    display: "inline-block",
    marginBottom: "25px",
    color: "#0f5132",
    textDecoration: "none",
    fontWeight: "700",
  },

  sectionTitle: {
    fontSize: "25px",
    marginBottom: "20px",
  },

  yearGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "20px",
  },

  yearCard: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    textDecoration: "none",
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "18px",
    padding: "30px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
    color: "#172033",
  },

  yearCardStrong: {
    fontSize: "42px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
  },

  card: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "18px",
    padding: "25px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
    textAlign: "center",
  },

  cardIcon: {
    fontSize: "38px",
    marginBottom: "10px",
  },

  available: {
    fontSize: "14px",
    color: "#198754",
    marginBottom: "18px",
  },

  comingSoon: {
    fontSize: "14px",
    color: "#b54708",
    marginBottom: "18px",
  },

  button: {
    display: "inline-block",
    textDecoration: "none",
    background: "#0f5132",
    color: "#fff",
    padding: "12px 20px",
    borderRadius: "10px",
    fontWeight: "700",
  },

  outlineButton: {
    display: "inline-block",
    textDecoration: "none",
    background: "#fff",
    color: "#0f5132",
    border: "1px solid #0f5132",
    padding: "11px 20px",
    borderRadius: "10px",
    fontWeight: "700",
  },

  disabled: {
    display: "inline-block",
    background: "#eef0f2",
    color: "#777",
    padding: "12px 18px",
    borderRadius: "10px",
    fontWeight: "700",
  },

  pdfContainer: {
    width: "100%",
    background: "#fff",
    borderRadius: "16px",
    overflow: "hidden",
    border: "1px solid #ddd",
    boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
  },

  pdf: {
    width: "100%",
    height: "75vh",
    minHeight: "550px",
    border: "none",
    display: "block",
  },

  download: {
    textAlign: "center",
    padding: "20px 0 10px",
  },

  promotion: {
    marginTop: "35px",
    padding: "35px 25px",
    borderRadius: "20px",
    background: "#0f5132",
    color: "#fff",
    textAlign: "center",
  },

  lightButton: {
    display: "inline-block",
    textDecoration: "none",
    background: "#fff",
    color: "#0f5132",
    padding: "12px 20px",
    borderRadius: "10px",
    fontWeight: "700",
  },

  bottomPromotion: {
    marginTop: "50px",
    padding: "35px 25px",
    borderRadius: "20px",
    background: "#e9f5ee",
    textAlign: "center",
  },

  arrow: {
    position: "absolute",
    right: "25px",
    bottom: "25px",
    fontSize: "25px",
    color: "#0f5132",
  },
};

export default ModelExams;