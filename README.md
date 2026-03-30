# GRAFFKIT.

Graffkit turns a tag into professional-grade graffiti without asking the user to write a prompt. The UI translates intent (style, complexity, palette, extras) into a consistent OpenAI `gpt-image-1.5` request, emulating a graffiti pack that crews can trust.

## Features

- Hero form layer with text input, CAPS/tag/readable toggles, style cards, palette presets + manual color pickers, slider-based complexity, line style chips, background choices and extra effects.
- Live preview area showing the resulting mural, status copy, CTA buttons (`Drop your tag.`, `Download HD`) plus badges that reinforce the Graffkit system.
- Prompt preview box and monetization thoughts (free tier, premium packs, batch generation) to keep the product story on-brand.
- Server component at `/api/generate` builds the structured prompt and forwards it to OpenAI Images (`gpt-image-1.5`).

## Getting started

1. Install dependencies:

```bash
npm install
```

2. Set the OpenAI API key:

```bash
export OPENAI_API_KEY=sk-...
```

3. Run the dev server:

```bash
npm run dev
```

Open http://localhost:3000 to interact with the Graffkit UI.

## API contract

- `POST /api/generate` expects `{ config: PromptConfig }` in the body (text, style, complexity, lineStyle, colors, features, background).
- The server calls OpenAI Images (`gpt-image-1.5`) and returns `{ image: string | null }` with the generated URL.

## Deploying

1. Push to a Git repo.
2. On Vercel, add the `OPENAI_API_KEY` environment variable and deploy the project.
3. Every push will keep the preview consistent with the Graffkit brand.
