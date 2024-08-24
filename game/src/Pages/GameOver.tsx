import React from 'react';
import { useSavedState } from '../Hooks/useSavedState';
import { useLeaderBoard } from '../Hooks/useLeaderBoard';

export function GameOver({ finalScore, onReset }: { finalScore: number, onReset: () => void }) {
    const [playerName, setPlayerName] = useSavedState("catcher.playerName", "");
    const { submitScore, isPending, error, submissionID } = useLeaderBoard();

    const pageStyle: React.CSSProperties = {
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        placeItems: "center",
        justifyContent: "center",
    };

    const contentStyle: React.CSSProperties = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "rgb(255 255 255)",
        borderRadius: 15,
        padding: "2em 4em",
        boxShadow: "2px 2px 4px 4px rgb(0 0 0 / 0.5)"
    };

    const titleStyle: React.CSSProperties = {
        color: "rgb(64 64 64)",
        textShadow: "4px 4px 4px rgb(0 0 0 / 10%)"
    };

    const textStyle: React.CSSProperties = {
        color: "rgb(64 64 64)",
        textShadow: "4px 4px 4px rgb(0 0 0 / 10%)"
    };

    const inputStyle: React.CSSProperties = {
        padding: "0.5em 1em",
        border: "1px solid rgb(128 128 128)",
        borderRadius: 10,
        fontSize: "1.2rem"
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (playerName) {
            submitScore(playerName, finalScore);
        }
    }

    return (
        <div style={pageStyle}>
            <div style={contentStyle}>

                <h1 style={titleStyle}>Game Over</h1>
                <h2 style={textStyle}>Final Score: {finalScore}</h2>

                {isNaN(submissionID) ?
                    <form onSubmit={handleSubmit}>

                        <label>
                            Enter name for leaderboard:<br />
                            <input
                                name="playerName"
                                style={inputStyle}
                                value={playerName}
                                onChange={e => setPlayerName(e.target.value)}
                                placeholder='Name'
                                autoFocus
                                disabled={isPending}
                            />
                        </label>

                        <button style={{ marginLeft: "1em" }} disabled={isPending}>Submit</button>

                        {isPending && <p>Submitting</p>}
                        {error && <p style={{ color: "red" }}>Sorry! Something went wrong while saving.</p>}

                    </form>
                    :
                    <p>Click here to see the leaderboard: <a href={`/leaderboard?id=${submissionID}`}>Leaderboard</a></p>
                }
                <button onClick={onReset} style={{ margin: "1em" }}>Play Again</button>
            </div>
        </div>
    );
}