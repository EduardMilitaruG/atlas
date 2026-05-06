import { describe, it, expect } from 'vitest'
import { dailyLifeScore, healthIndex, productivityScore } from '@/lib/scoring/daily'
import type { DailyLogInput } from '@/types/scoring'

const base: DailyLogInput = {
  sleep_hours: 7.5,
  mood: 5,
  cigarettes_count: 0,
  weekly_cig_target: 5,
  hard_thing_done: true,
  minox_am: true,
  finasteride: true,
  workout_logged: true,
  steps_count: 0,
  journaled: true,
}

describe('dailyLifeScore', () => {
  it('returns 100 for a perfect day', () => {
    expect(dailyLifeScore(base)).toBe(100)
  })

  it('returns 0 for a zero day', () => {
    const log: DailyLogInput = {
      ...base,
      sleep_hours: 0,
      mood: 0,
      hard_thing_done: false,
      minox_am: false,
      finasteride: false,
      workout_logged: false,
      steps_count: 0,
      journaled: false,
      cigarettes_count: 10,
      weekly_cig_target: 5,
    }
    expect(dailyLifeScore(log)).toBe(0)
  })

  describe('sleep component (max 25)', () => {
    it('gives 25 pts for exactly 7.5h', () => {
      const log = { ...base, sleep_hours: 7.5 }
      // sleep = 25, movement = 20, mood = 15, habits = 20, hard = 20 = 100
      expect(dailyLifeScore(log)).toBe(100)
    })

    it('gives 25 pts for 9h (capped)', () => {
      const log = { ...base, sleep_hours: 9 }
      expect(dailyLifeScore(log)).toBe(100)
    })

    it('gives 0 sleep pts for 0h', () => {
      const log = { ...base, sleep_hours: 0 }
      // sleep=0, movement=20, mood=15, habits=20, hard=20 = 75
      expect(dailyLifeScore(log)).toBe(75)
    })

    it('scales linearly below 7.5h', () => {
      const log = { ...base, sleep_hours: 3.75 }
      // sleep = (3.75/7.5)*25 = 12.5 → rounds with rest of score
      const score = dailyLifeScore(log)
      expect(score).toBeGreaterThan(74)
      expect(score).toBeLessThan(90)
    })
  })

  describe('movement component (max 20)', () => {
    it('gives 20 pts when workout logged', () => {
      const log = { ...base, workout_logged: true, steps_count: 0 }
      expect(dailyLifeScore(log)).toBe(100)
    })

    it('gives 20 pts for 8000+ steps without workout', () => {
      const log = { ...base, workout_logged: false, steps_count: 8000 }
      expect(dailyLifeScore(log)).toBe(100)
    })

    it('gives 10 pts for 4000–7999 steps without workout', () => {
      const log = { ...base, workout_logged: false, steps_count: 4000 }
      // 100 - 10 = 90
      expect(dailyLifeScore(log)).toBe(90)
    })

    it('gives 0 pts for <4000 steps without workout', () => {
      const log = { ...base, workout_logged: false, steps_count: 3999 }
      expect(dailyLifeScore(log)).toBe(80)
    })
  })

  describe('mood component (max 15)', () => {
    it('gives 15 pts for mood=5', () => {
      expect(dailyLifeScore({ ...base, mood: 5 })).toBe(100)
    })

    it('gives 0 pts for mood=0', () => {
      const log = { ...base, mood: 0 }
      // 100 - 15 = 85
      expect(dailyLifeScore(log)).toBe(85)
    })

    it('gives 9 pts for mood=3', () => {
      const log = { ...base, mood: 3 }
      // mood = (3/5)*15 = 9, total = 25+20+9+20+20 = 94
      expect(dailyLifeScore(log)).toBe(94)
    })
  })

  describe('habits component (max 20, 5 pts each)', () => {
    it('minox_am=false loses 5 pts', () => {
      expect(dailyLifeScore({ ...base, minox_am: false })).toBe(95)
    })

    it('finasteride=false loses 5 pts', () => {
      expect(dailyLifeScore({ ...base, finasteride: false })).toBe(95)
    })

    it('journaled=false loses 5 pts', () => {
      expect(dailyLifeScore({ ...base, journaled: false })).toBe(95)
    })

    it('cigs over target loses 5 pts', () => {
      const log = { ...base, cigarettes_count: 6, weekly_cig_target: 5 }
      expect(dailyLifeScore(log)).toBe(95)
    })

    it('cigs at target keeps 5 pts', () => {
      const log = { ...base, cigarettes_count: 5, weekly_cig_target: 5 }
      expect(dailyLifeScore(log)).toBe(100)
    })
  })

  describe('hard thing component (20 pts)', () => {
    it('hard_thing_done=false loses 20 pts', () => {
      expect(dailyLifeScore({ ...base, hard_thing_done: false })).toBe(80)
    })
  })

  it('score is always an integer', () => {
    const log = { ...base, sleep_hours: 6.3, mood: 3 }
    expect(Number.isInteger(dailyLifeScore(log))).toBe(true)
  })
})

