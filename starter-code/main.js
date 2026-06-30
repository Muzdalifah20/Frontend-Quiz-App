// DOM
const quizSubjectBtns = document.querySelectorAll(".hero__subject-btn");
const heroSection = document.querySelector(".hero");
const headerTitleDiv = document.querySelector(".header__title");
const quizSection = document.querySelector(".quiz");
const quizCompletedSection = document.querySelector(".quiz-completed");
const quizQuestionText = document.querySelector("#quizQuestionText");
const quizQuestionOptions = document.querySelectorAll("input[name='options']");
const quizQuestionOptionsLabel = document.querySelectorAll(
  ".quiz__option-label"
);
const quizQuestionLabel = document.querySelector(".quiz__question-label");
const quizQuestionBtn = document.querySelector(".quiz__submit-btn");
const quizErrorMessageDiv = document.querySelector(".quiz__error-message");
const quizQuestion = document.querySelector("#quizQuestion");
const quizQuestionOptionsDiv = document.querySelectorAll(".quiz__option");
const quizResultHeaderTitle = document.querySelector(".result-header__title");
const quizResultHeaderIcon = document.querySelector(".result-header__icon");
const quizResultScoreP = document.querySelector(
  ".quiz-completed__result-score"
);
const quizPlayAgainBtn = document.querySelector(".quiz-completed__repaly-btn");
const themes = document.querySelectorAll("input[name='theme']");
const themeToggleBtn = document.querySelector(".header__toggle-button");
const quizProgressBar = document.querySelector("#quizProgressBar");
const body = document.body;

// State
let quizData = null;
let quizDataAnswer = null;
let quizQuestionIndex = 0;
let quizScore = 0;
let currentQuizSubject = "HTML";
let isInSubmitMode = true;

//  Theme Function
function setTheme(theme) {
  body.classList.toggle("dark", theme === "dark");
  body.classList.toggle("light", theme === "light");
  localStorage.setItem("theme", theme);
}

function initTheme() {
  const savedTheme = localStorage.getItem("theme");
  setTheme(savedTheme || "light");
}

// Load Quiz Data
const loadQuizData = async () => {
  try {
    const response = await fetch("./assets/data/data.json");

    if (!response.ok) {
      throw new Error(
        `Failed to fetch: ${response.status} ${response.statusText}`
      );
    }

    quizData = await response.json();
  } catch (error) {
    console.error(error.message);
  }
};

function quizSubjectIndex(quizSubject = 0) {
  switch (quizSubject) {
    case "HTML":
      return 0;
      break;
    case "CSS":
      return 1;
      break;
    case "JavaScript":
      return 2;
      break;
    case "Accessibility":
      return 3;
      break;

    default:
      return 3;
      break;
  }
}

function getQuizData(quizSubject, quizQuestionIndex = 0, quizQuery) {
  const quizSubjectByIndex = quizSubjectIndex(quizSubject);
  console.log(quizData);
  const quizQueryData =
    quizData?.quizzes?.[quizSubjectByIndex]?.questions?.[quizQuestionIndex]?.[
      quizQuery
    ];

  return quizQueryData;
}

function renderHeader(quizSubject) {
  const quizSubjectByIndex = quizSubjectIndex(quizSubject);
  const quizTitleText = quizData?.quizzes?.[quizSubjectByIndex]?.title;
  const quizTitleIconPath = quizData?.quizzes?.[quizSubjectByIndex]?.icon;
  const quizTitleIcon = document.querySelector("#quizTitleIcon");
  const quizTitle = document.querySelector("#quizTitle");
  if (!quizTitle || !quizTitleIcon) return;

  quizTitle.textContent = quizTitleText;
  quizTitleIcon.src = quizTitleIconPath;
  quizResultHeaderTitle.textContent = quizTitleText;
  quizResultHeaderIcon.src = quizTitleIconPath;
}

function renderQuestion(quizSubject, quizQuestionIndex = 0) {
  const question = getQuizData(quizSubject, quizQuestionIndex, "question");

  const options = getQuizData(quizSubject, quizQuestionIndex, "options");

  quizQuestionText.textContent = question;
  for (let j = 0; j < 4; j++) {
    quizQuestionOptions[j].value = options[j];
    quizQuestionOptionsLabel[j].textContent = options[j];
  }
}

function getQuizDataAnswer(quizSubject, quizQuestionIndex) {
  quizDataAnswer = getQuizData(quizSubject, quizQuestionIndex, "answer");
}

// UI functions
function hideSection(section) {
  section.classList.add("hidden");
}
function showSection(section) {
  section.classList.remove("hidden");
}

function resetQuiz() {
  quizScore = 0;
  quizQuestionIndex = 0;
  resetSections();
}

function resetSections() {
  hideSection(headerTitleDiv);
  hideSection(quizSection);
  hideSection(quizCompletedSection);
  showSection(heroSection);
}

function showError() {
  showSection(quizErrorMessageDiv);
  quizErrorMessageDiv.focus();
}

function showUpdatedAnswerStyle(element, className) {
  element.classList.add(className);
}

function removeUpdatedAnswerStyle(element, className) {
  element.classList.remove(className);
}

