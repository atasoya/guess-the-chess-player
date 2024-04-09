import React, { useEffect, useState } from 'react';
import './App.css';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

const chessPlayers = [
  { label: 'Ediz Gürel', born: 2008, elo: 2540, nationality: "TUR", title: "GM", imageUrl: "Ediz-Gürel.jpeg" },
  { label: 'Magnus Carlsen', born: 1990, elo: 2830, nationality: "NOR", title: "GM", imageUrl: "Magnus-Carlsen.jpeg" },
  { label: 'Iluan Baltag', born: 1986, elo: 2410, nationality: "MDA", title: "IM", imageUrl: "Iluan-Baltag.jpeg" },
];

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
  const [randomPlayer, setRandomPlayer] = useState({});
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isWinner, setIsWinner] = useState(false);
  const [selectedPlayerNames, setSelectedPlayerNames] = useState([]);
  const [blurLevel, setBlurLevel] = useState(30);
  const [guessMade, setGuessMade] = useState(false); // State to track if a guess has been made
  const [dontAnimate, setDontAnimate] = useState(false); // State to track if a guess has been made

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
  };

  const handleGuess = () => {
    setDontAnimate(false);
    if (selectedPlayer) {
      if(selectedPlayer === randomPlayer){
        setBlurLevel(0);
        setIsWinner(true);
      }else{
        setIsWinner(false);
      }
      setSelectedPlayerNames(prevNames => [selectedPlayer, ...prevNames]);
      setSelectedPlayer(null);
      setBlurLevel(prevLevel => Math.max(prevLevel - 5, 0));
      setGuessMade(true); // Set guessMade to true when a guess is made
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleGuess();
    }
  };

  return (
    <div className="App">
      <div className="bg-custom-black h-20 w-screen flex justify-center items-center">
        <p className="text-custom-white font-bold text-lg">Guess The Chess Player</p>
      </div>
      <div className="coffee-image-container" style={{ position: 'relative', textAlign: 'center', marginTop: '20px',"marginLeft":"20px" }}>
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

      <div className="flex justify-center mt-10"style={{ "marginTop":"10px" }}>
        <div className="flex flex-col items-center bg-custom-white shadow-lg rounded-lg p-5" >
          <div className="bg-custom-grey h-64 w-64 mb-4 flex items-center justify-center relative">
            <img
              src={randomPlayer.imageUrl || ''}
              alt={randomPlayer.label || 'Chess Player'}
              className="absolute h-full w-full object-cover rounded-lg"
              style={{ filter: `blur(${blurLevel}px)` }}
            />
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
              />
            )}
            onChange={handleAutocompleteChange}
            value={selectedPlayer}
          />
          {windowWidth <= 768 && (
            <button
              className="mobile-only-button"
              onClick={handleGuess} // Use handleGuess for button click
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
                      Peak Elo
                      {randomPlayer && player.elo > randomPlayer.elo ? <ArrowDownwardIcon style={{ color: arrowColor }} /> : player.elo < randomPlayer.elo ? <ArrowUpwardIcon style={{ color: arrowColor }} /> : null}
                    </div>
                    <div
                    className="circle"
                    style={{
                      backgroundColor: player.elo === randomPlayer.elo ? 'green' : '#393E46',
                    }}
                  >
                    {player.born}
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
