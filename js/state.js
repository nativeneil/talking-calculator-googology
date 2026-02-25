export const defaultVoiceSettings = {
  rate: 1,
  pitch: 1,
  volume: 1,
};

export function createDefaultFunProgress() {
  return {
    totalSpecialEvents: 0,
    rankIndex: 0,
    eventsSinceRankUp: 0,
    unlockedPackIds: ["A"],
    seenPhrasesByCategory: {},
    lastPhraseByCategory: {},
    pendingRankUpBanner: null,
  };
}

export function createCalculatorState() {
  return {
    tokens: [],
    currentInput: "",
    lastResult: "",
    lastExpression: "",
    lastAction: null,
    history: [],
    availableVoices: [],
    selectedVoiceName: "",
    voiceSettings: {
      ...defaultVoiceSettings,
    },
    funModeEnabled: true,
    funProgress: createDefaultFunProgress(),
    lastSpecialContext: null,
  };
}
