'use client'

import { useState } from 'react'
import { FileText, CheckCircle2, Calendar, Tag } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { CONTENT_TEMPLATES, type ContentTemplate } from '@/lib/content-templates'

interface ContentTemplatesSelectorProps {
  contentType?: ContentTemplate['contentType']
  onSelect: (template: ContentTemplate) => void
  onCancel?: () => void
}

export default function ContentTemplatesSelector({
  contentType,
  onSelect,
  onCancel,
}: ContentTemplatesSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')

  const filteredTemplates = contentType
    ? CONTENT_TEMPLATES.filter(t => t.contentType === contentType)
    : CONTENT_TEMPLATES

  const handleSelect = () => {
    const template = CONTENT_TEMPLATES.find(t => t.id === selectedTemplate)
    if (template) {
      onSelect(template)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold mb-2">Choose a Template</h3>
        <p className="text-muted-foreground">
          Select a template to get started with structured content creation
        </p>
      </div>

      <RadioGroup value={selectedTemplate} onValueChange={setSelectedTemplate}>
        <div className="grid gap-4">
          {filteredTemplates.map((template) => (
            <Label
              key={template.id}
              htmlFor={template.id}
              className="cursor-pointer"
            >
              <Card className={`transition-all ${
                selectedTemplate === template.id
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'hover:border-primary/50'
              }`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value={template.id} id={template.id} className="mt-1" />
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          {template.name}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {template.description}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline">
                      {template.contentType.replace('_', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-semibold mb-2">Structure:</p>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {template.structure.sections.map((section, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle2 className="h-3 w-3 text-primary" />
                            <span>
                              {section.title}
                              {section.required && (
                                <Badge variant="outline" className="ml-2 text-xs">Required</Badge>
                              )}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {template.suggestedSchedule && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Suggested: {template.suggestedSchedule.frequency} on{' '}
                          {template.suggestedSchedule.bestDays.join(', ')}
                        </span>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {template.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Label>
          ))}
        </div>
      </RadioGroup>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button onClick={handleSelect} disabled={!selectedTemplate}>
          Use Template
        </Button>
      </div>
    </div>
  )
}

