"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown, FolderIcon } from "lucide-react"
import type { Folder } from "@/types/folder"

interface FolderSelectProps {
  folders: Folder[]
  selectedFolderId: string | null
  onSelectFolder: (folderId: string | null) => void
}

export function FolderSelect({ folders, selectedFolderId, onSelectFolder }: FolderSelectProps) {
  const [open, setOpen] = useState(false)

  const selectedFolder = selectedFolderId ? folders.find((folder) => folder.id === selectedFolderId) : null

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          <div className="flex items-center">
            <FolderIcon className="mr-2 h-4 w-4" />
            {selectedFolder ? selectedFolder.name : "All Notes"}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  onSelectFolder(null)
                  setOpen(false)
                }}
                className="flex items-center"
              >
                <FolderIcon className="mr-2 h-4 w-4" />
                <span>All Notes</span>
                {selectedFolderId === null && <Check className="ml-auto h-4 w-4" />}
              </CommandItem>
              {folders.map((folder) => (
                <CommandItem
                  key={folder.id}
                  onSelect={() => {
                    onSelectFolder(folder.id)
                    setOpen(false)
                  }}
                  className="flex items-center"
                >
                  <FolderIcon className="mr-2 h-4 w-4" />
                  <span>{folder.name}</span>
                  {selectedFolderId === folder.id && <Check className="ml-auto h-4 w-4" />}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

