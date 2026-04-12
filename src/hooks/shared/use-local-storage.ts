"use client"

import { useState } from "react"

// ─────────────────────────────────────────────────────────────────────────────
// useLocalStorage
// Syncs a piece of state with a localStorage key.
// Safe for SSR — reads/writes are guarded by typeof window checks.
// ─────────────────────────────────────────────────────────────────────────────

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue
    try {
      const item = window.localStorage.getItem(key)
      return item !== null ? (JSON.parse(item) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  function setValue(value: T) {
    try {
      setStoredValue(value)
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(value))
      }
    } catch (e) {
      console.error(e)
    }
  }

  function removeValue() {
    try {
      setStoredValue(initialValue)
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key)
      }
    } catch (e) {
      console.error(e)
    }
  }

  return { storedValue, setValue, removeValue }
}
