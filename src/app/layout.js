import './globals.css';
import { Analytics } from '@vercel/analytics/next';


export const metadata = {
  title: 'Guess The Chess Player',
  description: 'A game where you guess chess players based on clues',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}
      <Analytics />
      </body>
    </html>
  );
} 