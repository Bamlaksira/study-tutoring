import { useState } from 'react'
import './Grade6Registration.css'

const API = 'https://studycare-backend.onrender.com'

export default function Grade6Registration() {
  const [form, setForm] = useState({
    parentName: '',
    phone: '',
    childName: '',
    city: '',
    area: '',
    subject: '',
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)

  function updateField(e) {
    const { name, value } = e.target
    setForm(previous => ({ ...previous, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setSuccess(false)

    try {
      const response = await fetch(
        `${API}/api/grade-6-registrations`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        }
      )

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || 'Registration failed. Please try again.'
        )
      }

            window.location.href = '/grade-6-registration-success'
    } catch (error) {
      setMessage(
        error.message ||
        'Unable to submit your registration. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="g6-registration">
      <header className="g6-header">
        <a className="g6-logo" href="/">Study<span>Care</span></a>
        <p>Personalized online academic support</p>
      </header>

      <section className="g6-card">
        <div className="g6-intro">
          <span className="g6-label">GRADE 6 SUPPORT</span>
          <h1>Grade 6 Ministry Exam Preparation</h1>
          <p>
            Help your child prepare with structured online learning,
            focused practice, and support in their chosen subject.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <h2>Register Your Child</h2>
          <p className="g6-required">Fields marked * are required.</p>

          <label htmlFor="parentName">Parent / Guardian Name *</label>
          <input
            id="parentName"
            name="parentName"
            value={form.parentName}
            onChange={updateField}
            autoComplete="name"
            required
            maxLength={100}
            placeholder="Enter parent or guardian's name"
          />

          <label htmlFor="phone">Parent's Phone Number *</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={updateField}
            autoComplete="tel"
            required
            maxLength={25}
            placeholder="Enter phone number"
          />

          <label htmlFor="childName">Student's Full Name *</label>
          <input
            id="childName"
            name="childName"
            value={form.childName}
            onChange={updateField}
            required
            maxLength={100}
            placeholder="Enter student's full name"
          />

          <label htmlFor="city">City *</label>
          <input
            id="city"
            name="city"
            value={form.city}
            onChange={updateField}
            required
            maxLength={100}
            placeholder="e.g. Addis Ababa, Gondar"
          />

          <label htmlFor="area">Street / Area *</label>
          <input
            id="area"
            name="area"
            value={form.area}
            onChange={updateField}
            required
            maxLength={150}
            placeholder="e.g. Bole"
          />

          <label htmlFor="grade">Grade</label>
          <input id="grade" value="Grade 6" readOnly />

          <label htmlFor="subject">Choose one subject *</label>
          <select
            id="subject"
            name="subject"
            value={form.subject}
            onChange={updateField}
            required
          >
            <option value="">Select a subject</option>
            <option value="Mathematics">Mathematics</option>
            <option value="English">English</option>
          </select>

          <label htmlFor="learningMethod">Learning Method</label>
          <input id="learningMethod" value="Online" readOnly />

          <button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Register for Exam Preparation'}
          </button>

          {message && (
            <p
              className={success ? 'g6-message success' : 'g6-message error'}
              role="status"
            >
              {message}
            </p>
          )}

          <p className="g6-privacy">
            Your information will be used to respond to your registration.
          </p>
        </form>
      </section>
    </main>
  )
}
