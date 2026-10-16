import './Grade6Registration.css'

export default function Grade6RegistrationSuccess() {
  return (
    <main className="g6-registration">
      <header className="g6-header">
        <a className="g6-logo" href="/">
          Study<span>Care</span>
        </a>
        <p>Personalized online academic support</p>
      </header>

      <section className="g6-card g6-success-card">
        <div className="g6-success-icon" aria-hidden="true">
          ✓
        </div>

        <span className="g6-label">REGISTRATION COMPLETE</span>

        <h1>Thank You!</h1>

        <h2>Registration Submitted Successfully</h2>

        <p>
          Your child's registration for Grade 6 Ministry Exam Preparation
          has been received successfully.
        </p>

        <p>
          StudyCare will contact you using the phone number you provided
          to discuss the next steps.
        </p>

        <a className="g6-home-link" href="/">
          Return to StudyCare
        </a>
      </section>
    </main>
  )
}
