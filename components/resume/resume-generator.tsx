'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  User,
  Briefcase,
  GraduationCap,
  Award,
  Download,
  FileText,
  Sparkles,
  Plus,
  X,
} from 'lucide-react'
import { showSuccessToast, showErrorToast, showInfoToast } from '@/lib/toast-helpers'

interface PersonalInfo {
  fullName: string
  email: string
  phone: string
  location: string
  website?: string
  linkedin?: string
  github?: string
}

interface Experience {
  id: string
  title: string
  company: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  description: string
  achievements: string[]
}

interface Education {
  id: string
  degree: string
  institution: string
  location: string
  graduationDate: string
  gpa?: string
  honors?: string
}

interface Skill {
  id: string
  name: string
  category: string
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
}

interface Certification {
  id: string
  name: string
  issuer: string
  date: string
  expiryDate?: string
}

const RESUME_TEMPLATES = [
  { id: 'modern', name: 'Modern', description: 'Clean and professional' },
  { id: 'classic', name: 'Classic', description: 'Traditional format' },
  { id: 'creative', name: 'Creative', description: 'Stand out design' },
]

export default function ResumeGenerator() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedTemplate, setSelectedTemplate] = useState('modern')
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
  })
  const [summary, setSummary] = useState('')
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [educations, setEducations] = useState<Education[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const addExperience = () => {
    setExperiences([
      ...experiences,
      {
        id: `exp-${Date.now()}`,
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
        achievements: [],
      },
    ])
  }

  const removeExperience = (id: string) => {
    setExperiences(experiences.filter((exp) => exp.id !== id))
  }

  const addEducation = () => {
    setEducations([
      ...educations,
      {
        id: `edu-${Date.now()}`,
        degree: '',
        institution: '',
        location: '',
        graduationDate: '',
      },
    ])
  }

  const removeEducation = (id: string) => {
    setEducations(educations.filter((edu) => edu.id !== id))
  }

  const addSkill = () => {
    setSkills([
      ...skills,
      {
        id: `skill-${Date.now()}`,
        name: '',
        category: 'Technical',
        level: 'intermediate',
      },
    ])
  }

  const removeSkill = (id: string) => {
    setSkills(skills.filter((skill) => skill.id !== id))
  }

  const addCertification = () => {
    setCertifications([
      ...certifications,
      {
        id: `cert-${Date.now()}`,
        name: '',
        issuer: '',
        date: '',
      },
    ])
  }

  const removeCertification = (id: string) => {
    setCertifications(certifications.filter((cert) => cert.id !== id))
  }

  const handleGeneratePDF = async () => {
    setIsGenerating(true)
    try {
      // Transform resume generator data to match ResumePDF format
      const resumeData = {
        personal: {
          name: personalInfo.fullName || 'Your Name',
          title: summary.split('.')[0] || 'Professional', // Use first sentence of summary as title
          email: personalInfo.email || '',
          phone: personalInfo.phone || '',
          location: personalInfo.location || '',
          github: personalInfo.github?.startsWith('http') ? personalInfo.github : personalInfo.github ? `https://github.com/${personalInfo.github.replace(/^https?:\/\//, '').replace(/^github\.com\//, '')}` : '',
          linkedin: personalInfo.linkedin?.startsWith('http') ? personalInfo.linkedin : personalInfo.linkedin ? `https://linkedin.com/in/${personalInfo.linkedin.replace(/^https?:\/\//, '').replace(/^linkedin\.com\/in\//, '')}` : '',
          website: personalInfo.website || '',
          summary: summary || '',
        },
        experience: experiences.map((exp) => ({
          role: exp.title,
          company: exp.company,
          location: exp.location,
          startDate: exp.startDate,
          endDate: exp.current ? 'Present' : exp.endDate,
          description: exp.description.split('\n').filter((line) => line.trim()),
          achievements: exp.achievements || [],
        })),
        education: educations.map((edu) => ({
          degree: edu.degree,
          school: edu.institution,
          location: edu.location,
          startDate: edu.graduationDate ? new Date(edu.graduationDate).getFullYear().toString() : '',
          endDate: edu.graduationDate ? new Date(edu.graduationDate).getFullYear().toString() : 'Present',
          gpa: edu.gpa,
          achievements: edu.honors ? [edu.honors] : [],
        })),
        skills: {
          frontend: skills.filter((s) => s.category === 'Frontend').map((s) => s.name),
          backend: skills.filter((s) => s.category === 'Backend').map((s) => s.name),
          tools: skills.filter((s) => s.category === 'Tools').map((s) => s.name),
          other: skills.filter((s) => !['Frontend', 'Backend', 'Tools'].includes(s.category)).map((s) => s.name),
        },
        projects: [], // Can be populated if needed
        certifications: certifications.map((cert) => ({
          name: cert.name,
          issuer: cert.issuer,
          date: cert.date,
          expiryDate: cert.expiryDate,
        })),
      }

      // Call PDF generation API
      const response = await fetch('/api/resume/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: resumeData,
          format: selectedTemplate === 'creative' ? 'creative' : selectedTemplate === 'classic' ? 'traditional' : 'ats',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate PDF')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${personalInfo.fullName || 'resume'}-${selectedTemplate}-${new Date().getFullYear()}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      showSuccessToast('Resume PDF generated and downloaded successfully!')
    } catch (error) {
      console.error('Error generating PDF:', error)
      showErrorToast('Failed to generate PDF. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const totalSteps = 6

  return (
    <div className="container mx-auto py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Resume Generator</h1>
        <p className="text-muted-foreground">
          Create your professional resume using our templates
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div key={index} className="flex items-center flex-1">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep > index + 1
                    ? 'bg-primary text-primary-foreground border-primary'
                    : currentStep === index + 1
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background border-muted-foreground text-muted-foreground'
                }`}
              >
                {currentStep > index + 1 ? '✓' : index + 1}
              </div>
              {index < totalSteps - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    currentStep > index + 1 ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                {currentStep === 1 && 'Step 1: Personal Information'}
                {currentStep === 2 && 'Step 2: Professional Summary'}
                {currentStep === 3 && 'Step 3: Work Experience'}
                {currentStep === 4 && 'Step 4: Education'}
                {currentStep === 5 && 'Step 5: Skills & Certifications'}
                {currentStep === 6 && 'Step 6: Review & Generate'}
              </CardTitle>
              <CardDescription>
                Fill in your information to create a professional resume
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1: Personal Info */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={personalInfo.fullName}
                        onChange={(e) =>
                          setPersonalInfo({ ...personalInfo, fullName: e.target.value })
                        }
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={personalInfo.email}
                        onChange={(e) =>
                          setPersonalInfo({ ...personalInfo, email: e.target.value })
                        }
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        id="phone"
                        value={personalInfo.phone}
                        onChange={(e) =>
                          setPersonalInfo({ ...personalInfo, phone: e.target.value })
                        }
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location *</Label>
                      <Input
                        id="location"
                        value={personalInfo.location}
                        onChange={(e) =>
                          setPersonalInfo({ ...personalInfo, location: e.target.value })
                        }
                        placeholder="City, State"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={personalInfo.website}
                      onChange={(e) =>
                        setPersonalInfo({ ...personalInfo, website: e.target.value })
                      }
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <Input
                        id="linkedin"
                        value={personalInfo.linkedin}
                        onChange={(e) =>
                          setPersonalInfo({ ...personalInfo, linkedin: e.target.value })
                        }
                        placeholder="linkedin.com/in/username"
                      />
                    </div>
                    <div>
                      <Label htmlFor="github">GitHub</Label>
                      <Input
                        id="github"
                        value={personalInfo.github}
                        onChange={(e) =>
                          setPersonalInfo({ ...personalInfo, github: e.target.value })
                        }
                        placeholder="github.com/username"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Summary */}
              {currentStep === 2 && (
                <div>
                  <Label htmlFor="summary">Professional Summary</Label>
                  <Textarea
                    id="summary"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="Write a brief professional summary highlighting your experience and skills..."
                    className="min-h-[200px]"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={async () => {
                      try {
                        showInfoToast('Generating AI summary...')
                        const response = await fetch('/api/ai-summary', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            personalInfo,
                            experiences,
                            educations,
                            skills,
                            certifications,
                          }),
                        })

                        if (response.ok) {
                          const data = await response.json()
                          setSummary(data.summary || '')
                          showSuccessToast('AI summary generated!')
                        } else {
                          throw new Error('Failed to generate summary')
                        }
                      } catch (error) {
                        console.error('Error generating AI summary:', error)
                        showErrorToast('Failed to generate AI summary. Please try again.')
                      }
                    }}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate with AI
                  </Button>
                </div>
              )}

              {/* Step 3: Experience */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  {experiences.map((exp, index) => (
                    <Card key={exp.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Experience {index + 1}</CardTitle>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeExperience(exp.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Job Title *</Label>
                            <Input
                              value={exp.title}
                              onChange={(event) => {
                                const updated = experiences.map((e) =>
                                  e.id === exp.id ? { ...e, title: event.target.value } : e
                                )
                                setExperiences(updated)
                              }}
                              placeholder="Software Engineer"
                            />
                          </div>
                          <div>
                            <Label>Company *</Label>
                            <Input
                              value={exp.company}
                              onChange={(event) => {
                                const updated = experiences.map((e) =>
                                  e.id === exp.id ? { ...e, company: event.target.value } : e
                                )
                                setExperiences(updated)
                              }}
                              placeholder="Company Name"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label>Start Date *</Label>
                            <Input
                              type="month"
                              value={exp.startDate}
                              onChange={(event) => {
                                const updated = experiences.map((e) =>
                                  e.id === exp.id ? { ...e, startDate: event.target.value } : e
                                )
                                setExperiences(updated)
                              }}
                            />
                          </div>
                          <div>
                            <Label>End Date</Label>
                            <Input
                              type="month"
                              value={exp.endDate}
                              onChange={(event) => {
                                const updated = experiences.map((e) =>
                                  e.id === exp.id ? { ...e, endDate: event.target.value } : e
                                )
                                setExperiences(updated)
                              }}
                              disabled={exp.current}
                            />
                          </div>
                          <div className="flex items-end">
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={`current-${exp.id}`}
                                checked={exp.current}
                                onChange={(event) => {
                                  const updated = experiences.map((e) =>
                                    e.id === exp.id ? { ...e, current: event.target.checked } : e
                                  )
                                  setExperiences(updated)
                                }}
                                className="rounded"
                                aria-label="Current position"
                              />
                              <Label htmlFor={`current-${exp.id}`} className="cursor-pointer">
                                Current
                              </Label>
                            </div>
                          </div>
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Textarea
                            value={exp.description}
                            onChange={(event) => {
                              const updated = experiences.map((e) =>
                                e.id === exp.id ? { ...e, description: event.target.value } : e
                              )
                              setExperiences(updated)
                            }}
                            placeholder="Describe your role and responsibilities..."
                            className="min-h-[100px]"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Button variant="outline" onClick={addExperience} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Experience
                  </Button>
                </div>
              )}

              {/* Step 4: Education */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  {educations.map((edu, index) => (
                    <Card key={edu.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Education {index + 1}</CardTitle>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeEducation(edu.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Degree *</Label>
                            <Input
                              value={edu.degree}
                              onChange={(event) => {
                                const updated = educations.map((e) =>
                                  e.id === edu.id ? { ...e, degree: event.target.value } : e
                                )
                                setEducations(updated)
                              }}
                              placeholder="Bachelor of Science"
                            />
                          </div>
                          <div>
                            <Label>Institution *</Label>
                            <Input
                              value={edu.institution}
                              onChange={(event) => {
                                const updated = educations.map((e) =>
                                  e.id === edu.id ? { ...e, institution: event.target.value } : e
                                )
                                setEducations(updated)
                              }}
                              placeholder="University Name"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Graduation Date *</Label>
                            <Input
                              type="month"
                              value={edu.graduationDate}
                              onChange={(event) => {
                                const updated = educations.map((e) =>
                                  e.id === edu.id ? { ...e, graduationDate: event.target.value } : e
                                )
                                setEducations(updated)
                              }}
                            />
                          </div>
                          <div>
                            <Label>GPA (Optional)</Label>
                            <Input
                              value={edu.gpa || ''}
                              onChange={(event) => {
                                const updated = educations.map((e) =>
                                  e.id === edu.id ? { ...e, gpa: event.target.value } : e
                                )
                                setEducations(updated)
                              }}
                              placeholder="3.8"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Button variant="outline" onClick={addEducation} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Education
                  </Button>
                </div>
              )}

              {/* Step 5: Skills & Certifications */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Skills</h3>
                      <Button variant="outline" size="sm" onClick={addSkill}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Skill
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {skills.map((skill) => (
                        <div key={skill.id} className="flex items-center gap-2">
                          <Input
                            value={skill.name}
                            onChange={(e) => {
                              const updated = skills.map((s) =>
                                s.id === skill.id ? { ...s, name: e.target.value } : s
                              )
                              setSkills(updated)
                            }}
                            placeholder="Skill name"
                            className="flex-1"
                          />
                          <select
                            value={skill.level}
                            onChange={(event) => {
                              const updated = skills.map((s) =>
                                s.id === skill.id
                                  ? { ...s, level: event.target.value as Skill['level'] }
                                  : s
                              )
                              setSkills(updated)
                            }}
                            className="px-3 py-2 border rounded-md"
                            aria-label="Skill level"
                          >
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                            <option value="expert">Expert</option>
                          </select>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeSkill(skill.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Certifications</h3>
                      <Button variant="outline" size="sm" onClick={addCertification}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Certification
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {certifications.map((cert) => (
                        <div key={cert.id} className="flex items-center gap-2">
                          <Input
                            value={cert.name}
                            onChange={(e) => {
                              const updated = certifications.map((c) =>
                                c.id === cert.id ? { ...c, name: e.target.value } : c
                              )
                              setCertifications(updated)
                            }}
                            placeholder="Certification name"
                            className="flex-1"
                          />
                          <Input
                            value={cert.issuer}
                            onChange={(e) => {
                              const updated = certifications.map((c) =>
                                c.id === cert.id ? { ...c, issuer: e.target.value } : c
                              )
                              setCertifications(updated)
                            }}
                            placeholder="Issuer"
                            className="flex-1"
                          />
                          <Input
                            type="month"
                            value={cert.date}
                            onChange={(e) => {
                              const updated = certifications.map((c) =>
                                c.id === cert.id ? { ...c, date: e.target.value } : c
                              )
                              setCertifications(updated)
                            }}
                            className="w-32"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeCertification(cert.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 6: Review */}
              {currentStep === 6 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Review Your Resume</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold">Personal Information</h4>
                        <p className="text-sm text-muted-foreground">
                          {personalInfo.fullName || 'Not provided'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {personalInfo.email || 'Not provided'}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Summary</h4>
                        <p className="text-sm text-muted-foreground">
                          {summary || 'Not provided'}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Experience</h4>
                        <p className="text-sm text-muted-foreground">
                          {experiences.length} {experiences.length === 1 ? 'entry' : 'entries'}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Education</h4>
                        <p className="text-sm text-muted-foreground">
                          {educations.length} {educations.length === 1 ? 'entry' : 'entries'}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Skills</h4>
                        <p className="text-sm text-muted-foreground">
                          {skills.length} {skills.length === 1 ? 'skill' : 'skills'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>
                {currentStep < totalSteps ? (
                  <Button onClick={() => setCurrentStep(currentStep + 1)}>Next</Button>
                ) : (
                  <Button onClick={handleGeneratePDF} disabled={isGenerating}>
                    {isGenerating ? (
                      <>
                        <FileText className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Generate PDF
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Template Selector Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Template</CardTitle>
              <CardDescription>Choose a resume template</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {RESUME_TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`w-full p-4 text-left border-2 rounded-lg transition-colors ${
                    selectedTemplate === template.id
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="font-semibold">{template.name}</div>
                  <div className="text-sm text-muted-foreground">{template.description}</div>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
