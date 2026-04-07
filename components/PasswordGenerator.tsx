'use client'

import { useState, useCallback, useEffect } from 'react'
import { adjectives, animals, uniqueNamesGenerator } from 'unique-names-generator'

type Mode = 'random' | 'memorable'

function generateRandom(length: number, opts: { upper: boolean; lower: boolean; numbers: boolean; symbols: boolean }): string {
  let chars = ''
  if (opts.upper)   chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  if (opts.lower)   chars += 'abcdefghijklmnopqrstuvwxyz'
  if (opts.numbers) chars += '0123456789'
  if (opts.symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?'
  if (!chars)       chars  = 'abcdefghijklmnopqrstuvwxyz'
  const arr = new Uint32Array(length)
  crypto.getRandomValues(arr)
  return Array.from(arr, x => chars[x % chars.length]).join('')
}

function generateMemorable(wordCount: number, capitalize: boolean, appendNumber: boolean): string {
  const dicts = Array.from({ length: wordCount }, (_, i) => i % 2 === 0 ? adjectives : animals)
  const words = uniqueNamesGenerator({ dictionaries: dicts, style: capitalize ? 'capital' : 'lower', separator: '-' })
  if (!appendNumber) return words
  const arr = new Uint32Array(1)
  crypto.getRandomValues(arr)
  return words + '-' + (arr[0] % 1000).toString().padStart(3, '0')
}

function getStrength(pw: string): { score: number; label: string; color: string } {
  if (!pw) return { score: 0, label: '', color: '' }
  let s = 0
  if (pw.length >= 12) s++
  if (pw.length >= 20) s++
  if (/[A-Z]/.test(pw)) s++
  if (/[a-z]/.test(pw)) s++
  if (/[0-9]/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  if (s <= 1) return { score: 1, label: 'Weak',        color: '#f87171' }
  if (s <= 2) return { score: 2, label: 'Fair',        color: '#fb923c' }
  if (s <= 3) return { score: 3, label: 'Good',        color: '#facc15' }
  if (s <= 4) return { score: 4, label: 'Strong',      color: '#86efac' }
  return             { score: 5, label: 'Very Strong', color: '#4ade80' }
}

export default function PasswordGenerator() {
  const [mode,      setMode]      = useState<Mode>('random')
  const [length,    setLength]    = useState(20)
  const [wordCount,   setWordCount]   = useState(3)
  const [memCaps,     setMemCaps]     = useState(true)
  const [memNumbers,  setMemNumbers]  = useState(true)
  const [upper,     setUpper]     = useState(true)
  const [lower,     setLower]     = useState(true)
  const [numbers,   setNumbers]   = useState(true)
  const [symbols,   setSymbols]   = useState(false)
  const [password,  setPassword]  = useState('')
  const [copied,    setCopied]    = useState(false)

  const generate = useCallback(() => {
    setPassword(
      mode === 'random'
        ? generateRandom(length, { upper, lower, numbers, symbols })
        : generateMemorable(wordCount, memCaps, memNumbers)
    )
  }, [mode, length, wordCount, upper, lower, numbers, symbols, memCaps, memNumbers])

  useEffect(() => { generate() }, [generate])

  const copy = async () => {
    if (!password) return
    await navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const strength = getStrength(password)

  const Toggle = ({ label, active, onToggle }: { label: string; active: boolean; onToggle: () => void }) => (
    <button
      onClick={onToggle}
      className={`px-3 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all cursor-pointer border ${
        active
          ? 'bg-slate-200 text-slate-900 border-slate-200'
          : 'bg-transparent text-slate-500 border-slate-700 hover:border-slate-500 hover:text-slate-400'
      }`}
    >
      {label}
    </button>
  )

  return (
    <div className="min-h-screen bg-[#0c0c0c] flex items-center justify-center p-6">
      <div className="w-full max-w-[420px] flex flex-col gap-1">

        {/* Header */}
        <div className="flex items-center gap-3 px-1 mb-4">
          <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C9.24 2 7 4.24 7 7v2H5v13h14V9h-2V7c0-2.76-2.24-5-5-5zm0 2c1.66 0 3 1.34 3 3v2H9V7c0-1.66 1.34-3 3-3zm0 9a2 2 0 110 4 2 2 0 010-4z" fill="#94a3b8"/>
            </svg>
          </div>
          <span className="text-sm font-semibold text-slate-400 tracking-wide uppercase">Password Generator</span>
        </div>

        {/* Card */}
        <div className="bg-[#141414] border border-[#242424] rounded-2xl overflow-hidden">

          {/* Password display */}
          <div className="px-6 pt-6 pb-4">
            <div className="relative group">
              <div className="font-mono text-[17px] font-medium tracking-wide text-slate-100 break-all leading-relaxed min-h-[56px] select-all pr-20">
                {password || <span className="text-slate-600">Generating…</span>}
              </div>
              {/* Actions — float top-right */}
              <div className="absolute top-0 right-0 flex gap-1">
                <button
                  onClick={generate}
                  title="New password"
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:text-slate-300 hover:bg-white/5 transition-all cursor-pointer"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="23 4 23 10 17 10"/>
                    <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/>
                  </svg>
                </button>
                <button
                  onClick={copy}
                  title="Copy"
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:text-slate-300 hover:bg-white/5 transition-all cursor-pointer"
                >
                  {copied
                    ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                  }
                </button>
              </div>
            </div>

            {/* Strength bar */}
            <div className="flex items-center gap-3 mt-4">
              <div className="flex gap-1 flex-1">
                {[1,2,3,4,5].map(i => (
                  <div
                    key={i}
                    className="h-[3px] flex-1 rounded-full transition-all duration-500"
                    style={{ background: i <= strength.score ? strength.color : '#222' }}
                  />
                ))}
              </div>
              {strength.label && (
                <span className="text-[11px] font-semibold tracking-wide shrink-0 w-16 text-right" style={{ color: strength.color }}>
                  {strength.label}
                </span>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-[#1e1e1e] mx-6" />

          {/* Controls */}
          <div className="px-6 py-5 flex flex-col gap-5">

            {/* Mode */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</span>
              <div className="flex gap-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-1">
                {(['random', 'memorable'] as Mode[]).map(m => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                      mode === m
                        ? 'bg-slate-200 text-slate-900'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {m === 'random' ? 'Random' : 'Memorable'}
                  </button>
                ))}
              </div>
            </div>

            {/* Random: length + character toggles */}
            {mode === 'random' && (
              <>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Length</span>
                    <span className="font-mono text-sm font-bold text-slate-200">{length}</span>
                  </div>
                  <input
                    type="range" min={6} max={64} value={length}
                    onChange={e => setLength(+e.target.value)}
                    className="slider"
                    style={{ '--pct': `${((length - 6) / 58) * 100}%` } as React.CSSProperties}
                  />
                </div>

                <div className="flex flex-col gap-2.5">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Characters</span>
                  <div className="flex flex-wrap gap-2">
                    <Toggle label="A–Z" active={upper}   onToggle={() => setUpper(v => !v)} />
                    <Toggle label="a–z" active={lower}   onToggle={() => setLower(v => !v)} />
                    <Toggle label="0–9" active={numbers} onToggle={() => setNumbers(v => !v)} />
                    <Toggle label="!@#" active={symbols} onToggle={() => setSymbols(v => !v)} />
                  </div>
                </div>
              </>
            )}

            {/* Memorable: word count + options */}
            {mode === 'memorable' && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Words</span>
                  <div className="flex gap-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-1">
                    {[2, 3, 4, 5].map(n => (
                      <button
                        key={n}
                        onClick={() => setWordCount(n)}
                        className={`w-9 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                          wordCount === n
                            ? 'bg-slate-200 text-slate-900'
                            : 'text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2.5">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Options</span>
                  <div className="flex flex-wrap gap-2">
                    <Toggle label="Aa" active={memCaps}    onToggle={() => setMemCaps(v => !v)} />
                    <Toggle label="0–9" active={memNumbers} onToggle={() => setMemNumbers(v => !v)} />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Generate button */}
          <div className="px-6 pb-6">
            <button
              onClick={generate}
              className="w-full py-2.5 rounded-xl bg-slate-200 hover:bg-white text-slate-900 font-bold text-sm tracking-wide transition-all cursor-pointer"
            >
              Generate
            </button>
          </div>
        </div>

        <p className="text-center text-[11px] text-slate-700 mt-3 tracking-wide">
          Generated locally · never sent to any server
        </p>
      </div>
    </div>
  )
}
