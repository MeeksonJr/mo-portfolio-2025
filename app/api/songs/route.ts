import { NextResponse } from 'next/server'
import { readdir } from 'fs/promises'
import { join } from 'path'

export async function GET() {
  try {
    const songsDir = join(process.cwd(), 'public', 'songs')
    const files = await readdir(songsDir)
    
    const songs = files
      .filter(file => file.endsWith('.mp3'))
      .map(file => ({
        title: file.replace('.mp3', ''),
        file: `/songs/${file}`
      }))
      .sort((a, b) => a.title.localeCompare(b.title))

    return NextResponse.json({ songs })
  } catch (error) {
    console.error('Error reading songs directory:', error)
    return NextResponse.json({ songs: [] }, { status: 500 })
  }
}
