const body = document.body;
const modeButtons = document.querySelectorAll(".mode-button");
const highlights = document.querySelectorAll(".highlight");
const checkButton = document.querySelector("#checkButton");
const resetButton = document.querySelector("#resetButton");
const scoreText = document.querySelector("#scoreText");
const feedback = document.querySelector("#feedback");
const practiceHint = document.querySelector("#practiceHint");
const gridCells = document.querySelectorAll(".grid-cell");
const gridDetail = document.querySelector("#gridDetail");
const mapNodes = document.querySelectorAll(".map-node");
const mapDetail = document.querySelector("#mapDetail");
const quizForm = document.querySelector("#quizForm");
const quizResult = document.querySelector("#quizResult");

function setMode(mode) {
  if (!modeButtons.length) return;

  body.dataset.mode = mode;
  modeButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.mode === mode);
  });

  const isPractice = mode === "practice";
  highlights.forEach((item) => {
    item.setAttribute("tabindex", isPractice ? "0" : "-1");
    item.setAttribute("role", isPractice ? "button" : "text");
    item.setAttribute("aria-pressed", isPractice && item.classList.contains("is-selected") ? "true" : "false");
  });

  if (!practiceHint) return;

  if (mode === "plain") {
    practiceHint.textContent = "這是空白文章。請先完整閱讀，再想一想每段最重要的是什麼。";
  } else if (mode === "practice") {
    practiceHint.textContent = "點選你認為應該劃重點的文字，再按下檢核答案。";
  } else {
    practiceHint.textContent = "示範版用不同顏色表示重點類型，可和自己的選擇互相比較。";
  }
}

function toggleHighlight(item) {
  if (body.dataset.mode !== "practice") return;
  item.classList.remove("is-correct", "is-missed");
  item.classList.toggle("is-selected");
  item.setAttribute("aria-pressed", item.classList.contains("is-selected") ? "true" : "false");
}

function checkAnswers() {
  setMode("practice");
  const total = highlights.length;
  let correct = 0;

  highlights.forEach((item) => {
    const selected = item.classList.contains("is-selected");
    item.classList.toggle("is-correct", selected);
    item.classList.toggle("is-missed", !selected);
    if (selected) correct += 1;
  });

  if (scoreText) scoreText.textContent = `${correct} / ${total}`;
  if (!feedback) return;

  if (correct === total) {
    feedback.textContent = "全部選到。下一步請說明每個重點屬於主概念、過程、例子或行動。";
  } else if (correct >= 5) {
    feedback.textContent = "已抓到多數重點。紅色提示是漏掉的關鍵句，回頭看它和段落主旨的關係。";
  } else {
    feedback.textContent = "先縮小範圍。每段只選最能代表段落意思的一句或一個詞，再重新檢核。";
  }
}

function resetPractice() {
  highlights.forEach((item) => {
    item.classList.remove("is-selected", "is-correct", "is-missed");
    item.setAttribute("aria-pressed", "false");
  });
  if (scoreText) scoreText.textContent = "尚未檢核";
  if (feedback) feedback.textContent = "尚未開始檢核。";
  setMode("practice");
}

function activateGridCell(cell) {
  gridCells.forEach((item) => item.classList.remove("is-active"));
  cell.classList.add("is-active");
  if (gridDetail) gridDetail.textContent = cell.dataset.detail;
}

function activateMapNode(node) {
  mapNodes.forEach((item) => item.classList.remove("is-active"));
  node.classList.add("is-active");
  if (mapDetail) mapDetail.textContent = node.dataset.map;
}

function checkQuiz(event) {
  event.preventDefault();
  const formData = new FormData(quizForm);
  const answers = ["q1", "q2", "q3"];
  let answered = 0;
  let score = 0;

  answers.forEach((key) => {
    const value = formData.get(key);
    if (value !== null) answered += 1;
    if (value === "1") score += 1;
  });

  if (!quizResult) return;

  if (answered < answers.length) {
    quizResult.textContent = "還有題目尚未作答。";
    return;
  }

  if (score === answers.length) {
    quizResult.textContent = "3 / 3。概念清楚：你能連結樹冠、蒸散作用與森林保水。";
  } else {
    quizResult.textContent = `${score} / 3。請回到九宮格和心智圖，重新確認「水速變化」與「植物如何參與水循環」。`;
  }
}

modeButtons.forEach((button) => {
  button.addEventListener("click", () => setMode(button.dataset.mode));
});

highlights.forEach((item) => {
  item.addEventListener("click", () => toggleHighlight(item));
  item.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleHighlight(item);
    }
  });
});

gridCells.forEach((cell) => {
  cell.addEventListener("click", () => activateGridCell(cell));
});

mapNodes.forEach((node) => {
  node.addEventListener("click", () => activateMapNode(node));
});

if (checkButton) checkButton.addEventListener("click", checkAnswers);
if (resetButton) resetButton.addEventListener("click", resetPractice);
if (quizForm) quizForm.addEventListener("submit", checkQuiz);

setMode("plain");
