import EngineManager from "../components/engines/EngineManager";
import { useT } from "../i18n/useT";

export default function Settings() {
  const { t } = useT();
  return (
    <div className="mx-auto max-w-3xl px-8 py-10">
      <h1 className="text-2xl font-bold text-stone-50">{t("settings.title")}</h1>
      <p className="mt-1 text-sm text-forge-steel">{t("settings.subtitle")}</p>
      <div className="mt-8">
        <EngineManager />
      </div>
    </div>
  );
}
