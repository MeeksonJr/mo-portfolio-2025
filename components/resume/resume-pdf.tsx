import React from 'react'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

// Register fonts (you can add custom fonts later)
// Font.register({
//   family: 'Roboto',
//   src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxP.ttf',
// })

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 20,
    borderBottom: '2 solid #22c55e',
    paddingBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000000',
  },
  title: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 10,
  },
  contact: {
    fontSize: 9,
    color: '#666666',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#22c55e',
    borderBottom: '1 solid #e5e5e5',
    paddingBottom: 3,
  },
  experienceItem: {
    marginBottom: 12,
  },
  jobTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  company: {
    fontSize: 10,
    color: '#666666',
    marginBottom: 4,
  },
  date: {
    fontSize: 9,
    color: '#999999',
    fontStyle: 'italic',
  },
  bulletList: {
    marginLeft: 10,
    marginTop: 4,
  },
  bulletItem: {
    fontSize: 10,
    marginBottom: 3,
    paddingLeft: 5,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  skillTag: {
    fontSize: 9,
    backgroundColor: '#f0f0f0',
    padding: '3 6',
    borderRadius: 3,
    marginBottom: 3,
  },
  summary: {
    fontSize: 10,
    lineHeight: 1.5,
    color: '#333333',
    marginBottom: 5,
  },
})

interface ResumePDFProps {
  data: any
  format: 'ats' | 'creative' | 'traditional'
}

export function ResumePDF({ data, format }: ResumePDFProps) {
  const { personal, experience, education, skills, projects } = data

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{personal.name}</Text>
          <Text style={styles.title}>{personal.title}</Text>
          <View style={styles.contact}>
            <Text>{personal.email}</Text>
            {personal.phone && <Text>• {personal.phone}</Text>}
            <Text>• {personal.location}</Text>
            {personal.github && <Text>• {personal.github.replace(/^https?:\/\//, '')}</Text>}
            {personal.linkedin && <Text>• LinkedIn</Text>}
          </View>
        </View>

        {/* Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PROFESSIONAL SUMMARY</Text>
          <Text style={styles.summary}>{personal.summary}</Text>
        </View>

        {/* Experience */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PROFESSIONAL EXPERIENCE</Text>
          {experience.map((exp: any, idx: number) => (
            <View key={idx} style={styles.experienceItem}>
              <Text style={styles.jobTitle}>{exp.role}</Text>
              <Text style={styles.company}>
                {exp.company} {exp.location && `• ${exp.location}`}
              </Text>
              <Text style={styles.date}>
                {exp.startDate} - {exp.endDate}
              </Text>
              <View style={styles.bulletList}>
                {exp.description.map((desc: string, i: number) => (
                  <Text key={i} style={styles.bulletItem}>
                    • {desc}
                  </Text>
                ))}
              </View>
              {exp.achievements && exp.achievements.length > 0 && (
                <View style={styles.bulletList}>
                  <Text style={[styles.bulletItem, { fontWeight: 'bold' }]}>Key Achievements:</Text>
                  {exp.achievements.map((ach: string, i: number) => (
                    <Text key={i} style={styles.bulletItem}>
                      • {ach}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Education */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>EDUCATION</Text>
          {education.map((edu: any, idx: number) => (
            <View key={idx} style={styles.experienceItem}>
              <Text style={styles.jobTitle}>{edu.degree}</Text>
              <Text style={styles.company}>
                {edu.school} • {edu.location}
              </Text>
              {edu.gpa && <Text style={styles.date}>GPA: {edu.gpa}</Text>}
              <Text style={styles.date}>
                {edu.startDate} - {edu.endDate}
              </Text>
              {edu.achievements && edu.achievements.length > 0 && (
                <View style={styles.bulletList}>
                  {edu.achievements.map((ach: string, i: number) => (
                    <Text key={i} style={styles.bulletItem}>
                      • {ach}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Skills */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TECHNICAL SKILLS</Text>
          <View style={{ marginBottom: 5 }}>
            <Text style={styles.bulletItem}>
              <Text style={{ fontWeight: 'bold' }}>Frontend:</Text> {skills.frontend.join(', ')}
            </Text>
          </View>
          <View style={{ marginBottom: 5 }}>
            <Text style={styles.bulletItem}>
              <Text style={{ fontWeight: 'bold' }}>Backend:</Text> {skills.backend.join(', ')}
            </Text>
          </View>
          <View style={{ marginBottom: 5 }}>
            <Text style={styles.bulletItem}>
              <Text style={{ fontWeight: 'bold' }}>AI Tools:</Text> {skills.ai.join(', ')}
            </Text>
          </View>
          <View>
            <Text style={styles.bulletItem}>
              <Text style={{ fontWeight: 'bold' }}>Tools:</Text> {skills.tools.join(', ')}
            </Text>
          </View>
        </View>

        {/* Projects */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>KEY PROJECTS</Text>
          {projects.slice(0, 3).map((project: any, idx: number) => (
            <View key={idx} style={styles.experienceItem}>
              <Text style={styles.jobTitle}>{project.name}</Text>
              <Text style={styles.company}>{project.description}</Text>
              <Text style={styles.date}>{project.technologies.join(', ')}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  )
}

