import { useState } from 'react'
import './App.css'
import Onboarding from './Onboarding'

const API = 'https://studycare-backend.onrender.com'
const GUIDE = '/study-guide.pdf'
const WHATSAPP = '251908075506'

const grades = ['KG1','KG2','KG3','Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6','Grade 7','Grade 8','Grade 9','Grade 10','Grade 11','Grade 12']

const text = {
  en: {
    navHome:'Home', navServices:'Services', navHow:'How It Works', navResources:'Resources', navContact:'Contact',
    heroTitle:'Help Your Child Study Smarter — Not Just Harder',
    heroText:'Personalized academic support for KG–12 students, designed around your child’s needs, challenges, goals and learning habits.',
    guide:'Get Your FREE Study Guide', talk:'Talk to StudyCare',
    trust:'Homework support • All subjects • Languages • Exam preparation • Personalized study plans',
    problemTitle:'Could Your Child Benefit From More Learning Support?',
    problemText:'Every child learns differently. These everyday signs may mean your child could benefit from additional structure or support.',
    assessmentTitle:'Parent Learning Check',
    assessmentText:'Answer a few quick questions to reflect on your child’s current study experience.',
    often:'Often', sometimes:'Sometimes', rarely:'Rarely', result:'See My Result',
    servicesTitle:'Academic Support Built Around Your Child',
    planTitle:'A Personalized Approach — Not a One-Size-Fits-All Plan',
    planText:'Before recommending support, StudyCare looks at academic performance, strengths, challenges, interests, goals, habits, learning preferences, schedule and the kind of support that works best.',
    tipsTitle:'What Parents Can Do Today',
    howTitle:'How StudyCare Works',
    resourcesTitle:'Free Learning Resources',
    faqTitle:'Frequently Asked Questions',
    finalTitle:'Ready to Help Your Child Study With More Structure?',
    finalText:'Start with a free study guide or talk with StudyCare about your child’s needs.',
    submit:'Get My Free Guide', close:'Close',
    parentName:'Parent Name', phone:'Phone / WhatsApp', grade:'Child Grade',
    city:'City / Town', area:'Area / Sub-city (optional)', country:'Country',
    challenge:'Main Learning Challenge', language:'Preferred Language', source:'How did you hear about StudyCare?',
    select:'Select', english:'English', amharic:'Amharic', optional:'Optional',
    success:'Your FREE Study Guide is Ready!', successText:'Download it now, then contact StudyCare if you would like help creating a plan specifically for your child.',
    download:'Open Study Guide', start:'Talk About My Child', privacy:'We use your information only to respond to your request.',
    services:['Homework Support','All Subjects','Language Skills','Exam Preparation','Personalized Study Plans'],
    signs:['Avoids studying or homework','Struggles to understand lessons','Forgets what was recently learned','Has difficulty maintaining a study routine','Loses concentration easily','Seems to be falling behind','Lacks confidence when studying','Feels stressed about exams','Needs help preparing for important exams'],
    questions:['Does your child often struggle to start homework?','Does your child need repeated explanations to understand lessons?','Does your child struggle to maintain a regular study routine?','Does your child forget material soon after studying?','Does your child lack confidence when studying?','Does your child need more structured exam preparation?'],
    tips:['Create a consistent study time','Break large tasks into smaller goals','Ask what makes studying difficult — not only about grades'],
    steps:['Tell us about your child','We understand their needs','We identify an appropriate support approach','Your child follows structured support','Progress is reviewed','Parents stay informed'],
    faqs:[
      ['What grades does StudyCare support?','StudyCare supports students from KG through Grade 12.'],
      ['What subjects can my child get help with?','Support can cover all subjects, depending on the child’s needs.'],
      ['Is support personalized?','Yes. We consider the child’s academic situation, strengths, challenges, goals, habits and preferences.'],
      ['Can my child study online?','Online academic support is available. Contact StudyCare to discuss what is suitable.'],
      ['What is the free study guide?','It is a practical resource for study routines, homework, study struggles and exam preparation.'],
      ['What happens after I contact StudyCare?','You can discuss your child’s situation and determine what type of support may be appropriate.'],
      ['Does StudyCare guarantee grades?','No. We do not promise unrealistic academic results.'],
      ['How do I get started?','Start with the free guide or contact StudyCare directly.']
    ]
  },
  am: {
    navHome:'መነሻ', navServices:'አገልግሎቶች', navHow:'እንዴት እንሰራለን', navResources:'መረጃዎች', navContact:'ያግኙን',
    heroTitle:'ልጅዎ የበለጠ ሳይሆን በተሻለ እንዲማር ያግዙት',
    heroText:'ለKG–12 ተማሪዎች በፍላጎታቸው፣ ችግሮቻቸው እና ግቦቻቸው ላይ የተመሰረተ የትምህርት ድጋፍ።',
    guide:'ነፃ የጥናት መመሪያውን ያግኙ', talk:'StudyCareን ያነጋግሩ',
    trust:'የቤት ስራ ድጋፍ • ሁሉም ትምህርቶች • ቋንቋ • የፈተና ዝግጅት • ግላዊ የጥናት እቅድ',
    problemTitle:'ልጅዎ ተጨማሪ የትምህርት ድጋፍ ያስፈልገዋል?',
    problemText:'እያንዳንዱ ልጅ የሚማረው በተለየ መንገድ ነው።',
    assessmentTitle:'የወላጅ የመማር ሁኔታ ማረጋገጫ',
    assessmentText:'ስለ ልጅዎ የጥናት ሁኔታ ጥቂት ፈጣን ጥያቄዎችን ይመልሱ።',
    often:'ብዙ ጊዜ', sometimes:'አንዳንድ ጊዜ', rarely:'እምብዛም', result:'ውጤቴን አሳይ',
    servicesTitle:'በልጅዎ ፍላጎት ላይ የተመሰረተ ድጋፍ',
    planTitle:'ለእያንዳንዱ ልጅ የተለየ አቀራረብ',
    planText:'የትምህርት ደረጃ፣ ጥንካሬ፣ ችግር፣ ግብ፣ የጥናት ልምድ እና የሚመች የመማሪያ መንገድ እንመለከታለን።',
    tipsTitle:'ወላጆች ዛሬ ሊያደርጉት የሚችሉት',
    howTitle:'StudyCare እንዴት ይሰራል?',
    resourcesTitle:'ነፃ የትምህርት መረጃ',
    faqTitle:'ተደጋጋሚ ጥያቄዎች',
    finalTitle:'ልጅዎ በተደራጀ መንገድ እንዲማር ዝግጁ ነዎት?',
    finalText:'ነፃውን የጥናት መመሪያ ያግኙ ወይም StudyCareን ያነጋግሩ።',
    submit:'ነፃ መመሪያዬን አግኝ', close:'ዝጋ',
    parentName:'የወላጅ ስም', phone:'ስልክ / WhatsApp', grade:'የልጅ ክፍል',
    city:'ከተማ / አካባቢ', area:'አካባቢ (አማራጭ)', country:'ሀገር',
    challenge:'ዋና የትምህርት ችግር', language:'የሚመርጡት ቋንቋ', source:'StudyCareን እንዴት አገኙ?',
    select:'ይምረጡ', english:'እንግሊዝኛ', amharic:'አማርኛ', optional:'አማራጭ',
    success:'ነፃው የጥናት መመሪያ ዝግጁ ነው!', successText:'አሁን ያውርዱት። ለልጅዎ የተለየ የጥናት እቅድ ከፈለጉ StudyCareን ያነጋግሩ።',
    download:'የጥናት መመሪያውን ይክፈቱ', start:'ስለ ልጄ እንነጋገር', privacy:'መረጃዎን የምንጠቀመው ለጥያቄዎ ምላሽ ለመስጠት ብቻ ነው።',
    services:['የቤት ስራ ድጋፍ','ሁሉም ትምህርቶች','የቋንቋ ክህሎት','የፈተና ዝግጅት','ግላዊ የጥናት እቅድ'],
    signs:['ትምህርትን ወይም የቤት ስራን ይርቃል','ትምህርቱን ለመረዳት ይቸገራል','የተማረውን በፍጥነት ይረሳል','የጥናት ልማድ ለመጠበቅ ይቸገራል','ትኩረት ለማድረግ ይቸገራል','ከትምህርቱ ወደኋላ የሚቀር ይመስላል','በጥናት ጊዜ በራስ መተማመን ያነሰዋል','ስለ ፈተና ጭንቀት ይሰማዋል','ለአስፈላጊ ፈተና ዝግጅት ድጋፍ ይፈልጋል'],
    questions:['ልጅዎ የቤት ስራ ለመጀመር ብዙ ጊዜ ይቸገራል?','ትምህርትን ለመረዳት ተደጋጋሚ ማብራሪያ ይፈልጋል?','የጥናት ልማድን በመጠበቅ ይቸገራል?','ከጥናት በኋላ ትምህርቱን በፍጥነት ይረሳል?','በጥናት ጊዜ በራስ መተማመን ያነሰዋል?','የተደራጀ የፈተና ዝግጅት ድጋፍ ይፈልጋል?'],
    tips:['የተወሰነ የጥናት ሰዓት ያዘጋጁ','ትልልቅ ስራዎችን ወደ ትንንሽ ግቦች ይከፋፍሉ','ስለ ውጤቱ ብቻ ሳይሆን ምን እንደሚያስቸግረው ይጠይቁ'],
    steps:['ስለ ልጅዎ ይንገሩን','ፍላጎቱን እንረዳለን','ተገቢውን የድጋፍ አቀራረብ እንለያለን','ተደራጀ ድጋፍ ይከተላል','እድገት ይገመገማል','ወላጆች መረጃ ያገኛሉ'],
    faqs:[['StudyCare ለየትኞቹ ክፍሎች ነው?','StudyCare ከKG እስከ Grade 12 ድረስ ይደግፋል።'],['ልጄ የትኞቹን ትምህርቶች ሊማር ይችላል?','ድጋፍ በልጁ ፍላጎት መሰረት ሁሉንም ትምህርቶች ሊያካትት ይችላል።'],['ድጋፉ ግላዊ ነው?','አዎ። የልጁን ሁኔታ፣ ጥንካሬ፣ ችግር፣ ግብ እና የጥናት ልምድ እንመለከታለን።'],['በኦንላይን መማር ይችላል?','አዎ። ለልጅዎ ተገቢውን አማራጭ ለመወያየት ያግኙን።'],['ነፃው መመሪያ ምንድነው?','የጥናት ልማድ፣ የቤት ስራ እና የፈተና ዝግጅትን የሚመለከት ተግባራዊ መመሪያ ነው።'],['ካነጋገርኩ StudyCare ምን ይከሰታል?','የልጅዎን ሁኔታ በመወያየት ተገቢውን የድጋፍ አይነት መወሰን ይችላሉ።'],['ውጤት ዋስትና አለ?','አይ። የተጋነኑ የውጤት ተስፋዎችን አንሰጥም።'],['እንዴት እጀምራለሁ?','ነፃውን መመሪያ ያግኙ ወይም StudyCareን በቀጥታ ያነጋግሩ።']]
  }
}

