"use client"

import { useEffect, useState } from "react"
import { NoteProvider } from "@/context/note-context"
import { Sidebar } from "@/components/sidebar"
import { NoteEditor } from "@/components/note-editor"
import { EmptyState } from "@/components/empty-state"
import type { Note } from "@/types/note"
import type { Folder } from "@/types/folder"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"

export default function Home() {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  const [notes, setNotes] = useState<Note[]>([])
  const [folders, setFolders] = useState<Folder[]>([])
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Load notes and folders from local storage on initial render
  useEffect(() => {
    // Load notes
    const storedNotes = localStorage.getItem("notes")
    if (storedNotes) {
      try {
        const parsedNotes = JSON.parse(storedNotes)
        setNotes(parsedNotes)
      } catch (error) {
        console.error("Failed to parse notes from localStorage:", error)
        setNotes([])
      }
    }

    // Load folders
    const storedFolders = localStorage.getItem("folders")
    if (storedFolders) {
      try {
        const parsedFolders = JSON.parse(storedFolders)
        setFolders(parsedFolders)
      } catch (error) {
        console.error("Failed to parse folders from localStorage:", error)
        setFolders([])
      }
    }
  }, [])

  // Save notes and folders to local storage whenever they change
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes))
  }, [notes])

  useEffect(() => {
    localStorage.setItem("folders", JSON.stringify(folders))
  }, [folders])

  const handleSelectNote = (note: Note) => {
    setSelectedNote(note)
  }

  const handleSelectFolder = (folderId: string | null) => {
    setSelectedFolderId(folderId)
  }

  const handleCreateNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "Untitled Note",
      content: "",
      tags: [],
      folderId: selectedFolderId, // Assign to current selected folder
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setNotes([newNote, ...notes])
    setSelectedNote(newNote)
  }

  const handleUpdateNote = (updatedNote: Note | null) => {
    if (updatedNote === null) {
      setSelectedNote(null)
      return
    }

    const updatedNotes = notes.map((note) => (note.id === updatedNote.id ? updatedNote : note))
    setNotes(updatedNotes)
    setSelectedNote(updatedNote)
  }

  const handleDeleteNote = (noteId: string) => {
    console.log("Deleting note with ID:", noteId)

    // Create a new array without the deleted note
    const updatedNotes = notes.filter((note) => note.id !== noteId)

    // Update state with the new array
    setNotes(updatedNotes)

    // If the deleted note is currently selected, clear the selection
    if (selectedNote && selectedNote.id === noteId) {
      setSelectedNote(null)
    }

    // Update localStorage immediately
    localStorage.setItem("notes", JSON.stringify(updatedNotes))
  }

  const handleCreateFolder = (folderData: Omit<Folder, "id" | "createdAt">) => {
    const newFolder: Folder = {
      id: Date.now().toString(),
      name: folderData.name,
      createdAt: new Date().toISOString(),
    }

    const updatedFolders = [...folders, newFolder]
    setFolders(updatedFolders)

    // Update localStorage immediately
    localStorage.setItem("folders", JSON.stringify(updatedFolders))
  }

  const handleUpdateFolder = (updatedFolder: Folder) => {
    const updatedFolders = folders.map((folder) => (folder.id === updatedFolder.id ? updatedFolder : folder))
    setFolders(updatedFolders)

    // Update localStorage immediately
    localStorage.setItem("folders", JSON.stringify(updatedFolders))
  }

  const handleDeleteFolder = (folderId: string) => {
    // Remove the folder
    const updatedFolders = folders.filter((folder) => folder.id !== folderId)
    setFolders(updatedFolders)

    // Move notes from this folder to "All Notes" (null folderId)
    const updatedNotes = notes.map((note) => (note.folderId === folderId ? { ...note, folderId: null } : note))
    setNotes(updatedNotes)

    // If the deleted folder is currently selected, clear the selection
    if (selectedFolderId === folderId) {
      setSelectedFolderId(null)
    }

    // Update localStorage immediately
    localStorage.setItem("folders", JSON.stringify(updatedFolders))
    localStorage.setItem("notes", JSON.stringify(updatedNotes))
  }

  const renderContent = () => {
    if (selectedNote) {
      return (
        <NoteEditor
          note={selectedNote}
          folders={folders}
          onUpdate={handleUpdateNote}
          onDelete={handleDeleteNote}
          onSelectFolder={handleSelectFolder}
        />
      )
    }
    return <EmptyState onCreate={handleCreateNote} />
  }

  const renderSidebar = () => (
    <Sidebar
      notes={notes}
      folders={folders}
      selectedNote={selectedNote}
      selectedFolderId={selectedFolderId}
      onSelectNote={handleSelectNote}
      onSelectFolder={handleSelectFolder}
      onCreate={handleCreateNote}
      onDeleteNote={handleDeleteNote}
      onCreateFolder={handleCreateFolder}
      onUpdateFolder={handleUpdateFolder}
      onDeleteFolder={handleDeleteFolder}
    />
  )

  return (
    <NoteProvider
      value={{
        notes,
        selectedNote,
        setSelectedNote,
        createNote: handleCreateNote,
        updateNote: handleUpdateNote,
        deleteNote: handleDeleteNote,
      }}
    >
      <main className="flex h-screen w-full overflow-hidden">
        {isMobile ? (
          <>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="absolute left-4 top-4 z-10 md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle sidebar</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-[280px]">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                {renderSidebar()}
              </SheetContent>
            </Sheet>
            <div className="flex-1 overflow-auto">{renderContent()}</div>
          </>
        ) : (
          <>
            <div className="w-[280px] border-r h-full">{renderSidebar()}</div>
            <div className="flex-1 overflow-auto">{renderContent()}</div>
          </>
        )}
      </main>
    </NoteProvider>
  )
}

