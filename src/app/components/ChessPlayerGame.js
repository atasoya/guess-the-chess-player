'use client';

import React, { useEffect, useState, useRef } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import GitHubIcon from '@mui/icons-material/GitHub';
import Switch from '@mui/material/Switch';
import { useRouter } from 'next/navigation';
import chessPlayers from '../data/chessPlayers.json';
import { getRandomPlayer } from '../actions/getRandomPlayer';
import Script from 'next/script';

const arrowColor = '#00ADB5';

const titleHierarchy = {
  'GM': 8,
  'IM': 7,
  'WGM': 6,
  'FM': 5,
  'WIM': 4,
  'CM': 3,
  'WFM': 2,
  'WCM': 1,
  'None': 0,
};

// Mapping of nationalities to flag codes
const nationalityToFlagCode = {
  // Common nationalities in the dataset
  'America': 'us',
  'India': 'in',
  'China': 'cn',
  'Russia': 'ru',
  'Germany': 'de',
  'Azerbaijan': 'az',
  'Spain': 'es',
  'France': 'fr',
  'Ukraine': 'ua',
  'Hungary': 'hu',
  'Armenia': 'am',
  'Netherlands': 'nl',
  'Uzbekistan': 'uz',
  'Poland': 'pl',
  'England': 'gb-eng',
  'Israel': 'il',
  'Norway': 'no',
  'Serbia': 'rs',
  'Romania': 'ro',
  'Turkiye': 'tr',
  'Iran': 'ir',
  'Bulgaria': 'bg',
  'Croatia': 'hr',
  'Slovenia': 'si',
  'Greece': 'gr',
  'Denmark': 'dk',
  'Georgia': 'ge',
  'Argentina': 'ar',
  'Austria': 'at',
  'Italy': 'it',
  'Cuba': 'cu',
  'Sweden': 'se',
  'Brazil': 'br',
  'Switzerland': 'ch',
  'Kazakhstan': 'kz',
  'Vietnam': 'vn',
  'Slovakia': 'sk',
  'Lithuania': 'lt',
  'Australia': 'au',
  'Moldova': 'md',
  'Canada': 'ca',
  'Montenegro': 'me',
  'Belgium': 'be',
  'Iceland': 'is',
  'Egypt': 'eg',
  'Portugal': 'pt',
  
  // Additional countries from the provided list
  'Bosnia': 'ba',
  'Peru': 'pe',
  'Colombia': 'co',
  'Mexico': 'mx',
  'Finland': 'fi',
  'Latvia': 'lv',
  'Mongolia': 'mn',
  'Philippines': 'ph',
  'Belarus': 'by',
  'Indonesia': 'id',
  'Macedonia': 'mk',
  'Chile': 'cl',
  'Paraguay': 'py',
  'Estonia': 'ee',
  'Scotland': 'gb-sct',
  'Ireland': 'ie',
  'Venezuela': 've',
  'Singapore': 'sg',
  'Malaysia': 'my',
  'Uruguay': 'uy',
  'Kyrgyzstan': 'kg',
  'Turkmenistan': 'tm',
  'Bangladesh': 'bd',
  'Albania': 'al',
  'South Africa': 'za',
  'Morocco': 'ma',
  'Algeria': 'dz',
  'Faroe Islands': 'fo',
  'Ecuador': 'ec',
  'Andorra': 'ad',
  'Myanmar': 'mm',
  'Zambia': 'zm',
  'Costa Rica': 'cr',
  'New Zealand': 'nz',
  'Japan': 'jp',
  'Kosovo': 'xk',
  'Tunisia': 'tn',
  'Bolivia': 'bo',
  'Syria': 'sy',
  'Dominican Republic': 'do',
  'Tajikistan': 'tj',
  'Nigeria': 'ng',
  'United Arab Emirates': 'ae',
  'Wales': 'gb-wls',
  'Luxembourg': 'lu',
  'Monaco': 'mc',
  'Iraq': 'iq',
  'Lebanon': 'lb',
  'Panama': 'pa',
  'Zimbabwe': 'zw',
  'El Salvador': 'sv',
  'Jordan': 'jo',
  'Trinidad': 'tt',
  'Angola': 'ao',
  'South Korea': 'kr',
  'Uganda': 'ug',
  'Sri Lanka': 'lk',
  'Madagascar': 'mg',
  'Thailand': 'th',
  'Yemen': 'ye',
  'Nicaragua': 'ni',
  'Pakistan': 'pk',
  'Malta': 'mt',
  'Puerto Rico': 'pr',
  'Guatemala': 'gt',
  'Libya': 'ly',
  'Hong Kong': 'hk',
  'Jamaica': 'jm',
  'Honduras': 'hn',
  'Sudan': 'sd',
  'Cyprus': 'cy',
  'Nepal': 'np',
  'Ethiopia': 'et',
  'Chinese Taipei': 'tpe',
  'Palestine': 'ps',
  'South Sudan': 'ss',
  'Liechtenstein': 'li',
  'Botswana': 'bw',
  'Malawi': 'mw',
  'Netherlands Antilles': 'an',
  'Barbados': 'bb',
  'Afghanistan': 'af',
  'Mozambique': 'mz',
  'Aruba': 'aw',
  'Kenya': 'ke',
  'Namibia': 'na',
  'Cote d\'Ivoire': 'ci',
  'Brunei': 'bn',
  'Isle of Man': 'im',
  'Saudi Arabia': 'sa',
  'Mauritius': 'mu',
  'Oman': 'om',
  'Cape Verde': 'cv',
  'Somalia': 'so',
  'Liberia': 'lr',
  'Suriname': 'sr',
  'Mauritania': 'mr',
  'Kuwait': 'kw',
  'Guam': 'gu',
  'Bahrain': 'bh',
  'Gambia': 'gm',
  'Ghana': 'gh',
  'Senegal': 'sn',
  'Bermuda': 'bm',
  'Jersey': 'je',
  'Guernsey': 'gg',
  'Saint Lucia': 'lc',
  'Guyana': 'gy',
  'Palau': 'pw',
  'Tanzania': 'tz',
  'Burundi': 'bi',
  'Cayman Islands': 'ky',
  'Lesotho': 'ls',
  'San Marino': 'sm',
  'Maldives': 'mv',
  'Bahamas': 'bs',
  'Togo': 'tg',
  'Cameroon': 'cm',
  'Eswatini': 'sz',
  'Fiji': 'fj',
  'Sierra Leone': 'sl',
  'Qatar': 'qa',
  'Haiti': 'ht',
  'Macau': 'mo'
};

