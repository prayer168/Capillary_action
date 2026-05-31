const tabs = [...document.querySelectorAll(".tab")];
const panels = [...document.querySelectorAll(".panel")];

function showTab(id) {
  tabs.forEach((tab) => tab.classList.toggle("is-active", tab.dataset.tab === id));
  panels.forEach((panel) => panel.classList.toggle("is-active", panel.id === id));
  document.getElementById(id)?.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

tabs.forEach((tab) => tab.addEventListener("click", () => showTab(tab.dataset.tab)));
document.querySelectorAll("[data-jump]").forEach((button) => {
  button.addEventListener("click", () => showTab(button.dataset.jump));
});

const presets = {
  material: {
    paperType: "kitchen",
    paperLayers: 4,
    paperWidth: "medium",
    result: "影片任務一：衛生紙 15 cm，廚房紙巾 52 cm。"
  },
  layers: {
    paperType: "kitchen",
    paperLayers: 4,
    paperWidth: "medium",
    result: "影片任務二：一層廚房紙巾 10 cm，四層廚房紙巾 40 cm。"
  },
  width: {
    paperType: "kitchen",
    paperLayers: 1,
    paperWidth: "wide",
    result: "影片任務三：細紙條 11 cm，寬紙條 15 cm。"
  }
};

const paperType = document.getElementById("paperType");
const paperLayers = document.getElementById("paperLayers");
const paperWidth = document.getElementById("paperWidth");
const observeTime = document.getElementById("observeTime");
const layerOut = document.getElementById("layerOut");
const timeOut = document.getElementById("timeOut");
const simPaper = document.getElementById("simPaper");
const simWick = document.getElementById("simWick");
const cylinderFill = document.getElementById("cylinderFill");
const cylinderText = document.getElementById("cylinderText");
const labResult = document.getElementById("labResult");

function estimateCm() {
  const materialBase = paperType.value === "kitchen" ? 18 : 7;
  const layerBoost = Number(paperLayers.value) * (paperType.value === "kitchen" ? 8 : 3);
  const widthBoost = { narrow: 3, medium: 8, wide: 13 }[paperWidth.value];
  const timeFactor = Number(observeTime.value) / 30;
  return Math.round((materialBase + layerBoost + widthBoost) * timeFactor);
}

function updateLabVisual(animate = false) {
  layerOut.value = paperLayers.value;
  timeOut.value = observeTime.value;
  const widthMap = { narrow: 42, medium: 64, wide: 92 };
  const cm = Math.min(60, estimateCm());
  simPaper.style.width = `${widthMap[paperWidth.value]}px`;
  simPaper.style.opacity = paperType.value === "kitchen" ? "1" : ".72";
  if (animate) {
    simWick.style.height = "18%";
    window.setTimeout(() => {
      simWick.style.height = `${Math.max(20, Math.min(88, cm * 1.45))}%`;
    }, 80);
  } else {
    simWick.style.height = `${Math.max(20, Math.min(88, cm * 1.45))}%`;
  }
  cylinderFill.style.height = `${Math.max(10, Math.min(92, cm * 1.55))}%`;
  cylinderText.textContent = `${cm} cm`;
}

[paperType, paperLayers, paperWidth, observeTime].forEach((input) => {
  input.addEventListener("input", () => updateLabVisual(false));
});

document.getElementById("labForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const prediction = new FormData(event.currentTarget).get("prediction");
  const cm = estimateCm();
  const amount = cm >= 35 ? "很遠" : "較短";
  updateLabVisual(true);
  labResult.textContent = `你的預測是「水會移動${prediction}」。這次模擬約移動 ${cm} cm，距離${amount}。請想想：是哪一個條件讓結果變成這樣？`;
});

document.querySelectorAll("[data-load-preset]").forEach((button) => {
  button.addEventListener("click", () => {
    const preset = presets[button.dataset.loadPreset];
    paperType.value = preset.paperType;
    paperLayers.value = preset.paperLayers;
    paperWidth.value = preset.paperWidth;
    observeTime.value = 30;
    labResult.textContent = preset.result;
    updateLabVisual(true);
    showTab("lab");
  });
});

const defaultData = [
  ["衛生紙", 15],
  ["廚房紙巾", 52],
  ["一層廚房紙巾", 10],
  ["四層廚房紙巾", 40],
  ["細廚房紙巾", 11],
  ["寬廚房紙巾", 15]
];

const dataInputs = document.getElementById("dataInputs");
const chart = document.getElementById("barChart");
const ctx = chart.getContext("2d");
const conclusion = document.getElementById("conclusion");

function makeDataInputs() {
  dataInputs.innerHTML = "";
  defaultData.forEach(([label, value], index) => {
    const row = document.createElement("label");
    row.textContent = label;
    const input = document.createElement("input");
    input.type = "number";
    input.min = "0";
    input.max = "200";
    input.value = value;
    input.dataset.index = index;
    input.setAttribute("aria-label", `${label}水移動距離，單位公分`);
    input.addEventListener("input", drawChart);
    row.append(input);
    dataInputs.append(row);
  });
}

function getData() {
  return [...dataInputs.querySelectorAll("input")].map((input, index) => ({
    label: defaultData[index][0],
    value: Math.max(0, Number(input.value) || 0)
  }));
}

