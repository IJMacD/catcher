import { useState } from "react";

/**
 * This hook implements the API for submitting scores to the leaderboard
 */
export function useLeaderBoard() {
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState(/** @type {string?} */(null));
    const [submissionID, setSubmissionID] = useState(NaN);

    /**
     * This function takes a player name and a score. After the request is
     * successful, the submissionID associated with the leaderboard entry is set.
     * @param {string} name
     * @param {number} score
     */
    function submitScore(name, score) {
        const body = new URLSearchParams();
        body.set("name", name);
        body.set("score", score.toString());

        fetch('/api/leaderboard', {
            method: "POST",
            body,
        })
            .then(r => {
                if (r.ok) return r.json();
                throw new Error(`Unexpected result from server: [${r.status}] ${r.statusText}`);
            })
            .then(d => {
                if (d.id) {
                    setSubmissionID(d.id);
                    setError(null);
                }
                else {
                    throw new Error(`Server did not return a submission ID`);
                }
            })
            .catch((/** @type {Error} */e) => {
                setError(e.message);
            })
            .finally(() => {
                setIsPending(false);
            });
    }

    return {
        submitScore,
        isPending,
        error,
        submissionID,
    };
}