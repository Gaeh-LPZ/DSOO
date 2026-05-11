"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function FiltroFechas({ startDate, endDate, basePath }: {
  startDate: string
  endDate: string
  basePath: string
}) {
  const router = useRouter()
  const [start, setStart] = useState(startDate)
  const [end, setEnd] = useState(endDate)

  function aplicar() {
    router.push(`${basePath}?start=${start}&end=${end}`)
  }

  return (
    <div className="flex flex-wrap items-end gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-slate-400 uppercase tracking-widest">Desde</label>
        <input
          type="date"
          value={start}
          onChange={e => setStart(e.target.value)}
          className="text-sm text-slate-700 border border-slate-200 px-3 py-2 bg-white focus:outline-none focus:border-slate-400"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-slate-400 uppercase tracking-widest">Hasta</label>
        <input
          type="date"
          value={end}
          onChange={e => setEnd(e.target.value)}
          className="text-sm text-slate-700 border border-slate-200 px-3 py-2 bg-white focus:outline-none focus:border-slate-400"
        />
      </div>
      <button
        onClick={aplicar}
        className="text-xs font-semibold tracking-wider uppercase px-6 py-2 bg-slate-900 text-white hover:bg-slate-700 transition-colors"
      >
        Aplicar
      </button>
    </div>
  )
}