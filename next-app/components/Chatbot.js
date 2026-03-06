import { useState } from 'react'

export default function Chatbot(){
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hola — soy tu Asistente IA. Introduce tus gastos y te doy recomendaciones.' }
  ])
  const [text, setText] = useState('')

  async function send(){
    if(!text) return
    const user = { from: 'user', text }
    setMessages(m=> [...m, user])
    setText('')

    // call API placeholder
    const res = await fetch('/api/chat', { method: 'POST', headers: { 'content-type':'application/json' }, body: JSON.stringify({ total: 0 }) })
    const json = await res.json()
    const botMsgs = json.messages || []
    setMessages(m=> [...m, ...botMsgs.map(t=> ({ from:'bot', text:t }))])
  }

  return (
    <aside className="bg-white p-4 rounded-lg shadow">
      <h4 className="font-bold mb-2">Asistente IA</h4>
      <div className="h-64 overflow-auto border rounded p-2 mb-2 bg-slate-50">
        {messages.map((m,i)=> (
          <div key={i} className={`mb-2 ${m.from==='bot' ? 'text-slate-700' : 'text-right text-slate-900'}`}>
            <div className={`inline-block p-2 rounded ${m.from==='bot' ? 'bg-white' : 'bg-blue-600 text-white'}`}>{m.text}</div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={text} onChange={e=> setText(e.target.value)} className="flex-1 p-2 border rounded" placeholder="Pregunta al asistente" />
        <button onClick={send} className="px-4 py-2 bg-primary text-white rounded">Enviar</button>
      </div>
    </aside>
  )
}
