# Re:naissance

A seamless Royalty Solution for NFT communities to track and redeem royalties 👑

Built on Backpack 🎒

![Renaissance](/public/screenshot1.png)

🔗 **Link**: <https://builderz.dev>

🎥 **Demo**: <https://vimeo.com/808021937>

🐤 **Twitter**: <https://twitter.com/renaissance_xyz>

💬 **Discord**: <https://discord.gg/eMKXtKu6P9>

## 🤝 Contribute

- Fork Renaissance onto your own GitHub
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

To work with our project you need to pass in a Helius API and RPC Proxy URL in the .env file In the root of the project, create a `.env` file with the following values:

```
VITE_HELIUS_RPC_PROXY=<PROXY_URL>
```

---

> **Note**
> You can learn how to create a proxy for your HELIUS Plan [HERE](https://docs.helius.xyz/reference/how-to-stop-your-api-key-from-leaking)

---

### Install

Run the install command from the root of the project to install dependencies for all apps and packages.

```sh
yarn install
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
