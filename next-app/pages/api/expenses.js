import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

export default async function handler(req, res){
  if(!SERVICE_KEY){
    return res.status(500).json({ error: 'Server not configured with SUPABASE_SERVICE_ROLE_KEY' })
  }

  if(req.method === 'GET'){
    const { data, error } = await supabase.from('expenses').select('id,category,amount,liters,created_at')
    if(error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if(req.method === 'POST'){
    const { category, amount, liters } = req.body || {}
    if(!category || amount == null) return res.status(400).json({ error: 'category and amount required' })
    const payload = { category, amount: Number(amount), liters: Number(liters || 0) }
    const { data, error } = await supabase.from('expenses').insert([payload]).select()
    if(error) return res.status(500).json({ error: error.message })
    return res.status(201).json(data && data[0])
  }

  res.setHeader('Allow', 'GET,POST')
  res.status(405).end('Method Not Allowed')
}
