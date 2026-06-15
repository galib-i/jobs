import colourConfig from "./colourConfig.json";

export const getStageColour = (stageName) => {
  if (!stageName) return colourConfig.defaultColour;

  const match = Object.entries(colourConfig.stageColours).find(([rule]) =>
    stageName.toLowerCase().includes(rule),
  );

  return match ? match[1] : colourConfig.defaultColour;
};
