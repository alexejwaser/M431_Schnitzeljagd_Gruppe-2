// Liste aller Fragen der Schnitzeljagd
const questions = [
  {
    image: "img/optimiert/1.webp",
    question: "Mensa, welchen Wassermodus gibt es nicht?",
    type: "choice",
    options: ["eiskalt", "kochendes Wasser", "Sprudelwasser"],
    answer: "Sprudelwasser",
  },
  {
    image: "img/optimiert/2.webp",
    question: "Velokeller, Wie viele Veloschilder hat es insgesamt?",
    type: "text",
    answer: "4",
  },
  {
    image: "img/optimiert/3.webp",
    question:
      "Mensa, Welcher Monat steht oberhalb der Tomate bei der Küche (Abkürzung)?",
    type: "text",
    answer: "Jul",
  },
  {
    image: "img/optimiert/4.webp",
    question: "Medienraum, Welche Marke hat das Mikrofon",
    type: "choice",
    options: ["Rode", "Shure", "HyperX"],
    answer: "Shure",
  },
  {
    image: "img/optimiert/5.webp", // This image is missing
    question: "IT Support Raum, Wohin führt die Tür links vom Support Raum?",
    type: "choice",
    options: ["Herren WC", "Damen WC", "Schuladministration"],
    answer: "Herren WC",
  },
  {
    image: "img/optimiert/6.webp", // This image is missing
    question: "Aldi (Insert placeholder question)", // Placeholder question
    type: "text",
    answer: "Insert placeholder solution", // Placeholder solution
  },
  {
    image: "img/optimiert/7.webp",
    question: "Berufsbildnerplakate, Wie viele Berufsplakate hat es im OG1?",
    type: "text",
    answer: "5",
  },
  {
    image: "img/optimiert/8.webp",
    question: "Drucker, Welche Marke hat der Drucker im OG1?",
    type: "text",
    answer: "Ricoh",
  },
];

// Globale Variablen für Spiellogik
let currentQuestion = 0; // Index der aktuellen Frage
let startTime = 0; // Zeit beim Start des Spiels
let penaltyTime = 0; // Strafzeit in Sekunden
let timerInterval; // Referenz auf das Timer-Intervall
let wrongAttempts = 0; // Zähler für falsche Antworten

// Startet das Spiel
function startGame() {
  document.getElementById("startScreen").classList.add("hidden");
  document.getElementById("gameScreen").classList.remove("hidden");
  startTime = Date.now(); // Startzeit erfassen
  penaltyTime = 0;
  timerInterval = setInterval(updateTimer, 50); // Timer läuft alle 50ms
  showQuestion(); // Zeigt erste Frage
}

// Aktualisiert die Timer-Anzeige
function updateTimer() {
  const totalMilliseconds = Date.now() - startTime + penaltyTime * 1000;

  const minutes = Math.floor(totalMilliseconds / 60000);
  const seconds = Math.floor((totalMilliseconds % 60000) / 1000);
  const milliseconds = Math.floor((totalMilliseconds % 1000) / 10); // auf zwei Stellen gekürzt

  // Formatieren (z. B. 01:05:09)
  const paddedMinutes = String(minutes).padStart(2, "0");
  const paddedSeconds = String(seconds).padStart(2, "0");
  const paddedMilliseconds = String(milliseconds).padStart(2, "0");

  document.getElementById(
    "timer"
  ).textContent = `Zeit: ${paddedMinutes}:${paddedSeconds}:${paddedMilliseconds}`;
}

// Zeigt die aktuelle Frage und das Bild dazu an
function showQuestion() {
  const container = document.getElementById("questionContainer");
  const feedbackBox = document.getElementById("feedback");
  container.innerHTML = ""; // Alte Inhalte löschen
  feedbackBox.classList.add("hidden"); // Feedbackbox verstecken
  feedbackBox.textContent = "";
  wrongAttempts = 0; // Fehlversuche zurücksetzen

  const q = questions[currentQuestion]; // aktuelle Frage laden

  // Bild anzeigen
  const img = document.createElement("img");
  img.src = q.image;
  container.appendChild(img);

  // Fragetext anzeigen
  const questionText = document.createElement("p");
  questionText.textContent = q.question;
  container.appendChild(questionText);

  // Antwortfeld abhängig vom Typ
  if (q.type === "text") {
    // Eingabefeld für Texteingabe
    const input = document.createElement("input");
    input.type = "text";
    input.id = "userAnswer";
    container.appendChild(input);

    // Button zum Antworten
    const submit = document.createElement("button");
    submit.textContent = "Antwort prüfen";
    submit.onclick = () => {
      const inputValue = document
        .getElementById("userAnswer")
        .value.trim()
        .toLowerCase();
      checkAnswer(inputValue);
    };
    submit.classList.add("button"); // Add the "button" class
    container.appendChild(submit);
  } else if (q.type === "choice") {
    // Mehrere Buttons für Auswahlmöglichkeiten
    q.options.forEach((option) => {
      const btn = document.createElement("button");
      btn.textContent = option;
      btn.onclick = () => checkAnswer(option);
      btn.classList.add("button"); // Add the "button" class
      container.appendChild(btn);
    });
  }
}

// Zeigt eine Feedback-Nachricht auf der Seite
function showFeedback(message, hint = false) {
  const feedback = document.getElementById("feedback");
  feedback.textContent = message;
  feedback.classList.remove("hidden");

  // Normales Feedback verschwindet nach 3 Sekunden
  if (!hint) {
    setTimeout(() => {
      feedback.classList.add("hidden");
      feedback.textContent = "";
    }, 3000);
  }
}

// Prüft die Antwort des Users
function checkAnswer(givenAnswer) {
  const correct = questions[currentQuestion].answer.toLowerCase();

  if (givenAnswer.toLowerCase() === correct) {
    // Richtig → weiter zur nächsten Frage
    currentQuestion++;
    if (currentQuestion < questions.length) {
      showQuestion();
    } else {
      endGame(); // letzte Frage → Spielende
    }
  } else {
    // Falsch → Strafzeit + Feedback
    wrongAttempts++;
    penaltyTime += 120; // 2 Minuten in Sekunden

    if (wrongAttempts >= 3) {
      // Nach 3 Versuchen Tipp anzeigen
      showFeedback(
        `Tipp: Die richtige Antwort war: ${questions[currentQuestion].answer}`,
        true
      );
    } else {
      showFeedback(
        `Falsche Antwort. Es wurden +2 Minuten hinzugefügt. (${wrongAttempts}/3)`
      );
    }
  }
}

// Spielende: zeigt die Endzeit an
function endGame() {
  clearInterval(timerInterval); // Timer stoppen
  document.getElementById("gameScreen").classList.add("hidden");
  document.getElementById("endScreen").classList.remove("hidden");

  const totalMilliseconds = Date.now() - startTime + penaltyTime * 1000;
  const minutes = Math.floor(totalMilliseconds / 60000);
  const seconds = Math.floor((totalMilliseconds % 60000) / 1000);
  const milliseconds = totalMilliseconds % 1000;

  const paddedMinutes = String(minutes).padStart(2, "0");
  const paddedSeconds = String(seconds).padStart(2, "0");
  const paddedMilliseconds = String(milliseconds).padStart(3, "0");

  document.getElementById(
    "finalTime"
  ).textContent = `${paddedMinutes}:${paddedSeconds}:${paddedMilliseconds}`;
}
