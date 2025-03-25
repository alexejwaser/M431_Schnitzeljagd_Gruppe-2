// Fragen-Datenbank mit Bildern, Fragen, Antworttypen und Lösungen
const questions = [
  {
    image: "https://via.placeholder.com/600x300?text=Posten+1",
    question: "Wie viele Beine hat ein Hund?",
    type: "text",
    answer: "4",
  },
  {
    image: "https://via.placeholder.com/600x300?text=Posten+2",
    question: "Was ist die Hauptstadt von Deutschland?",
    type: "text",
    answer: "berlin",
  },
  {
    image: "https://via.placeholder.com/600x300?text=Posten+3",
    question: "Welche Farbe hat der Himmel?",
    type: "choice",
    options: ["Grün", "Blau", "Rot"],
    answer: "Blau",
  },
  {
    image: "https://via.placeholder.com/600x300?text=Posten+4",
    question: "Wie viele Monate hat ein Jahr?",
    type: "text",
    answer: "12",
  },
  {
    image: "https://via.placeholder.com/600x300?text=Posten+5",
    question: "Welche Frucht ist gelb und krumm?",
    type: "choice",
    options: ["Apfel", "Banane", "Traube"],
    answer: "Banane",
  },
  {
    image: "https://via.placeholder.com/600x300?text=Posten+6",
    question: "Wie nennt man ein Junges vom Hund?",
    type: "text",
    answer: "welpe",
  },
  {
    image: "https://via.placeholder.com/600x300?text=Posten+7",
    question: "Wie heißt das größte Land der Welt?",
    type: "choice",
    options: ["Russland", "Kanada", "China"],
    answer: "Russland",
  },
  {
    image: "https://via.placeholder.com/600x300?text=Posten+8",
    question: "Wie viele Kontinente gibt es?",
    type: "text",
    answer: "7",
  },
];

let currentQuestion = 0;
let startTime = 0;
let timerInterval;

// Startet das Spiel
function startGame() {
  document.getElementById("startScreen").classList.add("hidden");
  document.getElementById("gameScreen").classList.remove("hidden");
  startTime = Date.now();
  timerInterval = setInterval(updateTimer, 1000);
  showQuestion();
}

// Aktualisiert den Timer jede Sekunde
function updateTimer() {
  const seconds = Math.floor((Date.now() - startTime) / 1000);
  document.getElementById("timer").textContent = `Zeit: ${seconds}s`;
}

// Zeigt die aktuelle Frage an
function showQuestion() {
  const container = document.getElementById("questionContainer");
  container.innerHTML = "";

  const q = questions[currentQuestion];

  const img = document.createElement("img");
  img.src = q.image;
  container.appendChild(img);

  const questionText = document.createElement("p");
  questionText.textContent = q.question;
  container.appendChild(questionText);

  if (q.type === "text") {
    const input = document.createElement("input");
    input.type = "text";
    input.id = "userAnswer";
    container.appendChild(input);
  } else if (q.type === "choice") {
    q.options.forEach((option) => {
      const btn = document.createElement("button");
      btn.textContent = option;
      btn.onclick = () => checkAnswer(option);
      container.appendChild(btn);
    });
    return;
  }

  const submit = document.createElement("button");
  submit.textContent = "Antwort prüfen";
  submit.onclick = () => {
    const input = document
      .getElementById("userAnswer")
      .value.trim()
      .toLowerCase();
    checkAnswer(input);
  };
  container.appendChild(submit);
}

// Prüft die Antwort und geht weiter oder beendet das Spiel
function checkAnswer(givenAnswer) {
  const correct = questions[currentQuestion].answer.toLowerCase();
  if (givenAnswer.toLowerCase() === correct) {
    currentQuestion++;
    if (currentQuestion < questions.length) {
      showQuestion();
    } else {
      endGame();
    }
  } else {
    alert("Falsche Antwort. Versuch es nochmal!");
  }
}

// Beendet das Spiel und zeigt die Zeit an
function endGame() {
  clearInterval(timerInterval);
  document.getElementById("gameScreen").classList.add("hidden");
  document.getElementById("endScreen").classList.remove("hidden");
  const totalTime = Math.floor((Date.now() - startTime) / 1000);
  document.getElementById("finalTime").textContent = `${totalTime} Sekunden`;
}
