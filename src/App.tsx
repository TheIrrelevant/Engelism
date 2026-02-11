export default function App() {
  return (
    <div className="min-h-screen bg-obsidian text-bone">
      {/* Header */}
      <header className="border-l-4 border-ash pl-3 mx-8 mt-6 mb-8">
        <h1 className="font-avenir text-ash font-black text-base uppercase tracking-[4px]">
          Engelism
          <span className="text-[0.5rem] opacity-50 font-light ml-2">
            | Camera Override Protocol v2.0
          </span>
        </h1>
      </header>

      {/* Wizard placeholder */}
      <main className="mx-8">
        <p className="text-ash text-sm">Wizard steps will render here.</p>
      </main>
    </div>
  )
}
