// The CMS layer. With Supabase keys it reads/writes the database; without keys it shows the seed content.
import { createClient } from '@supabase/supabase-js'
import { seedPosts, seedProjects } from '../data/seed'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY
export const sb = url && key ? createClient(url, key) : null
export const cmsOn = !!sb

// all = true is used only by the admin panel (it also sees drafts and never falls back to seed data)
export async function getPosts(all = false) {
  if (!sb) return all ? [] : seedPosts
  let q = sb.from('posts').select('*').order('created_at', { ascending: false })
  if (!all) q = q.eq('published', true)
  const { data, error } = await q
  if (error) throw error
  return data
}

export async function getProjects(all = false) {
  if (!sb) return all ? [] : seedProjects
  const { data, error } = await sb.from('projects').select('*').order('sort_order').order('created_at')
  if (error) {
    if (all) throw error
    return seedProjects
  }
  return data
}

export async function saveRow(table, row) {
  const { id, ...rest } = row
  const { error } = id ? await sb.from(table).update(rest).eq('id', id) : await sb.from(table).insert(rest)
  if (error) throw error
}

export async function delRow(table, id) {
  const { error } = await sb.from(table).delete().eq('id', id)
  if (error) throw error
}

export async function uploadImage(file) {
  const path = `${Date.now()}-${file.name.replace(/[^a-z0-9.]/gi, '_')}`
  const { error } = await sb.storage.from('images').upload(path, file)
  if (error) throw error
  return sb.storage.from('images').getPublicUrl(path).data.publicUrl
}
