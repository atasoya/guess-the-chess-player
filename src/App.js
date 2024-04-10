import React, { useEffect, useState } from 'react';
import './App.css';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import GitHubIcon from '@mui/icons-material/GitHub';
import chessPlayers from './data/chessPlayers.json';

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

const getTitleHierarchyValue = (title) => titleHierarchy[title] || 0;

function App() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [foundCountry, setFoundCountry] = useState(false);
  const [randomPlayer, setRandomPlayer] = useState({});
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isWinner, setIsWinner] = useState(false);
  const [selectedPlayerNames, setSelectedPlayerNames] = useState([]);
  const [blurLevel, setBlurLevel] = useState(30);
  const [guessMade, setGuessMade] = useState(false);
  const [dontAnimate, setDontAnimate] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false); // State to manage modal visibility

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * chessPlayers.length);
    const selectedRandomPlayer = chessPlayers[randomIndex];
    setRandomPlayer(selectedRandomPlayer);
  }, []);

  const handleAutocompleteChange = (event, newValue) => {
    setSelectedPlayer(newValue);
    setDontAnimate(true);
  };

  const handlePlayAgain = () => {
    setIsWinner(false);
    const randomIndex = Math.floor(Math.random() * chessPlayers.length);
    const selectedRandomPlayer = chessPlayers[randomIndex];
    setRandomPlayer(selectedRandomPlayer);
    setSelectedPlayerNames([]);
    setBlurLevel(30);
    setFoundCountry(false);
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
  };

  const closeHelpModal = () => {
    setIsHelpModalOpen(false);
  };

  return (
    <div className="App">
      <div className="bg-custom-black h-20 w-screen flex justify-between items-center">
        <p className="text-custom-white font-bold text-lg mx-auto">Guess The Chess Player</p>
        <div>
          <HelpOutlineIcon style={{ color: 'grey', fontSize: '24px', cursor: 'pointer', marginRight: '20px' }} onClick={openHelpModal} />
        </div>
      </div>
      {isHelpModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <p><strong>Welcome to "Guess The Chess Player"!</strong></p>
            <ul>
            <li style={{ marginBottom: "10px" }}>This interactive game challenges you to guess the identity of a chess player based on various clues provided.</li>
        <li style={{ marginBottom: "10px" }}>The game randomly selects a chess player from the April 2024 rating list provided by FIDE, the international chess federation. (Top 100 open & woman)</li>
        <li style={{ marginBottom: "10px" }}>Your task is to analyze the clues given, including the player's photo, Elo rating, nationality, birth year, and title, and make an educated guess about the identity of the chess player.</li>
        <li style={{ marginBottom: "10px" }}>Have fun guessing and testing your knowledge of the chess world!</li>
        <li><a href="https://github.com/atasoya/guess-the-chess-player" target="_blank"><GitHubIcon /></a></li>
      </ul>
            
            <button onClick={closeHelpModal} style={{marginTop:"20px"}}>Close</button>
          </div>
        </div>

      )}
      <div className="coffee-image-container" style={{ position: 'relative', textAlign: 'center', marginTop: '20px', "marginLeft": "20px" }}>
        <a href="https://www.buymeacoffee.com/atasoyata" target="_blank">
          <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style={{ height: '40px', width: '145px' }} />
        </a>
      </div>
      {isWinner && (
        <div className="modal">
          <div className="modal-content">
            <p>Congratulations! You've guessed correctly.</p>
            <button onClick={handlePlayAgain}>Play Again</button>
          </div>
        </div>
      )}
      <div className="flex justify-center mt-10" style={{ "marginTop": "10px" }}>
        <div className="flex flex-col items-center bg-custom-white shadow-lg rounded-lg p-5" >
          <div className="bg-custom-grey h-64 w-64 mb-4 flex items-center justify-center relative">
            <img
              src={randomPlayer.imageUrl || ''}
              alt={randomPlayer.label || 'Chess Player'}
              className="absolute h-full w-full object-cover rounded-lg"
              style={{ filter: `blur(${blurLevel}px)` }}
            />
            {foundCountry && randomPlayer.nationality !== "FIDE" && (
              <img
                src={`https://ratings.fide.com/svg/${randomPlayer.nationality}.svg`}
                alt="Found Country"
                className="absolute bottom-0 right-0 h-9 w-12"
              />
            )}
          </div>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={chessPlayers}
            sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Guess The Chess Player"
                onKeyDown={handleKeyDown}
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
          />
          {windowWidth <= 768 && (
            <button
              className="mobile-only-button"
              onClick={handleGuess}
              style={{
                display: 'block',
                marginTop: '10px',
                backgroundColor: '#00ADB5',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Guess
            </button>
          )}
        </div>
      </div>
      {selectedPlayerNames.length > 0 && (
        <div className="mt-4 px-5">
          <div className="stack">
            {selectedPlayerNames.map((player, index) => (
              <div key={`${player.label}-${index}-${Math.random()}`} className={`stack-item ${index === 0 && guessMade && !dontAnimate ? 'animate-in' : ''}`}>
                <h3 className="stack-title">{player.label}</h3>
                <div className="circles-container">
                  <div className="circle-container">
                    <div className="circle-text">
                      Elo
                      {randomPlayer && player.elo > randomPlayer.elo ? <ArrowDownwardIcon style={{ color: arrowColor }} /> : player.elo < randomPlayer.elo ? <ArrowUpwardIcon style={{ color: arrowColor }} /> : null}
                    </div>
                    <div
                      className="circle"
                      style={{
                        backgroundColor: player.elo === randomPlayer.elo ? 'green' : '#393E46',
                      }}
                    >
                      {player.elo}
                    </div>
                  </div>
                  <div className="circle-container">
                    <div className="circle-text">Nationality</div>
                    <div
                      className="circle"
                      style={{
                        backgroundColor: player.nationality === randomPlayer.nationality ? 'green' : '#393E46',
                      }}
                    >
                      {player.nationality}
                    </div>
                  </div>
                  <div className="circle-container">
                    <div className="circle-text">
                      Born Year
                      {randomPlayer && player.born > randomPlayer.born ? <ArrowDownwardIcon style={{ color: arrowColor }} /> : player.born < randomPlayer.born ? <ArrowUpwardIcon style={{ color: arrowColor }} /> : null}
                    </div>
                    <div
                      className="circle"
                      style={{
                        backgroundColor: player.born === randomPlayer.born ? 'green' : '#393E46',
                      }}
                    >
                      {player.born}
                    </div>
                  </div>
                  <div className="circle-container">
                    <div className="circle-text">
                      Title
                      {randomPlayer && getTitleHierarchyValue(player.title) > getTitleHierarchyValue(randomPlayer.title) ? <ArrowDownwardIcon style={{ color: arrowColor }} /> : getTitleHierarchyValue(player.title) < getTitleHierarchyValue(randomPlayer.title) ? <ArrowUpwardIcon style={{ color: arrowColor }} /> : null}
                    </div>
                    <div
                      className="circle"
                      style={{
                        backgroundColor: player.title === randomPlayer.title ? 'green' : '#393E46',
                      }}
                    >
                      {player.title}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
