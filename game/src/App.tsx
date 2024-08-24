import { useState } from 'react'
import './App.css'
import { StartMenu } from './Pages/StartMenu.tsx'
import { PlayField } from './Pages/PlayField.tsx';
import { GameOver } from './Pages/GameOver.tsx';

type PlayState = "start" | "playing" | "gameover";

function App() {
  const [playState, setPlayState] = useState("start" as PlayState);
  const [finalScore, setFinalScore] = useState(0);

  if (playState === "start") {
    return <StartMenu onStart={() => setPlayState("playing")} />
  }

  if (playState === "playing") {
    return <PlayField onGameEnd={(score: number) => { setFinalScore(score); setPlayState("gameover"); }} />;
  }

  return <GameOver finalScore={finalScore} onReset={() => setPlayState("start")} />;
}

export default App
