import { useState, useMemo } from 'react'

const CATEGORIES = [
  'Alimentación','Mano de Obra','Salud Animal','Energía/Combustible','Agua/Riego','Mantenimiento','Transporte','Administración','Impuestos','Inversión','Otros'
]

export default function Dashboard(){
  const [amounts, setAmounts] = useState(() => CATEGORIES.map(()=>0))
  const [liters, setLiters] = useState(4500)

  const total = useMemo(()=> amounts.reduce((s,a)=> s + Number(a||0),0), [amounts])
  const costPerLiter = liters ? (total / Number(liters || 0)) : 0

  function setAmount(idx, v){
    const copy = [...amounts]; copy[idx] = Number(v || 0); setAmounts(copy)
  }

  return (
    <section className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-bold mb-4">Dashboard de Rentabilidad</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="md:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {CATEGORIES.map((c, i)=> (
              <label key={c} className="flex items-center gap-2 border p-2 rounded">
                <span className="text-sm w-40">{i+1}. {c}</span>
                <input type="number" step="0.01" className="w-full p-1 border rounded" value={amounts[i]} onChange={e=> setAmount(i, e.target.value)} />
              </label>
            ))}
          </div>
        </div>

        <div className="p-4 border rounded">
          <label className="block text-sm text-slate-600">Litros Producidos</label>
          <input type="number" className="w-full mt-2 p-2 border rounded" value={liters} onChange={e=> setLiters(e.target.value)} />

          <div className="mt-4">
            <div className="text-sm text-slate-500">Gasto Total (MXN)</div>
            <div className="text-2xl font-bold text-primary">${total.toFixed(2)}</div>
            <div className="text-sm text-slate-500 mt-2">Costo por Litro</div>
            <div className="text-2xl font-bold text-slate-900">${costPerLiter.toFixed(2)} / L</div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-sm text-slate-600">
        <strong>Educación contable</strong>
        <ul className="mt-2 list-disc ml-6">
          <li title="Tus bienes">Activos: Tus bienes: vacas, maquinaria.</li>
          <li title="Tus deudas">Pasivos: Tus deudas: créditos, proveedores.</li>
          <li title="Tu patrimonio">Capital: Tu patrimonio real.</li>
        </ul>
      </div>
    </section>
  )
}
