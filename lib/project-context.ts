/**
 * Server-side utility to get current project ID from cookie/header
 */
import { cookies } from 'next/headers'

export async function getCurrentProjectId(): Promise<string | undefined> {
  const cookieStore = await cookies()
  const projectId = cookieStore.get('architectflow_project_id')?.value
  return projectId
}

export function setCurrentProjectId(projectId: string): void {
  // This would be set client-side via localStorage
  // Server-side reading only
}
