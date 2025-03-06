'use client';

import React from 'react';
import ChessPlayerGame from './components/ChessPlayerGame';

export default function Home() {
  return (
    <main>
      <ChessPlayerGame mode="daily" />
    </main>
  );
} 