export interface Note {
  id: string
  title: string
  content: string
  tags: string[]
  folderId: string | null // null means "All notes" or uncategorized
  createdAt: string
  updatedAt: string
}

export type SortOption = "createdAt" | "updatedAt" | "title"
export type SortDirection = "asc" | "desc"

