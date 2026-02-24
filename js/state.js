export const defaultVoiceSettings = {
  rate: 1,
  pitch: 1,
  volume: 1,
};

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
    lastSpecialContext: null,
  };
}
