import { useEffect, useState } from "react";

interface LeaderboardEntry {
    id: number;
    playerName: string;
    score: number;
    submittedAt: string;
}

export function useLeaderboard() {
    const [leaderboard, setLeaderboard] = useState([] as LeaderboardEntry[]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null as Error | null);

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
            setLeaderboard(data);

            // To avoid race condition at first load
            active = false;
        });

        return () => {
            active = false;

            ws.close();
        };
    }, []);

    async function removeEntry(id: number) {
        const r = await fetch(`/api/leaderboard/${id}`, {
            method: "DELETE",
        });
        return r.ok;
    }

    return {
        leaderboard,
        isLoading,
        error,
        removeEntry,
    };
}