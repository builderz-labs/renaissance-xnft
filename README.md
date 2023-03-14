# XRAY

A human-readable Solana transaction explorer powered by Helius.

🔗 **Link**: <https://builderz.dev>

🎥 **Demo**: <https://vimeo.com/808021937>

🐤 **Twitter**: <https://twitter.com/renaissance_xyz>

💬 **Discord**: <https://discord.gg/eMKXtKu6P9>

## 🤝 Contribute

- Fork Rennaisance onto your own GitHub
- Clone it and checkout the dev branch (`git checkout dev`)
- Create a new branch named `[initials]/[feature]` off of `dev`. Example `q/added-a-cool-thing`.
- When ready for us to review your changes, create a PR with your new branch to be merged into the `dev` branch on the official xNFT.

### Recommended VSCode Extensions

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [Better Comments](https://marketplace.visualstudio.com/items?itemName=aaron-bond.better-comments)

### Tech Stack

- [Node](https://nodejs.org/en/)
- [TypeScript](https://www.typescriptlang.org/)
- [tRPC](https://trpc.io/)
- [TanstackQuery](https://tanstack.com/query/latest)
- [Tailwind](https://tailwindcss.com/)
- [DaisyUI Components](https://daisyui.com/)
- [Material UI](https://mui.com)

### Setup Environment

In the root of the project, create a `.env` file with the values mentioned in `.env.template`.

### Install

Run the install command from the root of the project to install dependencies for all apps and packages.

```sh
npm install
```

### Dev

Start all packages and apps in dev mode which watches for changes and adds your local environment.

```sh
yarn
```

### Lint

It's recommended you use VSCode because if you do, ESLint is setup to auto fix/format as you're working.

```sh
yarn lint
```

### Format

Formats files based on the Prettier and ESlint settings.

```sh
yarn
```

### Test

Tests the code, determines if it should be allowed to merge. We recommend running this locally before creating PRs.

```sh
yarn
```

### Build

Build all apps and packages for production.

```sh
yarn build
```

## Styles

[TailwindCSS](https://tailwindcss.com/) is used for base utilies and [DaisyUI](https://daisyui.com/) contains helpful UI components.

## Icons

Material Icons
