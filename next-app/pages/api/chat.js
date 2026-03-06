export default function handler(req, res){
  // Simple placeholder AI: inspects totals and returns advice
  const { total, categories } = req.body || {}
  const advice = []
  if(total && total > 0){
    advice.push(`Gasto total detectado: $${Number(total).toFixed(2)}.`)
    const food = categories?.find(c => c.key === 'Alimentación')
    if(food && food.amount && food.amount / total > 0.4){
      advice.push('Tu gasto en Alimentación es alto. Considera renegociar proveedores o optimizar raciones.')
    }
  }
  if(advice.length === 0) advice.push('Sube tus gastos para que pueda darte recomendaciones prácticas.')
  res.status(200).json({ messages: advice })
}
