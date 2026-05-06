import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { streakLength } from '@/lib/scoring/streaks'
import type { HabitLogEntry } from '@/types/scoring'

// Pin "today" to a fixed date so tests are deterministic
const FAKE_TODAY = '2026-05-06'

function makeDate(offsetDays: number): string {
  const d = new Date(FAKE_TODAY)
  d.setDate(d.getDate() + offsetDays)
  return d.toISOString().slice(0, 10)
}

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date(FAKE_TODAY))
})

afterEach(() => {
  vi.useRealTimers()
})

function completed(offsetDays: number): HabitLogEntry {
  return { date: makeDate(offsetDays), completed: true }
}

function missed(offsetDays: number): HabitLogEntry {
  return { date: makeDate(offsetDays), completed: false }
}

describe('streakLength', () => {
  it('returns 0 for empty entries', () => {
    expect(streakLength([])).toBe(0)
  })

  it('returns 0 when only missed entries exist', () => {
    expect(streakLength([missed(-1), missed(-2), missed(-3)])).toBe(0)
  })

  it('counts a single completed yesterday', () => {
    expect(streakLength([completed(-1)])).toBe(1)
  })

  it('counts today if completed', () => {
    expect(streakLength([completed(0)])).toBe(1)
  })

  it('counts today + yesterday', () => {
    expect(streakLength([completed(0), completed(-1)])).toBe(2)
  })

  it('counts consecutive days correctly', () => {
    const entries = [completed(-1), completed(-2), completed(-3), completed(-4), completed(-5)]
    expect(streakLength(entries)).toBe(5)
  })

  it('breaks at first unrecorded gap', () => {
    // Days -1, -2 done; -3 missing; -4, -5 done → streak = 2 (freeze on -3)
    // Actually: -1 and -2 done, -3 missing (uses freeze), -4 done = 4 streak
    // Unless -3 breaks it before freeze... let's test the freeze properly:
    // -1 done, -2 done, gap at -3 (no entry = missed → freeze used), -4 done
    const entries = [completed(-1), completed(-2), completed(-4)]
    // -3 has no entry → treated as missed → freeze used → streak continues
    // -5 has no entry → missed → no more freezes for May → break
    // streak = -1, -2, -3(freeze), -4 = 4
    expect(streakLength(entries)).toBe(4)
  })

  it('applies one freeze per calendar month', () => {
    // All of May (month = 2026-05) gets one freeze
    // -1 done, -2 missed (freeze used), -3 missed (no freeze left) → break after -2
    const entries = [completed(-1), missed(-2), missed(-3), completed(-4)]
    expect(streakLength(entries)).toBe(2) // -1 + -2(freeze)
  })

  it('freeze resets in a new calendar month', () => {
    // Today = 2026-05-06
    // -5 = May 1, -6 = Apr 30 (new month, fresh freeze)
    const aprilMissed = makeDate(-6) // Apr 30 — 2026-04-30
    const aprilDone1 = makeDate(-7) // Apr 29
    const aprilDone2 = makeDate(-8) // Apr 28

    const entries: HabitLogEntry[] = [
      completed(-1), // May 5
      completed(-2), // May 4
      completed(-3), // May 3
      completed(-4), // May 2
      completed(-5), // May 1
      { date: aprilMissed, completed: false }, // Apr 30 → freeze (April)
      { date: aprilDone1, completed: true }, // Apr 29
      { date: aprilDone2, completed: true }, // Apr 28
    ]

    // May: no misses → no freeze used in May
    // Apr 30 missed → uses April freeze → streak continues
    expect(streakLength(entries)).toBe(8)
  })

  it('two misses in the same month only first is absorbed', () => {
    // -1 done, -2 missed (freeze), -3 missed (no freeze) → streak = 2
    const entries = [completed(-1), missed(-2), missed(-3)]
    expect(streakLength(entries)).toBe(2)
  })

  it('does not count future days', () => {
    const entries = [completed(1), completed(2), completed(-1)]
    expect(streakLength(entries)).toBe(1)
  })

  it('streak of 0 when today and yesterday are both unrecorded', () => {
    // Only entries from 3+ days ago
    expect(streakLength([completed(-10), completed(-11)])).toBe(0)
  })
})
