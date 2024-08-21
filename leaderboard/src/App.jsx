import React, { useState } from 'react';
import './App.css'
import { useLeaderboard } from './Hooks/useLeaderboard';

function App() {
  const { leaderboard, isLoading, error, removeEntry } = useLeaderboard();
  const [isModerator, setIsModerator] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const selectedID = urlParams.get("id") || "";

  function handleModerateButton() {
    fetch("/api/moderation/verify")
      .then(r => {
        if (r.ok) {
          setIsModerator(true);
        }
      });
  }

  return (
    <>
      <div className='Leaderboard-Content'>
        <h1>Catcher Leaderboard</h1>
        <a href="/">Play the game</a>

        {isLoading && <p>Loading...</p>}

        {error && <p className='error'>Unable to fetch the leader board</p>}

        {!isLoading && !error && leaderboard.length === 0 && <p>It seems the leaderboard is empty.</p>}

        <ol className='Leaderboard-List'>
          {
            leaderboard.map(entry => {
              let className = "Leaderboard-ListItem";
              if (entry.id === +selectedID) {
                className += " Leaderboard-ListItem--selected";
              }

              return (
                <li key={entry.id} className={className}>
                  <span>{entry.playerName}: {entry.score}</span>
                  {isModerator && <button onClick={() => removeEntry(entry.id)}>Remove</button>}
                </li>
              );
            })
          }
        </ol>

      </div>
      {!isModerator && <button onClick={handleModerateButton} style={{ position: "fixed", bottom: 10, left: 10 }}>Moderate</button>}
    </>
  )
}

export default App
