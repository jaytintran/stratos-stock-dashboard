"use client";

// useCallback: Memoizes functions to prevent recreation on re-renders
// useRef: Creates a mutable reference that persists across re-renders without causing re-renders
import { useCallback, useRef } from "react";

// Export a custom hook that accepts a callback function and an optional delay (default 300ms)
export function useDebounce(callback: () => void, delay: number = 300) {
	// Create a ref to store the timeout ID - persists across re-renders without causing them
	/* 
	<NodeJS.Timeout>:
	This is TypeScript generic syntax with a union type:
		useRef<T> - Generic type parameter specifying what type the ref will hold
		NodeJS.Timeout - The type returned by setTimeout in Node.js environment
		| null - Union type operator, meaning the value can be either NodeJS.Timeout OR null
		The ref starts as null and will hold a timeout ID once setTimeout is called
	*/
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	// Return a memoized debounced function that only changes if callback or delay changes
	return useCallback(() => {
		// If there's an existing timeout, cancel it to reset the debounce timer
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		// Set a new timeout that will execute the callback after the delay period
		timeoutRef.current = setTimeout(callback, delay);
	}, [callback, delay]); // Dependencies: recreate this function only if callback or delay changes
}
