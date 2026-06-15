const body = document.body;
const modeButtons = document.querySelectorAll(".mode-button");
const highlights = document.querySelectorAll(".highlight");
const checkButton = document.querySelector("#checkButton");
const resetButton = document.querySelector("#resetButton");
const scoreText = document.querySelector("#scoreText");
const feedback = document.querySelector("#feedback");
const practiceHint = document.querySelector("#practiceHint");

function setMode(mode) {
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

  scoreText.textContent = `${correct} / ${total}`;
  if (correct === total) {
    feedback.textContent = "很準確！你選到所有示範重點。下一步可以說明每個重點屬於主概念、過程、例子或行動。";
  } else if (correct >= 5) {
    feedback.textContent = "已經抓到多數重點。紅色提示代表容易漏掉的關鍵句，可以回頭看看它和段落主旨的關係。";
  } else {
    feedback.textContent = "先不要急著標很多字。試著每段只選一個最能代表段落意思的詞句，再重新檢核。";
  }
}

function resetPractice() {
  highlights.forEach((item) => {
    item.classList.remove("is-selected", "is-correct", "is-missed");
    item.setAttribute("aria-pressed", "false");
  });
  scoreText.textContent = "尚未檢核";
  feedback.textContent = "尚未開始檢核。";
  setMode("practice");
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

checkButton.addEventListener("click", checkAnswers);
resetButton.addEventListener("click", resetPractice);

setMode("plain");
