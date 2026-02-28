import { getNextLesson } from "./special-math.js";

const UNKNOWN_SPEECH = "unknown number - error error error";
const MEME_SIXTY_SEVEN_SPEECH = "six seven";

let infinitySpeakPressCount = 0;
let lastDisplayWasInfinity = false;

function makeSpeechFriendlyUtteranceText(text) {
  return text.replace(/\b[a-z]+illion\b/gi, (word) => {
    if (!/milli/i.test(word) || word.length < 15) {
      return word;
    }
    return word
      .replace(/milli/gi, " milli ")
      .replace(/\s+/g, " ")
      .trim();
  });
}

export function buildSpeechText({
  currentInput,
  lastResult,
  displayText,
  specialContext,
  funModeEnabled = true,
  numberToWords,
  isAutoSpeak = false,
}) {
  const rawValue = currentInput || lastResult || (displayText || "").trim();
  if (!rawValue) {
    return "";
  }

  const normalizedNumeric = rawValue.trim().replace(/,/g, "");

  const isInfinityResult =
    specialContext?.kind === "infinity" || specialContext?.kind === "negative_infinity";
  const isNegInfinity = specialContext?.kind === "negative_infinity";

  // Reset infinity speak state when display changes to non-infinity
  if (!isInfinityResult) {
    infinitySpeakPressCount = 0;
    lastDisplayWasInfinity = false;
  }

  if (specialContext?.speech) {
    if (funModeEnabled) {
      // FOR SIX SEVEN:
      // - on auto-speak (equals): just say "six seven"
      // - on manual speak (peak): say "six seven" + the result (e.g. forty two)
      if (specialContext.kind === "meme_6_7" || specialContext.kind === "meme_67") {
        if (isAutoSpeak) {
          return specialContext.speech;
        }
        return specialContext.speech + " " + numberToWords(normalizedNumeric);
      }

      // INFINITY SPEECH REWORK:
      // - auto-speak (equals): speak the educational lesson
      // - manual speak, 1st press on new infinity: just say "infinity" / "negative infinity"
      // - manual speak, subsequent: cycle through funny quips
      if (isInfinityResult) {
        if (isAutoSpeak) {
          // On equals, speak the lesson (already set as specialContext.speech)
          lastDisplayWasInfinity = true;
          infinitySpeakPressCount = 0;
          return specialContext.speech;
        }
        // Manual speak button
        infinitySpeakPressCount++;
        if (!lastDisplayWasInfinity) {
          // First press on a new infinity result
          lastDisplayWasInfinity = true;
          return isNegInfinity ? "negative infinity" : "infinity";
        }
        if (infinitySpeakPressCount === 1) {
          // First manual press after auto-speak already said the lesson
          return isNegInfinity ? "negative infinity" : "infinity";
        }
        // Subsequent presses: cycle through quips
        const quipKey = isNegInfinity ? "quips_negative_infinity" : "quips_infinity";
        return getNextLesson(quipKey);
      }

      return numberToWords(normalizedNumeric) + ". " + specialContext.speech;
    }
    return specialContext.speech;
  }

  if (funModeEnabled) {
    const digits = normalizedNumeric.replace(/[^0-9]/g, "");
    if (digits.includes("67")) {
      return "six seven " + numberToWords(normalizedNumeric);
    }
  }

  const normalizedRaw = rawValue.trim();
  const normalized = normalizedRaw.toLowerCase();
  if (normalized === "infinity" || normalized === "+infinity") {
    return "infinity";
  }
  if (normalized === "-infinity") {
    return "negative infinity";
  }
  if (normalized.includes("error") || normalized.includes("nan")) {
    return UNKNOWN_SPEECH;
  }

  return numberToWords(rawValue);
}

function setSpeakingState(speakButton, speaking) {
  if (!speakButton) {
    return;
  }
  if (speaking) {
    speakButton.classList.add("speaking");
  } else {
    speakButton.classList.remove("speaking");
  }
  const speakLabel = speakButton.querySelector(".speak-label");
  if (speakLabel) {
    speakLabel.textContent = speaking ? "Speaking" : "Speak";
  }
}

export function speakText({
  text,
  selectedVoiceName,
  voiceSettings,
  speakButton,
  speechSynthesis,
  SpeechSynthesisUtteranceCtor,
}) {
  if (!text || !speechSynthesis || !SpeechSynthesisUtteranceCtor) {
    return;
  }

  const speechText = makeSpeechFriendlyUtteranceText(text);
  speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtteranceCtor(speechText);
  const voices = speechSynthesis.getVoices();
  const selectedVoice = voices.find((voice) => voice.name === selectedVoiceName);
  const fallbackVoice = voices.find((voice) => voice.lang && voice.lang.startsWith("en-GB"));

  if (selectedVoice) {
    utterance.voice = selectedVoice;
  } else if (fallbackVoice) {
    utterance.voice = fallbackVoice;
  }

  utterance.rate = voiceSettings.rate;
  utterance.pitch = voiceSettings.pitch;
  utterance.volume = voiceSettings.volume;

  setSpeakingState(speakButton, true);

  utterance.onend = () => {
    setSpeakingState(speakButton, false);
  };

  utterance.onerror = () => {
    setSpeakingState(speakButton, false);
  };

  speechSynthesis.speak(utterance);
}

export { makeSpeechFriendlyUtteranceText, UNKNOWN_SPEECH, MEME_SIXTY_SEVEN_SPEECH };
