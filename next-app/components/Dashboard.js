import { useState, useEffect, useMemo } from 'react'

const CATEGORIES = [
  'Alimentación','Mano de Obra','Salud Animal','Energía/Combustible','Agua/Riego','Mantenimiento','Transporte','Administración','Impuestos','Inversión','Otros'
]

export default function Dashboard(){
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ category: CATEGORIES[0], amount: '', liters: '' })

  async function load(){
    setLoading(true)
    try{
      const res = await fetch('/api/expenses')
      const data = await res.json()
      setRows(data || [])
    }catch(e){ console.error(e) }
    setLoading(false)
  }

  useEffect(()=>{ load() }, [])

  const total = useMemo(()=> rows.reduce((s,r)=> s + Number(r.amount || 0), 0), [rows])
  const litersTotal = useMemo(()=> rows.reduce((s,r)=> s + Number(r.liters || 0), 0), [rows])
  const costPerLiter = litersTotal ? (total / litersTotal) : 0

  async function submit(e){
    e && e.preventDefault()
    const payload = { category: form.category, amount: Number(form.amount || 0), liters: Number(form.liters || 0) }
    const res = await fetch('/api/expenses', { method: 'POST', headers:{ 'content-type':'application/json' }, body: JSON.stringify(payload) })
    if(res.ok){ setForm({ category: CATEGORIES[0], amount: '', liters: '' }); await load(); }
    else { const err = await res.json(); alert('Error: ' + (err.error || 'unknown')) }
  }

  return (
    <section className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-bold mb-4">Dashboard de Rentabilidad</h3>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="p-6 bg-blue-600 text-white square-card">
              <div className="text-xs uppercase tracking-widest">Gasto Total</div>
              <div className="text-3xl font-black">${total.toFixed(2)}</div>
            </div>
            <div className="p-6 bg-white square-card border">
              <div className="text-xs uppercase tracking-widest">Litros Totales</div>
              <div className="text-3xl font-black">{litersTotal.toFixed(2)} L</div>
            </div>
            <div className="p-6 bg-slate-900 text-white square-card">
              <div className="text-xs uppercase tracking-widest">Costo / Litro</div>
              <div className="text-3xl font-black">${costPerLiter.toFixed(2)}</div>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="font-semibold mb-2">Gastos recientes</h4>
            {loading ? <div>Loading...</div> : (
              <div className="space-y-2">
                {rows.slice().reverse().slice(0,8).map(r=> (
                  <div key={r.id} className="flex justify-between border rounded p-2">
                    <div className="text-sm">{r.category}</div>
                    <div className="text-sm font-semibold">${Number(r.amount).toFixed(2)} {r.liters ? `· ${r.liters} L` : ''}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <aside>
          <form onSubmit={submit} className="bg-white p-4 border rounded space-y-3">
            <h4 className="font-bold">Registrar Gasto</h4>
            <label className="block text-sm">Categoría
              <select className="w-full mt-1 p-2 border rounded" value={form.category} onChange={e=> setForm(f=> ({...f, category: e.target.value}))}>
                {CATEGORIES.map(c=> <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
            <label className="block text-sm">Monto (MXN)
              <input required className="w-full mt-1 p-2 border rounded" type="number" step="0.01" value={form.amount} onChange={e=> setForm(f=> ({...f, amount: e.target.value}))} />
            </label>
            <label className="block text-sm">Litros
              <input className="w-full mt-1 p-2 border rounded" type="number" step="0.01" value={form.liters} onChange={e=> setForm(f=> ({...f, liters: e.target.value}))} />
            </label>
            <div className="flex gap-2">
              <button className="flex-1 py-2 bg-primary text-white rounded" type="submit">Guardar</button>
              <button type="button" className="flex-1 py-2 border rounded" onClick={()=> setForm({ category: CATEGORIES[0], amount: '', liters: '' })}>Limpiar</button>
            </div>
          </form>
        </aside>
      </div>

      <div className="mt-6 text-sm text-slate-600">
        <strong>Educación contable</strong>
        <ul className="mt-2 list-disc ml-6">
          <li title="Tus bienes">Activos: Tus bienes — vacas y maquinaria.</li>
          <li title="Tus deudas">Pasivos: Tus deudas — créditos y facturas por pagar.</li>
          <li title="Tu patrimonio">Capital: Tu patrimonio neto (activos menos pasivos).</li>
        </ul>
      </div>
    </section>
  )
}
