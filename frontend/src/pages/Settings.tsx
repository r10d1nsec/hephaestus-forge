import EngineManager from "../components/engines/EngineManager";

export default function Settings() {
  return (
    <div className="mx-auto max-w-3xl px-8 py-10">
      <h1 className="text-2xl font-bold text-stone-50">Engines</h1>
      <p className="mt-1 text-sm text-forge-steel">
        Bring Your Own Engine — conecta el modelo o agente que ya tienes. Nada sale de tu máquina.
      </p>
      <div className="mt-8">
        <EngineManager />
      </div>
    </div>
  );
}