function trackEvent(name, data = {}) {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('trackCustom', name, data)
  }
}

function App() {
  const [language,setLanguage] = useState(localStorage.getItem('studycareLanguage') || 'en')
  const [menu,setMenu] = useState(false)
  const [modal,setModal] = useState(false)
  const [success,setSuccess] = useState(false)
  const [openFaq,setOpenFaq] = useState(null)
  const [answers,setAnswers] = useState({})
  const [assessmentDone,setAssessmentDone] = useState(false)
  const [form,setForm] = useState({parentName:'',phone:'',grade:'',city:'',area:'',country:'Ethiopia',challenge:'',preferredLanguage:'en',marketingSource:''})
  const [loading,setLoading] = useState(false)

  const getTracking = () => {
    const params = new URLSearchParams(window.location.search)
    return {
      marketingSource:
        params.get('utm_source') ||
        form.marketingSource ||
        (document.referrer.includes('facebook') ? 'Facebook' :
         document.referrer.includes('instagram') ? 'Instagram' :
         document.referrer.includes('tiktok') ? 'TikTok' :
         document.referrer.includes('google') ? 'Google' :
         document.referrer ? 'Referral' : 'Direct'),
      utmSource: params.get('utm_source') || '',
      utmMedium: params.get('utm_medium') || '',
      utmCampaign: params.get('utm_campaign') || '',
      utmContent: params.get('utm_content') || '',
      utmTerm: params.get('utm_term') || ''
    }
  }
  const t=text[language]

  const changeLanguage=(v)=>{setLanguage(v);localStorage.setItem('studycareLanguage',v)}
  const whatsapp=(message)=>window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`,'_blank')
  const update=(e)=>setForm({...form,[e.target.name]:e.target.value})

  async function submit(e){
    trackEvent('StudyGuideSubmitted', { grade: form.grade, city: form.city })

    e.preventDefault()
    if(!form.parentName || !form.phone || !form.grade || !form.city) return
    setLoading(true)
    try{
      const r=await fetch(`${API}/api/leads`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
        ...form,
        ...getTracking(),
        location:form.city,
        heardAbout:form.marketingSource,
        landingPage:window.location.href,
        referrer:document.referrer
      })})
      if(!r.ok) throw new Error()
      setSuccess(true)
    }catch{ alert(language==='am'?'እባክዎ እንደገና ይሞክሩ።':'Please try again.') }
    finally{setLoading(false)}
  }

  if(window.location.pathname==='/onboarding') return <Onboarding/>

  const score=Object.values(answers).reduce((a,v)=>a+v,0)

  return <div className="site">
    <nav className="nav">
      <a className="logo" href="#home">Study<span>Care</span></a>
      <button className="menu-btn" onClick={()=>setMenu(!menu)}>☰</button>
      <div className={`nav-links ${menu?'show':''}`}>
       <a href="#home">{t.navHome}</a><a href="#services">{t.navServices}</a><a href="#how">{t.navHow}</a><a href="#resources">{t.navResources}</a><a href="/exams" onClick={()=>setMenu(false)}>Exam Practice</a>
        <select value={language} onChange={e=>changeLanguage(e.target.value)}><option value="en">EN</option><option value="am">አማ</option></select>
      </div>
    </nav>

    <main>
      <section id="home" className="hero">
        <div className="hero-content">
          <div className="badge">KG–12 • Personalized Academic Support</div>
          <h1>{t.heroTitle}</h1>
          <p>{t.heroText}</p>
          <div className="chips">{t.services.map((x,i)=><span key={i}>{x}</span>)}</div>
          <div className="actions">
            <button className="btn primary" onClick={()=>{trackEvent('StudyGuideFormStarted');setModal(true)}}>{t.guide}</button>
            <button className="btn secondary" onClick={()=>{trackEvent('WhatsAppClicked');whatsapp(t.start)}}>{t.talk}</button>
          </div>
          <small>{t.trust}</small>
        </div>
        <div className="hero-card">
          <div className="hero-card-icon">📚</div>
          <h3>StudyCare</h3>
          <p>{t.planText}</p>
          <button onClick={()=>whatsapp(t.start)}>{t.talk} →</button>
        </div>
      </section>

      <section className="section">
        <div className="heading"><span>01</span><h2>{t.problemTitle}</h2><p>{t.problemText}</p></div>
        <div className="sign-grid">{t.signs.map((x,i)=><div className="sign" key={i}><b>✓</b>{x}</div>)}</div>
      </section>

      <section className="section tinted">
        <div className="heading"><span>02</span><h2>{t.assessmentTitle}</h2><p>{t.assessmentText}</p></div>
        <div className="assessment">
          {t.questions.map((q,i)=><div className="question" key={i}><b>{i+1}. {q}</b><div className="answers">{[[2,t.often],[1,t.sometimes],[0,t.rarely]].map(([v,label])=><button className={answers[i]===v?'selected':''} onClick={()=>setAnswers({...answers,[i]:v})} key={label}>{label}</button>)}</div></div>)}
          <button className="btn primary" disabled={Object.keys(answers).length<6} onClick={()=>{trackEvent('ParentAssessmentCompleted');setAssessmentDone(true)}}>{t.result}</button>
          {assessmentDone&&<div className="result"><strong>{score>=8?'Your child may benefit from additional structure and learning support.':'Your answers suggest that your child may be doing well in some areas, while still benefiting from consistent study habits.'}</strong><button onClick={()=>whatsapp('I completed the StudyCare Parent Learning Check and would like to discuss my child.')}>{t.talk} →</button></div>}
        </div>
      </section>

      <section id="services" className="section">
        <div className="heading"><span>03</span><h2>{t.servicesTitle}</h2></div>
        <div className="service-grid">{t.services.map((x,i)=><div className="service" key={x}><div className="number">0{i+1}</div><h3>{x}</h3><p>Structured support designed around the student's current needs and learning goals.</p><button onClick={()=>whatsapp(`I am interested in ${x}. I would like to know more.`)}>Ask About This →</button></div>)}</div>
      </section>

      <section className="plan">
        <div><span>04</span><h2>{t.planTitle}</h2><p>{t.planText}</p><button className="btn primary" onClick={()=>whatsapp(t.start)}>{t.start}</button></div>
        <div className="plan-list">{['Academic performance','Strengths & challenges','Goals & interests','Study habits','Learning preferences','Schedule & environment','Parent expectations','Progress over time'].map(x=><div key={x}>✓ {x}</div>)}</div>
      </section>

      <section className="section">
        <div className="heading"><span>05</span><h2>{t.tipsTitle}</h2></div>
        <div className="tip-grid">{t.tips.map((x,i)=><div className="tip" key={i}><strong>{i+1}</strong><p>{x}</p></div>)}</div>
      </section>

      <section id="how" className="section tinted">
        <div className="heading"><span>06</span><h2>{t.howTitle}</h2></div>
        <div className="steps">{t.steps.map((x,i)=><div key={i}><strong>{i+1}</strong><p>{x}</p></div>)}</div>
      </section>

      <section id="resources" className="section">
        <div className="heading"><span>07</span><h2>{t.resourcesTitle}</h2></div>
        <div className="resource"><div>📖</div><div><h3>FREE Study Guide</h3><p>{t.planText}</p><button onClick={()=>{trackEvent('PaidServiceClicked');setModal(true)}}>{t.guide} →</button></div></div>
      </section>

      <section className="section faq">
        <div className="heading"><span>08</span><h2>{t.faqTitle}</h2></div>
        {t.faqs.map((f,i)=><div className="faq-item" key={i}><button onClick={()=>setOpenFaq(openFaq===i?null:i)}>{f[0]} <span>{openFaq===i?'−':'+'}</span></button>{openFaq===i&&<p>{f[1]}</p>}</div>)}
      </section>

      <section className="final">
        <h2>{t.finalTitle}</h2><p>{t.finalText}</p>
        <div className="actions"><button className="btn primary" onClick={()=>setModal(true)}>{t.guide}</button><button className="btn secondary" onClick={()=>whatsapp(t.start)}>{t.talk}</button></div>
      </section>
    </main>

    <footer><div><a className="logo" href="#home">Study<span>Care</span></a><p>{t.privacy}</p></div><button onClick={()=>whatsapp(t.start)}>WhatsApp</button></footer>

    {modal&&<div className="modal-bg" onClick={()=>setModal(false)}><div className="modal" onClick={e=>e.stopPropagation()}>
      {!success?<><button className="close" onClick={()=>setModal(false)}>×</button><h2>{t.guide}</h2><p>Tell us a little about you and your child.</p>
      <form onSubmit={submit}>
        <input name="parentName" placeholder={t.parentName} value={form.parentName} onChange={update} required/>
        <input name="phone" placeholder={t.phone} value={form.phone} onChange={update} required/>
        <select name="grade" value={form.grade} onChange={update} required><option value="">{t.grade}</option>{grades.map(g=><option key={g}>{g}</option>)}</select>
        <input name="city" placeholder={t.city} value={form.city} onChange={update} required/>
        <input name="area" placeholder={t.area} value={form.area} onChange={update}/>
        <input name="country" placeholder={t.country} value={form.country} onChange={update}/>
        <select name="preferredLanguage" value={form.preferredLanguage} onChange={update}><option value="en">{t.english}</option><option value="am">{t.amharic}</option></select>
        <textarea name="challenge" placeholder={t.challenge} value={form.challenge} onChange={update}/>
        <select name="marketingSource" value={form.marketingSource} onChange={update}><option value="">{t.source}</option>{['Facebook','Instagram','TikTok','Google','Friend/Family','WhatsApp','Other'].map(x=><option key={x}>{x}</option>)}</select>
        <button className="btn primary" disabled={loading}>{loading?'Sending...':t.submit}</button>
      </form></>:<div className="success"><div>✓</div><h2>{t.success}</h2><p>{t.successText}</p><a className="btn primary" href={GUIDE} target="_blank" rel="noreferrer">{t.download}</a><button className="btn secondary" onClick={()=>whatsapp(t.start)}>{t.start}</button></div>}
    </div></div>}
  </div>
}

export default App
