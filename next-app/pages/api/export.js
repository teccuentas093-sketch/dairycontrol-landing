import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

export default async function handler(req, res){
  if(!SERVICE_KEY){
    return res.status(500).json({ error: 'Server not configured with SUPABASE_SERVICE_ROLE_KEY' })
  }

  if(req.method !== 'GET'){
    res.setHeader('Allow', 'GET')
    return res.status(405).end('Method Not Allowed')
  }

  const { from, to } = req.query || {}

  let query = supabase.from('expenses').select('id,category,subcategory,account_code,amount,liters,created_at').order('created_at', { ascending: true })
  if(from) query = query.gte('created_at', from)
  if(to) query = query.lte('created_at', to)

  const { data, error } = await query
  if(error) return res.status(500).json({ error: error.message })

  const rows = data || []
  const headers = ['id','created_at','category','subcategory','account_code','amount','liters']

  // Build CSV content, properly escaping values
  let csv = headers.join(',') + '\n'
  for(const r of rows){
    const line = headers.map(h=>{
      let v = r[h]
      if(v === null || v === undefined) return ''
      v = String(v)
      if(v.includes('"') || v.includes(',') || v.includes('\n')){
        return '"' + v.replace(/"/g, '""') + '"'
      }
      return v
    }).join(',')
    csv += line + '\n'
  }

  res.setHeader('Content-Type', 'text/csv')
  res.setHeader('Content-Disposition', 'attachment; filename="expenses_export.csv"')
  res.status(200).send(csv)
}
