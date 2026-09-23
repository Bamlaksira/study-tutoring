export const examProducts = [
  {
    id: "grade6-mathematics",
    grade: "Grade 6",
    subject: "Mathematics",
    title: "Grade 6 Mathematics Exam Practice",
    price: 50,
    description:
      "Practice Grade 6 Mathematics questions with answers and explanations.",
    active: true,
    questions: [
      {
        id: "g6math-1",
        order: 1,
        question: "What is 25 + 37?",
        options: ["52", "62", "72", "82"],
        correctAnswer: "62",
        explanation:
          "25 + 37 = 62. Add the ones first: 5 + 7 = 12, then add the tens.",
      },
      {
        id: "g6math-2",
        order: 2,
        question: "What is 8 × 7?",
        options: ["54", "56", "64", "72"],
        correctAnswer: "56",
        explanation:
          "8 × 7 = 56.",
      },
      {
        id: "g6math-3",
        order: 3,
        question: "What is 100 − 45?",
        options: ["45", "50", "55", "65"],
        correctAnswer: "55",
        explanation:
          "100 − 45 = 55.",
      },

    ],
  },

  {
  id: "grade6-english",
  grade: "Grade 6",
  subject: "English",
  title: "Grade 6 English Exam Practice",
  price: 65,
  description:
    "Practice Grade 6 English questions with answers and explanations.",
  active: true,
  passage: `Effective Study Skills

1 Effective study skills are essential for students to succeed in their academic pursuits. Developing good study habits starts with setting clear goals and creating a structured schedule. When students know what they need to learn and when they need to complete their tasks, they can manage their time more efficiently.

2 It is also important to find a quiet, comfortable place to study where distractions are minimized. This helps students stay focused and retain information better. Additionally, active learning techniques such as taking notes, summarizing key points, and teaching the material to someone else can greatly enhance understanding and memory.

3 Another key aspect of study skills is the use of different learning methods to suit individual needs. Some students may benefit from visual aids like diagrams or charts, while others may prefer listening to lectures or reading textbooks. It is important to experiment with various techniques to find what works best for each person. Regular review and practice are also crucial. Revisiting material periodically helps reinforce learning and prevents information from being forgotten. Using flashcards, practice tests, and self-quizzing can make review more effective and engaging.

4 Finally, maintaining a healthy lifestyle is an important part of developing strong study skills. Adequate sleep, proper nutrition, and regular exercise contribute to better concentration and overall well-being. Students who take care of their physical and mental health are more likely to stay motivated and perform well in their studies. By combining effective study strategies with a balanced lifestyle, students can achieve their academic goals and build a foundation for lifelong learning.`,
  questions: [
      {
        id: "g6eng-1",
        order: 1,
        question: "According to the passage, which one of the following is Not Correct?",
        options: ["Developing good study habits starts with setting clear goals.","A healthy life style is part of effective study skills.","Effective study skills include finding a quiet and comfortable place.","Distractions are parts of effective study skills."],
        correctAnswer: "Distractions are parts of effective study skills.",
        explanation: "The passage says that distractions should be minimized because a quiet place helps students stay focused. Therefore, distractions are not a part of effective study skills.",
      },
      {
        id: "g6eng-2",
        order: 2,
        question: "In the passage, which one is not mentioned as an active learning method?",
        options: ["Taking notes","Simply listening to the teacher","Teaching materials to other people","Summarizing key points"],
        correctAnswer: "Simply listening to the teacher",
        explanation: "The passage specifically mentions taking notes, summarizing key points, and teaching the material to someone else. Simply listening to the teacher is not mentioned as an active learning technique.",
      },
      {
        id: "g6eng-3",
        order: 3,
        question: "What is the main idea of paragraph 2?",
        options: ["The use of different suitable learning methods","The importance of revisiting learning materials","The importance of setting goals and studying schedule","The importance of finding quiet and appropriate place to study"],
        correctAnswer: "The importance of finding quiet and appropriate place to study",
        explanation: "Paragraph 2 explains the importance of having a quiet, comfortable place with fewer distractions. It also explains how this improves concentration and memory.",
      },
    ],
  },

  {
    id: "grade6-science",
    grade: "Grade 6",
    subject: "General Science",
    title: "Grade 6 General Science Exam Practice",
    price: 50,
    description:
      "Practice Grade 6 General Science questions with answers and explanations.",
    active: true,
    questions: [],
  },

  {
    id: "grade8-mathematics",
    grade: "Grade 8",
    subject: "Mathematics",
    title: "Grade 8 Mathematics Exam Practice",
    price: 60,
    description:
      "Practice Grade 8 Mathematics questions with answers and explanations.",
    active: true,
    questions: [],
  },

  {
    id: "grade8-english",
    grade: "Grade 8",
    subject: "English",
    title: "Grade 8 English Exam Practice",
    price: 60,
    description:
      "Practice Grade 8 English questions with answers and explanations.",
    active: true,
    questions: [],
  },

  {
    id: "grade8-science",
    grade: "Grade 8",
    subject: "General Science",
    title: "Grade 8 General Science Exam Practice",
    price: 60,
    description:
      "Practice Grade 8 General Science questions with answers and explanations.",
    active: true,
    questions: [],
  },

  {
    id: "grade12-mathematics",
    grade: "Grade 12",
    subject: "Mathematics",
    title: "Grade 12 Mathematics Exam Practice",
    price: 75,
    description:
      "Practice Grade 12 Mathematics questions with answers and explanations.",
    active: true,
    questions: [],
  },

  {
    id: "grade12-english",
    grade: "Grade 12",
    subject: "English",
    title: "Grade 12 English Exam Practice",
    price: 75,
    description:
      "Practice Grade 12 English questions with answers and explanations.",
    active: true,
    questions: [],
  },

  {
    id: "grade12-physics",
    grade: "Grade 12",
    subject: "Physics",
    title: "Grade 12 Physics Exam Practice",
    price: 75,
    description:
      "Practice Grade 12 Physics questions with answers and explanations.",
    active: true,
    questions: [],
  },

  {
    id: "grade12-chemistry",
    grade: "Grade 12",
    subject: "Chemistry",
    title: "Grade 12 Chemistry Exam Practice",
    price: 75,
    description:
      "Practice Grade 12 Chemistry questions with answers and explanations.",
    active: true,
    questions: [],
  },

  {
    id: "grade12-biology",
    grade: "Grade 12",
    subject: "Biology",
    title: "Grade 12 Biology Exam Practice",
    price: 75,
    description:
      "Practice Grade 12 Biology questions with answers and explanations.",
    active: true,
    questions: [],
  },
];

export const EXAM_GRADES = [
  "Grade 6",
  "Grade 8",
  "Grade 12",
];

export function getProductsByGrade(grade) {
  return examProducts.filter(
    (product) => product.grade === grade && product.active
  );
}

export function getProductById(id) {
  return examProducts.find(
    (product) => product.id === id && product.active
  );
}
