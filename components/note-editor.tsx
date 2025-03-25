"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TagInput } from "@/components/tag-input"
import { FolderSelect } from "@/components/folder-select"
import { MarkdownPreview } from "@/components/markdown-preview"
import type { Note } from "@/types/note"
import type { Folder } from "@/types/folder"
import { Trash } from "lucide-react"

interface NoteEditorProps {
  note: Note
  folders: Folder[]
  onUpdate: (note: Note) => void
  onDelete: (noteId: string) => void
  onSelectFolder: (folderId: string | null) => void
}

export function NoteEditor({ note, folders, onUpdate, onDelete, onSelectFolder }: NoteEditorProps) {
  const [title, setTitle] = useState(note.title)
  const [content, setContent] = useState(note.content)
  const [tags, setTags] = useState<string[]>(note.tags)
  const [folderId, setFolderId] = useState<string | null>(note.folderId)
  const [activeTab, setActiveTab] = useState<string>("edit")
  const [isSaving, setIsSaving] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // Update local state when the selected note changes
  useEffect(() => {
    setTitle(note.title)
    setContent(note.content)
    setTags(note.tags)
    setFolderId(note.folderId)
  }, [note])

  const handleSave = () => {
    setIsSaving(true)

    const updatedNote: Note = {
      ...note,
      title: title || "Untitled Note",
      content,
      tags,
      folderId,
      updatedAt: new Date().toISOString(),
    }

    onUpdate(updatedNote)

    setTimeout(() => {
      setIsSaving(false)
    }, 500)
  }

  const handleDeleteClick = () => {
    setShowDeleteDialog(true)
  }

  const handleConfirmDelete = () => {
    console.log("Deleting note from editor:", note.id)
    onDelete(note.id)
    setShowDeleteDialog(false)
  }

  const handleCancelDelete = () => {
    setShowDeleteDialog(false)
  }

  const handleFolderChange = (newFolderId: string | null) => {
    setFolderId(newFolderId)
    // We don't call onSelectFolder here because that would change the sidebar filter
  }

  // Auto-save when content changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        title !== note.title ||
        content !== note.content ||
        JSON.stringify(tags) !== JSON.stringify(note.tags) ||
        folderId !== note.folderId
      ) {
        handleSave()
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [title, content, tags, folderId]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled Note"
          className="text-lg font-medium border border-black border-dashed focus:border-solid hover:border-solid px-2 py-1 h-auto"
        />
        <Button variant="destructive" size="icon" className=" ml-2" onClick={handleDeleteClick}>
          <Trash className="h-4 w-4" />
          <span className="sr-only">Delete note</span>
        </Button>
      </div>

      <div className="p-4 border-b">
        <FolderSelect folders={folders} selectedFolderId={folderId} onSelectFolder={handleFolderChange} />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="border-b px-4 bg-muted">
          <TabsList className="h-10">
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="split">Split</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="edit" className="flex-1 p-0 m-0">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note here using Markdown..."
            className="w-full h-full p-4 resize-none focus:outline-none font-mono text-sm"
          />
        </TabsContent>

        <TabsContent value="preview" className="flex-1 p-0 m-0">
          <div className="p-4 overflow-auto h-full">
            <MarkdownPreview content={content} />
          </div>
        </TabsContent>

        <TabsContent value="split" className="flex-1 p-0 m-0">
          <div className="grid grid-cols-2 h-full divide-x">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note here using Markdown..."
              className="w-full h-full p-4 resize-none focus:outline-none font-mono text-sm"
            />
            <div className="p-4 overflow-auto">
              <MarkdownPreview content={content} />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="p-4 border-t">
        <div className="grid grid-cols-2 gap-2 items-end">
          <TagInput tags={tags} setTags={setTags} showLabel={false} />
          <FolderSelect folders={folders} selectedFolderId={folderId} onSelectFolder={handleFolderChange} />
        </div>
      </div>

      <div className="p-2 border-t text-xs text-muted-foreground flex justify-between">
        <span>{isSaving ? "Saving..." : "Autosaved"}</span>
        <span>Last edited: {new Date(note.updatedAt).toLocaleString()}</span>
      </div>

      {/* Custom delete confirmation dialog */}
      {showDeleteDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          style={{ pointerEvents: "auto" }}
          onClick={(e) => {
            // Close when clicking the backdrop, but not when clicking the dialog
            if (e.target === e.currentTarget) {
              handleCancelDelete()
            }
          }}
        >
          <div className="bg-background rounded-lg p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
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
    </div>
  )
}

