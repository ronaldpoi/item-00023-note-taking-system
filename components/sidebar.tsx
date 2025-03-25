"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NoteList } from "@/components/note-list"
import { FolderList } from "@/components/folder-list"
import type { Note, SortOption, SortDirection } from "@/types/note"
import type { Folder } from "@/types/folder"
import { Plus, Search, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface SidebarProps {
  notes: Note[]
  folders: Folder[]
  selectedNote: Note | null
  selectedFolderId: string | null
  onSelectNote: (note: Note) => void
  onSelectFolder: (folderId: string | null) => void
  onCreate: () => void
  onDeleteNote: (noteId: string) => void
  onCreateFolder: (folder: Omit<Folder, "id" | "createdAt">) => void
  onUpdateFolder: (folder: Folder) => void
  onDeleteFolder: (folderId: string) => void
}

export function Sidebar({
  notes,
  folders,
  selectedNote,
  selectedFolderId,
  onSelectNote,
  onSelectFolder,
  onCreate,
  onDeleteNote,
  onCreateFolder,
  onUpdateFolder,
  onDeleteFolder,
}: SidebarProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  // Default sort without UI controls
  const sortOption: SortOption = "updatedAt"
  const sortDirection: SortDirection = "desc"

  // Extract all unique tags from notes
  const allTags = Array.from(new Set(notes.flatMap((note) => note.tags))).filter(Boolean)

  // Filter notes based on search term, selected tags, and selected folder
  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesTags = selectedTags.length === 0 || selectedTags.every((tag) => note.tags.includes(tag))

    const matchesFolder = selectedFolderId === null || note.folderId === selectedFolderId

    return matchesSearch && matchesTags && matchesFolder
  })

  // Sort filtered notes
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (sortOption === "title") {
      return sortDirection === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
    }

    const dateA = new Date(a[sortOption]).getTime()
    const dateB = new Date(b[sortOption]).getTime()

    return sortDirection === "asc" ? dateA - dateB : dateB - dateA
  })

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const clearSearch = () => {
    setSearchTerm("")
  }

  const clearFilters = () => {
    setSelectedTags([])
    setSearchTerm("")
  }

  // Update the filtered notes status bar text
  const isFiltered = searchTerm || selectedTags.length > 0

  const handleDeleteNote = (noteId: string) => {
    onDeleteNote(noteId)
  }

  // Get the current folder name
  const currentFolderName = selectedFolderId
    ? folders.find((folder) => folder.id === selectedFolderId)?.name || "All Notes"
    : "All Notes"

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold mb-4">Notes</h1>
        <Button onClick={onCreate} className="w-full mb-4">
          <Plus className="mr-2 h-4 w-4" /> New Note
        </Button>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 pr-8"
          />
          {searchTerm && (
            <Button variant="ghost" size="icon" className="absolute right-1 top-1.5 h-6 w-6" onClick={clearSearch}>
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>
      </div>

      <div className="p-2 border-b">
        <FolderList
          folders={folders}
          selectedFolderId={selectedFolderId}
          onSelectFolder={onSelectFolder}
          onCreateFolder={onCreateFolder}
          onUpdateFolder={onUpdateFolder}
          onDeleteFolder={onDeleteFolder}
        />
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-2 text-sm font-medium text-muted-foreground">{currentFolderName}</div>
        <NoteList
          notes={sortedNotes}
          selectedNote={selectedNote}
          onSelectNote={onSelectNote}
          onDeleteNote={handleDeleteNote}
        />
      </div>

      {allTags.length > 0 && (
        <div className="p-4 border-t">
          <div className="flex justify-between items-center mb-2">
            {selectedTags.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-6 px-2 ml-auto">
                Clear
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 border-t text-xs text-muted-foreground">
        {isFiltered ? `${notes.length} notes • ${filteredNotes.length} filtered` : `${notes.length} notes`}
      </div>
    </div>
  )
}

