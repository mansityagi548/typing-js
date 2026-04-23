import { hiddenInput, setTimer } from "./script.js";

let correctChar = 0;
let incorrectChar = 0;
let currentIndex = 0;
let handleTyping = null;
let handleMobileInput = null;

export const wpmDisplay = document.querySelector("#wpm");
export const accuracyDisplay = document.querySelector("#accuracy");

export function startTyping() {
  correctChar = 0;
  incorrectChar = 0;
  currentIndex = 0;

  if (hiddenInput) hiddenInput.removeEventListener("keydown", handleTyping);
  if (hiddenInput) hiddenInput.removeEventListener("input", handleMobileInput);

  const spans = document.querySelectorAll("#textDisplay span");

  handleTyping = function (e) {
    if (
      e.key === "Shift" ||
      e.key === "Alt" ||
      e.key === "Tab" ||
      e.key === "Control" ||
      e.key === "Meta" ||
      e.key === "ArrowLeft" ||
      e.key === "ArrowRight" ||
      e.key === "CapsLock"
    )
      return;

    if (!spans.length) return;

    if (e.key === "Backspace") {
      if (currentIndex === 0) return;
      currentIndex--;
      const prev = spans[currentIndex];
      if (prev.classList.contains("txt-success")) correctChar--;
      if (prev.classList.contains("txt-error")) incorrectChar--;
      prev.className = "txt-pending";

      document.querySelectorAll("#textDisplay .typing-cursor").forEach((c) => {
        c.remove();
      });
      const cursorIndex = spans[currentIndex];
      cursorIndex.insertAdjacentHTML(
        "beforebegin",
        `<span class="typing-cursor"></span>`,
      );
      return;
    }

    if (currentIndex >= spans.length) {
      return;
    } // this one is for when  it is completed  ;

    const index = spans[currentIndex];
    document.querySelectorAll("#textDisplay .typing-cursor").forEach((c) => {
      c.remove();
    });

    if (e.key === index.textContent) {
      index.className = "txt-success";
      correctChar++;
    } else {
      index.className = "txt-error";
      incorrectChar++;
    }

    currentIndex++;
    const totalTyped = correctChar + incorrectChar;
    const accuracyType =
      totalTyped === 0 ? 0 : Math.round((correctChar / totalTyped) * 100);
    wpmDisplay.textContent = Math.round(correctChar / 5);
    accuracyDisplay.textContent = accuracyType + "%";

    if (currentIndex < spans.length) {
      spans[currentIndex].insertAdjacentHTML(
        "beforebegin",
        '<span class="typing-cursor"></span>',
      );
    }
  };

    handleMobileInput = function (e) {
    if (e.inputType === "deleteContentBackward") {
      processBackspace();
    } else if (e.data) {
      for (let char of e.data) {
        processChar(char);
      }
    }
    hiddenInput.value = "";
  };

  if (hiddenInput) {
    hiddenInput.addEventListener("keydown", handleTyping);
    hiddenInput.addEventListener("input", handleMobileInput);
    hiddenInput.focus();
  }
}

export function stopTying() {
  if (handleTyping && hiddenInput) {
    hiddenInput.removeEventListener("keydown", handleTyping);
    handleTyping = null;
  }
  if (handleMobileInput && hiddenInput) {
    hiddenInput.removeEventListener("input", handleMobileInput);
    handleMobileInput = null;
  }
}

export function setResult(timeTaken) {
  const timeMinutes = timeTaken / 60;
  let WPM = Math.round(correctChar / 5 / timeMinutes);
  let totalChar = correctChar + incorrectChar;
  let Accuracy =
    totalChar === 0 ? 0 : Math.round((correctChar / totalChar) * 100);
  return { WPM, Accuracy, correctChar, incorrectChar };
}
