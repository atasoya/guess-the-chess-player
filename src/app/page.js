'use client';

import React from 'react';
import ChessPlayerGame from './components/ChessPlayerGame';
import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <ChessPlayerGame mode="daily" />
      <div className="flex justify-center mt-4">
        <Link 
          href="/endless" 
          className="text-custom-white bg-custom-teal px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all"
        >
          Try Endless Mode
        </Link>
      </div>
    </main>
  );
} 