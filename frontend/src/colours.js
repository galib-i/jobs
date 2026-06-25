import colours from "tailwindcss/colors";

const stageColours = {
  application: colours.green[500],
  interview: colours.yellow[500],
  offer: colours.blue[500],
  rejected: colours.red[500],
  withdrawn: colours.slate[400],
};

const defaultColour = colours.yellow[500];

export const getStageColour = (stageName) => {
  if (!stageName) return defaultColour;

  const match = Object.entries(stageColours).find(([rule]) =>
    stageName.toLowerCase().includes(rule),
  );

  return match ? match[1] : defaultColour;
};

export const getStageTextColour = (bgColour) => {
  return bgColour === colours.yellow[500] ? colours.slate[800] : colours.white;
};
