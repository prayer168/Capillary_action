const slides = Array.from(document.querySelectorAll(".slide"));
const toc = document.querySelector("#toc");
const counter = document.querySelector("#counter");
const progressBar = document.querySelector("#progressBar");
const prevBtn = document.querySelector("#prevBtn");
const nextBtn = document.querySelector("#nextBtn");

let currentIndex = 0;

function buildToc() {
  slides.forEach((slide, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = `${String(index + 1).padStart(2, "0")} ${slide.dataset.title}`;
    button.addEventListener("click", () => showSlide(index));
    toc.appendChild(button);
  });
}

function showSlide(index) {
  currentIndex = Math.max(0, Math.min(index, slides.length - 1));

  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === currentIndex);
  });

  Array.from(toc.children).forEach((button, buttonIndex) => {
    button.classList.toggle("is-active", buttonIndex === currentIndex);
  });

  counter.textContent = `${currentIndex + 1} / ${slides.length}`;
  progressBar.style.width = `${((currentIndex + 1) / slides.length) * 100}%`;
  location.hash = `slide-${currentIndex + 1}`;
}

function nextSlide() {
  showSlide(currentIndex + 1);
}

function prevSlide() {
  showSlide(currentIndex - 1);
}

function startFromHash() {
  const match = location.hash.match(/slide-(\d+)/);
  if (!match) return 0;
  return Number(match[1]) - 1;
}

buildToc();
showSlide(startFromHash());

prevBtn.addEventListener("click", prevSlide);
nextBtn.addEventListener("click", nextSlide);

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight" || event.key === "PageDown" || event.key === " ") {
    event.preventDefault();
    nextSlide();
  }

  if (event.key === "ArrowLeft" || event.key === "PageUp") {
    event.preventDefault();
    prevSlide();
  }

  if (event.key === "Home") {
    event.preventDefault();
    showSlide(0);
  }

  if (event.key === "End") {
    event.preventDefault();
    showSlide(slides.length - 1);
  }
});
