"use client";

import { useMemo, useState } from "react";
import { buildPrompt } from "../lib/buildPrompt";

const styleOptions = [
  { name: "Wildstyle", description: "arrows, extensions and high energy" },
  { name: "Bubble", description: "round, cartoon warmth" },
  { name: "Throw-up", description: "fast lines, two-tone fills" },
  { name: "Block letters", description: "solid weight and stacked form" },
  { name: "Calligraphy", description: "flowing strokes and motion" },
  { name: "3D graffiti", description: "depth, bevels, and shadows" },
  { name: "Stencil", description: "crispy edges, spray edges" },
  { name: "Street raw", description: "grime, drips, raw texture" },
];

const paletteOptions = [
  {
    name: "Neon",
    description: "hot pink, cyan glow, electric highlights",
    swatches: ["#FF3C1A", "#0D0D0D", "#00C2A8", "#FFD600"],
  },
  {
    name: "Classic",
    description: "red/orange energy with inky shadow",
    swatches: ["#FF3C1A", "#FFD600", "#0D0D0D", "#F5F0E8"],
  },
  {
    name: "Ocean",
    description: "teals, greens, and misty concrete",
    swatches: ["#00C2A8", "#008080", "#F5F0E8", "#3A3A3A"],
  },
  {
    name: "Fire",
    description: "burnt orange, yellow flare, ash",
    swatches: ["#FF3C1A", "#FFD600", "#3A3A3A", "#0D0D0D"],
  },
  {
    name: "Pastel",
    description: "soft fills with neon contrast",
    swatches: ["#F5F0E8", "#FFD600", "#00C2A8", "#FF3C1A"],
  },
  {
    name: "Dark mode",
    description: "black field with glow accents",
    swatches: ["#0D0D0D", "#3A3A3A", "#00C2A8", "#FF3C1A"],
  },
];

const lineStyles = [
  "Smooth clean",
  "Rough spray",
  "Drips heavy",
  "Sketch style",
  "Calligraphy stroke",
];

const backgroundOptions = [
  { name: "Brick wall", description: "classic mortar & bricks" },
  { name: "Concrete wall", description: "weathered gray with streaks" },
  { name: "Train", description: "metallic panel with rivets" },
  { name: "Black studio", description: "logo-grade neutral field" },
  { name: "Transparent", description: "PNG-ready isolation" },
];

const featureOptions = [
  "Drips",
  "Glow",
  "Shadows",
  "3D depth",
  "Paint splatter",
  "Outline heavy",
];

const badgeVariants = [
  { label: "Generate", variant: "primary" },
  { label: "Download HD", variant: "ink" },
  { label: "Wildstyle", variant: "ghost" },
  { label: "Bubble", variant: "ghost" },
  { label: "Throw-up", variant: "ghost" },
];

const monetizationNotes = [
  "5 images free / day to keep the flow going",
  "Premium unlocks HD, transparent PNGs, remix history",
  "Batch generation & tag packs for crews",
  "Pro graffiti pack adds advanced stencils + textures",
];

const sliderCopy = (value: number) => {
  if (value <= 2) return "Logo-like precision";
  if (value <= 5) return "Wildstyle in control";
  if (value <= 8) return "Chaos with structure";
  return "Total chaos for pros";
};

