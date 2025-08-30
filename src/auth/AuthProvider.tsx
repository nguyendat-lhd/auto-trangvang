import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { appwriteAccount } from '../lib/appwrite'
import type { AppwriteUser } from '../lib/appwrite'

type AuthContextValue = {
  user: AppwriteUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppwriteUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const current = await appwriteAccount.get()
        if (mounted) setUser(current)
      } catch {
        if (mounted) setUser(null)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  const login = async (email: string, password: string) => {
    await appwriteAccount.createEmailPasswordSession(email, password)
    const current = await appwriteAccount.get()
    setUser(current)
  }

  const logout = async () => {
    try {
      await appwriteAccount.deleteSessions()
    } finally {
      setUser(null)
    }
  }

  const value = useMemo<AuthContextValue>(() => ({ user, loading, login, logout }), [user, loading])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}


