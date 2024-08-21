import React from 'react';
import bg from '../assets/bg1.png';

/**
 *
 * @param {object} props
 * @param {() => void} props.onStart
 * @returns
 */
export function StartMenu({ onStart }) {

    /** @type {import('react').CSSProperties} */
    const pageStyle = {
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "50%",
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        placeItems: "center",
        justifyContent: "center",
    };

    /** @type {import('react').CSSProperties} */
    const contentStyle = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    };

    /** @type {import('react').CSSProperties} */
    const titleStyle = {
        color: "white",
        textShadow: "2px 2px 4px rgb(0 0 0 / 50%)"
    };

    /** @type {import('react').CSSProperties} */
    const linkStyle = {
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