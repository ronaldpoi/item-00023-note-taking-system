"use client"

import { Button } from "@/components/ui/button"
import { FileText, Plus } from "lucide-react"

interface EmptyStateProps {
  onCreate: () => void
}

export function EmptyState({ onCreate }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <FileText className="h-10 w-10 text-muted-foreground" />
      </div>
      <h2 className="mt-6 text-xl font-semibold">No note selected</h2>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm">
        Select a note from the sidebar or create a new one to get started.
      </p>
      <Button onClick={onCreate} className="mt-6">
        <Plus className="mr-2 h-4 w-4" /> Create a new note
      </Button>
    </div>
  )
}

