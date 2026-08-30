import { useState } from 'react'
import './App.css'

function App() {
  const [showForm, setShowForm] = useState(false)
const [submitted, setSubmitted] = useState(false)
const [loading, setLoading] = useState(false)
const [error, setError] = useState('')

  const handleSubmit = async (e) => {
  e.preventDefault()

  setLoading(true)
  setError('')

  const formData = new FormData(e.target)

  const lead = {
    parentName: formData.get('parentName'),
    phone: formData.get('phone'),
    grade: formData.get('grade'),
    subject: formData.get('subject')
  }

  try {
    const response = await fetch('https://studycare-backend.onrender.com/api/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(lead)
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong.')
    }

    setSubmitted(true)

  } catch (err) {
    console.error(err)
    setError(
      'Unable to submit the form. Make sure the backend server is running.'
    )
  } finally {
    setLoading(false)
  }
  }

  return (
    <div className="website">

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo">
          <span>📚</span> StudyCare
        </div>

        <button
          className="nav-button"
          onClick={() => setShowForm(true)}
        >
          Get Free Guide
        </button>
      </nav>


      {/* HERO */}
      <section className="hero-section">
        <div className="hero-content">

          <div className="badge">
            🎓 KG – Grade 12
          </div>

          <h1>
            Help Your Child
            <span> Learn With Confidence</span>
          </h1>

          <p>
            Personalized study support, homework assistance,
            and exam preparation designed for students from
            KG to Grade 12.
          </p>

          <button
            className="primary-button"
            onClick={() => setShowForm(true)}
          >
            🎁 Get Your FREE Study Guide
          </button>

          <p className="small-text">
            No payment required • Simple registration
          </p>

        </div>

        <div className="hero-card">
          <div className="student-icon">👩‍🎓</div>
          <h3>Better Study. Better Results.</h3>
          <p>
            Give your child the personalized support
            they need to succeed.
          </p>

          <div className="stats">
            <div>
              <strong>KG–12</strong>
              <small>Students</small>
            </div>

            <div>
              <strong>📚</strong>
              <small>Study Support</small>
            </div>

            <div>
              <strong>🎯</strong>
              <small>Personalized</small>
            </div>
          </div>
        </div>
      </section>


      {/* PROBLEM */}
      <section className="problem-section">
        <div className="section-title">
          <span>Is your child struggling with...</span>
          <h2>School shouldn't feel overwhelming.</h2>
          <p>
            Every student learns differently. The right support
            can make studying easier and more effective.
          </p>
        </div>

        <div className="problem-grid">

          <div className="problem-card">
            <div>📖</div>
            <h3>Homework</h3>
            <p>
              Having difficulty understanding or completing homework?
            </p>
          </div>

          <div className="problem-card">
            <div>🧮</div>
            <h3>Subjects</h3>
            <p>
              Struggling with Mathematics, English, Science or other subjects?
            </p>
          </div>

          <div className="problem-card">
            <div>📝</div>
            <h3>Exams</h3>
            <p>
              Need better preparation and a structured study plan?
            </p>
          </div>

        </div>
      </section>


      {/* SERVICES */}
      <section className="services-section">

        <div className="section-title">
          <span>WHAT WE OFFER</span>
          <h2>Support designed for your child</h2>
          <p>
            We help students build understanding, confidence,
            and better study habits.
          </p>
        </div>

        <div className="services-grid">

          <div className="service-card">
            <span>📚</span>
            <h3>Homework Support</h3>
            <p>
              Help your child understand lessons and complete
              assignments with confidence.
            </p>
          </div>

          <div className="service-card">
            <span>🧮</span>
            <h3>Mathematics</h3>
            <p>
              Build strong mathematical understanding through
              personalized support.
            </p>
          </div>

          <div className="service-card">
            <span>🔬</span>
            <h3>Science</h3>
            <p>
              Make difficult science concepts easier to understand.
            </p>
          </div>

          <div className="service-card">
            <span>🇬🇧</span>
            <h3>English</h3>
            <p>
              Improve reading, writing, grammar, and communication skills.
            </p>
          </div>

          <div className="service-card">
            <span>📝</span>
            <h3>Exam Preparation</h3>
            <p>
              Prepare with structured revision and exam-focused study.
            </p>
          </div>

          <div className="service-card">
            <span>🎯</span>
            <h3>Personalized Study Plan</h3>
            <p>
              A study approach based on your child's grade and needs.
            </p>
          </div>

        </div>
      </section>


      {/* GRADES */}
      <section className="grades-section">

        <div className="section-title">
          <span>FOR EVERY STAGE</span>
          <h2>KG through Grade 12</h2>
          <p>
            Support changes as your child grows. That's why
            we organize learning around their grade level.
          </p>
        </div>

        <div className="grades-grid">

          <div className="grade-card">
            <span>🌱</span>
            <h3>KG – Grade 4</h3>
            <p>
              Reading, writing, basic mathematics,
              homework and learning foundations.
            </p>
          </div>

          <div className="grade-card">
            <span>📘</span>
            <h3>Grade 5 – 8</h3>
            <p>
              Core subjects, homework support,
              study habits and academic improvement.
            </p>
          </div>

          <div className="grade-card">
            <span>🎓</span>
            <h3>Grade 9 – 10</h3>
            <p>
              Subject support, revision and
              exam preparation.
            </p>
          </div>

          <div className="grade-card">
            <span>🏆</span>
            <h3>Grade 11 – 12</h3>
            <p>
              Advanced subjects, intensive revision
              and exam-focused preparation.
            </p>
          </div>

        </div>
      </section>


      {/* FREE GUIDE */}
      <section className="guide-section">

        <div className="guide-content">

          <div className="guide-icon">
            🎁
          </div>

          <span>FREE RESOURCE FOR PARENTS</span>

          <h2>
            Get Your Free
            <strong> Study Guide</strong>
          </h2>

          <p>
            Get practical study tips and strategies that
            can help your child develop better study habits.
          </p>

          <ul>
            <li>✓ Better study routines</li>
            <li>✓ Homework tips</li>
            <li>✓ Exam preparation strategies</li>
            <li>✓ Time management tips</li>
          </ul>

          <button
            className="primary-button"
            onClick={() => setShowForm(true)}
          >
            Get My Free Guide →
          </button>

        </div>

      </section>


      {/* PAID SERVICE */}
      <section className="paid-section">

        <div className="section-title">
          <span>NEED MORE SUPPORT?</span>

          <h2>
            Give Your Child
            <span> Personalized Support</span>
          </h2>

          <p>
            If your child needs more than a study guide,
            our personalized tutoring service can provide
            ongoing academic support.
          </p>
        </div>

        <div className="paid-grid">

          <div>✓ Personalized lessons</div>
          <div>✓ Homework assistance</div>
          <div>✓ Exam preparation</div>
          <div>✓ Flexible learning</div>
          <div>✓ Progress support</div>
          <div>✓ KG–Grade 12</div>

        </div>

        <button
          className="primary-button"
          onClick={() => setShowForm(true)}
        >
          Request a Free Assessment
        </button>

      </section>


      {/* FOOTER */}
      <footer>
        <div className="logo">
          <span>📚</span> StudyCare
        </div>

        <p>
          Helping students learn, grow and succeed.
        </p>

        <p className="copyright">
          © 2026 StudyCare. All rights reserved.
        </p>
      </footer>

      
   {/* FORM MODAL */}
{showForm && (
  <div
    className="modal-overlay"
    onClick={() => setShowForm(false)}
  >
    <div
      className="form-modal"
      onClick={(e) => e.stopPropagation()}
    >

      <button
        className="close-button"
        onClick={() => setShowForm(false)}
      >
        ×
      </button>

      {!submitted ? (
        <>
          <div className="form-icon">🎁</div>

          <h2>Get Your Free Study Guide</h2>

          <p>
            Tell us a little about your child so we
            can provide the right guide.
          </p>

          <form onSubmit={handleSubmit}>

            <label>Parent / Guardian Name</label>

            <input
              type="text"
              name="parentName"
              placeholder="Your name"
              required
            />


            <label>Phone / WhatsApp Number</label>

            <input
              type="tel"
              name="phone"
              placeholder="09XXXXXXXX"
              required
            />


            <label>Child's Grade</label>

            <select name="grade" required>
              <option value="">Select grade</option>
              <option>KG 1</option>
              <option>KG 2</option>
              <option>Grade 1</option>
              <option>Grade 2</option>
              <option>Grade 3</option>
              <option>Grade 4</option>
              <option>Grade 5</option>
              <option>Grade 6</option>
              <option>Grade 7</option>
              <option>Grade 8</option>
              <option>Grade 9</option>
              <option>Grade 10</option>
              <option>Grade 11</option>
              <option>Grade 12</option>
            </select>


            <label>Subject needing help</label>

            <input
              type="text"
              name="subject"
              placeholder="Example: Mathematics"
            />


            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading
                ? 'Submitting...'
                : 'Get My Free Guide →'}
            </button>


            <small>
              By submitting this form, you agree that we
              may contact you about the study guide and
              our tutoring services.
            </small>

          </form>
        </>
      ) : (

        /* SUCCESS MESSAGE */

        <div className="success-message">

  <div className="success-icon">🎉</div>

  <h2>Your Study Guide Is Ready!</h2>

  <p className="success-intro">
    Thank you for registering. Your free KG–Grade 12
    Study Success Guide is ready.
  </p>

  <a
    href="/study-guide.pdf"
    download="Study-Success-Guide.pdf"
    className="submit-button"
  >
    📥 Download Free Study Guide
  </a>

  <div className="tutoring-offer">

    <h3>📚 Need More Support for Your Child?</h3>

    <p>
      Every student learns differently. If your child needs
      additional academic support, we're here to help.
    </p>

    <div className="support-list">

      <div>📖 <strong>All School Subjects</strong></div>

      <div>🇬🇧 <strong>English Language Support</strong></div>

      <div>📝 <strong>Homework & Assignments</strong></div>

      <div>📄 <strong>Exam Preparation & Practice</strong></div>

      <div>🎯 <strong>Personalized Study Support</strong></div>

      <div>💻 <strong>Online & In-Person Learning</strong></div>

    </div>

    <h3>🎯 Start With a Free Student Assessment</h3>

    <p>
      We'll learn about your child's grade, subjects,
      challenges, and learning goals, then recommend
      the right support.
    </p>

    <div className="contact-box">

      <a href="tel:0908075506">
        📞 Call: 0908075506
      </a>

      <a href="tel:0945440089">
        💬 WhatsApp: 0945440089
      </a>

    </div>

  </div>

</div>
      )}

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

    </div>
  </div>
)}

    </div>
  )
}

export default App