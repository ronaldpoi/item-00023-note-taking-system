"use client"

import { useState, useEffect } from "react"

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)

    // Update the state initially
    setMatches(media.matches)

    // Add event listener for changes
    const listener = () => setMatches(media.matches)
    media.addEventListener("change", listener)

    // Clean up on unmount
    return () => media.removeEventListener("change", listener)
  }, [query])

  return matches
}

