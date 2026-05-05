'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      const msg =
        error.status === 429
          ? 'Too many requests — wait a few minutes before trying again.'
          : error.message
      setErrorMsg(msg)
      setStatus('error')
    } else {
      setStatus('sent')
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Atlas</h1>
          <p className="text-sm text-zinc-400">Sign in to your dashboard</p>
        </div>

        {status === 'sent' ? (
          <div className="rounded-lg border border-zinc-800 p-4 text-sm text-zinc-300">
            Check your inbox — magic link sent to <span className="text-zinc-100">{email}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm text-zinc-400">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-600 focus:outline-none"
              />
            </div>

            {status === 'error' && <p className="text-sm text-red-400">{errorMsg}</p>}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full rounded-lg bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-200 disabled:opacity-50 transition-colors"
            >
              {status === 'loading' ? 'Sending…' : 'Send magic link'}
            </button>
          </form>
        )}
      </div>
    </main>
  )
}
