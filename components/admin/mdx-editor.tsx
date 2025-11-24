'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { Eye, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Dynamically import MDEditor to avoid SSR issues
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

interface MDXEditorProps {
  value: string
  onChange: (value: string | undefined) => void
  placeholder?: string
  className?: string
  minHeight?: number
}

export default function MDXEditor({
  value,
  onChange,
  placeholder = 'Write your content in Markdown/MDX format...',
  className,
  minHeight = 400,
}: MDXEditorProps) {
  const [previewMode, setPreviewMode] = useState<'edit' | 'preview' | undefined>(undefined)

  return (
    <div className={cn('w-full', className)}>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-2 p-2 border rounded-t-lg bg-muted/50">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant={previewMode === 'edit' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setPreviewMode('edit')}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            type="button"
            variant={previewMode === 'preview' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setPreviewMode('preview')}
          >
            <Eye className="h-4 w-4 mr-1" />
            Preview
          </Button>
          <Button
            type="button"
            variant={previewMode === undefined ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setPreviewMode(undefined)}
          >
            Both
          </Button>
        </div>
        <div className="text-xs text-muted-foreground">
          Markdown & MDX supported
        </div>
      </div>

      {/* Editor */}
      <div data-color-mode="auto" className="md-editor-wrapper">
        <MDEditor
          value={value}
          onChange={onChange}
          preview={previewMode}
          hideToolbar={false}
          visibleDragbar={previewMode === undefined}
          height={minHeight}
          textareaProps={{
            placeholder,
            style: {
              fontSize: 14,
              fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
            },
          }}
        />
      </div>

      {/* Help Text */}
      <div className="mt-2 text-xs text-muted-foreground p-2 border rounded-b-lg bg-muted/30">
        <p className="mb-1">
          <strong>Markdown Tips:</strong> Use <code className="bg-muted px-1 py-0.5 rounded">#</code> for headings,{' '}
          <code className="bg-muted px-1 py-0.5 rounded">**bold**</code> for bold text,{' '}
          <code className="bg-muted px-1 py-0.5 rounded">`code`</code> for inline code.
        </p>
        <p>
          <strong>MDX Support:</strong> You can use React components in your content. Import them at the top of your markdown.
        </p>
      </div>
    </div>
  )
}

