// Liste aller Fragen der Schnitzeljagd
const questions = [
  {
    image: "https://via.placeholder.com/600x300?text=Posten+1", // Bild-URL für den Posten
    question: "Wie viele Beine hat ein Hund?", // Text der Frage
    type: "text", // Antworttyp: Texteingabe
    answer: "4", // richtige Antwort
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
    type: "choice", // Antworttyp: Auswahlmöglichkeiten
    options: ["Grün", "Blau", "Rot"], // Auswahlmöglichkeiten
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
    container.appendChild(submit);
  } else if (q.type === "choice") {
    // Mehrere Buttons für Auswahlmöglichkeiten
    q.options.forEach((option) => {
      const btn = document.createElement("button");
      btn.textContent = option;
      btn.onclick = () => checkAnswer(option);
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
