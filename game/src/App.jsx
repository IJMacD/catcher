import React, { useState } from 'react'
import './App.css'
import { StartMenu } from './Pages/StartMenu'
import { PlayField } from './Pages/PlayField';
import { GameOver } from './Pages/GameOver';

/**
 * @typedef {"start"|"playing"|"gameover"} PlayState
 */

function App() {
  const [playState, setPlayState] = useState(/** @type {PlayState} */("start"));
  const [finalScore, setFinalScore] = useState(0);

  if (playState === "start") {
    return <StartMenu onStart={() => setPlayState("playing")} />
  }

  if (playState === "playing") {
    return <PlayField onGameEnd={(score) => { setFinalScore(score); setPlayState("gameover"); }} />;
  }

  return <GameOver finalScore={finalScore} onReset={() => setPlayState("start")} />;
}

export default App
