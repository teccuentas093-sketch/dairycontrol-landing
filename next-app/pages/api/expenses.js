import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

export default async function handler(req, res){
  if(!SERVICE_KEY){
    return res.status(500).json({ error: 'Server not configured with SUPABASE_SERVICE_ROLE_KEY' })
  }

  if(req.method === 'GET'){
    const { data, error } = await supabase.from('expenses').select('id,category,amount,liters,subcategory,account_code,created_at')
    if(error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if(req.method === 'POST'){
    const { category, amount, liters, subcategory } = req.body || {}
    if(!category || amount == null) return res.status(400).json({ error: 'category and amount required' })

    // server-side accounting code map
    const CODE_MAP = {
      'Alimentacion': '601',
      'Mano de Obra': '602',
      'Salud Animal': '603',
      'Energia y Combustible': '604',
      'Agua y Riego': '605',
      'Mantenimiento': '606',
      'Transporte': '607',
      'Administracion': '608',
      'Impuestos': '609',
      'Inversion y Expansion': '610',
      'Otros': '699'
    };

    // incoming `category` may be "Key - Subcat" or just the key
    let catKey = category;
    let subcat = subcategory || '';
    if(typeof category === 'string' && category.includes(' - ')){
      const parts = category.split(' - ').map(s=>s.trim());
      catKey = parts[0];
      if(parts[1]) subcat = parts.slice(1).join(' - ');
    }

    const account_code = CODE_MAP[catKey] || null;
    const payload = { category: catKey, amount: Number(amount), liters: Number(liters || 0), subcategory: subcat, account_code };
    const { data, error } = await supabase.from('expenses').insert([payload]).select()
    if(error) return res.status(500).json({ error: error.message })
    return res.status(201).json(data && data[0])
  }

  res.setHeader('Allow', 'GET,POST')
  res.status(405).end('Method Not Allowed')
}
