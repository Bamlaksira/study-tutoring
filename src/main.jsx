import ExamPractice from './exams/ExamPractice.jsx'
import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Admin from './Admin.jsx'

class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: '30px', fontFamily: 'Arial', color: '#b91c1c' }}>
          <h1>StudyCare Error</h1>
          <p>{this.state.error.message}</p>
          <pre style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error.stack}
          </pre>
        </div>
      )
    }

    return this.props.children
  }
}

const path = window.location.pathname

const Page =
  path === '/admin'
    ? Admin
    : path === '/exams'
      ? ExamPractice
      : App
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <Page />
    </ErrorBoundary>
  </StrictMode>,
)
