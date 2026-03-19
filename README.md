# Trotter

**Trotter** is a simple, pocket-sized race timing app. Time 5ks, marathons, and more from your phone—no bulky equipment.

- **App**: React Native (Expo), TypeScript
- **Planning**: See [docs/](./docs/)

## Project structure

```
EventTimer/           # repo root
├── trotter/          # Trotter app (Expo)
├── docs/             # planning & design
└── android-legacy/   # old EventTimer Android app (reference only)
```

## Run the app

```bash
cd trotter
npm run ios      # iOS Simulator
npm run android  # Android emulator
npm run web      # web (dev)
```

## Development

- **Milestone 1**: Project setup + Events list ← *you are here*
- See [docs/05-MVP-SCOPE.md](./docs/05-MVP-SCOPE.md) for full roadmap.

## Legacy

The original Android app lives in `android-legacy/`. It’s kept for reference only. You can delete that folder once Trotter is stable and you no longer need it (see [docs/05-MVP-SCOPE.md](./docs/05-MVP-SCOPE.md)).
