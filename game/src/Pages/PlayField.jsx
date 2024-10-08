import React, { useEffect, useRef, useState } from 'react';
import { useGameLoop } from '../Hooks/useGameLoop';

import bgImg from '../assets/bg1.png';
import playerImg from '../assets/boat.png';
import e1 from "../assets/e1.png";
import e2 from "../assets/e2.png";
import p1 from "../assets/p1.png";
import p2 from "../assets/p2.png";
import p3 from "../assets/p3.png";
import p4 from "../assets/p4.png";

const DEBUG = false;

/**
 *
 * @param {object} props
 * @param {(score: number) => void} props.onGameEnd
 * @returns
 */
export function PlayField({ onGameEnd }) {
    // Used to keep track of mouse position and feed it into the game loop.
    const [mousePosition, setMousePosition] = useState(() => window.innerWidth / 2);
    // keeps track of the direction the player is facing
    const playerMovementRef = useRef(0);

    const { score, objects, timeRemaining, playerPosition } = useGameLoop(mousePosition);

    useEffect(() => {
        if (timeRemaining < 0) {
            onGameEnd(score);
        }
    }, [timeRemaining]);

    // Add mouse listener to the document
    useEffect(() => {
        /**
         * @param {MouseEvent} e
         */
        function cb(e) {
            setMousePosition(e.x);
            playerMovementRef.current = e.movementX;
        }

        document.addEventListener("mousemove", cb);

        // Remove listener on unmount
        return () => document.removeEventListener("mousemove", cb);
    }, []);

    /** @type {import('react').CSSProperties} */
    const pageStyle = {
        backgroundImage: `url(${bgImg})`,
        backgroundSize: "cover",
        backgroundPosition: "50%",
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        placeItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        cursor: "none",
    };

    /** @type {import('react').CSSProperties} */
    const playerStyle = {
        backgroundImage: `url(${playerImg})`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        width: 150,
        height: 180,
        position: "absolute",
        left: playerPosition,
        bottom: 50,
        transform: `translate(-50%, 0) ${playerMovementRef.current < 0 ? "scale(-1, 1)" : ""}`,
    };

    /** @type {import('react').CSSProperties} */
    const hudStyle = {
        backgroundColor: "white",
        position: "absolute",
        top: 0,
        fontSize: "2rem",
        fontWeight: "bold",
        padding: "0 1em 0.25em",
    };

    /** @type {import('react').CSSProperties} */
    const scoreStyle = {
        ...hudStyle,
        left: 0,
        borderBottomRightRadius: 10,
    };

    /** @type {import('react').CSSProperties} */
    const clockStyle = {
        ...hudStyle,
        right: 0,
        borderBottomLeftRadius: 10,
    };

    /** @type {import('react').CSSProperties} */
    const debugCollisionStyle = {
        border: "2px solid red",
        position: "absolute",
        left: playerPosition - 50,
        top: window.innerHeight - 100,
        width: 100,
        height: 25,
    };

    return (
        <div style={pageStyle}>
            {
                objects.map(obj => {
                    /** @type {import('react').CSSProperties} */
                    const objectStyle = {
                        position: "absolute",
                        top: obj.y,
                        left: obj.x,
                        transform: "translate(-50%, -50%)",
                        width: 100,
                        height: 100,
                        backgroundImage: `url(${getSprite(obj.sprite)})`,
                        backgroundSize: "contain",
                    };

                    return <div key={obj.id} style={objectStyle} />;
                })
            }
            <div style={scoreStyle}>Score: {score}</div>
            <div style={clockStyle}>Time: {(timeRemaining / 1000).toFixed()}</div>
            <div style={playerStyle} />
            {DEBUG && <div style={debugCollisionStyle} />}
        </div>
    );
}

/**
 * Helper function to map sprite names to URLs
 * @param {string} sprite
 */
function getSprite(sprite) {
    return { e1, e2, p1, p2, p3, p4 }[sprite];
}