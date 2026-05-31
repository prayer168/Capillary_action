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

const applicationExamples = {
  towel: {
    kicker: "例子 1",
    title: "抹布吸水",
    text: "抹布裡有很多細小空隙，水會沿著纖維間的小縫縫移動，所以可以把桌上的水慢慢吸起來。",
    think: "想一想：為什麼厚一點的抹布通常可以吸比較多水？",
    scene: "towel-scene"
  },
  plant: {
    kicker: "例子 2",
    title: "植物把水往上送",
    text: "植物莖裡有細小管道，水可以從根部往上移動，幫助葉子得到需要的水分。",
    think: "想一想：如果植物缺水，葉子可能會發生什麼變化？",
    scene: "plant-scene"
  },
  paper: {
    kicker: "例子 3",
    title: "紙巾上的顏色擴散",
    text: "把水滴在紙巾上，水會沿著紙纖維擴散，顏色也會跟著水往外移動。",
    think: "想一想：為什麼水滴在衛生紙上會慢慢變成一大片？",
    scene: "paper-scene"
  },
  wick: {
    kicker: "例子 4",
    title: "蠟燭燈芯吸蠟油",
    text: "蠟燭燃燒時，融化的蠟油會沿著燈芯的小縫隙往上移動，讓火焰可以持續燃燒。",
    think: "想一想：燈芯如果太短或太濕，火焰可能會怎樣？",
    scene: "wick-scene"
  },
  soil: {
    kicker: "例子 5",
    title: "土壤把水留住",
    text: "土壤顆粒之間有小空隙，水會停留或慢慢移動，植物的根就能接觸到水。",
    think: "想一想：為什麼太鬆或太硬的土都可能影響植物生長？",
    scene: "soil-scene"
  },
  straw: {
    kicker: "例子 6",
    title: "吸管花和紙花實驗",
    text: "把紙花或紙條碰到彩色水，水會沿著紙的空隙往上移動，讓顏色慢慢爬高。",
    think: "想一想：紙條越寬或層數越多，顏色移動會一樣嗎？",
    scene: "straw-scene"
  }
};

const applicationVisual = document.getElementById("applicationVisual");
const applicationKicker = document.getElementById("applicationKicker");
const applicationTitle = document.getElementById("applicationTitle");
const applicationText = document.getElementById("applicationText");
const applicationThink = document.getElementById("applicationThink");

document.querySelectorAll(".application-choice").forEach((button) => {
  button.addEventListener("click", () => {
    const item = applicationExamples[button.dataset.app];
    document.querySelectorAll(".application-choice").forEach((choice) => {
      choice.classList.toggle("is-active", choice === button);
    });
    applicationVisual.className = `application-visual ${item.scene}`;
    applicationKicker.textContent = item.kicker;
    applicationTitle.textContent = item.title;
    applicationText.textContent = item.text;
    applicationThink.textContent = item.think;
  });
});

const presets = {
  material: {
    paperLayers: 4,
    paperWidth: 2,
    paperLength: 50,
    result: "影片任務一：衛生紙 15 cm，廚房紙巾 52 cm。"
  },
  layers: {
    paperLayers: 4,
    paperWidth: 2,
    paperLength: 40,
    result: "影片任務二：一層廚房紙巾 10 cm，四層廚房紙巾 40 cm。"
  },
  width: {
    paperLayers: 1,
    paperWidth: 3,
    paperLength: 30,
    result: "影片任務三：細紙條 11 cm，寬紙條 15 cm。"
  }
};

const paperLayers = document.getElementById("paperLayers");
const paperWidth = document.getElementById("paperWidth");
const paperLength = document.getElementById("paperLength");
const observeTime = document.getElementById("observeTime");
const layerOut = document.getElementById("layerOut");
const widthOut = document.getElementById("widthOut");
const lengthOut = document.getElementById("lengthOut");
const timeOut = document.getElementById("timeOut");
const tissuePaper = document.getElementById("tissuePaper");
const kitchenPaper = document.getElementById("kitchenPaper");
const tissueWick = document.getElementById("tissueWick");
const kitchenWick = document.getElementById("kitchenWick");
const tissueText = document.getElementById("tissueText");
const kitchenText = document.getElementById("kitchenText");
const labResult = document.getElementById("labResult");

function estimateCm(material) {
  const materialBase = material === "kitchen" ? 18 : 7;
  const layerBoost = Number(paperLayers.value) * (material === "kitchen" ? 8 : 3);
  const widthBoost = Number(paperWidth.value) * 4;
  const lengthFactor = Number(paperLength.value) / 50;
  const timeFactor = Number(observeTime.value) / 30;
  return Math.round((materialBase + layerBoost + widthBoost) * lengthFactor * timeFactor);
}

function updateLabVisual(animate = false) {
  layerOut.value = paperLayers.value;
  widthOut.value = { 1: "細", 2: "中", 3: "寬" }[paperWidth.value];
  lengthOut.value = paperLength.value;
  timeOut.value = observeTime.value;
  const widthMap = { 1: 42, 2: 64, 3: 92 };
  const height = Math.max(170, Math.min(270, Number(paperLength.value) * 4.5));
  const tissueCm = Math.min(60, estimateCm("tissue"));
  const kitchenCm = Math.min(60, estimateCm("kitchen"));
  [tissuePaper, kitchenPaper].forEach((paper) => {
    paper.style.width = `${widthMap[paperWidth.value]}px`;
    paper.style.height = `${height}px`;
  });
  const setWick = (wick, cm) => {
    wick.style.height = `${Math.max(18, Math.min(88, cm * 1.45))}%`;
  };
  if (animate) {
    tissueWick.style.height = "18%";
    kitchenWick.style.height = "18%";
    window.setTimeout(() => {
      setWick(tissueWick, tissueCm);
      setWick(kitchenWick, kitchenCm);
    }, 80);
  } else {
    setWick(tissueWick, tissueCm);
    setWick(kitchenWick, kitchenCm);
  }
  tissueText.textContent = `${tissueCm} cm`;
  kitchenText.textContent = `${kitchenCm} cm`;
}

[paperLayers, paperWidth, paperLength, observeTime].forEach((input) => {
  input.addEventListener("input", () => updateLabVisual(false));
});

document.getElementById("labForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const prediction = new FormData(event.currentTarget).get("prediction");
  const tissueCm = estimateCm("tissue");
  const kitchenCm = estimateCm("kitchen");
  const winner = kitchenCm >= tissueCm ? "廚房紙巾" : "衛生紙";
  updateLabVisual(true);
  labResult.textContent = `你的預測是「${prediction}」。這次模擬中，衛生紙約 ${tissueCm} cm，廚房紙巾約 ${kitchenCm} cm；水在「${winner}」上移動得比較遠。`;
});

document.querySelectorAll("[data-load-preset]").forEach((button) => {
  button.addEventListener("click", () => {
    const preset = presets[button.dataset.loadPreset];
    paperLayers.value = preset.paperLayers;
    paperWidth.value = preset.paperWidth;
    paperLength.value = preset.paperLength;
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
