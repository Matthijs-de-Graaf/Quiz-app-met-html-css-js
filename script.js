const quizData = [
  {
    question: "In welke programmeertaal wordt een webbrowser uitgevoerd?",
    a: "Java",
    b: "C",
    c: "Python",
    d: "JavaScript",
    correctAnswer: "d",
  },
  {
    question: "Waar staat CSS voor?",
    a: "Central Style Sheets",
    b: "Cascading Style Sheets",
    c: "Cascading Simple Sheets",
    d: "Geen van boven",
    correctAnswer: "b",
  },
  {
    question: "Waar staat HTML voor?",
    a: "Hypertext Markup Language",
    b: "Hypertext Markdown Language",
    c: "Hyperloop Machine Language",
    d: "Geen van boven",
    correctAnswer: "a",
  },
  {
    question: "In welk jaar werd JavaScript gelanceerd?",
    a: "1996",
    b: "1995",
    c: "1994",
    d: "1993",
    correctAnswer: "b",
  },
  {
    question:
      "Wat is de juiste syntaxis voor het maken van een functie in JavaScript?",
    a: "functie = mijnFunctie()",
    b: "function myFunction()",
    c: "functie: mijnFunctie()",
    d: "mijnFunctie() = functie",
    correctAnswer: "b",
  },
  {
    question:
      "Welke CSS-eigenschap wordt gebruikt om de tekstkleur te definiëren?",
    a: "text-color",
    b: "color",
    c: "text-transform",
    d: "text-decoration",
    correctAnswer: "b",
  },
];

// Elementen selecteren
const quiz = document.getElementById("quiz");
const answerElements = document.querySelectorAll(".answer");
const questionElement = document.getElementById("question");
const a_text = document.getElementById("a_text");
const b_text = document.getElementById("b_text");
const c_text = document.getElementById("c_text");
const d_text = document.getElementById("d_text");
const submitButton = document.getElementById("submit");
const timerElement = document.getElementById("timer");

// Huidige vraag en score bijhouden
let currentQuiz = 0;
let score = 0;

// Timer variabelen
let timeLeft = 120;
let timerInterval;

// Functie om alle geselecteerde antwoorden te deselecteren
const deselectAnswers = () => {
  answerElements.forEach((answer) => (answer.checked = false));
};

// Functie om alle geselecteerde antwoorden op te halen
const getSelected = () => {
  let answers = [];
  answerElements.forEach((answerElement) => {
    if (answerElement.checked) answers.push(answerElement.id);
  });
  return answers;
};

// Functie om de vragen in een willekeurige volgorde te schudden
const randomQuestions = () => {
  for (let i = quizData.length - 1; i > 0; i--) {
    const random = Math.floor(Math.random() * (i + 1));
    [quizData[i], quizData[random]] = [quizData[random], quizData[i]];
  }
};

// Functie om de quiz te laden
const loadQuiz = () => {
  deselectAnswers();
  const currentQuizData = quizData[currentQuiz];
  questionElement.innerText = currentQuizData.question;
  a_text.innerText = currentQuizData.a;
  b_text.innerText = currentQuizData.b;
  c_text.innerText = currentQuizData.c;
  d_text.innerText = currentQuizData.d;

  // Bereken de voortgang en update de voortgangsbalk
  const progress = ((currentQuiz + 1) / quizData.length) * 100;
  const progressBarFill = document.getElementById("progress");
  progressBarFill.style.width = `${progress}%`;
  

  // Update de voortgangstekst
  const progressText = document.getElementById("progress-text");
  progressText.innerText = `${score}/${quizData.length} goed`;
};

// Functie om de timer te starten
const startTimer = () => {
  timerInterval = setInterval(() => {
    timeLeft--;
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerElement.innerText = `${minutes}:${seconds
      .toString()
      .padStart(2, "0")}`;

    // Controleer of de tijd op is en beëindig de quiz indien nodig
    if (timeLeft === 0) {
      clearInterval(timerInterval);
      endQuiz();
    }
  }, 1000);
};

// Functie om het einde van de quiz weer te geven
const endQuiz = () => {
  quiz.innerHTML = `
  <h2>Je hebt ${score} van de ${quizData.length} vragen goed</h2>
  <button id='fullReset'>Volledige reset</button>  
  `;
  const fullReset = document.getElementById("fullReset");

  // Event listener voor de volledige resetknop
  fullReset.addEventListener(
    "click",
    function (e) {
      location.reload();
    },
    false
  );
};

// Volledige resetknop
const fullReset = document.getElementById("fullReset");

// Event listener voor de volledige resetknop
fullReset.addEventListener(
  "click",
  function () {
    location.reload();
  },
  false
);

// Event listener voor de verzendknop
submitButton.addEventListener("click", () => {
  const answers = getSelected();
  if (answers.length > 0) {
    let isCorrect = true;
    answers.forEach((answer) => {
      if (answer !== quizData[currentQuiz].correctAnswer) {
        isCorrect = false;
      }
    });
    
    if (isCorrect) {
      score++;
    }

    // Schakel het beantwoorden van de vraag uit
    answerElements.forEach((answerElement) => {
      answerElement.disabled = true;
    });
    
    // Toon feedback
    const feedback = document.createElement("p");
    if (isCorrect) {
      feedback.innerText = "Correct antwoord!";
      feedback.classList.add("correct");
    } else {
      feedback.innerText = "Fout antwoord!";
      feedback.classList.add("wrong");
    }
    quiz.appendChild(feedback);
    
    // Ga naar de volgende vraag of beëindig de quiz
    currentQuiz++;
    if (currentQuiz < quizData.length) {
      setTimeout(() => {
        quiz.removeChild(feedback);
        loadQuiz();
        answerElements.forEach((answerElement) => {
          answerElement.disabled = false;
        });
      }, 1000);
    } else {
      clearInterval(timerInterval);
      setTimeout(() => {
        endQuiz();
      }, 1000);
    }
  }
});



randomQuestions();
loadQuiz();
startTimer();