export default function Home() {
  const [text, setText] = useState("Mateus");
  const [allCaps, setAllCaps] = useState(true);
  const [tagStyle, setTagStyle] = useState(false);
  const [cleanRead, setCleanRead] = useState(true);
  const [selectedStyle, setSelectedStyle] = useState(styleOptions[0].name);
  const [selectedPalette, setSelectedPalette] = useState(paletteOptions[0].name);
  const [primaryColor, setPrimaryColor] = useState(paletteOptions[0].swatches[0]);
  const [secondaryColor, setSecondaryColor] = useState(paletteOptions[0].swatches[1]);
  const [complexity, setComplexity] = useState(7);
  const [lineStyle, setLineStyle] = useState(lineStyles[0]);
  const [background, setBackground] = useState(backgroundOptions[0].name);
  const [features, setFeatures] = useState<string[]>(["Glow", "Drips", "Shadows"]);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState("Drop your tag. No prompt needed.");

  const displayText = useMemo(() => {
    const trimmed = text.trim();
    const safe = trimmed || "GRAFFKIT";
    return allCaps ? safe.toUpperCase() : safe;
  }, [text, allCaps]);

  const activeFeatures = useMemo(() => {
    const set = new Set(features);
    if (tagStyle) {
      set.add("Tag-style illegibility");
    }
    if (cleanRead) {
      set.add("Clean readability");
    } else {
      set.add("Raw spray texture");
    }
    return Array.from(set);
  }, [features, tagStyle, cleanRead]);

  const promptPreview = useMemo(() => {
    return buildPrompt({
      text: displayText,
      style: selectedStyle,
      complexity,
      lineStyle,
      colors: `${selectedPalette} palette (${primaryColor}, ${secondaryColor})`,
      features: activeFeatures,
      background,
    });
  }, [
    displayText,
    selectedStyle,
    complexity,
    lineStyle,
    primaryColor,
    secondaryColor,
    selectedPalette,
    activeFeatures,
    background,
  ]);

  const handlePaletteSelect = (
    palette: (typeof paletteOptions)[number]
  ) => {
    setSelectedPalette(palette.name);
    setPrimaryColor(palette.swatches[0]);
    setSecondaryColor(palette.swatches[1] ?? palette.swatches[0]);
  };

  const handleFeatureToggle = (feature: string) => {
    setFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((item) => item !== feature)
        : [...prev, feature]
    );
  };

  const handleGenerate = async () => {
    setLoading(true);
    setStatusMessage("On the wall in 3…");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          config: {
            text: displayText,
            style: selectedStyle,
            complexity,
            lineStyle,
            colors: `${selectedPalette} palette (${primaryColor}, ${secondaryColor})`,
            features: activeFeatures,
            background,
          },
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error ?? "Image generation failed");
      }

      setImageUrl(payload.image ?? null);
      setStatusMessage("There it is.");
    } catch (error) {
      console.error(error);
      setStatusMessage("Didn't land — try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-concrete text-ink">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-12">
        <header className="space-y-4">
          <p className="font-display text-xs uppercase tracking-[0.4em] text-shadow">
            GRAFFKIT.
          </p>
          <h1 className="font-display text-5xl uppercase tracking-[0.25em] text-ink">
            YOUR TAG. YOUR STYLE. NO PROMPT NEEDED.
          </h1>
          <p className="max-w-3xl text-sm font-mono leading-relaxed text-shadow">
            Drop your tag, dial in style, palette and chaos level, then hit generate. The UI
            translates your intention into a premium graffiti prompt and keeps the drop simple.
          </p>
        </header>

        <div className="rounded-3xl border border-shadow/40 bg-concrete p-6 shadow-[0_25px_80px_rgba(10,10,10,0.08)]">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="space-y-8">
              <div className="space-y-2">
                <label className="font-mono text-xs uppercase tracking-[0.3em] text-shadow">
                  Tag
                </label>
                <input
                  className="w-full rounded-md border border-shadow/40 bg-white px-4 py-3 text-3xl font-display tracking-[0.5em] text-ink shadow-sm"
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  placeholder="Mateus"
                />
                <div className="flex flex-wrap gap-3 text-[0.7rem] uppercase tracking-[0.4em]">
                  {[
                    { label: "ALL CAPS", state: allCaps, toggle: () => setAllCaps((prev) => !prev) },
                    { label: "Tag style", state: tagStyle, toggle: () => setTagStyle((prev) => !prev) },
                    { label: "Clean readable", state: cleanRead, toggle: () => setCleanRead((prev) => !prev) },
                  ].map((option) => (
                    <button
                      key={option.label}
                      type="button"
                      onClick={option.toggle}
                      className={`rounded-lg border px-3 py-1 text-xs tracking-[0.2em] transition ${
                        option.state
                          ? "border-spray bg-spray text-white"
                          : "border-shadow/30 bg-white text-ink"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-shadow">
                  Style
                </p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {styleOptions.map((style) => (
                    <button
                      key={style.name}
                      type="button"
                      onClick={() => setSelectedStyle(style.name)}
                      className={`group flex flex-col gap-1 rounded-2xl border px-4 py-3 text-left transition ${
                        selectedStyle === style.name
                          ? "border-spray bg-ink/90 text-white"
                          : "border-shadow/30 bg-white text-ink"
                      }`}
                    >
                      <span className="font-display text-lg tracking-[0.2em]">{style.name}</span>
                      <span className="text-xs uppercase tracking-[0.35em] text-shadow">
                        {style.description}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-shadow">
                  Palette & colors
                </p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {paletteOptions.map((palette) => (
                    <button
                      key={palette.name}
                      type="button"
                      onClick={() => handlePaletteSelect(palette)}
                      className={`flex flex-col gap-1 rounded-2xl border px-4 py-3 text-left transition ${
                        selectedPalette === palette.name
                          ? "border-spray bg-ink/90 text-white"
                          : "border-shadow/30 bg-white text-ink"
                      }`}
                    >
                      <div className="flex gap-1">
                        {palette.swatches.map((swatch) => (
                          <span
                            key={swatch}
                            className="h-6 w-6 rounded-full border border-white/40"
                            style={{ backgroundColor: swatch }}
                          />
                        ))}
                      </div>
                      <span className="font-display text-sm tracking-[0.3em]">
                        {palette.name}
                      </span>
                      <span className="text-[0.6rem] uppercase tracking-[0.3em] text-shadow">
                        {palette.description}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-4 text-xs uppercase tracking-[0.4em] text-shadow">
                  <label className="flex items-center gap-2">
                    Primary
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(event) => setPrimaryColor(event.target.value)}
                      className="h-8 w-12 cursor-pointer rounded-lg border border-shadow/40 bg-transparent p-0"
                    />
                  </label>
                  <label className="flex items-center gap-2">
                    Accent
                    <input
                      type="color"
                      value={secondaryColor}
                      onChange={(event) => setSecondaryColor(event.target.value)}
                      className="h-8 w-12 cursor-pointer rounded-lg border border-shadow/40 bg-transparent p-0"
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-3">
                <p className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-shadow">
                  Complexity
                </p>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={complexity}
                  onChange={(event) => setComplexity(Number(event.target.value))}
                  className="w-full accent-spray"
                />
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-shadow">
                  <span>{complexity} / 10</span>
                  <span>{sliderCopy(complexity)}</span>
                </div>
              </div>

              <div>
                <p className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-shadow">
                  Line style
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {lineStyles.map((line) => (
                    <button
                      key={line}
                      type="button"
                      onClick={() => setLineStyle(line)}
                      className={`rounded-full border px-4 py-2 text-[0.65rem] uppercase tracking-[0.35em] transition ${
                        lineStyle === line
                          ? "border-spray bg-spray text-white"
                          : "border-shadow/30 bg-white text-ink"
                      }`}
                    >
                      {line}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-shadow">
                  Background
                </p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {backgroundOptions.map((item) => (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => setBackground(item.name)}
                      className={`rounded-2xl border px-4 py-3 text-left transition ${
                        background === item.name
                          ? "border-spray bg-ink/90 text-white"
                          : "border-shadow/30 bg-white text-ink"
                      }`}
                    >
                      <p className="font-display text-sm uppercase tracking-[0.4em]">
                        {item.name}
                      </p>
                      <p className="text-[0.6rem] uppercase tracking-[0.3em] text-shadow">
                        {item.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-shadow">
                  Extras
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {featureOptions.map((feature) => (
                    <button
                      key={feature}
                      type="button"
                      onClick={() => handleFeatureToggle(feature)}
                      className={`rounded-full border px-4 py-2 text-[0.7rem] uppercase tracking-[0.35em] transition ${
                        features.includes(feature)
                          ? "border-spray bg-spray/90 text-white"
                          : "border-shadow/30 bg-white text-ink"
                      }`}
                    >
                      {feature}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="rounded-2xl border border-shadow/50 bg-ink/95 p-5 text-shadow shadow-[0_20px_45px_rgba(10,10,10,0.5)]">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-concrete">
                  <span>Preview</span>
                  <span>{background}</span>
                </div>
                <div
                  className="mt-4 h-72 w-full rounded-2xl border border-white/10 bg-cover bg-center"
                  style={{
                    backgroundImage: imageUrl
                      ? `linear-gradient(180deg, rgba(13,13,13,0.4), rgba(13,13,13,0.9)), url(${imageUrl})`
                      : "linear-gradient(145deg, rgba(255,60,26,0.2), rgba(0,194,168,0.12))",
                  }}
                >
                  {loading && (
                    <div className="flex h-full items-center justify-center text-sm tracking-[0.3em] text-concrete">
                      On the wall in 3…
                    </div>
                  )}
                </div>
                <p className="mt-4 text-[0.75rem] uppercase tracking-[0.4em] text-concrete">
                  {statusMessage}
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleGenerate}
                    className="flex-1 rounded-full bg-spray px-5 py-3 text-[0.8rem] uppercase tracking-[0.5em] text-white transition disabled:opacity-60"
                    disabled={loading}
                  >
                    Drop your tag.
                  </button>
                  <button
                    type="button"
                    className="flex-1 rounded-full border border-white/40 px-5 py-3 text-[0.7rem] uppercase tracking-[0.4em] text-white"
                    disabled={!imageUrl}
                  >
                    Download HD
                  </button>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 text-[0.65rem] uppercase tracking-[0.4em] text-concrete">
                  {badgeVariants.map((badge) => (
                    <span
                      key={badge.label}
                      className={`rounded-full px-3 py-1 text-xs tracking-[0.4em] ${
                        badge.variant === "primary"
                          ? "bg-spray text-white"
                          : badge.variant === "ink"
                            ? "bg-ink text-white"
                            : "border border-white/20 text-white"
                      }`}
                    >
                      {badge.label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-3 rounded-2xl border border-shadow/30 bg-white/90 p-5">
                <p className="font-mono text-[0.6rem] uppercase tracking-[0.4em] text-shadow">
                  Prompt preview
                </p>
                <textarea
                  readOnly
                  value={promptPreview}
                  className="h-32 w-full rounded-2xl border border-shadow/40 bg-black/5 p-3 text-[0.7rem] leading-relaxed text-ink"
                />
              </div>

              <div className="space-y-2 rounded-2xl border border-shadow/30 bg-white/90 p-5">
                <p className="font-mono text-[0.6rem] uppercase tracking-[0.4em] text-shadow">
                  Monetization
                </p>
                <ul className="space-y-2 text-[0.7rem] text-ink">
                  {monetizationNotes.map((note) => (
                    <li key={note} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-ink" />
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
