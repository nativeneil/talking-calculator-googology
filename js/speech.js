const UNKNOWN_SPEECH = "unknown number - error error error";
const MEME_SIXTY_SEVEN_SPEECH = "six seven";

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
}) {
  const rawValue = currentInput || lastResult || (displayText || "").trim();
  if (!rawValue) {
    return "";
  }

  const normalizedNumeric = rawValue.trim().replace(/,/g, "");

  if (specialContext?.speech) {
    if (funModeEnabled) {
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
