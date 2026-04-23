import { passages } from "./passage.js";
import { personal_Best  , setActive} from "./script.js";
import { startTyping  , wpmDisplay , accuracyDisplay} from "./typing.js";

export const typingArea = document.querySelector(".typing-area");
const original = typingArea.innerHTML;


function passageChoice(difficultLevel = "hard") {
  const arr = passages[difficultLevel];
  const arrIndex = Math.floor(Math.random() * arr.length);
  return arr[arrIndex];
}

function partyPopper(){
  const sound = new Audio("confetti_sound.mp3");
  sound.play();
  confetti({ particleCount: 1000, angle: 60, spread: 360, origin: { x: 0 } });
  confetti({ particleCount: 1000, angle: 120, spread: 360, origin: { x: 1 } });
}


export function renderHTML(level) {
  let passage = passageChoice(level);
 const chars =  passage.split("").map((char)=>{
    return `<span class="txt-pending">${char}</span>`
  }).join("");

  let passageHTML = "";

  passageHTML = `
     <section class="typing-active-wrapper">
  <div class="passage-display" id="textDisplay">
    ${chars}
  </div>
</section>

<footer class="action-footer">
  <button class="btn-reset">
    Restart Test 
    <svg class="refresh-icon" viewBox="0 0 24 24" width="16" height="16">
        <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" fill="currentColor"/>
    </svg>
  </button>
</footer>
    `;
  typingArea.innerHTML = passageHTML;
  startTyping();
}


export function renderResult(wpm , accuracy , correct , incorrect) {
  const personalBest = Number(localStorage.getItem("personalBest"));
  let title, subtitle, icon, btnText;

  if (!personalBest) {
    title = "Baseline Established!";
    subtitle =
      "You've set the bar. Now the real challenge begins—time to beat it.";
    icon = `<div class="success-icon">
            <span class="check"><img src="icons/icon-completed.svg" alt="" ></span>
        </div>`;
    btnText = "Beat This Score";

  } else if (personalBest > wpm) {
    title = "Test Complete!";
    subtitle = "Solid run. Keep pushing to beat your high score.";
    icon = `<div class="success-icon">
            <span class="check"><img src="icons/icon-completed.svg" alt="" ></span>
        </div>`;
    btnText = "Go Again";

  } else {
    title = "High Score Smashed!";
    subtitle = "You're getting faster. That was incredible typing.";
    icon = `<div class="celebration-icon">
                  <img src="icons/icon-new-pb.svg" alt="">
                </div>`;
    btnText = "Beat the score";

  }

  if(!personalBest || wpm > personalBest){
    localStorage.setItem("personalBest" , wpm);
    personal_Best();
  }

   const overlay = document.createElement("div");
  overlay.classList.add("result-overlay"); 

  
overlay.innerHTML = `
     <main class="results-wrapper">
        <div class="deco deco-left"><img src=" icons/pattern-star-2.svg" alt=""></div>
        <div class="deco deco-right"><img src="icons/pattern-star-1.svg" alt=""></div>
       ${icon}
        <h2>${title}</h2>
        <p class="subtitle">${subtitle}</p>

        <div class="stats-grid">
            <div class="stat-card">
                <span class="label">WPM:</span>
                <span class="value">${wpm}</span>
            </div>
            <div class="stat-card">
                <span class="label">Accuracy:</span>
                <span class="value text-red">${accuracy}%</span>
            </div>
            <div class="stat-card">
                <span class="label">Characters</span>
                <span class="value">
                    <span class="text-green">${correct}</span><span class="slash">/</span><span class="text-red">${incorrect}</span>
                </span>
            </div>
        </div>
        <button class="cta-button">
            Beat This Score ↺
        </button>
    </main>


  `
  document.body.appendChild(overlay);
  const btn = document.querySelector(".cta-button");
  btn.addEventListener("click" , ()=>{
    overlay.remove();
    renderHTML();
    setActive();
    wpmDisplay.textContent = "";
    accuracyDisplay.textContent = "";
  })

    if (wpm >= personalBest) {
    partyPopper();
  }
}