function drawChart() {
  const data = getData();
  const width = chart.width;
  const height = chart.height;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#fffdfa";
  ctx.fillRect(0, 0, width, height);

  const padding = 58;
  const graphW = width - padding * 2;
  const graphH = height - padding * 1.8;
  const max = Math.max(10, ...data.map((item) => item.value));
  const barGap = 18;
  const barW = (graphW - barGap * (data.length - 1)) / data.length;

  ctx.strokeStyle = "#bedad8";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding, 24);
  ctx.lineTo(padding, height - padding);
  ctx.lineTo(width - 24, height - padding);
  ctx.stroke();

  data.forEach((item, index) => {
    const x = padding + index * (barW + barGap);
    const barH = (item.value / max) * graphH;
    const y = height - padding - barH;
    ctx.fillStyle = index % 2 === 0 ? "#1fb6d8" : "#e34b5f";
    ctx.fillRect(x, y, barW, barH);
    ctx.fillStyle = "#17323a";
    ctx.font = "700 20px 'Noto Sans TC', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${item.value} cm`, x + barW / 2, y - 10);
    ctx.font = "700 15px 'Noto Sans TC', sans-serif";
    wrapText(item.label, x + barW / 2, height - 36, Math.min(95, barW + 10), 18);
  });

  const winner = data.reduce((best, item) => (item.value > best.value ? item : best), data[0]);
  conclusion.textContent = `這次實驗中，「${winner.label}」水移動的距離最遠，是 ${winner.value} cm。請用紙材、層數或寬度來說明你的想法。`;
}

function wrapText(text, x, y, maxWidth, lineHeight) {
  let line = "";
  let lineY = y;
  [...text].forEach((char) => {
    const testLine = line + char;
    if (ctx.measureText(testLine).width > maxWidth && line) {
      ctx.fillText(line, x, lineY);
      line = char;
      lineY += lineHeight;
    } else {
      line = testLine;
    }
  });
  ctx.fillText(line, x, lineY);
}

document.getElementById("resetData").addEventListener("click", () => {
  [...dataInputs.querySelectorAll("input")].forEach((input, index) => {
    input.value = defaultData[index][1];
  });
  drawChart();
});

document.getElementById("printPage").addEventListener("click", () => window.print());

const quizItems = [
  {
    question: "哪一個現象最像毛細現象？",
    options: ["抹布碰到水後慢慢變濕", "球從桌上掉下來", "電燈打開後變亮"],
    answer: 0,
    feedback: "抹布裡有細小空隙，水會沿著空隙移動。"
  },
  {
    question: "影片中，哪一種紙讓水移動得比較遠？",
    options: ["衛生紙", "廚房紙巾", "兩種完全一樣"],
    answer: 1,
    feedback: "廚房紙巾約 52 cm，比衛生紙約 15 cm 遠。"
  },
  {
    question: "四層廚房紙巾比一層廚房紙巾讓水移動得更遠，可能和什麼有關？",
    options: ["紙變得比較黑", "可吸水的紙纖維變多", "杯子變高了"],
    answer: 1,
    feedback: "層數變多，能讓水通過或停留的纖維也變多。"
  },
  {
    question: "做公平比較時，哪一件事應該盡量相同？",
    options: ["觀察時間", "每組同學的身高", "教室牆壁顏色"],
    answer: 0,
    feedback: "觀察時間相同，才比較容易判斷是哪個條件造成差異。"
  },
  {
    question: "如果紙條比較寬，影片中水移動量大約如何？",
    options: ["比較遠", "一定是 0 cm", "會變成冰"],
    answer: 0,
    feedback: "寬紙條約 15 cm，細紙條約 11 cm。"
  },
  {
    question: "看到長條圖最高的一欄，代表什麼？",
    options: ["那一組水移動距離最遠", "那一組紙條最漂亮", "那一組一定做錯"],
    answer: 0,
    feedback: "長條越高，表示水移動的距離越遠。"
  }
];

const quizList = document.getElementById("quizList");
const scoreBox = document.getElementById("scoreBox");

function renderQuiz() {
  quizList.innerHTML = "";
  scoreBox.textContent = "完成作答後會看到分數。";
  quizItems.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "quiz-card";
    card.innerHTML = `<h3>第 ${index + 1} 題</h3><p>${item.question}</p>`;
    const options = document.createElement("div");
    options.className = "quiz-options";
    const feedback = document.createElement("div");
    feedback.className = "feedback";
    item.options.forEach((option, optionIndex) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = option;
      button.addEventListener("click", () => answerQuiz(card, button, index, optionIndex, feedback));
      options.append(button);
    });
    card.append(options, feedback);
    quizList.append(card);
  });
}

function answerQuiz(card, button, questionIndex, optionIndex, feedback) {
  if (card.dataset.answered) return;
  card.dataset.answered = "true";
  const correct = quizItems[questionIndex].answer === optionIndex;
  button.classList.add(correct ? "correct" : "wrong");
  const correctButton = card.querySelectorAll("button")[quizItems[questionIndex].answer];
  correctButton.classList.add("correct");
  feedback.textContent = `${correct ? "答對了！" : "再想想。"}${quizItems[questionIndex].feedback}`;
  updateScore();
}

function updateScore() {
  const answered = [...quizList.querySelectorAll(".quiz-card")].filter((card) => card.dataset.answered);
  const correct = [...quizList.querySelectorAll(".quiz-card")].filter((card, index) => {
    const buttons = [...card.querySelectorAll("button")];
    return buttons[quizItems[index].answer].classList.contains("correct") && !buttons.some((button) => button.classList.contains("wrong"));
  });
  scoreBox.textContent = `已作答 ${answered.length} / ${quizItems.length} 題，目前答對 ${correct.length} 題。`;
}

document.getElementById("retryQuiz").addEventListener("click", renderQuiz);

makeDataInputs();
drawChart();
renderQuiz();
updateLabVisual(false);