function handleQuizProgressBarValue() {
  quizProgressBar.value = `${quizQuestionIndex + 1}`;
}

function focusFirstOption(currentBtn) {
  const firstOption = document.getElementById("optionA");
  if (firstOption) {
    firstOption.focus();
  } else {
    currentBtn.focus();
  }
}

// Helper functions
function getSelectedAnswer() {
  let selectedAnswer;
  for (const quizQuestionOption of quizQuestionOptions) {
    if (quizQuestionOption.checked) {
      selectedAnswer = quizQuestionOption;
      break;
    }
  }
  return selectedAnswer || null;
}

function getQuizDataAnswerIndex() {
  let quizDataAnswerIndex;
  for (let i = 0; i < 4; i++) {
    if (quizQuestionOptions[i].value == quizDataAnswer) {
      quizDataAnswerIndex = i;
      break;
    }
  }
  return quizDataAnswerIndex;
}

// Logic Functions
function evaluateOptions() {
  const selectedAnswer = getSelectedAnswer();
  if (!selectedAnswer) {
    showError();
    return false;
  }
  return true;
}

function evaluateSubmitAnswer() {
  const selectedAnswer = getSelectedAnswer();
  const quizDataAnswerIndex = getQuizDataAnswerIndex();
  hideSection(quizErrorMessageDiv);

  evaluateOptions();

  removeUpdatedAnswerStyle(selectedAnswer, "correct-answer");
  removeUpdatedAnswerStyle(selectedAnswer, "incorrect-answer");

  if (selectedAnswer.value === quizDataAnswer) {
    showUpdatedAnswerStyle(selectedAnswer, "correct-answer");
    quizScore++;
  }

  if (selectedAnswer.value !== quizDataAnswer) {
    showUpdatedAnswerStyle(
      quizQuestionOptionsDiv[quizDataAnswerIndex],
      "given-quiz-answer"
    );
    showUpdatedAnswerStyle(selectedAnswer, "incorrect-answer");
  }
}

function updateUiForNextQuestion() {
  const selectedAnswer = getSelectedAnswer();
  const quizDataAnswerIndex = getQuizDataAnswerIndex();
  if (selectedAnswer !== null) {
    removeUpdatedAnswerStyle(selectedAnswer, "correct-answer");
    removeUpdatedAnswerStyle(selectedAnswer, "incorrect-answer");
    removeUpdatedAnswerStyle(
      quizQuestionOptionsDiv[quizDataAnswerIndex],
      "given-quiz-answer"
    );
    selectedAnswer.checked = false;
  }
}

function finishQuiz() {
  quizResultScoreP.textContent = quizScore;
  hideSection(heroSection);
  hideSection(quizSection);
  showSection(headerTitleDiv);
  showSection(quizCompletedSection);
}

quizSubjectBtns.forEach((quizSubjectBtn) => {
  quizSubjectBtn.addEventListener("click", () => {
    const quizSubject = quizSubjectBtn.dataset.subject;

    currentQuizSubject = quizSubject;
    quizQuestionIndex = 0;

    hideSection(heroSection);
    hideSection(quizCompletedSection);
    showSection(headerTitleDiv);
    showSection(quizSection);

    renderHeader(currentQuizSubject);
    renderQuestion(currentQuizSubject, quizQuestionIndex);
    getQuizDataAnswer(currentQuizSubject, quizQuestionIndex);
    quizQuestionLabel.textContent = `Question ${quizQuestionIndex + 1} of 10`;

    focusFirstOption(quizSubjectBtn);
  });
});

function goTONextQuestion() {
  if (quizQuestionIndex >= 10) return;
  quizQuestionLabel.textContent = `Question ${quizQuestionIndex + 2} of 10`;
  quizQuestionIndex++;
}

quizQuestionBtn.addEventListener("click", (e) => {
  if (isInSubmitMode) {
    e.preventDefault();
    const canContinue = evaluateOptions();
    console.log(canContinue);
    if (!canContinue) return;
    evaluateSubmitAnswer();
    handleQuizProgressBarValue();
    if (quizQuestionIndex === 9) {
      quizQuestionBtn.textContent = "Show Result";
    } else {
      quizQuestionBtn.textContent = "Next Question";
    }
    isInSubmitMode = false;
  } else {
    focusFirstOption(quizQuestionBtn);
    quizQuestionBtn.textContent = "Submit Answer";
    e.preventDefault();
    updateUiForNextQuestion();
    goTONextQuestion();
    isInSubmitMode = true;

    if (quizQuestionIndex > 9) {
      isInSubmitMode = false;
      finishQuiz();
    }

    if (quizQuestionIndex >= 10) return;
  }
});

quizPlayAgainBtn.addEventListener("click", resetQuiz);

quizQuestionOptions.forEach((quizQuestionOption) => {
  quizQuestionOption.addEventListener("input", () => {
    hideSection(quizErrorMessageDiv);
  });
});

themes.forEach((theme) => {
  theme.addEventListener("change", () => {
    if (theme.id === "dark") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  });
});

document.addEventListener("DOMContentLoaded", async () => {
  try {
    initTheme();
    await loadQuizData();

    resetSections();
  } catch (error) {
    console.error(error.message);
  }
});