// Function to get the flag code for a player
const getFlagCode = (player) => {
  // Special case for Republic - could be Czech Republic or Vietnam
  if (player.nationality === "Republic") {
    return player.label.includes("Nguyen") ? "vn" : "cz";
  }
  
  // Use the mapping or fallback to lowercase nationality
  return nationalityToFlagCode[player.nationality] || player.nationality.toLowerCase();
};

const getTitleHierarchyValue = (title) => titleHierarchy[title] || 0;

export default function ChessPlayerGame({ mode = 'daily' }) {
  const router = useRouter();
  const [windowWidth, setWindowWidth] = useState(0);
  const [foundCountry, setFoundCountry] = useState(false);
  const [randomPlayer, setRandomPlayer] = useState({});
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isWinner, setIsWinner] = useState(false);
  const [selectedPlayerNames, setSelectedPlayerNames] = useState([]);
  const [blurLevel, setBlurLevel] = useState(30);
  const [guessMade, setGuessMade] = useState(false);
  const [dontAnimate, setDontAnimate] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [tryAgainModalOpen, setTryAgainModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize window width
    setWindowWidth(window.innerWidth);
    
    // Function to set window width on resize
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Function to simulate loading for 1 second when page reloads
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Function to set random player when component mounts
    const initializeRandomPlayer = async () => {
      if (mode === 'daily') {
        const player = await getRandomPlayer();
        setRandomPlayer(player);
      } else {
        // Endless mode - use local random selection
        const randomIndex = Math.floor(Math.random() * chessPlayers.length);
        setRandomPlayer(chessPlayers[randomIndex]);
      }
    };

    initializeRandomPlayer();
  }, [mode]);

  const handleAutocompleteChange = (event, newValue) => {
    setSelectedPlayer(newValue);
    setDontAnimate(true);
  };

  const handlePlayAgain = async () => {
    setIsWinner(false);
    if (mode === 'daily') {
      const player = await getRandomPlayer();
      setRandomPlayer(player);
    } else {
      // Endless mode - use local random selection
      const randomIndex = Math.floor(Math.random() * chessPlayers.length);
      setRandomPlayer(chessPlayers[randomIndex]);
    }
    setSelectedPlayerNames([]);
    setBlurLevel(30);
    setFoundCountry(false);
    setTryAgainModalOpen(false);
  };

  const handleGuess = () => {
    setDontAnimate(false);
    if (selectedPlayer) {
      if (selectedPlayer === randomPlayer) {
        setBlurLevel(0);
        setIsWinner(true);
        setFoundCountry(true);
      } else {
        setIsWinner(false);
      }
      if (randomPlayer.nationality === selectedPlayer.nationality) {
        setFoundCountry(true);
      }
      setSelectedPlayerNames(prevNames => [selectedPlayer, ...prevNames]);
      setSelectedPlayer(null);
      setBlurLevel(prevLevel => Math.max(prevLevel - 5, 0));
      setGuessMade(true);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleGuess();
    }
  };

  const openHelpModal = () => {
    setIsHelpModalOpen(true);
    setDontAnimate(true)
  };

  const closeHelpModal = () => {
    setIsHelpModalOpen(false);
    setDontAnimate(true)
  };

  const openTryAgainModal = () => {
    setTryAgainModalOpen(true);
  };

  const closeTryAgainModal = () => {
    setTryAgainModalOpen(false);
  };

  const handleModeChange = () => {
    const newMode = mode === 'daily' ? 'endless' : 'daily';
    router.push(newMode === 'daily' ? '/' : '/endless');
  };

  return (
    <>
      {/* Add structured data for SEO */}
      <Script id="chess-game-schema" type="application/ld+json" strategy="afterInteractive">
        {`
          {
            "@context": "https://schema.org",
            "@type": "Game",
            "name": "Guess The Chess Player",
            "description": "A daily chess puzzle game where you guess famous chess players from blurred images",
            "url": "https://guessthechessplayer.com",
            "genre": "Puzzle",
            "audience": {
              "@type": "Audience",
              "audienceType": "Chess Players"
            }
          }
        `}
      </Script>
      
      <div className="App">
        {isLoading && (
          <div className="loading-spinner" aria-label="Loading game content">
            <CircularProgress size={24} />
          </div>
        )}

        <div className="bg-custom-black h-14 sm:h-20 w-full flex items-center justify-between px-3 sm:px-6">
          <h1 className="text-custom-white font-bold text-sm sm:text-xl md:text-2xl">
            Guess The Chess Player
          </h1>

          <div className="flex items-center gap-1 sm:gap-4">
            <div className="flex items-center bg-custom-grey rounded-full px-1.5 sm:px-3 py-0.5 sm:py-1">
              <span className={`text-[10px] sm:text-base mr-1 sm:mr-2 ${mode === 'daily' ? 'text-custom-teal font-bold' : 'text-gray-400'}`}>
                Daily
              </span>
              <Switch
                size="small"
                checked={mode === 'endless'}
                onChange={handleModeChange}
                aria-label={`Switch to ${mode === 'daily' ? 'endless' : 'daily'} mode`}
                sx={{
                  padding: 0,
                  width: { xs: 28, sm: 32 },
                  height: { xs: 16, sm: 20 },
                  '& .MuiSwitch-switchBase': {
                    padding: 0,
                    margin: '1px',
                    '&.Mui-checked': {
                      color: '#00ADB5',
                      '& + .MuiSwitch-track': {
                        backgroundColor: '#00ADB5',
                      },
                    },
                  },
                  '& .MuiSwitch-thumb': {
                    width: { xs: 14, sm: 16 },
                    height: { xs: 14, sm: 16 },
                  },
                }}
              />
              <span className={`text-[10px] sm:text-base ml-1 sm:ml-2 ${mode === 'endless' ? 'text-custom-teal font-bold' : 'text-gray-400'}`}>
                Endless
              </span>
            </div>
            <HelpOutlineIcon 
              style={{ fontSize: windowWidth >= 640 ? '24px' : '16px' }} 
              className="text-gray-400 hover:text-gray-300 cursor-pointer"
              onClick={openHelpModal}
              aria-label="Help information"
            />
          </div>
        </div>

        {isHelpModalOpen && (
          <div className="modal">
            <div className="modal-content max-w-[90vw] sm:max-w-[500px] p-4 sm:p-6">
              <p className="text-lg sm:text-xl font-bold mb-4">Welcome to "Guess The Chess Player"!</p>
              <ul className="space-y-3 text-sm sm:text-base">
                <li>This interactive game challenges you to guess the identity of a chess player based on various clues provided.</li>
                <li>The game randomly selects a chess player from the March 2025 rating list provided by FIDE, the international chess federation. (Top 100 open & woman)</li>
                <li>Your task is to analyze the clues given, including the player's photo, Elo rating, nationality, birth year, and title, and make an educated guess about the identity of the chess player.</li>
                <li>Have fun guessing and testing your knowledge of the chess world!</li>
              </ul>
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
                <a href="https://www.buymeacoffee.com/atasoyata" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="transition-opacity hover:opacity-90">
                  <img 
                    src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" 
                    alt="Buy Me A Coffee" 
                    style={{ height: '40px', width: '145px' }}
                  />
                </a>
                <button 
                  onClick={closeHelpModal}
                  className="w-full sm:w-auto bg-custom-teal text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {tryAgainModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <p>Oops! It seems you need to try again.</p>
              <button onClick={handlePlayAgain}>Try Again</button>
            </div>
          </div>
        )}

        {isWinner && (
          <div className="modal">
            <div className="modal-content">
            <p className='font-bold'>
                {randomPlayer.label}
            </p>
            <div className='flex justify-center mb-4'>
              <img
                src={`/players/${randomPlayer.ID}.jpeg`}
                alt={randomPlayer.name || 'Chess Player'}
                style={{ height: '200px', width: '200px', objectFit: 'cover' }}
              />
          </div>
              <p>Congratulations! You've guessed correctly.</p>
              <button onClick={handlePlayAgain}>Play Again</button>
            </div>
          </div>
        )}

        <div className="flex flex-col items-center mt-2 sm:mt-4 px-2 sm:px-4">
          <div className="w-full max-w-[320px] sm:max-w-[400px] text-center mb-3">
            <span className="inline-block bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 text-transparent bg-clip-text text-sm sm:text-base font-bold animate-pulse">
              <a 
                href="https://chessstreet.com?ref=guess-the-chessplayer" 
                target="_blank" 
                rel="noopener noreferrer sponsored" 
                title="Visit Chess Street - The Ultimate Community for Chess Players"
                aria-label="Chess Street: Online community with chat rooms for chess players"
                className="hover:underline focus:outline-none focus:ring-2 focus:ring-purple-500 rounded"
              >
                Chess Street: #1 Community & Chat for Chess Players
              </a>
            </span>
          </div>
          <div className="flex flex-col items-center bg-custom-white shadow-lg rounded-lg p-3 sm:p-5 w-full max-w-[320px] sm:max-w-[400px]">
            <div className="bg-custom-grey w-full aspect-square mb-3 sm:mb-4 flex items-center justify-center relative rounded-lg">
              <img
                src={"/players/" + randomPlayer.ID + ".jpeg"}
                alt={`Chess player puzzle - ${mode} mode`}
                className="absolute h-full w-full object-cover rounded-lg"
                style={{ filter: `blur(${blurLevel}px)` }}
              />
              {foundCountry && randomPlayer.nationality !== "FIDE" && (
                <img
                  src={`https://ratings.fide.com/images/flags/${getFlagCode(randomPlayer)}.svg`}
                  alt={`Flag of ${randomPlayer.nationality}`}
                  className="absolute bottom-0 right-0 h-7 w-9 sm:h-9 sm:w-12"
                />
              )}
            </div>
            <Autocomplete
              disablePortal
              id="chess-player-autocomplete"
              options={chessPlayers}
              size="small"
              sx={{ 
                width: '100%',
                '& .MuiInputBase-root': {
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Guess The Chess Player"
                  onKeyDown={handleKeyDown}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: "#00ADB5",
                      },
                    },
                    '& .MuiInputLabel-outlined': {
                      '&.Mui-focused': {
                        color: "black",
                      },
                    },
                  }}
                />
              )}
              onChange={handleAutocompleteChange}
              value={selectedPlayer}
              aria-label="Search and select a chess player"
            />
            <button
              className="w-full sm:hidden mt-3 bg-custom-teal text-white py-1.5 px-3 rounded-md hover:bg-opacity-90 transition-all text-sm"
              onClick={handleGuess}
              aria-label="Submit your guess"
            >
              Guess
            </button>
          </div>
        </div>

        {selectedPlayerNames.length > 0 && (
          <div className="mt-3 sm:mt-4 px-2 sm:px-4">
            <div className="stack">
              {selectedPlayerNames.map((player, index) => (
                <div key={`${player.label}-${index}-${Math.random()}`} 
                     className={`stack-item ${index === 0 && guessMade && !dontAnimate ? 'animate-in' : ''}`}>
                  <h3 className="stack-title text-xs sm:text-base mb-2">{player.label}</h3>
                  <div className="circles-container flex flex-wrap justify-center gap-2 sm:gap-4">
                    <div className="circle-container">
                      <div className="circle-text text-xs sm:text-sm">Elo</div>
                      <div
                        className={`circle flex flex-col items-center justify-center w-[50px] h-[50px] sm:w-[75px] sm:h-[75px] text-xs sm:text-sm border-4 sm:border-8 border-[#222831] ${player.elo === randomPlayer.elo ? 'bg-green-600' : 'bg-[#393E46]'}`}
                      >
                        {randomPlayer && player.elo > randomPlayer.elo ? 
                          <ArrowDownwardIcon style={{ color: arrowColor, fontSize: windowWidth >= 640 ? '16px' : '14px', marginBottom: windowWidth >= 640 ? '-4px' : '-2px' }} /> : 
                          player.elo < randomPlayer.elo ? 
                          <ArrowUpwardIcon style={{ color: arrowColor, fontSize: windowWidth >= 640 ? '16px' : '14px', marginBottom: windowWidth >= 640 ? '-4px' : '-2px' }} /> : null}
                        <span>{player.elo}</span>
                      </div>
                    </div>
                    <div className="circle-container">
                      <div className="circle-text text-xs sm:text-sm">Nationality</div>
                      <div
                        className={`circle flex items-center justify-center w-[50px] h-[50px] sm:w-[75px] sm:h-[75px] border-4 sm:border-8 border-[#222831] ${player.nationality === randomPlayer.nationality ? 'bg-green-600' : 'bg-[#393E46]'}`}
                      >
                        {player.nationality !== "FIDE" && (
                          <img
                            src={`https://ratings.fide.com/images/flags/${getFlagCode(player)}.svg`}
                            alt={`${player.nationality} flag`}
                            className="w-full h-full object-cover rounded-full"
                          />
                        )}
                      </div>
                    </div>
                    <div className="circle-container">
                      <div className="circle-text text-xs sm:text-sm">Born Year</div>
                      <div
                        className={`circle flex flex-col items-center justify-center w-[50px] h-[50px] sm:w-[75px] sm:h-[75px] text-xs sm:text-sm border-4 sm:border-8 border-[#222831] ${player.born === randomPlayer.born ? 'bg-green-600' : 'bg-[#393E46]'}`}
                      >
                        {randomPlayer && player.born > randomPlayer.born ? 
                          <ArrowDownwardIcon style={{ color: arrowColor, fontSize: '14px', marginBottom: '-2px' }} /> : 
                          player.born < randomPlayer.born ? 
                          <ArrowUpwardIcon style={{ color: arrowColor, fontSize: '14px', marginBottom: '-2px' }} /> : null}
                        <span>{player.born}</span>
                      </div>
                    </div>
                    <div className="circle-container">
                      <div className="circle-text text-xs sm:text-sm">Title</div>
                      <div
                        className={`circle flex flex-col items-center justify-center w-[50px] h-[50px] sm:w-[75px] sm:h-[75px] text-xs sm:text-sm border-4 sm:border-8 border-[#222831] ${player.title === randomPlayer.title ? 'bg-green-600' : 'bg-[#393E46]'}`}
                      >
                        {randomPlayer && getTitleHierarchyValue(player.title) > getTitleHierarchyValue(randomPlayer.title) ? 
                          <ArrowDownwardIcon style={{ color: arrowColor, fontSize: '14px', marginBottom: '-2px' }} /> : 
                          getTitleHierarchyValue(player.title) < getTitleHierarchyValue(randomPlayer.title) ? 
                          <ArrowUpwardIcon style={{ color: arrowColor, fontSize: '14px', marginBottom: '-2px' }} /> : null}
                        <span>{player.title}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}