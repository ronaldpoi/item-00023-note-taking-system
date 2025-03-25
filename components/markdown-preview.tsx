"use client"

import { useEffect, useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism"
import mermaid from "mermaid"

interface MarkdownPreviewProps {
  content: string
}

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  const [mermaidSvgs, setMermaidSvgs] = useState<Record<string, string>>({})

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "default",
    })
  }, [])

  useEffect(() => {
    // Find all mermaid code blocks
    const mermaidBlocks: Record<string, string> = {}
    const regex = /```mermaid\n([\s\S]*?)```/g
    let match

    while ((match = regex.exec(content)) !== null) {
      const id = `mermaid-${Math.random().toString(36).substring(2, 11)}`
      mermaidBlocks[id] = match[1]
    }

    // Render mermaid diagrams
    const renderDiagrams = async () => {
      const svgs: Record<string, string> = {}

      for (const [id, code] of Object.entries(mermaidBlocks)) {
        try {
          const { svg } = await mermaid.render(id, code)
          svgs[id] = svg
        } catch (error) {
          console.error("Failed to render mermaid diagram:", error)
          svgs[id] = `<div class="text-red-500">Failed to render diagram</div>`
        }
      }

      setMermaidSvgs(svgs)
    }

    if (Object.keys(mermaidBlocks).length > 0) {
      renderDiagrams()
    }
  }, [content])

  // Replace mermaid code blocks with rendered SVGs
  const processedContent = content.replace(/```mermaid\n([\s\S]*?)```/g, (_, code) => {
    const id = `mermaid-${Math.random().toString(36).substring(2, 11)}`
    return `<div class="mermaid-placeholder" data-id="${id}"></div>`
  })

  return (
    <div className="prose prose-sm max-w-none dark:prose-invert">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "")
            return !inline && match ? (
              <SyntaxHighlighter style={tomorrow} language={match[1]} PreTag="div" {...props}>
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            )
          },
          // Custom handling for mermaid placeholders
          div: ({ node, className, ...props }) => {
            if (className === "mermaid-placeholder" && props["data-id"]) {
              const id = props["data-id"] as string
              if (mermaidSvgs[id]) {
                return <div dangerouslySetInnerHTML={{ __html: mermaidSvgs[id] }} className="my-4" />
              }
              return <div className="my-4 p-4 bg-muted rounded">Loading diagram...</div>
            }
            return <div {...props} />
          },
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  )
}

