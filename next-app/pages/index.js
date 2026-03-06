import Hero from '../components/Hero'
import Dashboard from '../components/Dashboard'
import Chatbot from '../components/Chatbot'

export default function Home(){
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Hero />
      <main className="max-w-6xl mx-auto px-6 py-16">
        <section className="mb-16">
          <h2 className="text-3xl font-extrabold mb-4">Dairy Control</h2>
          <p className="text-lg text-slate-700">Una plataforma que te ayuda a entender, controlar y reducir tus gastos con ayuda de IA.</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Dashboard />
          </div>
          <div>
            <Chatbot />
          </div>
        </div>
      </main>
    </div>
  )
}
