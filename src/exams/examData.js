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
      {
        id: "g6math-4",
        order: 4,
        question: "What is 6 × 9?",
        options: ["45", "54", "63", "72"],
        correctAnswer: "54",
        explanation:
          "6 × 9 = 54.",
      },
    ],
  },

  {
    id: "grade6-english",
    grade: "Grade 6",
    subject: "English",
    title: "Grade 6 English Exam Practice",
    price: 50,
    description:
      "Practice Grade 6 English questions with answers and explanations.",
    active: true,
    questions: [],
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
