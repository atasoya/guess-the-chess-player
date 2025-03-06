'use server';

import chessPlayers from '../data/chessPlayers.json';

export async function getRandomPlayer() {
  // Get current date in UTC to ensure consistency across all regions
  const now = new Date();
  const utcDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const dateString = `${utcDate.getUTCFullYear()}-${utcDate.getUTCMonth() + 1}-${utcDate.getUTCDate()}`;
  
  // Create a seed based on the date
  const initialSeed = dateString.split('').reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0);

  // Use the seed to generate a random index
  const seededRandom = () => {
    let seed = initialSeed;
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  const randomIndex = Math.floor(seededRandom() * chessPlayers.length);
  return chessPlayers[randomIndex];
} 