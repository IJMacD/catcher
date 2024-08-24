import React from 'react';
import bg from '../assets/bg1.png';

export function StartMenu({ onStart }: { onStart: () => void }) {

    /** @type {import('react').CSSProperties} */
    const pageStyle: React.CSSProperties = {
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "50%",
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
    };

    const titleStyle: React.CSSProperties = {
        color: "white",
        textShadow: "2px 2px 4px rgb(0 0 0 / 50%)"
    };

    const linkStyle: React.CSSProperties = {
        margin: "1em",
        padding: "0.5em 1.5em",
        background: "rgb(33 33 33)",
        color: "white",
        borderRadius: 10,
    };

    return (
        <div style={pageStyle}>
            <div style={contentStyle}>
                <h1 style={titleStyle}>Catcher</h1>

                <button onClick={onStart}>
                    Start Game
                </button>

                <a href="/leaderboard" style={linkStyle}>
                    Leaderboard
                </a>
            </div>
        </div>
    )
}