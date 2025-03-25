"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Folder } from "@/types/folder"

interface FolderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (folder: Omit<Folder, "id" | "createdAt">) => void
  folder?: Folder // If provided, we're editing an existing folder
}

export function FolderDialog({ open, onOpenChange, onSave, folder }: FolderDialogProps) {
  const [name, setName] = useState(folder?.name || "")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      setError("Folder name is required")
      return
    }

    onSave({ name })
    onOpenChange(false)
    setName("")
    setError("")
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setName("")
      setError("")
    } else if (folder) {
      setName(folder.name)
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{folder ? "Edit Folder" : "Create Folder"}</DialogTitle>
            <DialogDescription>
              {folder ? "Update the folder name below." : "Create a new folder to organize your notes."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Folder Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (e.target.value.trim()) setError("")
                }}
                placeholder="Enter folder name"
                className={error ? "border-destructive" : ""}
              />
              {error && <p className="text-xs text-destructive">{error}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{folder ? "Save Changes" : "Create Folder"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

