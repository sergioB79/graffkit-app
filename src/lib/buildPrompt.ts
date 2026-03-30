export type PromptConfig = {
  text: string;
  style: string;
  complexity: number;
  lineStyle: string;
  colors: string;
  features: string[];
  background: string;
};

export function buildPrompt(config: PromptConfig) {
  const featureLine = config.features.length
    ? `${config.features.join(", ")},`
    : "clean finish,";

  return `Graffiti mural with the word "${config.text}", dynamic ${config.style} lettering with ${config.lineStyle} lines, complexity level ${config.complexity}/10, color palette: ${config.colors}, ${featureLine} dramatic outline, urban spray paint texture, ${config.background} background, high detail, professional graffiti artwork, centered composition.`;
}
