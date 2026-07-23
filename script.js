"use strict";

const filledCircleNumbers = [
  "⓿", "❶", "❷", "❸", "❹", "❺", "❻", "❼",
  "❽", "❾", "❿", "⓫", "⓬", "⓭", "⓮", "⓯"
];

const outlineCircleNumbers = [
  "⓪", "①", "②", "③", "④", "⑤", "⑥", "⑦",
  "⑧", "⑨", "⑩", "⑪", "⑫", "⑬", "⑭", "⑮"
];

const superscriptMap = {
  "0": "⁰",
  "1": "¹",
  "2": "²",
  "3": "³",
  "4": "⁴",
  "5": "⁵",
  "6": "⁶",
  "7": "⁷",
  "8": "⁸",
  "9": "⁹"
};

const state = {
  attack: 12,
  defense: 15,
  hp: 12,
  circleStyle: "filled",
  theme: "light"
};

const pokemonNameInput = document.getElementById("pokemonName");
const preview = document.getElementById("preview");
const ivNumber = document.getElementById("ivNumber");
const statTotal = document.getElementById("statTotal");
const copyStatus = document.getElementById("copyStatus");
const themeToggle = document.getElementById("themeToggle");
const themeIcon = themeToggle.querySelector(".theme-icon");
const themeText = themeToggle.querySelector(".theme-text");
const themeColorMeta = document.querySelector('meta[name="theme-color"]');

const statConfig = {
  attack: {
    container: document.getElementById("attackButtons"),
    output: document.getElementById("attackValue")
  },
  defense: {
    container: document.getElementById("defenseButtons"),
    output: document.getElementById("defenseValue")
  },
  hp: {
    container: document.getElementById("hpButtons"),
    output: document.getElementById("hpValue")
  }
};


function applyTheme(theme, persist = true) {
  state.theme = theme;
  document.documentElement.dataset.theme = theme;
  const isDark = theme === "dark";

  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute("aria-label", isDark ? "切換淺色模式" : "切換深色模式");
  themeIcon.textContent = isDark ? "☀" : "☾";
  themeText.textContent = isDark ? "淺色" : "深色";
  themeColorMeta.setAttribute("content", isDark ? "#102a48" : "#58d4ff");

  if (persist) {
    localStorage.setItem("pogo-iv-theme", theme);
  }
}

function initializeTheme() {
  const savedTheme = localStorage.getItem("pogo-iv-theme");
  const systemPrefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  applyTheme(savedTheme || (systemPrefersDark ? "dark" : "light"), false);
}

function toSuperscript(value) {
  return String(value)
    .split("")
    .map((digit) => superscriptMap[digit] ?? digit)
    .join("");
}

function calculateIV() {
  const total = state.attack + state.defense + state.hp;
  return Math.round((total / 45) * 100);
}

function getCircleSymbols() {
  return state.circleStyle === "filled"
    ? filledCircleNumbers
    : outlineCircleNumbers;
}

function buildName() {
  const circles = getCircleSymbols();
  const iv = calculateIV();

  return [
    pokemonNameInput.value,
    toSuperscript(iv),
    circles[state.attack],
    circles[state.defense],
    circles[state.hp]
  ].join("");
}

function updateDisplay() {
  const total = state.attack + state.defense + state.hp;
  const iv = calculateIV();

  ivNumber.textContent = iv;
  statTotal.textContent = `${total} / 45`;

  Object.entries(statConfig).forEach(([key, config]) => {
    config.output.textContent = state[key];

    config.container.querySelectorAll(".number-button").forEach((button) => {
      const isActive = Number(button.dataset.value) === state[key];
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  });

  preview.textContent = buildName() || "請輸入名稱";
}

function createStatButtons(statName) {
  const container = statConfig[statName].container;

  for (let value = 0; value <= 15; value += 1) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "number-button";
    button.dataset.value = String(value);
    button.textContent = String(value);
    button.setAttribute("aria-label", `${statName} ${value}`);

    button.addEventListener("click", () => {
      state[statName] = value;
      updateDisplay();
    });

    container.appendChild(button);
  }
}

function setCircleStyle(style) {
  state.circleStyle = style;

  document
    .getElementById("filledStyle")
    .classList.toggle("active", style === "filled");

  document
    .getElementById("outlineStyle")
    .classList.toggle("active", style === "outline");

  updateDisplay();
}

async function copyGeneratedName() {
  const text = buildName();

  if (!text) {
    copyStatus.textContent = "請先輸入寶可夢名稱。";
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    copyStatus.textContent = `已複製：${text}`;
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();

    const copied = document.execCommand("copy");
    textarea.remove();

    copyStatus.textContent = copied
      ? `已複製：${text}`
      : "無法自動複製，請長按預覽文字手動複製。";
  }

  window.setTimeout(() => {
    copyStatus.textContent = "";
  }, 2200);
}

function resetGenerator() {
  pokemonNameInput.value = "";
  state.attack = 0;
  state.defense = 0;
  state.hp = 0;
  state.circleStyle = "filled";
  setCircleStyle("filled");
  updateDisplay();
}

Object.keys(statConfig).forEach(createStatButtons);

pokemonNameInput.addEventListener("input", updateDisplay);
document
  .getElementById("filledStyle")
  .addEventListener("click", () => setCircleStyle("filled"));
document
  .getElementById("outlineStyle")
  .addEventListener("click", () => setCircleStyle("outline"));
document
  .getElementById("copyButton")
  .addEventListener("click", copyGeneratedName);
document
  .getElementById("resetButton")
  .addEventListener("click", resetGenerator);

themeToggle.addEventListener("click", () => {
  applyTheme(state.theme === "dark" ? "light" : "dark");
});

initializeTheme();
updateDisplay();
