![Figma](https://img.shields.io/badge/figma-%23F24E1E.svg?style=for-the-badge&logo=figma&logoColor=white)
![BuyMeACoffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-ffdd00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)
![MUI](https://img.shields.io/badge/MUI-%230081CB.svg?style=for-the-badge&logo=mui&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)
![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)

# Guess The Chess Player

A fun interactive game where you can test your knowledge of chess players. Try to guess the identity of a chess player based on various clues like their photo, Elo rating, nationality, birth year, and title.

## Features

- Random selection of chess players from the FIDE rating list
- Progressive hints as you make guesses
- Visual feedback on how close your guesses are
- Mobile-responsive design

## Tech Stack

- Next.js 14
- React
- Material-UI
- Tailwind CSS

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How to Play

1. The game will randomly select a chess player from the FIDE rating list.
2. You'll see a blurred image of the player.
3. Make a guess by typing a player's name in the search box.
4. After each guess, you'll get feedback on how close you are:
   - Green circles indicate a correct attribute
   - Arrows indicate if the actual value is higher or lower
5. The image becomes less blurred with each guess
6. Try to guess the player with as few attempts as possible!

## Deployment

The app can be deployed to Vercel or any other hosting platform that supports Next.js.

```bash
npm run build
npm run start
```

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Preview

![Screen Shot1](/public/assets/ss1.png)
![Screen Shot2](/public/assets/ss2.png)

## Acknowledgments

A huge thank you to all contributors and players who have made this project possible. Your support and feedback have been invaluable.
