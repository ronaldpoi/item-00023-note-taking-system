"use client"

import { useState } from "react"
import type { Note } from "@/types/note"
import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { MoreVertical, Edit, Trash } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

interface NoteListProps {
  notes: Note[]
  selectedNote: Note | null
  onSelectNote: (note: Note) => void
  onDeleteNote: (noteId: string) => void
}

export function NoteList({ notes, selectedNote, onSelectNote, onDeleteNote }: NoteListProps) {
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleDeleteClick = (noteId: string) => {
    // Close the dropdown menu first
    setDropdownOpen(false)

    // Then show the delete dialog
    setNoteToDelete(noteId)
    setShowDeleteDialog(true)
  }

  const handleConfirmDelete = () => {
    if (noteToDelete) {
      console.log("Deleting note from list:", noteToDelete)
      onDeleteNote(noteToDelete)
      setNoteToDelete(null)
    }
    setShowDeleteDialog(false)
  }

  const handleCancelDelete = () => {
    setNoteToDelete(null)
    setShowDeleteDialog(false)
  }

  if (notes.length === 0) {
    return <div className="p-4 text-center text-muted-foreground">No notes found</div>
  }

  return (
    <>
      <div className="divide-y">
        {notes.map((note) => (
          <div
            key={note.id}
            className={`p-4 cursor-pointer hover:bg-muted/50 ${
              selectedNote?.id === note.id ? "bg-muted" : ""
            } relative`}
          >
            <div onClick={() => onSelectNote(note)}>
              <h3 className="font-medium truncate pr-8">{note.title}</h3>
              <p className="text-sm text-muted-foreground truncate mt-1">
                {note.content.substring(0, 100) || "No content"}
              </p>
              <div className="flex items-center justify-between mt-2">
                <div className="flex flex-wrap gap-1">
                  {note.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {note.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{note.tags.length - 3}
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(note.updatedAt))}</span>
              </div>
            </div>

            <div className="absolute top-2 right-2" onClick={(e) => e.stopPropagation()}>
              <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <button className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-muted">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onSelectNote(note)}>
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Edit</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onSelect={(e) => {
                      // This prevents the default behavior of the DropdownMenuItem
                      e.preventDefault()
                      handleDeleteClick(note.id)
                    }}
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>

      {/* Custom delete confirmation dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background rounded-lg p-6 max-w-md w-full">
            <h2 className="text-lg font-semibold mb-2">Are you sure?</h2>
            <p className="text-muted-foreground mb-4">
              This action cannot be undone. This will permanently delete the note.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleCancelDelete}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleConfirmDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

