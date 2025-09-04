# Chaitanya AI — Phase 2 (Private Beta)

A lightweight, futuristic **static web UI** for Project Indian AI (Chaitanya).
This phase adds:
- Voice input (Web Speech API), TTS replies
- Themed neon UI with hero + chat console
- Weather widget via **Open‑Meteo** (no API key)
- Local intro (name + gender) with respectful addressing
- Simple Q&A router (demo) and placeholders for future apps
- Export chat as PDF (basic)

## Deploy (GitHub → Vercel)
1. Upload these 3 files to your GitHub repo root: `index.html`, `style.css`, `script.js`  
2. On Vercel: **New Project** → Import GitHub repo → Framework Preset: **Other** → Build Command: _(leave empty)_ → Output Directory: `/`  
3. Deploy. Done.

## Local dev
Just open `index.html` in your browser (no server required).

## Notes
- Phase 3 will swap the demo router with free knowledge adapters (Wikipedia, Open-Meteo, RSS) and bring the full dashboard look from your concept image.
