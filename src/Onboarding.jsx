import { useState } from 'react'
import './App.css'

const API_URL =
  'https://studycare-backend.onrender.com/api/onboarding'

const grades = [
  'KG 1',
  'KG 2',
  'Grade 1',
  'Grade 2',
  'Grade 3',
  'Grade 4',
  'Grade 5',
  'Grade 6',
  'Grade 7',
  'Grade 8',
  'Grade 9',
  'Grade 10',
  'Grade 11',
  'Grade 12'
]

const subjectsList = [
  'Mathematics',
  'English',
  'Amharic',
  'Physics',
  'Chemistry',
  'Biology',
  'Science',
  'Social Studies',
  'Civics',
  'ICT / Computer',
  'Other'
]

function Onboarding() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    childName: '',
    preferredName: '',
    age: '',
    dateOfBirth: '',
    grade: '',
    school: '',
    gender: '',

    parentName: '',
    relationship: '',
    phone: '',
    email: '',
    city: '',
    heardAbout: '',

    subjects: [],
    strongestSubjects: '',
    interestedSubject: '',
    strugglingSubject: '',
    currentPerformance: '',
    recentResults: '',
    difficultTopics: '',
    homeworkSituation: '',
    academicConcern: '',

    strengths: '',
    learningChallenges: '',
    freeTimeActivities: '',
    motivation: '',
    dislikes: '',

    studyRoutine: '',
    studyDuration: '',
    concentration: '',
    distractions: '',
    independentStudy: '',
    examPreparation: '',
    homeworkHabits: '',

    learningStyle: '',
    helpfulSupport: [],

    goals: [],
    mainGoals: '',
    oneMonthGoal: '',
    threeMonthGoal: '',
    upcomingExam: '',
    targetGrade: '',

    preferredStudyTime: [],
    unavailableTimes: '',
    sessionsPerWeek: '',
    sessionLength: '',
    learningMode: '',

    quietPlace: '',
    devices: [],
    internetConnection: '',

    previousTutoring: '',
    previousTutoringDetails: '',
    whatWorked: '',
    whatDidNotWork: '',

    parentConcern: '',
    parentExpectations: '',
    progressUpdates: '',

    studentGoal: '',
    studentDifficulty: '',

    additionalInformation: ''
  })

  const totalSteps = 10

  const update = (name, value) => {
    setForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const toggleArray = (name, value) => {
    setForm(prev => ({
      ...prev,
      [name]: prev[name].includes(value)
        ? prev[name].filter(item => item !== value)
        : [...prev[name], value]
    }))
  }

  const nextStep = () => {
    setError('')

    if (step === 1) {
      if (!form.childName || !form.grade) {
        setError("Please enter the child's name and grade.")
        return
      }
    }

    if (step === 2) {
      if (!form.parentName || !form.phone) {
        setError('Please enter the parent name and phone number.')
        return
      }
    }

    if (step < totalSteps) {
      setStep(step + 1)
      window.scrollTo(0, 0)
    }
  }

  const previousStep = () => {
    setError('')

    if (step > 1) {
      setStep(step - 1)
      window.scrollTo(0, 0)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)
    setError('')

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Unable to submit onboarding form.'
        )
      }

      setSubmitted(true)
      window.scrollTo(0, 0)

    } catch (err) {
      console.error(err)

      setError(
        'Unable to submit your information. Please check your internet connection and try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="privacy-page">
        <div className="privacy-content success-message">

          <div className="form-icon">
            🎉
          </div>

          <h1>
            Thank You!
          </h1>

          <p>
            We have received your child's StudyCare
            onboarding information.
          </p>

          <p>
            We will review your child's academic needs,
            goals, study habits and learning preferences
            and use this information to prepare a
            personalized StudyCare learning plan.
          </p>

          <p>
            We will contact you soon with the next steps.
          </p>

          <button
            className="primary-button"
            onClick={() => {
              window.location.href = '/'
            }}
          >
            ← Back to StudyCare
          </button>

        </div>
      </div>
    )
  }

  return (
    <div className="privacy-page">

      <div
        className="privacy-content"
        style={{
          maxWidth: '750px',
          width: '100%'
        }}
      >

        {/* HEADER */}

        <div className="logo">
          <span>📚</span> StudyCare
        </div>

        <div style={{ marginBottom: '25px' }}>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '8px'
            }}
          >
            <strong>
              Student Onboarding
            </strong>

            <span>
              Step {step} of {totalSteps}
            </span>
          </div>

          <div
            style={{
              height: '8px',
              background: '#e5e7eb',
              borderRadius: '10px',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                width: `${(step / totalSteps) * 100}%`,
                height: '100%',
                background: '#2563eb',
                transition: '0.3s'
              }}
            />
          </div>

        </div>


        <form onSubmit={handleSubmit}>

          {/* STEP 1 */}

          {step === 1 && (
            <>
              <h1>
                👤 Student Information
              </h1>

              <p>
                Let's start by getting to know your child.
              </p>

              <label>Child's Full Name *</label>
              <input
                value={form.childName}
                onChange={e =>
                  update('childName', e.target.value)
                }
                placeholder="Child's full name"
                required
              />

              <label>Preferred Name</label>
              <input
                value={form.preferredName}
                onChange={e =>
                  update('preferredName', e.target.value)
                }
                placeholder="What should we call your child?"
              />

              <label>Age</label>
              <input
                type="number"
                value={form.age}
                onChange={e =>
                  update('age', e.target.value)
                }
                placeholder="Age"
              />

              <label>Date of Birth</label>
              <input
                type="date"
                value={form.dateOfBirth}
                onChange={e =>
                  update('dateOfBirth', e.target.value)
                }
              />

              <label>Grade *</label>
              <select
                value={form.grade}
                onChange={e =>
                  update('grade', e.target.value)
                }
                required
              >
                <option value="">
                  Select grade
                </option>

                {grades.map(grade => (
                  <option key={grade}>
                    {grade}
                  </option>
                ))}
              </select>

              <label>School</label>
              <input
                value={form.school}
                onChange={e =>
                  update('school', e.target.value)
                }
                placeholder="School name"
              />

              <label>Gender</label>
              <select
                value={form.gender}
                onChange={e =>
                  update('gender', e.target.value)
                }
              >
                <option value="">Prefer not to say</option>
                <option>Male</option>
                <option>Female</option>
              </select>
            </>
          )}


          {/* STEP 2 */}

          {step === 2 && (
            <>
              <h1>
                👨‍👩‍👧 Parent / Guardian
              </h1>

              <p>
                Tell us how we can contact you.
              </p>

              <label>Parent / Guardian Name *</label>
              <input
                value={form.parentName}
                onChange={e =>
                  update('parentName', e.target.value)
                }
                placeholder="Your full name"
                required
              />

              <label>Relationship to Child</label>
              <select
                value={form.relationship}
                onChange={e =>
                  update('relationship', e.target.value)
                }
              >
                <option value="">Select</option>
                <option>Parent</option>
                <option>Guardian</option>
                <option>Other</option>
              </select>

              <label>Phone / WhatsApp *</label>
              <input
                type="tel"
                value={form.phone}
                onChange={e =>
                  update('phone', e.target.value)
                }
                placeholder="09XXXXXXXX"
                required
              />

              <label>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e =>
                  update('email', e.target.value)
                }
                placeholder="your@email.com"
              />

              <label>City</label>
              <input
                value={form.city}
                onChange={e =>
                  update('city', e.target.value)
                }
                placeholder="City"
              />

              <label>
                How did you hear about StudyCare?
              </label>

              <select
                value={form.heardAbout}
                onChange={e =>
                  update('heardAbout', e.target.value)
                }
              >
                <option value="">Select</option>
                <option>Facebook</option>
                <option>Telegram</option>
                <option>WhatsApp</option>
                <option>Friend / Family</option>
                <option>School</option>
                <option>Other</option>
              </select>
            </>
          )}


          {/* STEP 3 */}

          {step === 3 && (
            <>
              <h1>
                📊 Academic Profile
              </h1>

              <p>
                Help us understand your child's current
                academic situation.
              </p>

              <label>
                What subjects is your child currently studying?
              </label>

              <div className="checkbox-grid">
                {subjectsList.map(subject => (
                  <label key={subject}>
                    <input
                      type="checkbox"
                      checked={form.subjects.includes(subject)}
                      onChange={() =>
                        toggleArray('subjects', subject)
                      }
                    />
                    {subject}
                  </label>
                ))}
              </div>

              <label>
                Which subjects are your child's strongest?
              </label>

              <textarea
                value={form.strongestSubjects}
                onChange={e =>
                  update('strongestSubjects', e.target.value)
                }
                placeholder="Example: Mathematics and Science"
              />

              <label>
                Which subject needs the most help?
              </label>

              <input
                value={form.strugglingSubject}
                onChange={e =>
                  update('strugglingSubject', e.target.value)
                }
                placeholder="Example: Mathematics"
              />

              <label>
                What specific topics are difficult?
              </label>

              <textarea
                value={form.difficultTopics}
                onChange={e =>
                  update('difficultTopics', e.target.value)
                }
                placeholder="Tell us what your child struggles with."
              />

              <label>
                Current marks / academic performance
              </label>

              <textarea
                value={form.currentPerformance}
                onChange={e =>
                  update('currentPerformance', e.target.value)
                }
                placeholder="Example: Usually scores 60–70%"
              />

              <label>
                Recent exam results, if available
              </label>

              <textarea
                value={form.recentResults}
                onChange={e =>
                  update('recentResults', e.target.value)
                }
                placeholder="Optional"
              />

              <label>
                What is the biggest academic concern right now?
              </label>

              <textarea
                value={form.academicConcern}
                onChange={e =>
                  update('academicConcern', e.target.value)
                }
                placeholder="Tell us your main concern."
              />

              <label>
                How is homework going?
              </label>

              <textarea
                value={form.homeworkSituation}
                onChange={e =>
                  update('homeworkSituation', e.target.value)
                }
                placeholder="Example: Needs help getting started."
              />
            </>
          )}


          {/* STEP 4 */}

          {step === 4 && (
            <>
              <h1>
                💪 Strengths & Challenges
              </h1>

              <label>
                What is your child good at?
              </label>

              <textarea
                value={form.strengths}
                onChange={e =>
                  update('strengths', e.target.value)
                }
                placeholder="Academic or personal strengths"
              />

              <label>
                What makes learning difficult for your child?
              </label>

              <textarea
                value={form.learningChallenges}
                onChange={e =>
                  update('learningChallenges', e.target.value)
                }
                placeholder="Example: Has difficulty concentrating."
              />

              <label>
                What does your child enjoy doing?
              </label>

              <textarea
                value={form.freeTimeActivities}
                onChange={e =>
                  update('freeTimeActivities', e.target.value)
                }
                placeholder="Hobbies, sports, games, reading, etc."
              />

              <label>
                What motivates your child to study?
              </label>

              <textarea
                value={form.motivation}
                onChange={e =>
                  update('motivation', e.target.value)
                }
                placeholder="Example: Praise, good grades, competition..."
              />

              <label>
                What usually makes your child lose interest?
              </label>

              <textarea
                value={form.dislikes}
                onChange={e =>
                  update('dislikes', e.target.value)
                }
                placeholder="Optional"
              />
            </>
          )}


          {/* STEP 5 */}

          {step === 5 && (
            <>
              <h1>
                📚 Study Habits
              </h1>

              <label>
                Describe your child's current study routine.
              </label>

              <textarea
                value={form.studyRoutine}
                onChange={e =>
                  update('studyRoutine', e.target.value)
                }
                placeholder="When and how does your child normally study?"
              />

              <label>
                How long can your child usually study before needing a break?
              </label>

              <select
                value={form.studyDuration}
                onChange={e =>
                  update('studyDuration', e.target.value)
                }
              >
                <option value="">Select</option>
                <option>Less than 20 minutes</option>
                <option>20–30 minutes</option>
                <option>30–45 minutes</option>
                <option>45–60 minutes</option>
                <option>More than 1 hour</option>
                <option>Not sure</option>
              </select>

              <label>
                How well does your child concentrate?
              </label>

              <select
                value={form.concentration}
                onChange={e =>
                  update('concentration', e.target.value)
                }
              >
                <option value="">Select</option>
                <option>Very well</option>
                <option>Well</option>
                <option>Sometimes struggles</option>
                <option>Often struggles</option>
              </select>

              <label>
                What usually distracts your child?
              </label>

              <textarea
                value={form.distractions}
                onChange={e =>
                  update('distractions', e.target.value)
                }
                placeholder="Phone, TV, games, noise, etc."
              />

              <label>
                Does your child study independently?
              </label>

              <select
                value={form.independentStudy}
                onChange={e =>
                  update('independentStudy', e.target.value)
                }
              >
                <option value="">Select</option>
                <option>Yes, independently</option>
                <option>Needs occasional help</option>
                <option>Needs regular supervision</option>
                <option>Usually needs someone beside them</option>
              </select>

              <label>
                How does your child prepare for exams?
              </label>

              <textarea
                value={form.examPreparation}
                onChange={e =>
                  update('examPreparation', e.target.value)
                }
                placeholder="Describe their current approach."
              />

              <label>
                How are homework assignments usually handled?
              </label>

              <textarea
                value={form.homeworkHabits}
                onChange={e =>
                  update('homeworkHabits', e.target.value)
                }
              />
            </>
          )}


          {/* STEP 6 */}

          {step === 6 && (
            <>
              <h1>
                🧠 Learning Preferences
              </h1>

              <label>
                How does your child seem to learn best?
              </label>

              <select
                value={form.learningStyle}
                onChange={e =>
                  update('learningStyle', e.target.value)
                }
              >
                <option value="">Select</option>
                <option>Seeing examples and diagrams</option>
                <option>Listening and discussing</option>
                <option>Reading and writing</option>
                <option>Practicing questions</option>
                <option>Hands-on activities</option>
                <option>A combination</option>
                <option>Not sure</option>
              </select>

              <label>
                What type of support helps your child most?
              </label>

              <div className="checkbox-grid">

                {[
                  'Step-by-step explanations',
                  'Examples',
                  'More practice',
                  'Repetition',
                  'Short lessons',
                  'Discussion',
                  'Quizzes',
                  'Homework support'
                ].map(item => (
                  <label key={item}>
                    <input
                      type="checkbox"
                      checked={form.helpfulSupport.includes(item)}
                      onChange={() =>
                        toggleArray('helpfulSupport', item)
                      }
                    />
                    {item}
                  </label>
                ))}

              </div>
            </>
          )}


          {/* STEP 7 */}

          {step === 7 && (
            <>
              <h1>
                🎯 Goals
              </h1>

              <p>
                What would you like StudyCare to help your child achieve?
              </p>

              <label>
                Main goals
              </label>

              <div className="checkbox-grid">

                {[
                  'Improve grades',
                  'Understand difficult subjects',
                  'Complete homework independently',
                  'Prepare for exams',
                  'Build better study habits',
                  'Improve confidence',
                  'Improve reading',
                  'Improve writing',
                  'Improve mathematics',
                  'Become more independent'
                ].map(goal => (
                  <label key={goal}>
                    <input
                      type="checkbox"
                      checked={form.goals.includes(goal)}
                      onChange={() =>
                        toggleArray('goals', goal)
                      }
                    />
                    {goal}
                  </label>
                ))}

              </div>

              <label>
                Describe your main goal.
              </label>

              <textarea
                value={form.mainGoals}
                onChange={e =>
                  update('mainGoals', e.target.value)
                }
                placeholder="What would success look like?"
              />

              <label>
                What would you like to improve in the next month?
              </label>

              <textarea
                value={form.oneMonthGoal}
                onChange={e =>
                  update('oneMonthGoal', e.target.value)
                }
              />

              <label>
                What would you like to achieve in 3 months?
              </label>

              <textarea
                value={form.threeMonthGoal}
                onChange={e =>
                  update('threeMonthGoal', e.target.value)
                }
              />

              <label>
                Is there an upcoming important exam?
              </label>

              <input
                value={form.upcomingExam}
                onChange={e =>
                  update('upcomingExam', e.target.value)
                }
                placeholder="Example: Grade 8 final exam"
              />

              <label>
                Target grade/mark, if you have one
              </label>

              <input
                value={form.targetGrade}
                onChange={e =>
                  update('targetGrade', e.target.value)
                }
                placeholder="Example: 80% or Grade A"
              />

              <label>
                What does the student personally want help with?
              </label>

              <textarea
                value={form.studentGoal}
                onChange={e =>
                  update('studentGoal', e.target.value)
                }
                placeholder="Ask your child and write their answer."
              />

              <label>
                What does the student find hardest about studying?
              </label>

              <textarea
                value={form.studentDifficulty}
                onChange={e =>
                  update('studentDifficulty', e.target.value)
                }
              />
            </>
          )}


          {/* STEP 8 */}

          {step === 8 && (
            <>
              <h1>
                🕐 Schedule
              </h1>

              <label>
                Preferred study times
              </label>

              <div className="checkbox-grid">

                {[
                  'Early morning',
                  'Morning',
                  'Afternoon',
                  'Evening',
                  'Night'
                ].map(time => (
                  <label key={time}>
                    <input
                      type="checkbox"
                      checked={form.preferredStudyTime.includes(time)}
                      onChange={() =>
                        toggleArray(
                          'preferredStudyTime',
                          time
                        )
                      }
                    />
                    {time}
                  </label>
                ))}

              </div>

              <label>
                Days/times your child is unavailable
              </label>

              <textarea
                value={form.unavailableTimes}
                onChange={e =>
                  update('unavailableTimes', e.target.value)
                }
                placeholder="Example: Monday and Wednesday 5–7 PM"
              />

              <label>
                Preferred sessions per week
              </label>

              <select
                value={form.sessionsPerWeek}
                onChange={e =>
                  update('sessionsPerWeek', e.target.value)
                }
              >
                <option value="">Select</option>
                <option>1 session</option>
                <option>2 sessions</option>
                <option>3 sessions</option>
                <option>4 sessions</option>
                <option>5+ sessions</option>
              </select>

              <label>
                Preferred session length
              </label>

              <select
                value={form.sessionLength}
                onChange={e =>
                  update('sessionLength', e.target.value)
                }
              >
                <option value="">Select</option>
                <option>30 minutes</option>
                <option>45 minutes</option>
                <option>1 hour</option>
                <option>1.5 hours</option>
                <option>2 hours</option>
              </select>

              <label>
                Preferred learning mode
              </label>

              <select
                value={form.learningMode}
                onChange={e =>
                  update('learningMode', e.target.value)
                }
              >
                <option value="">Select</option>
                <option>Online</option>
                <option>In-person</option>
                <option>Both</option>
              </select>
            </>
          )}


          {/* STEP 9 */}

          {step === 9 && (
            <>
              <h1>
                💻 Learning Environment
              </h1>

              <label>
                Does your child have a quiet place to study?
              </label>

              <select
                value={form.quietPlace}
                onChange={e =>
                  update('quietPlace', e.target.value)
                }
              >
                <option value="">Select</option>
                <option>Yes</option>
                <option>Sometimes</option>
                <option>No</option>
              </select>

              <label>
                Available devices
              </label>

              <div className="checkbox-grid">

                {[
                  'Smartphone',
                  'Tablet',
                  'Computer',
                  'Laptop',
                  'None'
                ].map(device => (
                  <label key={device}>
                    <input
                      type="checkbox"
                      checked={form.devices.includes(device)}
                      onChange={() =>
                        toggleArray('devices', device)
                      }
                    />
                    {device}
                  </label>
                ))}

              </div>

              <label>
                Internet connection
              </label>

              <select
                value={form.internetConnection}
                onChange={e =>
                  update(
                    'internetConnection',
                    e.target.value
                  )
                }
              >
                <option value="">Select</option>
                <option>Reliable</option>
                <option>Usually available</option>
                <option>Sometimes unavailable</option>
                <option>No regular internet</option>
              </select>

              <h2>
                Previous Tutoring
              </h2>

              <label>
                Has your child received tutoring before?
              </label>

              <select
                value={form.previousTutoring}
                onChange={e =>
                  update(
                    'previousTutoring',
                    e.target.value
                  )
                }
              >
                <option value="">Select</option>
                <option>Yes</option>
                <option>No</option>
              </select>

              <label>
                If yes, what type of tutoring?
              </label>

              <textarea
                value={form.previousTutoringDetails}
                onChange={e =>
                  update(
                    'previousTutoringDetails',
                    e.target.value
                  )
                }
              />

              <label>
                What worked well?
              </label>

              <textarea
                value={form.whatWorked}
                onChange={e =>
                  update('whatWorked', e.target.value)
                }
              />

              <label>
                What did not work?
              </label>

              <textarea
                value={form.whatDidNotWork}
                onChange={e =>
                  update('whatDidNotWork', e.target.value)
                }
              />
            </>
          )}


          {/* STEP 10 */}

          {step === 10 && (
            <>
              <h1>
                👨‍👩‍👧 Expectations
              </h1>

              <label>
                What is your biggest concern about your child's education?
              </label>

              <textarea
                value={form.parentConcern}
                onChange={e =>
                  update('parentConcern', e.target.value)
                }
              />

              <label>
                What do you expect from StudyCare?
              </label>

              <textarea
                value={form.parentExpectations}
                onChange={e =>
                  update('parentExpectations', e.target.value)
                }
                placeholder="Tell us what you expect from our service."
              />

              <label>
                How would you like to receive progress updates?
              </label>

              <select
                value={form.progressUpdates}
                onChange={e =>
                  update('progressUpdates', e.target.value)
                }
              >
                <option value="">Select</option>
                <option>WhatsApp</option>
                <option>Phone call</option>
                <option>Email</option>
                <option>Any of these</option>
              </select>

              <label>
                Is there anything else we should know?
              </label>

              <textarea
                value={form.additionalInformation}
                onChange={e =>
                  update(
                    'additionalInformation',
                    e.target.value
                  )
                }
                placeholder="Anything important about your child's learning."
              />

              <div
                style={{
                  padding: '18px',
                  background: '#f3f4f6',
                  borderRadius: '12px',
                  marginTop: '20px'
                }}
              >
                <strong>
                  📚 What happens next?
                </strong>

                <p>
                  We will review this information and use it
                  to create a personalized StudyCare learning
                  plan based on your child's needs, goals,
                  strengths and schedule.
                </p>
              </div>
            </>
          )}


          {error && (
            <p className="error-message">
              {error}
            </p>
          )}


          {/* BUTTONS */}

          <div
            style={{
              display: 'flex',
              gap: '12px',
              marginTop: '30px'
            }}
          >

            {step > 1 && (
              <button
                type="button"
                className="primary-button"
                onClick={previousStep}
              >
                ← Back
              </button>
            )}

            {step < totalSteps ? (
              <button
                type="button"
                className="submit-button"
                onClick={nextStep}
              >
                Continue →
              </button>
            ) : (
              <button
                type="submit"
                className="submit-button"
                disabled={loading}
              >
                {loading
                  ? 'Submitting...'
                  : '✓ Complete Onboarding'}
              </button>
            )}

          </div>

        </form>

      </div>

    </div>
  )
}

export default Onboarding
