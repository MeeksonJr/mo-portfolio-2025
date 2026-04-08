import { cache } from 'react'

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const GITHUB_USERNAME = 'MeeksonJr'

export const getGithubUser = cache(async () => {
  if (!GITHUB_TOKEN) return null

  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    })
    
    if (!res.ok) return null
    return res.json()
  } catch (e) {
    console.error('Error fetching GitHub user:', e)
    return null
  }
})

export const getGithubRepos = cache(async () => {
  if (!GITHUB_TOKEN) return []

  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
      next: { revalidate: 3600 }
    })
    
    if (!res.ok) return []
    return res.json()
  } catch (e) {
    console.error('Error fetching GitHub repos:', e)
    return []
  }
})
