// Kid-friendly speak-button characters.
// Each character is a self-contained block of markup injected into the
// `.speak-visual` container. Animations are driven purely by CSS reacting to
// the `.key.speak.speaking` class, so no per-character JS is required.

export const DEFAULT_CHARACTER = "trex";

const STORAGE_KEY = "speakCharacter";

// Order here is the order shown in the settings picker.
export const CHARACTERS = [
  { id: "robot", label: "Robot", emoji: "🤖" },
  { id: "trex", label: "T-Rex", emoji: "🦖" },
  { id: "poop", label: "Talking Poop", emoji: "💩" },
  { id: "monster", label: "Monster", emoji: "👾" },
  { id: "superhero", label: "Superhero", emoji: "🦸" },
  { id: "car", label: "Race Car", emoji: "🏎️" },
];

const CHARACTER_IDS = new Set(CHARACTERS.map((character) => character.id));

const CHARACTER_MARKUP = {
  robot: `
    <div class="char char-robot">
      <span class="robot-antenna"></span>
      <div class="robot-head">
        <span class="robot-eye robot-eye-left"></span>
        <span class="robot-eye robot-eye-right"></span>
        <span class="robot-mouth"></span>
      </div>
    </div>
  `,
  trex: `
    <div class="char char-trex">
      <div class="trex">
        <span class="trex-tail"></span>
        <div class="trex-body">
          <span class="trex-arm"></span>
        </div>
        <span class="trex-leg trex-leg-back"></span>
        <span class="trex-leg trex-leg-front"></span>
        <div class="trex-head">
          <span class="trex-eye"></span>
          <span class="trex-nostril"></span>
          <span class="trex-upper-teeth"></span>
        </div>
        <div class="trex-jaw">
          <span class="trex-lower-teeth"></span>
        </div>
      </div>
    </div>
  `,
  poop: `
    <div class="char char-poop">
      <div class="poop-body">
        <span class="poop-eye poop-eye-left"></span>
        <span class="poop-eye poop-eye-right"></span>
        <span class="poop-mouth"></span>
      </div>
    </div>
  `,
  monster: `
    <div class="char char-monster">
      <span class="monster-horn monster-horn-left"></span>
      <span class="monster-horn monster-horn-right"></span>
      <div class="monster-body">
        <span class="monster-eye"></span>
        <span class="monster-mouth"></span>
      </div>
      <span class="monster-foot monster-foot-left"></span>
      <span class="monster-foot monster-foot-right"></span>
    </div>
  `,
  superhero: `
    <div class="char char-superhero">
      <span class="hero-cape"></span>
      <div class="hero-head">
        <span class="hero-mask"></span>
        <span class="hero-eye hero-eye-left"></span>
        <span class="hero-eye hero-eye-right"></span>
        <span class="hero-mouth"></span>
      </div>
    </div>
  `,
  car: `
    <div class="char char-car">
      <div class="car-body">
        <span class="car-roof"></span>
        <span class="car-eye car-eye-left"></span>
        <span class="car-eye car-eye-right"></span>
        <span class="car-mouth"></span>
      </div>
      <span class="car-wheel car-wheel-left"></span>
      <span class="car-wheel car-wheel-right"></span>
    </div>
  `,
};

export function isValidCharacter(id) {
  return CHARACTER_IDS.has(id);
}

export function getStoredCharacter() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored && isValidCharacter(stored) ? stored : DEFAULT_CHARACTER;
}

export function saveCharacter(id) {
  if (isValidCharacter(id)) {
    localStorage.setItem(STORAGE_KEY, id);
  }
}

// Swap the markup inside the speak button's `.speak-visual` container and
// tag the button so styling/state can key off the active character.
export function renderCharacter(speakButton, id) {
  if (!speakButton) {
    return;
  }
  const character = isValidCharacter(id) ? id : DEFAULT_CHARACTER;
  const visual = speakButton.querySelector(".speak-visual");
  if (visual) {
    visual.innerHTML = CHARACTER_MARKUP[character].trim();
  }
  speakButton.dataset.character = character;
}
