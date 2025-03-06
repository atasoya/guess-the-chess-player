import './globals.css';
import GoogleAnalytics from './components/GoogleAnalytics';

export const metadata = {
  title: 'Guess The Chess Player',
  description: 'A game where you guess chess players based on clues',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
} 