import { useEffect, useState } from "react";

/**
 * @typedef LeaderboardEntry
 * @property {number} id
 * @property {string} playerName
 * @property {number} score
 * @property {string} submittedAt ISO 8601
 */

export function useLeaderboard() {
    const [leaderboard, setLeaderboard] = useState(/** @type {LeaderboardEntry[]} */([]));
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(/** @type {Error?} */(null));

    useEffect(() => {
        let active = true;

        setIsLoading(true);
        fetch('/api/leaderboard')
            .then(r => {
                if (r.ok) return r.json();
                throw new Error(`Unexpected response from server: [${r.status}] ${r.statusText}`);
            })
            .then(d => {
                if (active) {
                    setLeaderboard(d);
                }
            })
            .catch(setError)
            .finally(() => setIsLoading(false));

        const ws = new WebSocket('/api/leaderboard');

        ws.addEventListener("message", msg => {
            const data = JSON.parse(msg.data);
            setLeaderboard(data.leaderboard);

            // To avoid race condition at first load
            active = false;
        });

        return () => {
            active = false;

            ws.close();
        };
    }, []);

    /**
     * @param {number} id
     */
    function removeEntry(id) {
        return fetch(`/api/leaderboard/${id}`, {
            method: "DELETE",
        }).then(r => r.ok);
    }

    return {
        leaderboard,
        isLoading,
        error,
        removeEntry,
    };
}