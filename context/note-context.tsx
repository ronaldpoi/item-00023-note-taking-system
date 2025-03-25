"use client"

import type React from "react"

import { createContext, useContext } from "react"
import type { Note } from "@/types/note"

interface NoteContextType {
  notes: Note[]
  selectedNote: Note | null
  setSelectedNote: (note: Note | null) => void
  createNote: () => void
  updateNote: (note: Note) => void
  deleteNote: (noteId: string) => void
}

const NoteContext = createContext<NoteContextType | undefined>(undefined)

export function NoteProvider({
  children,
  value,
}: {
  children: React.ReactNode
  value: NoteContextType
}) {
  return <NoteContext.Provider value={value}>{children}</NoteContext.Provider>
}

export function useNotes() {
  const context = useContext(NoteContext)
  if (context === undefined) {
    throw new Error("useNotes must be used within a NoteProvider")
  }
  return context
}

