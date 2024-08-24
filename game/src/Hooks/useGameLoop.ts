import React, { useEffect, useRef, useState } from "react";
import { produce } from "immer";

// Duration of the game in seconds
const GAME_DURATION_SECONDS = 60;
// Points for collecting a good object
const GAME_SCORE_GOAL = 50;
// Points for collecting a bad object
const GAME_SCORE_FOUL = -100;
// Enter a small positive value to simulate gravity behaviour rather than
// terminal velocity behaviour.
const GRAVITY = 0;
// Initial speed of objects falling
const DEFAULT_OBJECT_SPEED = 0.1;
// Initial difficulty setting at start of game
const DEFAULT_DIFFICULTY = 1;
// The rate at which difficulty changes throughout the game
const DIFFICULTY_CHANGE_RATE = 1.0001;
// Time between spawns in milliseconds
const DEFAULT_SPAWN_RATE = 3000;
// The rate at which spawning changes throught the game (per frame)
const SPAWN_CHANGE_RATE = 0.9997;
// Ratio between foul/goal object
const DEFAULT_FOUL_RATE = 1 / 3;
// Size of player catchment area
const COLLISION_RADIUS = 50;

interface GameObject {
    id: number;
    score: number;
    sprite: string;
    x: number;
    y: number;
    vx: number;
    vy: number;
}

interface GameParams {
    difficulty: number;
    spawnRate: number;
    foulRate: number;
    mousePosition: number;
    playerPosition: number;
    gameWidth: number;
    gameHeight: number;
    endTime: number;
}


/**
 * This hook implements the main game loop
 */
export function useGameLoop(mousePosition: number) {
    // Keep score in its own state
    const [score, setScore] = useState(0);
    // Initialise the game objects list
    const [objects, setObjects] = useState([] as GameObject[]);
    // Create state to represent the player
    const [playerPosition, setPlayerPosition] = useState(mousePosition);

    const gameParamsRef: React.MutableRefObject<GameParams> = useRef({
        mousePosition,
        difficulty: DEFAULT_DIFFICULTY,
        spawnRate: DEFAULT_SPAWN_RATE,
        foulRate: DEFAULT_FOUL_RATE,
        gameWidth: window.innerWidth,
        gameHeight: window.innerHeight,
        endTime: Date.now() + GAME_DURATION_SECONDS * 1000,
        playerPosition
    });

    // Update mouse position in ref object each re-render
    gameParamsRef.current.mousePosition = mousePosition;

    // Update player position in ref object each re-render
    gameParamsRef.current.playerPosition = playerPosition;

    // Set up and effect to run the main game loop
    useEffect(() => {
        let active = true;
        let prevTime = 0;
        let prevSpawnTime = 0

        function loop(time: number) {
            const delta = Math.min(time - prevTime, 100);
            const spawnDelta = time - prevSpawnTime;
            prevTime = time;

            setObjects(oldState => produce(oldState, draft => {
                const { gameHeight, spawnRate, mousePosition, playerPosition } = gameParamsRef.current;

                /*********
                 * Input
                 *********/
                // Update the player position based on the mouse position

                // TODO: This could be updated to limit the maximum sailing
                // speed of the player
                setPlayerPosition(mousePosition);

                /***********
                 * Spawning
                 ***********/
                // Check to see if we are due to spawn a new object
                if (spawnDelta > spawnRate) {
                    spawnObject(draft, gameParamsRef.current);
                    prevSpawnTime = time;
                }

                /***********
                 * Physics
                 ***********/
                // Update position and speed of each object
                for (const obj of draft) {
                    obj.x += obj.vx * delta;
                    obj.y += obj.vy * delta;

                    obj.vy += GRAVITY * delta;
                }

                /************
                 * Collisions
                 ************/
                const playerBBox = {
                    left: playerPosition - COLLISION_RADIUS,
                    top: gameHeight - 100,
                    right: playerPosition + COLLISION_RADIUS,
                    bottom: gameHeight - 75,
                };

                // Check if each game object intersects with the player object
                for (const obj of draft) {
                    const objBBox = {
                        left: obj.x - COLLISION_RADIUS / 2,
                        right: obj.x + COLLISION_RADIUS / 2,
                        top: obj.y - COLLISION_RADIUS / 2,
                        bottom: obj.y + COLLISION_RADIUS / 2,
                    }

                    if (areOverlappingBox(playerBBox, objBBox)) {
                        const objectScore = obj.score;
                        setScore(score => score + objectScore);
                        removeObject(draft, obj);
                    }
                }

                /***********
                 * World
                 ***********/
                // Remove any object which has fallen out of the world
                for (const obj of draft) {
                    if (obj.y > gameHeight + 100) {
                        removeObject(draft, obj);
                    }
                }

                /************************
                 * Difficulty Adjustments
                 ************************/
                // Spawn slighty faster each frame
                gameParamsRef.current.spawnRate *= SPAWN_CHANGE_RATE;
                // Increase difficulty slightly each frame
                gameParamsRef.current.difficulty *= DIFFICULTY_CHANGE_RATE;
            }));

            // Only request the next render if this effect is still active
            if (active) {
                requestAnimationFrame(loop);
            }
        }

        // Kick off first render
        requestAnimationFrame(loop);

        // Cancel the requestAnimationFrame loop when dismounting
        return () => { active = false; };
    }, []);

    // Calcuate time remaining for consumer
    const timeRemaining = gameParamsRef.current.endTime - Date.now();

    return {
        score,
        objects,
        timeRemaining,
        playerPosition,
    };
}

type BBox = { left: number; top: number; right: number; bottom: number; };

/**
 * Helper function to check if two bounding boxes interect
 */
function areOverlappingBox(a: BBox, b: BBox) {
    return a.left < b.right && b.left < a.right
        && a.top < b.bottom && b.top < a.bottom;
}

/**
 * Helper function to remove an item from a list
 */
function removeObject<T>(list: T[], object: T) {
    const index = list.indexOf(object);
    if (index > -1) {
        list.splice(index, 1);
    }
}

let nextID = 0;
/**
 * Helper function to spawn new objects
 */
function spawnObject(list: GameObject[], gameParams: GameParams) {
    let score, sprite;

    if (Math.random() < gameParams.foulRate) {
        score = GAME_SCORE_FOUL;
        sprite = Math.random() < 0.5 ? "e1" : "e2";
    }
    else {
        score = GAME_SCORE_GOAL;
        sprite = `p${Math.floor(Math.random() * 4) + 1}`;
    }

    list.push({
        id: nextID++,
        score,
        sprite,
        x: Math.random() * gameParams.gameWidth,
        y: -50,
        vx: 0,
        vy: DEFAULT_OBJECT_SPEED * gameParams.difficulty,
    });
}