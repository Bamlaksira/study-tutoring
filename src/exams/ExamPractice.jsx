import { useEffect, useState } from 'react'
import { EXAM_GRADES, getProductsByGrade } from './examData'

const FREE_QUESTIONS = 3

// Your backend URL
const API_URL = 'https://studycare-backend.onrender.com'

// Replace this with your real CBE account number
const CBE_ACCOUNT_NAME = 'Bamlaksira Abebe'
const CBE_ACCOUNT_NUMBER = '1000385393257'

export default function ExamPractice() {
  const [selectedGrade, setSelectedGrade] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)

  const [selectedOptions, setSelectedOptions] = useState({})
  const [paidQuestions, setPaidQuestions] = useState([])
  const [showAnswers, setShowAnswers] = useState({})

  const [showPurchaseForm, setShowPurchaseForm] = useState(false)
  const [purchaseSubmitting, setPurchaseSubmitting] = useState(false)
  const [checkingAccess, setCheckingAccess] = useState(false)

  const [purchaseMessage, setPurchaseMessage] = useState('')
  const [purchaseError, setPurchaseError] = useState('')

  const [accessStatus, setAccessStatus] = useState('Locked')
  const [purchaseId, setPurchaseId] = useState('')

  const [purchaseForm, setPurchaseForm] = useState({
    customerName: '',
    phone: '',
    email: '',
    transactionReference: '',
  })

  const products = selectedGrade
    ? getProductsByGrade(selectedGrade)
    : []

  /*
    Load a previously submitted purchase when the student
    opens a product again.
  */
  useEffect(() => {
    if (!selectedProduct) return

    const storageKey = `studycare_exam_purchase_${selectedProduct.id}`
    const saved = localStorage.getItem(storageKey)

    if (!saved) {
      setPurchaseForm({
        customerName: '',
        phone: '',
        email: '',
        transactionReference: '',
      })
      setPurchaseId('')
      setAccessStatus('Locked')
      setPurchaseMessage('')
      setPurchaseError('')
      return
    }

    try {
      const data = JSON.parse(saved)

      if (data.form) {
        setPurchaseForm(data.form)
      }

      if (data.purchaseId) {
        setPurchaseId(data.purchaseId)
      }

      if (data.accessStatus) {
        setAccessStatus(data.accessStatus)
      }

      if (data.form?.phone && data.form?.transactionReference) {
        checkAccess(data.form)
      }
        } catch (error) {
      console.error('Saved purchase error:', error)
    }
  }, [selectedProduct])

  const openProduct = (product) => {
  setSelectedProduct(product)
  setPaidQuestions([])
  setSelectedOptions({})
    setShowAnswers({})
    setShowPurchaseForm(false)
    setPurchaseMessage('')
    setPurchaseError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const backToSubjects = () => {
  setSelectedProduct(null)
  setPaidQuestions([])
  setSelectedOptions({})
    setShowAnswers({})
    setShowPurchaseForm(false)
    setPurchaseMessage('')
    setPurchaseError('')
  }

  const selectOption = (questionId, option) => {
    if (selectedOptions[questionId]) return

    setSelectedOptions((prev) => ({
      ...prev,
      [questionId]: option,
    }))
  }

  const toggleAnswer = (id) => {
    setShowAnswers((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const getOptionStyle = (question, option) => {
    const selected = selectedOptions[question.id]

    if (!selected) {
      return styles.option
    }

    if (option === question.correctAnswer) {
      return {
        ...styles.option,
        ...styles.correctOption,
      }
    }

    if (
      option === selected &&
      option !== question.correctAnswer
    ) {
      return {
        ...styles.option,
        ...styles.wrongOption,
      }
    }

    return {
      ...styles.option,
      ...styles.disabledOption,
    }
  }

  const updatePurchaseForm = (field, value) => {
    setPurchaseForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  /*
    Submit the CBE transaction information to the backend.
  */
  const submitPurchase = async (event) => {
    event.preventDefault()

    setPurchaseError('')
    setPurchaseMessage('')

    if (
      !purchaseForm.customerName.trim() ||
      !purchaseForm.phone.trim() ||
      !purchaseForm.transactionReference.trim()
    ) {
      setPurchaseError(
        'Please enter your name, phone number, and CBE transaction reference.'
      )
      return
    }

    setPurchaseSubmitting(true)

    try {
      const response = await fetch(
        `${API_URL}/api/exam-purchases`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customerName: purchaseForm.customerName.trim(),
            phone: purchaseForm.phone.trim(),
            email: purchaseForm.email.trim(),
            productId: selectedProduct.id,
            productName: selectedProduct.title,
            amount: selectedProduct.price,
            transactionReference:
              purchaseForm.transactionReference.trim(),
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to submit payment information.'
        )
      }

      setPurchaseId(data.purchaseId)
      setAccessStatus('Locked')

      localStorage.setItem(
        `studycare_exam_purchase_${selectedProduct.id}`,
        JSON.stringify({
          purchaseId: data.purchaseId,
          form: purchaseForm,
          accessStatus: 'Locked',
        })
      )

      setPurchaseMessage(
        'Your payment information has been submitted. StudyCare will verify your CBE transfer before unlocking the exam.'
      )

      setShowPurchaseForm(false)
    } catch (error) {
      console.error('Purchase submission error:', error)

      setPurchaseError(
        error.message ||
          'Something went wrong while submitting your payment.'
      )
    } finally {
      setPurchaseSubmitting(false)
    }
  }

  /*
    Ask the backend whether this purchase has been approved.
  */
  const checkAccess = async (form = purchaseForm) => {
    if (
      !selectedProduct ||
      !form.phone.trim() ||
      !form.transactionReference.trim()
    ) {
      return
    }

    setCheckingAccess(true)
    setPurchaseError('')
    setPurchaseMessage('')

    try {
      const response = await fetch(
        `${API_URL}/api/exam-purchases/check-access`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phone: form.phone.trim(),
            transactionReference:
              form.transactionReference.trim(),
            productId: selectedProduct.id,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Purchase could not be found.'
        )
      }

      setAccessStatus(data.accessStatus)

      localStorage.setItem(
        `studycare_exam_purchase_${selectedProduct.id}`,
        JSON.stringify({
          purchaseId: data.purchaseId || purchaseId,
          form,
          accessStatus: data.accessStatus,
        })
      )

      if (data.accessStatus === 'Unlocked') {
        setPurchaseMessage(
          'Payment approved! Full exam practice is now unlocked.'
        )
       await loadPaidQuestions(form)
      } else {
        setPurchaseMessage(
          'Your payment is still being verified. Please check again after StudyCare approves the payment.'
        )
      }
    } catch (error) {
      console.error('Access check error:', error)

      setPurchaseError(
        error.message ||
          'Unable to check your payment status.'
      )
    } finally {
      setCheckingAccess(false)
    }
  }

  const isUnlocked = accessStatus === 'Unlocked'
    const loadPaidQuestions = async (form = purchaseForm) => {
    if (
      !selectedProduct ||
      !form.phone.trim() ||
      !form.transactionReference.trim()
    ) {
      return
    }

    try {
      const response = await fetch(
        `${API_URL}/api/exams/paid-content`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phone: form.phone.trim(),
            transactionReference:
              form.transactionReference.trim(),
            productId: selectedProduct.id,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
            'Paid exam content could not be loaded.'
        )
      }

      setPaidQuestions(data.questions || [])
    } catch (error) {
      console.error(
        'Paid exam content error:',
        error
      )
      setPaidQuestions([])
    }
  }
  /*
    Reusable question content.
  */
  const renderQuestionContent = (item) => {
    const selected = selectedOptions[item.id]
    const answered = Boolean(selected)
    const isCorrect = selected === item.correctAnswer

    return (
      <>
        <h3 style={styles.questionText}>
          {item.question}
        </h3>

        {item.options?.length > 0 && (
          <div style={styles.options}>
            {item.options.map((option, index) => (
              <button
                key={option}
                onClick={() =>
                  selectOption(item.id, option)
                }
                disabled={answered}
                style={getOptionStyle(item, option)}
              >
                <span style={styles.optionLetter}>
                  {String.fromCharCode(65 + index)}
                </span>

                <span style={styles.optionText}>
                  {option}
                </span>

                {answered &&
                  option === item.correctAnswer && (
                    <span style={styles.optionResult}>
                      ✓
                    </span>
                  )}

                {answered &&
                  option === selected &&
                  option !== item.correctAnswer && (
                    <span style={styles.optionResult}>
                      ✕
                    </span>
                  )}
              </button>
            ))}
          </div>
        )}

        {answered && (
          <div
            style={{
              ...styles.resultBox,
              ...(isCorrect
                ? styles.correctResult
                : styles.wrongResult),
            }}
          >
            <strong>
              {isCorrect
                ? '✓ Correct!'
                : '✕ Incorrect'}
            </strong>

            {!isCorrect && (
              <p>
                The correct answer is:{' '}
                <strong>
                  {item.correctAnswer}
                </strong>
              </p>
            )}
          </div>
        )}

        <button
          onClick={() => toggleAnswer(item.id)}
          style={styles.answerButton}
        >
          {showAnswers[item.id]
            ? 'Hide Answer & Explanation'
            : 'Show Answer & Explanation'}
        </button>

        {showAnswers[item.id] && (
          <div style={styles.answerBox}>
            <div>
              <strong>Answer</strong>
              <p>{item.correctAnswer}</p>
            </div>

            <div>
              <strong>Explanation</strong>
              <p>{item.explanation}</p>
            </div>
          </div>
        )}
      </>
    )
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <a href="/" style={styles.logo}>
          Study<span>Care</span>
        </a>

        <a href="/" style={styles.homeLink}>
          ← Back to StudyCare
        </a>
      </header>

      {!selectedProduct ? (
        <main style={styles.container}>
          <section style={styles.hero}>
            <span style={styles.badge}>
              EXAM PRACTICE
            </span>

            <h1 style={styles.heroTitle}>
              Practice Smarter for Your Exams
            </h1>

            <p style={styles.heroText}>
              Prepare with exam-style questions, instant
              answer checking, and clear explanations.
            </p>

            <div style={styles.heroFeatures}>
              <span>✓ Exam-style questions</span>
              <span>✓ Answers & explanations</span>
              <span>✓ Practice at your own pace</span>
            </div>
          </section>

          <section style={styles.section}>
            <div style={styles.sectionHeading}>
              <span style={styles.eyebrow}>
                STEP 1
              </span>

              <h2>Choose Your Grade</h2>

              <p>
                Select your grade to see available
                subjects.
              </p>
            </div>

            <div style={styles.gradeGrid}>
              {EXAM_GRADES.map((grade) => (
                <button
                  key={grade}
                  onClick={() =>
                    setSelectedGrade(grade)
                  }
                  style={{
                    ...styles.gradeCard,
                    ...(selectedGrade === grade
                      ? styles.gradeCardSelected
                      : {}),
                  }}
                >
                  <div style={styles.gradeIcon}>
                    🎓
                  </div>

                  <strong>{grade}</strong>

                  <span>
                    View subjects →
                  </span>
                </button>
              ))}
            </div>
          </section>

          {selectedGrade && (
            <section style={styles.section}>
              <div style={styles.sectionHeading}>
                <span style={styles.eyebrow}>
                  STEP 2 • {selectedGrade}
                </span>

                <h2>Choose a Subject</h2>

                <p>
                  Choose the subject you want to
                  practice.
                </p>
              </div>

              {products.length === 0 ? (
                <div style={styles.empty}>
                  <div style={styles.emptyIcon}>
                    📚
                  </div>

                  <h3>
                    Subjects Coming Soon
                  </h3>

                  <p>
                    Exam practice for this grade
                    is currently being prepared.
                  </p>
                </div>
              ) : (
                <div style={styles.productGrid}>
                  {products.map((product) => (
                    <article
                      key={product.id}
                      style={styles.productCard}
                    >
                      <div style={styles.subjectIcon}>
                        📖
                      </div>

                      <span style={styles.subjectLabel}>
                        {product.subject}
                      </span>

                      <h3 style={styles.productTitle}>
                        {product.title}
                      </h3>

                      <p
                        style={
                          styles.productDescription
                        }
                      >
                        {product.description}
                      </p>

                      <div
                        style={styles.productInfo}
                      >
                        <span>
                          🎯{' '}
                          {product.questions.length >
                          0
                            ? `${product.questions.length}+ questions`
                            : 'Questions coming soon'}
                        </span>

                        <span>
                          ✓ Answers included
                        </span>

                        <span>
                          ✓ Explanations included
                        </span>
                      </div>

                      <div
                        style={styles.productBottom}
                      >
                        <div>
                          <small
                            style={
                              styles.priceLabel
                            }
                          >
                            PRICE
                          </small>

                          <strong
                            style={styles.price}
                          >
                            {product.price > 0
                              ? `${product.price} ETB`
                              : 'Coming soon'}
                          </strong>
                        </div>

                        <button
                          onClick={() =>
                            openProduct(product)
                          }
                          style={styles.primaryButton}
                        >
                          Practice Now →
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}

          <section style={styles.infoSection}>
            <div style={styles.infoCard}>
              <span style={styles.infoIcon}>
                💡
              </span>

              <div>
                <h3>
                  Learn from Every Question
                </h3>

                <p>
                  Don't just check whether your
                  answer is correct. Use the
                  explanations to understand why
                  the answer is correct.
                </p>
              </div>
            </div>

            <div style={styles.infoCard}>
              <span style={styles.infoIcon}>
                🔓
              </span>

              <div>
                <h3>Start for Free</h3>

                <p>
                  Try the first 3 questions free
                  before deciding whether to unlock
                  the complete practice set.
                </p>
              </div>
            </div>
          </section>
        </main>
      ) : (
        <main style={styles.container}>
          <button
            onClick={backToSubjects}
            style={styles.backButton}
          >
            ← Back to Subjects
          </button>

          <section style={styles.productHero}>
            <div style={styles.productHeroTop}>
              <span style={styles.eyebrow}>
                {selectedProduct.grade}
              </span>

              <span style={styles.subjectPill}>
                {selectedProduct.subject}
              </span>
            </div>

            <h1 style={styles.productHeroTitle}>
              {selectedProduct.title}
            </h1>

            <p style={styles.productHeroText}>
              {selectedProduct.description}
            </p>

            <div style={styles.productStats}>
              <div>
                <strong>
                {selectedProduct.questions.length + paidQuestions.length}
                </strong>

                <span>Questions</span>
              </div>

              <div>
                <strong>
                  {FREE_QUESTIONS}
                </strong>

                <span>Free Questions</span>
              </div>

              <div>
                <strong>
                  {selectedProduct.price} ETB
                </strong>

                <span>Full Access</span>
              </div>
            </div>

            <div style={styles.freeNotice}>
              <div style={styles.freeNoticeIcon}>
                🎁
              </div>

              <div>
                <strong>
                  Try the first {FREE_QUESTIONS}{' '}
                  questions FREE
                </strong>

                <p>
                  Answer the free questions and see
                  the explanations before unlocking
                  the complete practice set.
                </p>
              </div>
            </div>
          </section>

          <section style={styles.questionsSection}>
            <div style={styles.questionsHeading}>
              <div>
                <span style={styles.eyebrow}>
                  PRACTICE
                </span>

                <h2>Questions</h2>
              </div>

              <span style={styles.freeCounter}>
                {FREE_QUESTIONS} FREE
              </span>
            </div>

           {selectedProduct.questions.length === 0 && !isUnlocked ? (
              <div style={styles.empty}>
                <div style={styles.emptyIcon}>
                  📝
                </div>

                <h3>
                  Questions Coming Soon
                </h3>

                <p>
                  We are preparing questions for
                  this subject.
                </p>
              </div>
            ) : (
              [...selectedProduct.questions, ...paidQuestions].map(
                (item) => {
                  const isFree =
                    item.order <= FREE_QUESTIONS

                  const canAccess =
                    isFree || isUnlocked

                  return (
                    <article
                      key={item.id}
                      style={{
                        ...styles.questionCard,
                        ...(!canAccess
                          ? styles.lockedCard
                          : {}),
                      }}
                    >
                      <div style={styles.questionTop}>
                        <span
                          style={
                            styles.questionNumber
                          }
                        >
                          Question {item.order}
                        </span>

                        {isFree ? (
                          <span
                            style={styles.freeBadge}
                          >
                            FREE
                          </span>
                        ) : isUnlocked ? (
                          <span
                            style={
                              styles.unlockedBadge
                            }
                          >
                            ✓ UNLOCKED
                          </span>
                        ) : (
                          <span
                            style={
                              styles.lockBadge
                            }
                          >
                            🔒 LOCKED
                          </span>
                        )}
                      </div>

                      {canAccess ? (
                        renderQuestionContent(item)
                      ) : (
                        <div
                          style={
                            styles.lockedContent
                          }
                        >
                          <div
                            style={
                              styles.lockIcon
                            }
                          >
                            🔒
                          </div>

                          <h3>
                            This question is
                            locked
                          </h3>

                          <p>
                            Unlock the full
                            practice set to see
                            this question, answer,
                            and explanation.
                          </p>

                          <button
                            onClick={() => {
                              setShowPurchaseForm(
                                true
                              )

                              setPurchaseError('')
                              setPurchaseMessage('')

                              window.scrollTo({
                                top: document.body
                                  .scrollHeight,
                                behavior: 'smooth',
                              })
                            }}
                            style={
                              styles.unlockButton
                            }
                          >
                            Unlock Full Exam
                            Practice
                          </button>
                        </div>
                      )}
                    </article>
                  )
                }
              )
            )}

             {selectedProduct.questions.length >= FREE_QUESTIONS && (
              <section style={styles.purchaseBox}>
                {isUnlocked ? (
                  <>
                    <div
                      style={styles.successIcon}
                    >
                      🎉
                    </div>

                    <span
                      style={
                        styles.purchaseEyebrow
                      }
                    >
                      FULL ACCESS UNLOCKED
                    </span>

                    <h2>
                      You can now access the
                      complete practice set
                    </h2>

                    <p>
                      Your payment has been
                      approved by StudyCare.
                      All questions, answers, and
                      explanations are unlocked.
                    </p>
                  </>
                ) : (
                  <>
                    <div
                      style={styles.purchaseIcon}
                    >
                      🎯
                    </div>

                    <span
                      style={
                        styles.purchaseEyebrow
                      }
                    >
                      FULL ACCESS
                    </span>

                    <h2>
                      Ready to practice the full
                      set?
                    </h2>

                    <p>
                      Unlock all questions, answers,
                      and detailed explanations for
                      this subject.
                    </p>

                    <div
                      style={styles.purchasePrice}
                    >
                      {selectedProduct.price} ETB
                    </div>

                    {!showPurchaseForm ? (
                      <>
                        <button
                          onClick={() => {
                            setShowPurchaseForm(
                              true
                            )
                            setPurchaseError('')
                            setPurchaseMessage('')
                          }}
                          style={
                            styles.primaryLarge
                          }
                        >
                          Unlock Full Exam
                          Practice
                        </button>

                        {purchaseMessage && (
                          <div
                            style={
                              styles.messageBox
                            }
                          >
                            {purchaseMessage}
                          </div>
                        )}

                        {purchaseError && (
                          <div
                            style={
                              styles.errorBox
                            }
                          >
                            {purchaseError}
                          </div>
                        )}

                        {purchaseId && (
                          <button
                            onClick={() =>
                              checkAccess()
                            }
                            disabled={
                              checkingAccess
                            }
                            style={
                              styles.checkButton
                            }
                          >
                            {checkingAccess
                              ? 'Checking...'
                              : 'Check Payment Status'}
                          </button>
                        )}

                        <small
                          style={
                            styles.purchaseSmall
                          }
                        >
                          Payment is made by CBE
                          bank transfer and
                          verified manually by
                          StudyCare.
                        </small>
                      </>
                    ) : (
                      <form
                        onSubmit={submitPurchase}
                        style={styles.purchaseForm}
                      >
                        <div
                          style={
                            styles.paymentInstruction
                          }
                        >
                          <strong>
                            CBE Transfer
                            Instructions
                          </strong>

                          <p>
                            Send{' '}
                            <strong>
                              {
                                selectedProduct.price
                              }{' '}
                              ETB
                            </strong>{' '}
                            to the StudyCare CBE
                            account, then enter
                            your transaction
                            reference below.
                          </p>

                          <div
                            style={
                              styles.bankDetails
                            }
                          >
                            <div>
                              <span>
                                Account Name
                              </span>

                              <strong>
                                {
                                  CBE_ACCOUNT_NAME
                                }
                              </strong>
                            </div>

                            <div>
                              <span>
                                CBE Account
                              </span>

                              <strong>
                                {
                                  CBE_ACCOUNT_NUMBER
                                }
                              </strong>
                            </div>
                          </div>
                        </div>

                        <label
                          style={styles.formLabel}
                        >
                          Full Name *
                          <input
                            type="text"
                            value={
                              purchaseForm.customerName
                            }
                            onChange={(e) =>
                              updatePurchaseForm(
                                'customerName',
                                e.target.value
                              )
                            }
                            placeholder="Enter your full name"
                            style={
                              styles.formInput
                            }
                            required
                          />
                        </label>

                        <label
                          style={styles.formLabel}
                        >
                          Phone Number *
                          <input
                            type="tel"
                            value={
                              purchaseForm.phone
                            }
                            onChange={(e) =>
                              updatePurchaseForm(
                                'phone',
                                e.target.value
                              )
                            }
                            placeholder="09XXXXXXXX"
                            style={
                              styles.formInput
                            }
                            required
                          />
                        </label>

                        <label
                          style={styles.formLabel}
                        >
                          Email
                          <input
                            type="email"
                            value={
                              purchaseForm.email
                            }
                            onChange={(e) =>
                              updatePurchaseForm(
                                'email',
                                e.target.value
                              )
                            }
                            placeholder="Optional"
                            style={
                              styles.formInput
                            }
                          />
                        </label>

                        <label
                          style={styles.formLabel}
                        >
                          CBE Transaction Reference *
                          <input
                            type="text"
                            value={
                              purchaseForm.transactionReference
                            }
                            onChange={(e) =>
                              updatePurchaseForm(
                                'transactionReference',
                                e.target.value
                              )
                            }
                            placeholder="Enter transaction/reference number"
                            style={
                              styles.formInput
                            }
                            required
                          />
                        </label>

                        {purchaseError && (
                          <div
                            style={
                              styles.errorBox
                            }
                          >
                            {purchaseError}
                          </div>
                        )}

                        <div
                          style={
                            styles.formButtons
                          }
                        >
                          <button
                            type="button"
                            onClick={() =>
                              setShowPurchaseForm(
                                false
                              )
                            }
                            style={
                              styles.cancelButton
                            }
                          >
                            Cancel
                          </button>

                          <button
                            type="submit"
                            disabled={
                              purchaseSubmitting
                            }
                            style={
                              styles.primaryLarge
                            }
                          >
                            {purchaseSubmitting
                              ? 'Submitting...'
                              : 'Submit Payment Information'}
                          </button>
                        </div>

                        <p
                          style={
                            styles.formNote
                          }
                        >
                          After submission, your
                          payment will remain locked
                          until StudyCare verifies
                          the CBE transfer.
                        </p>
                      </form>
                    )}
                  </>
                )}
              </section>
            )}
          </section>

          <section style={styles.tutoringCTA}>
            <div>
              <span style={styles.eyebrow}>
                NEED MORE SUPPORT?
              </span>

              <h2>
                Want personalized exam
                preparation?
              </h2>

              <p>
                StudyCare also provides
                personalized tutoring and exam
                preparation support for students.
              </p>
            </div>

            <a
              href="/"
              style={styles.tutoringButton}
            >
              Explore Tutoring →
            </a>
          </section>
        </main>
      )}

      <footer style={styles.footer}>
        <strong>
          Study<span>Care</span>
        </strong>

        <p>
          Helping students prepare, practice,
          and learn with confidence.
        </p>
      </footer>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f7f8fa',
    color: '#172033',
    fontFamily: 'Arial, sans-serif',
  },

  header: {
    minHeight: '70px',
    padding: '0 6%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: '#ffffff',
    borderBottom: '1px solid #e5e7eb',
    gap: '20px',
  },

  logo: {
    textDecoration: 'none',
    fontSize: '25px',
    fontWeight: '800',
    color: '#172033',
  },

  "logo span": {
    color: '#1769aa',
  },

  homeLink: {
    textDecoration: 'none',
    color: '#555',
    fontWeight: '600',
    fontSize: '14px',
  },

  container: {
    width: '92%',
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '45px 0 80px',
  },

  hero: {
    textAlign: 'center',
    maxWidth: '760px',
    margin: '0 auto 60px',
  },

  badge: {
    display: 'inline-block',
    padding: '7px 13px',
    borderRadius: '30px',
    background: '#e9f2ff',
    color: '#1769aa',
    fontSize: '12px',
    fontWeight: '800',
    letterSpacing: '1px',
  },

      
heroTitle: {
  fontSize: '42px',
  lineHeight: '1.1',
  margin: '18px 0 15px',
  color: '#172033',
},

  heroText: {
    fontSize: '18px',
    color: '#626b7a',
    lineHeight: '1.7',
    margin: 0,
  },

  heroFeatures: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '15px',
    marginTop: '25px',
    color: '#315f46',
    fontSize: '14px',
    fontWeight: '700',
  },

  section: {
    marginBottom: '55px',
  },

  sectionHeading: {
    marginBottom: '25px',
  },

  "sectionHeading h2": {
    margin: '7px 0 5px',
    fontSize: '28px',
  },

  "sectionHeading p": {
    margin: 0,
    color: '#697180',
  },

  eyebrow: {
    color: '#1769aa',
    fontWeight: '800',
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },

  gradeGrid: {
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit, minmax(210px, 1fr))',
    gap: '18px',
  },

  gradeCard: {
  border: '1px solid #e1e5eb',
  background: '#ffffff',
  borderRadius: '18px',
  padding: '25px',
  textAlign: 'left',
  cursor: 'pointer',
  minHeight: '155px',
  transition: '0.2s',
  color: '#172033',
},

  gradeCardSelected: {
    border: '2px solid #1769aa',
    boxShadow:
      '0 8px 25px rgba(23,105,170,0.10)',
  },

  gradeIcon: {
    fontSize: '30px',
    marginBottom: '15px',
  },

  productGrid: {
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit, minmax(290px, 1fr))',
    gap: '20px',
  },

  productCard: {
    background: '#ffffff',
    border: '1px solid #e1e5eb',
    borderRadius: '20px',
    padding: '25px',
    boxShadow:
      '0 5px 20px rgba(23,32,51,0.03)',
  },

  subjectIcon: {
    fontSize: '30px',
    marginBottom: '10px',
  },

  subjectLabel: {
    fontSize: '12px',
    color: '#1769aa',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
  },

  productTitle: {
  fontSize: '20px',
  margin: '8px 0',
  color: '#172033',
},

  productDescription: {
    color: '#687180',
    lineHeight: '1.6',
    minHeight: '52px',
  },

  productInfo: {
    display: 'grid',
    gap: '8px',
    margin: '20px 0',
    color: '#4d5969',
    fontSize: '13px',
  },

  productBottom: {
    borderTop: '1px solid #edf0f3',
    paddingTop: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '15px',
  },

  priceLabel: {
    display: 'block',
    color: '#89919d',
    fontSize: '10px',
    fontWeight: '800',
    letterSpacing: '1px',
  },

  price: {
    display: 'block',
    fontSize: '21px',
    marginTop: '3px',
  },

  primaryButton: {
    border: 'none',
    borderRadius: '11px',
    padding: '12px 16px',
    background: '#172033',
    color: '#ffffff',
    fontWeight: '800',
    cursor: 'pointer',
  },

  empty: {
    background: '#ffffff',
    borderRadius: '20px',
    padding: '45px 25px',
    textAlign: 'center',
    border: '1px solid #e1e5eb',
  },

  emptyIcon: {
    fontSize: '40px',
    marginBottom: '10px',
  },

  infoSection: {
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '18px',
    marginTop: '30px',
  },

  infoCard: {
    display: 'flex',
    gap: '15px',
    background: '#ffffff',
    border: '1px solid #e1e5eb',
    borderRadius: '18px',
    padding: '22px',
  },

  infoIcon: {
    fontSize: '25px',
  },

  "infoCard h3": {
    margin: '0 0 8px',
  },

  "infoCard p": {
    margin: 0,
    color: '#687180',
    lineHeight: '1.6',
  },

  backButton: {
    border: 'none',
    background: 'transparent',
    color: '#1769aa',
    fontWeight: '800',
    cursor: 'pointer',
    marginBottom: '25px',
    padding: 0,
  },

  productHero: {
    background: '#ffffff',
    borderRadius: '24px',
    padding: '35px',
    marginBottom: '35px',
    border: '1px solid #e1e5eb',
  },

  productHeroTop: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
  },

  subjectPill: {
    background: '#eef2f6',
    padding: '6px 11px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '800',
  },

  productHeroTitle: {
    fontSize: '36px',
    lineHeight: '1.2',
    margin: '15px 0 10px',
  },

  productHeroText: {
    color: '#687180',
    lineHeight: '1.7',
    fontSize: '16px',
    maxWidth: '720px',
  },

  productStats: {
    display: 'grid',
    gridTemplateColumns:
      'repeat(3, minmax(0, 1fr))',
    gap: '12px',
    marginTop: '28px',
  },

  "productStats div": {
    background: '#f7f8fa',
    borderRadius: '14px',
    padding: '15px',
    textAlign: 'center',
  },

  "productStats strong": {
    display: 'block',
    fontSize: '20px',
  },

  "productStats span": {
    display: 'block',
    marginTop: '5px',
    color: '#697180',
    fontSize: '12px',
  },

  freeNotice: {
    display: 'flex',
    gap: '15px',
    marginTop: '25px',
    padding: '18px',
    borderRadius: '15px',
    background: '#eef8f1',
    color: '#205c36',
    lineHeight: '1.6',
  },

  freeNoticeIcon: {
    fontSize: '25px',
  },

  "freeNotice p": {
    margin: '4px 0 0',
    fontSize: '14px',
  },

  questionsSection: {
    display: 'grid',
    gap: '20px',
  },

  questionsHeading: {
    color: '#172033',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'end',
    marginBottom: '5px',
  },

  freeCounter: {
    background: '#dff3e5',
    color: '#24733e',
    padding: '7px 11px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '800',
  },

  questionCard: {
    color: '#172033',
    background: '#ffffff',
    border: '1px solid #e1e5eb',
    borderRadius: '20px',
    padding: '25px',
  },

  lockedCard: {
    background: '#f1f2f4',
  },

  questionTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '18px',
    gap: '10px',
  },

  questionNumber: {
    fontWeight: '800',
    fontSize: '14px',
  },

  freeBadge: {
    padding: '5px 10px',
    borderRadius: '20px',
    background: '#dff3e5',
    color: '#24733e',
    fontSize: '11px',
    fontWeight: '800',
  },

  lockBadge: {
    padding: '5px 10px',
    borderRadius: '20px',
    background: '#e4e5e8',
    color: '#555',
    fontSize: '11px',
    fontWeight: '800',
  },

  unlockedBadge: {
    padding: '5px 10px',
    borderRadius: '20px',
    background: '#dff3e5',
    color: '#176b32',
    fontSize: '11px',
    fontWeight: '800',
  },

  questionText: {
    fontSize: '19px',
    lineHeight: '1.5',
    margin: '0 0 20px',
  },

  options: {
    display: 'grid',
    gap: '10px',
    margin: '15px 0 20px',
  },

  option: {
    color: '#172033',
    width: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px',
    borderRadius: '10px',
    background: '#f6f7f9',
    border: '2px solid transparent',
    textAlign: 'left',
    fontSize: '15px',
    cursor: 'pointer',
  },

  optionLetter: {
    color: '#172033',
    fontWeight: '800',
    minWidth: '25px',
  },

  optionText: {
    color: '#172033',
    flex: 1,
  },

  optionResult: {
    fontSize: '20px',
    fontWeight: '900',
  },

  correctOption: {
    background: '#e7f7ec',
    border: '2px solid #32a852',
    color: '#176b32',
  },

  wrongOption: {
    background: '#fdeaea',
    border: '2px solid #d93025',
    color: '#a51d16',
  },

  disabledOption: {
    opacity: 0.65,
    cursor: 'default',
  },

  resultBox: {
    padding: '14px 16px',
    borderRadius: '12px',
    marginBottom: '15px',
    lineHeight: '1.5',
  },

  correctResult: {
    background: '#e7f7ec',
    color: '#176b32',
    border: '1px solid #b8e5c4',
  },

  wrongResult: {
    background: '#fdeaea',
    color: '#a51d16',
    border: '1px solid #f2b8b5',
  },

  answerButton: {
    border: '1px solid #172033',
    background: '#ffffff',
    borderRadius: '10px',
    padding: '10px 14px',
    fontWeight: '700',
    cursor: 'pointer',
  },

  answerBox: {
    marginTop: '18px',
    padding: '18px',
    borderRadius: '12px',
    background: '#dceaff',
    lineHeight: '1.6',
    display: 'grid',
    gap: '10px',
  },

  "answerBox p": {
    margin: '4px 0 0',
  },

  lockedContent: {
    textAlign: 'center',
    padding: '25px 10px',
  },

  lockIcon: {
    fontSize: '38px',
    marginBottom: '10px',
  },

  unlockButton: {
    border: 'none',
    background: '#172033',
    color: '#ffffff',
    padding: '12px 18px',
    borderRadius: '10px',
    fontWeight: '800',
    cursor: 'pointer',
  },

  purchaseBox: {
    textAlign: 'center',
    background: '#ffffff',
    border: '1px solid #dce1e7',
    borderRadius: '24px',
    padding: '40px 25px',
    marginTop: '10px',
  },

  purchaseIcon: {
    fontSize: '38px',
  },

  successIcon: {
    fontSize: '45px',
  },

  purchaseEyebrow: {
    display: 'block',
    color: '#1769aa',
    fontWeight: '800',
    fontSize: '12px',
    letterSpacing: '1px',
    marginTop: '10px',
  },

  purchasePrice: {
    fontSize: '30px',
    fontWeight: '900',
    margin: '15px 0',
  },

  primaryLarge: {
    border: 'none',
    borderRadius: '12px',
    padding: '15px 25px',
    background: '#172033',
    color: '#ffffff',
    fontWeight: '800',
    cursor: 'pointer',
    fontSize: '15px',
  },

  purchaseSmall: {
    display: 'block',
    marginTop: '15px',
    color: '#777',
  },

  purchaseForm: {
    maxWidth: '600px',
    margin: '25px auto 0',
    textAlign: 'left',
  },

  paymentInstruction: {
    background: '#eef5ff',
    border: '1px solid #d5e5f8',
    borderRadius: '15px',
    padding: '20px',
    marginBottom: '20px',
    lineHeight: '1.6',
  },

  bankDetails: {
    display: 'grid',
    gap: '10px',
    marginTop: '15px',
  },

  "bankDetails div": {
    background: '#ffffff',
    borderRadius: '10px',
    padding: '12px 15px',
    display: 'flex',
    justifyContent: 'space-between',
    gap: '15px',
    flexWrap: 'wrap',
  },

  "bankDetails span": {
    color: '#697180',
  },

  formLabel: {
    display: 'block',
    fontWeight: '700',
    fontSize: '14px',
    marginBottom: '15px',
  },

  formInput: {
    display: 'block',
    width: '100%',
    boxSizing: 'border-box',
    marginTop: '7px',
    padding: '13px 14px',
    borderRadius: '10px',
    border: '1px solid #d6dbe2',
    fontSize: '15px',
    outline: 'none',
  },

  formButtons: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    flexWrap: 'wrap',
    marginTop: '20px',
  },

  cancelButton: {
    border: '1px solid #ccd2da',
    background: '#ffffff',
    color: '#172033',
    padding: '13px 18px',
    borderRadius: '10px',
    fontWeight: '700',
    cursor: 'pointer',
  },

  formNote: {
    textAlign: 'center',
    color: '#697180',
    fontSize: '13px',
    lineHeight: '1.6',
    marginTop: '18px',
  },

  messageBox: {
    background: '#e7f7ec',
    color: '#176b32',
    border: '1px solid #b8e5c4',
    borderRadius: '10px',
    padding: '13px 15px',
    marginTop: '18px',
    lineHeight: '1.5',
  },

  errorBox: {
    background: '#fdeaea',
    color: '#a51d16',
    border: '1px solid #f2b8b5',
    borderRadius: '10px',
    padding: '13px 15px',
    marginTop: '15px',
    lineHeight: '1.5',
  },

  checkButton: {
    display: 'block',
    margin: '15px auto 0',
    border: '1px solid #172033',
    background: '#ffffff',
    color: '#172033',
    padding: '11px 17px',
    borderRadius: '10px',
    fontWeight: '700',
    cursor: 'pointer',
  },

  tutoringCTA: {
    marginTop: '50px',
    background: '#172033',
    color: '#ffffff',
    borderRadius: '22px',
    padding: '30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '25px',
    flexWrap: 'wrap',
  },

  "tutoringCTA h2": {
    margin: '7px 0',
  },

  "tutoringCTA p": {
    color: '#cbd2dc',
    lineHeight: '1.6',
    margin: 0,
    maxWidth: '650px',
  },

  tutoringButton: {
    display: 'inline-block',
    textDecoration: 'none',
    background: '#ffffff',
    color: '#172033',
    padding: '13px 18px',
    borderRadius: '11px',
    fontWeight: '800',
  },

  footer: {
    borderTop: '1px solid #e5e7eb',
    background: '#ffffff',
    textAlign: 'center',
    padding: '30px 20px',
    color: '#697180',
  },

  "footer strong": {
    color: '#172033',
    fontSize: '20px',
  },

  "footer strong span": {
    color: '#1769aa',
  },

  "footer p": {
    margin: '8px 0 0',
    fontSize: '13px',
  },
}
