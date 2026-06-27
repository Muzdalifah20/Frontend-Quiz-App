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
let isInSubmitMode = true;
// let quizQuestionIndex = 0;

const fetchQuizData = async (quizSubject = "HTML", quizQuestionIndex) => {
  try {
    const response = await fetch("./assets/data/data.json");

    if (!response.ok) {
      throw new Error(
        `Failed to fetch: ${response.status} ${response.statusText}`
      );
    }

    const quizData = await response.json();
    updateQuestion(quizData, "HTML", quizQuestionIndex);
    // evaluateSubmitAnswer(quizData, "HTML", quizQuestionIndex);
    getQuizDataAnswer(quizData, "HTML", quizQuestionIndex);
    // getQuizData(quizData, "HTML", 0, "answer");
    // updateQuizHeader(quizData, quizSubject);
    // console.log(quizData);
    return quizData;
  } catch (error) {
    console.error(error.message);
  }
};

function getQuizData(quizData, quizSubject, quizQuestionIndex = 0, quizQuery) {
  const quizSubjectByIndex = quizSubjectIndex(quizSubject);

  const QuizQueryData =
    quizData?.quizzes?.[quizSubjectByIndex]?.questions?.[quizQuestionIndex]?.[
      quizQuery
    ];

  return QuizQueryData;
}

function updateQuestion(quizData, quizSubject, quizQuestionIndex = 0) {
  // for(let i = 0; i< 10; i++){
  const question = getQuizData(
    quizData,
    quizSubject,
    quizQuestionIndex,
    "question"
  );

  const options = getQuizData(
    quizData,
    quizSubject,
    quizQuestionIndex,
    "options"
  );

  quizQuestionText.textContent = question;
  for (let j = 0; j < 4; j++) {
    quizQuestionOptions[j].value = options[j];
    quizQuestionOptionsLabel[j].textContent = options[j];
  }

  // }
  //   console.log(question, options, answer);
}

let quizDataAnswer;
function getQuizDataAnswer(quizData, quizSubject, quizQuestionIndex) {
  quizDataAnswer = getQuizData(
    quizData,
    quizSubject,
    quizQuestionIndex,
    "answer"
  );
  console.log(quizDataAnswer);
}
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

function hideSection(section) {
  section.classList.add("hidden");
}
function showSection(section) {
  section.classList.remove("hidden");
}

function updateQuizHeader(quizData, quizSubject) {
  const quizSubjectByIndex = quizSubjectIndex(quizSubject);
  const quizTitleText = quizData?.quizzes?.[quizSubjectByIndex]?.title;
  const quizTitleIconPath = quizData?.quizzes?.[quizSubjectByIndex]?.icon;
  const quizTitleIcon = document.querySelector("#quizTitleIcon");
  const quizTitle = document.querySelector("#quizTitle");
  if (!quizTitle || !quizTitleIcon) return;
  quizTitle.textContent = quizTitleText;
  quizTitleIcon.src = quizTitleIconPath;
}

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

let quizScore = 0;
function evaluateSubmitAnswer() {
  const selectedAnswer = getSelectedAnswer();
  const quizDataAnswerIndex = getQuizDataAnswerIndex();
  hideSection(quizErrorMessageDiv);
  removeUpdatedAnswerStyle(selectedAnswer, "correct-answer");
  removeUpdatedAnswerStyle(selectedAnswer, "incorrect-answer");
  if (selectedAnswer === null) {
    showSection(quizErrorMessageDiv);
    return;
  }

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

  return selectedAnswer == quizDataAnswer;
}

function updateUiForNextQuestion() {
  const selectedAnswer = getSelectedAnswer();
  const quizDataAnswerIndex = getQuizDataAnswerIndex();
  removeUpdatedAnswerStyle(selectedAnswer, "correct-answer");
  removeUpdatedAnswerStyle(selectedAnswer, "incorrect-answer");
  removeUpdatedAnswerStyle(
    quizQuestionOptionsDiv[quizDataAnswerIndex],
    "given-quiz-answer"
  );
  selectedAnswer.checked = false;
}

function showUpdatedAnswerStyle(element, className) {
  element.classList.add(className);
}

function removeUpdatedAnswerStyle(element, className) {
  element.classList.remove(className);
}

let quizQuestionIndex = 0;
let currentQuizSubject = "HTML";
quizSubjectBtns.forEach((quizSubjectBtn) => {
  quizSubjectBtn.addEventListener("click", () => {
    const quizSubject = quizSubjectBtn.dataset.subject;
    currentQuizSubject = quizSubject;
    quizSubjectIndex = 0;

    hideSection(heroSection);
    hideSection(quizCompletedSection);
    showSection(headerTitleDiv);
    showSection(quizSection);

    fetchQuizData(currentQuizSubject, quizSubjectIndex + 1);
    quizQuestionLabel.textContent = `Question ${quizQuestionIndex + 1} of 10`;
  });
});

function handleQuizQuestionSubmitBtn() {
  fetchQuizData(currentQuizSubject, quizQuestionIndex + 1);
  quizQuestionLabel.textContent = `Question ${quizQuestionIndex + 2} of 10`;
  quizQuestionIndex++;
}

quizQuestionBtn.addEventListener("click", (e) => {
  if (isInSubmitMode) {
    e.preventDefault();
    console.log(evaluateSubmitAnswer());
    quizQuestionBtn.textContent = "Next Question";
    isInSubmitMode = false;
  } else {
    quizQuestionBtn.textContent = "Submit Answer";
    e.preventDefault();
    updateUiForNextQuestion();
    handleQuizQuestionSubmitBtn();
    isInSubmitMode = true;
    if (quizQuestionIndex > 10) {
      isInSubmitMode = false;
      return;
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  fetchQuizData(currentQuizSubject, quizQuestionIndex);
  quizQuestionLabel.textContent = `Question ${quizQuestionIndex + 1} of 10`;
});
