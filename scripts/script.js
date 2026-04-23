import { renderHTML, typingArea, renderResult } from "./generateHTML.js";
import { stopTying, setResult  , wpmDisplay , accuracyDisplay} from "./typing.js";

const startBtn = document.querySelector("#start-btn");
const easyBtn = document.querySelector("#easy");
const mediumBtn = document.querySelector("#medium");
const hardBtn = document.querySelector("#hard");
const timer = document.querySelector("#timer");
const best = document.querySelector("#best");
export const hiddenInput = document.querySelector("#hidden-input");


const btns = [easyBtn, mediumBtn, hardBtn];
let difficultLevel = "hard";
let time = 60;
let timeTook = 60;
let interval = null;

export function setTimer() {
  clearInterval(interval);
  time = 60;
  timer.textContent = `0:${time.toString().padStart(2, "0")}`;

  interval = setInterval(() => {
    time--;
    timer.textContent = `0:${time.toString().padStart(2, "0")}`;
    if (time === 0) {
      clearInterval(interval);
      interval = null;
      stopTying();
      const { WPM, Accuracy, correctChar, incorrectChar } = setResult(timeTook);
      renderResult(WPM, Accuracy, correctChar, incorrectChar);
    }
  }, 1000);
}

export function setActive(btn = hardBtn) {
  btns.forEach((button) => {
    button.classList.remove("active");
  });
  btn.classList.add("active");
}

export function personal_Best() {
  const score = Number(localStorage.getItem("personalBest"));
  if (score) {
    best.innerHTML = `<img src="icons/icon-personal-best.svg" alt=""> Personal best: <span>${score}</span>`;
  } else {
    best.innerHTML = `<img src="icons/icon-personal-best.svg" alt=""> Personal best: <span></span>`;
  }
}

personal_Best();

function focusHiddenInput() {
  setTimeout(() => {
    hiddenInput?.focus();
  }, 50);
}

startBtn.addEventListener("click", () => {
  setActive(hardBtn);
  renderHTML(difficultLevel);
  setTimer();
  focusHiddenInput();
});

easyBtn.addEventListener("click", () => {
  difficultLevel = "easy";
  setActive(easyBtn);
  renderHTML(difficultLevel);
  setTimer();
  focusHiddenInput();
});

mediumBtn.addEventListener("click", () => {
  difficultLevel = "medium";
  setActive(mediumBtn);
  renderHTML(difficultLevel);
  setTimer();
  focusHiddenInput();
});

hardBtn.addEventListener("click", () => {
  difficultLevel = "hard";
  setActive(hardBtn);
  renderHTML(difficultLevel);
  setTimer();
  focusHiddenInput();
});

typingArea.addEventListener("click", (e) => {
  focusHiddenInput();

  if (e.target.closest(".btn-reset")) {
    setTimer();
    setActive(
      btns.find((button) => {
        return button.classList.contains("active");
      })
    );
    renderHTML(difficultLevel);
    wpmDisplay.textContent = "";
    accuracyDisplay.textContent = "";
  }
});


