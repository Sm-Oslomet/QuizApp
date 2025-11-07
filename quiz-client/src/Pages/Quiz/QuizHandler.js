import { quizService } from "../../api/quizService";

export const QuizHandler = {
  async getAll() {
    const data = await quizService.getAll();
    return Array.isArray(data) ? data : [];
  },

  async getById(id) {
    const all = await quizService.getAll();
    return all.find(q => q.id === id) || null;
  },

  async delete(id) {
    await quizService.remove(id);
  },

  async add(quiz) {
    await quizService.create(quiz);
  },

  async loadExamples() {
    function makeId() {
      if (typeof crypto !== "undefined" && crypto.randomUUID) {
        return crypto.randomUUID();
      }
      return Math.random().toString(36).substring(2, 9);
    }

    const examples = [
      {
        id: makeId(),
        title: "General Knowledge Quiz",
        description: "A quick mix of fun trivia questions!",
        questions: [
          {
            text: "What is the capital of France?",
            options: ["Berlin", "Paris", "Rome", "Madrid"],
            correctAnswer: "Paris",
          },
          {
            text: "How many continents are there?",
            options: ["5", "6", "7", "8"],
            correctAnswer: "7",
          },
          {
            text: "Which ocean is the largest?",
            options: [
              "Atlantic Ocean",
              "Indian Ocean",
              "Arctic Ocean",
              "Pacific Ocean",
            ],
            correctAnswer: "Pacific Ocean",
          },
          {
            text: "Who wrote 'Hamlet'?",
            options: [
              "Charles Dickens",
              "William Shakespeare",
              "Jane Austen",
              "Mark Twain",
            ],
            correctAnswer: "William Shakespeare",
          },
          {
            text: "What is the tallest mountain in the world?",
            options: ["K2", "Mount Kilimanjaro", "Mount Everest", "Denali"],
            correctAnswer: "Mount Everest",
          },
        ],
      },
      {
        id: makeId(),
        title: "Programming Quiz",
        description: "Test your coding knowledge.",
        questions: [
          {
            text: "Which language runs in a web browser?",
            options: ["Python", "Java", "C++", "JavaScript"],
            correctAnswer: "JavaScript",
          },
          {
            text: "What does CSS stand for?",
            options: [
              "Computer Style Sheets",
              "Cascading Style Sheets",
              "Creative Style System",
              "Colorful Style Sheets",
            ],
            correctAnswer: "Cascading Style Sheets",
          },
          {
            text: "What does HTML stand for?",
            options: [
              "HyperText Markup Language",
              "Hyper Transfer Markup Language",
              "HighText Machine Language",
              "HyperTool Markup Language",
            ],
            correctAnswer: "HyperText Markup Language",
          },
          {
            text: "Which company developed the Java programming language?",
            options: [
              "Microsoft",
              "Sun Microsystems",
              "Google",
              "Apple",
            ],
            correctAnswer: "Sun Microsystems",
          },
          {
            text: "What symbol is used for comments in JavaScript?",
            options: ["//", "/*", "#", "<!-- -->"],
            correctAnswer: "//",
          },
        ],
      },
      {
        id: makeId(),
        title: "Science Quiz",
        description: "Learn about science and space.",
        questions: [
          {
            text: "What planet is known as the Red Planet?",
            options: ["Venus", "Mars", "Jupiter", "Saturn"],
            correctAnswer: "Mars",
          },
          {
            text: "What gas do plants absorb from the atmosphere?",
            options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Helium"],
            correctAnswer: "Carbon dioxide",
          },
          {
            text: "What is H2O commonly known as?",
            options: ["Hydrogen", "Salt", "Water", "Oxygen"],
            correctAnswer: "Water",
          },
          {
            text: "Who developed the theory of relativity?",
            options: [
              "Isaac Newton",
              "Albert Einstein",
              "Nikola Tesla",
              "Galileo Galilei",
            ],
            correctAnswer: "Albert Einstein",
          },
          {
            text: "What part of the cell contains genetic material?",
            options: [
              "Cytoplasm",
              "Cell membrane",
              "Nucleus",
              "Mitochondria",
            ],
            correctAnswer: "Nucleus",
          },
        ],
      },
    ];

    for (const quiz of examples) {
      await quizService.create(quiz);
    }

    return examples;
  },
};