describe('healthIndex', () => {
  const log7: DailyLogInput = {
    ...base,
    sleep_hours: 7.5,
    mood: 5,
    workout_logged: true,
    cigarettes_count: 0,
    weekly_cig_target: 5,
  }

  it('returns 100 for a perfect week', () => {
    const logs = Array.from({ length: 7 }, () => ({ ...log7 }))
    expect(healthIndex(logs)).toBe(100)
  })

  it('returns 0 for empty logs', () => {
    expect(healthIndex([])).toBe(0)
  })

  it('weights sleep at 40%', () => {
    // 0 sleep, everything else perfect
    const logs = Array.from({ length: 7 }, () => ({
      ...log7,
      sleep_hours: 0,
    }))
    // sleep=0, workout=30, smoking=15, mood=15 = 60
    expect(healthIndex(logs)).toBe(60)
  })

  it('weights workout at 30%', () => {
    const logs = Array.from({ length: 7 }, () => ({
      ...log7,
      workout_logged: false,
    }))
    // sleep=40, workout=0, smoking=15, mood=15 = 70
    expect(healthIndex(logs)).toBe(70)
  })

  it('weights mood at 15%', () => {
    const logs = Array.from({ length: 7 }, () => ({ ...log7, mood: 0 }))
    // sleep=40, workout=30, smoking=15, mood=0 = 85
    expect(healthIndex(logs)).toBe(85)
  })

  it('smoking: all over target scores 0 on that component', () => {
    const logs = Array.from({ length: 7 }, () => ({
      ...log7,
      cigarettes_count: 10,
      weekly_cig_target: 5,
    }))
    // sleep=40, workout=30, smoking=0, mood=15 = 85
    expect(healthIndex(logs)).toBe(85)
  })

  it('returns an integer', () => {
    const logs = Array.from({ length: 7 }, () => ({ ...log7, sleep_hours: 6 }))
    expect(Number.isInteger(healthIndex(logs))).toBe(true)
  })
})

describe('productivityScore', () => {
  it('returns 100 for maximum inputs', () => {
    expect(
      productivityScore({
        applicationsThisWeek: 35,
        skillsPracticeHours: 7,
        readingMinutes: 210,
        deepWorkHours: 14,
      })
    ).toBe(100)
  })

  it('returns 0 for zero inputs', () => {
    expect(
      productivityScore({
        applicationsThisWeek: 0,
        skillsPracticeHours: 0,
        readingMinutes: 0,
        deepWorkHours: 0,
      })
    ).toBe(0)
  })

  it('caps at 100 for over-target inputs', () => {
    expect(
      productivityScore({
        applicationsThisWeek: 100,
        skillsPracticeHours: 100,
        readingMinutes: 1000,
        deepWorkHours: 100,
      })
    ).toBe(100)
  })

  it('weights applications at 50%', () => {
    expect(
      productivityScore({
        applicationsThisWeek: 35,
        skillsPracticeHours: 0,
        readingMinutes: 0,
        deepWorkHours: 0,
      })
    ).toBe(50)
  })

  it('weights skills at 25%', () => {
    expect(
      productivityScore({
        applicationsThisWeek: 0,
        skillsPracticeHours: 7,
        readingMinutes: 0,
        deepWorkHours: 0,
      })
    ).toBe(25)
  })

  it('weights reading at 15%', () => {
    expect(
      productivityScore({
        applicationsThisWeek: 0,
        skillsPracticeHours: 0,
        readingMinutes: 210,
        deepWorkHours: 0,
      })
    ).toBe(15)
  })

  it('weights deep work at 10%', () => {
    expect(
      productivityScore({
        applicationsThisWeek: 0,
        skillsPracticeHours: 0,
        readingMinutes: 0,
        deepWorkHours: 14,
      })
    ).toBe(10)
  })

  it('returns an integer', () => {
    expect(
      Number.isInteger(
        productivityScore({
          applicationsThisWeek: 7,
          skillsPracticeHours: 2,
          readingMinutes: 45,
          deepWorkHours: 3,
        })
      )
    ).toBe(true)
  })
})
