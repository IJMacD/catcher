import React, { useEffect, useState } from "react";

/**
 * Hook to save state in local storage
 * @template T
 * @param {string} key
 * @param {T} initialValue
 * @returns {[T, React.Dispatch<T>]}
 */
export function useSavedState(key, initialValue) {
    const [state, setState] = useState(() => {
        const savedValue = localStorage.getItem(key);

        if (typeof savedValue === "string") {
            try {
                return JSON.parse(savedValue);
            }
            catch (e) { }
        }

        return initialValue;
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(state));
    }, [state]);

    return [state, setState];
}