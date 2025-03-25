"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FolderDialog } from "@/components/folder-dialog"
import type { Folder } from "@/types/folder"
import { FolderIcon, Plus, MoreVertical, Edit, Trash } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface FolderListProps {
  folders: Folder[]
  selectedFolderId: string | null
  onSelectFolder: (folderId: string | null) => void
  onCreateFolder: (folder: Omit<Folder, "id" | "createdAt">) => void
  onUpdateFolder: (folder: Folder) => void
  onDeleteFolder: (folderId: string) => void
}

export function FolderList({
  folders,
  selectedFolderId,
  onSelectFolder,
  onCreateFolder,
  onUpdateFolder,
  onDeleteFolder,
}: FolderListProps) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [folderToEdit, setFolderToEdit] = useState<Folder | undefined>(undefined)
  const [folderToDelete, setFolderToDelete] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleEditFolder = (folder: Folder) => {
    setFolderToEdit(folder)
    setEditDialogOpen(true)
    setDropdownOpen(false)
  }

  const handleDeleteClick = (folderId: string) => {
    setFolderToDelete(folderId)
    setShowDeleteDialog(true)
    setDropdownOpen(false)
  }

  const handleConfirmDelete = () => {
    if (folderToDelete) {
      onDeleteFolder(folderToDelete)
      setFolderToDelete(null)
    }
    setShowDeleteDialog(false)
  }

  const handleCancelDelete = () => {
    setFolderToDelete(null)
    setShowDeleteDialog(false)
  }

  const handleUpdateFolder = (updatedFolder: Omit<Folder, "id" | "createdAt">) => {
    if (folderToEdit) {
      onUpdateFolder({
        ...folderToEdit,
        name: updatedFolder.name,
      })
    }
    setFolderToEdit(undefined)
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between px-2 py-1.5">
        <h3 className="text-sm font-medium">Folders</h3>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          <span className="sr-only">Create folder</span>
        </Button>
      </div>

      <div>
        <Button
          variant="ghost"
          size="sm"
          className={`w-full justify-start ${selectedFolderId === null ? "bg-muted" : ""}`}
          onClick={() => onSelectFolder(null)}
        >
          <FolderIcon className="mr-2 h-4 w-4" />
          All Notes
        </Button>

        {folders.map((folder) => (
          <div key={folder.id} className="flex items-center group">
            <Button
              variant="ghost"
              size="sm"
              className={`flex-1 justify-start ${selectedFolderId === folder.id ? "bg-muted" : ""}`}
              onClick={() => onSelectFolder(folder.id)}
            >
              <FolderIcon className="mr-2 h-4 w-4" />
              {folder.name}
            </Button>

            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <MoreVertical className="h-3 w-3" />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                  <DropdownMenuItem onClick={() => handleEditFolder(folder)}>
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Rename</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onSelect={(e) => {
                      e.preventDefault()
                      handleDeleteClick(folder.id)
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

      <FolderDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} onSave={onCreateFolder} />

      <FolderDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleUpdateFolder}
        folder={folderToEdit}
      />

      {/* Custom delete confirmation dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background rounded-lg p-6 max-w-md w-full">
            <h2 className="text-lg font-semibold mb-2">Delete Folder?</h2>
            <p className="text-muted-foreground mb-4">
              This will delete the folder, but not the notes inside it. Notes will be moved to "All Notes".
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

