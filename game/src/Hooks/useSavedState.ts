import React, { useEffect, useState } from "react";

/**
 * Hook to save state in local storage
 */
export function useSavedState<T>(key: string, initialValue: T): [T, React.Dispatch<T>] {
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