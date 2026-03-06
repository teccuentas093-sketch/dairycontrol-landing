export default function Hero(){
  return (
    <header className="relative">
      <div className="relative h-72 md:h-96 lg:h-[560px] bg-black overflow-hidden">
        <video className="absolute inset-0 w-auto min-w-full min-h-full object-cover opacity-60" autoPlay muted loop playsInline poster="/Dairy1-poster.svg">
          <source src="/Dairy1.mp4" type="video/mp4" />
        </video>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
          <h1 className="text-white text-4xl md:text-6xl font-black tracking-tight uppercase">CONTROL TOTAL.<br/>RENTABILIDAD REAL.</h1>
          <p className="mt-4 text-blue-200 font-semibold">LA LAGUNA, MÉXICO</p>
          <p className="mt-6 text-white/90 max-w-2xl text-lg">Registra los gastos de tu rancho, calcula tu costo por litro y toma mejores decisiones.</p>
        </div>
      </div>
    </header>
  )
}
