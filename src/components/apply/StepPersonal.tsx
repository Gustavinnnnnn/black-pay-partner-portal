import { Field, inputClass } from "./fields";
import { maskWhatsapp } from "@/lib/applications";

export interface PersonalState {
  full_name: string;
  age: string;
  city_state: string;
  whatsapp: string;
  instagram: string;
}

export const EMPTY_PERSONAL: PersonalState = { full_name: "", age: "", city_state: "", whatsapp: "", instagram: "" };

export function StepPersonal({
  value, onChange, errors,
}: { value: PersonalState; onChange: (v: PersonalState) => void; errors: Record<string, string> }) {
  const set = (k: keyof PersonalState, v: string) => onChange({ ...value, [k]: v });
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <div className="md:col-span-2">
        <Field id="full_name" label="Nome completo" required error={errors["full_name"]}>
          <input id="full_name" autoComplete="name" className={inputClass(!!errors["full_name"])} value={value.full_name}
            onChange={(e) => set("full_name", e.target.value)} placeholder="Seu nome e sobrenome" maxLength={120} />
        </Field>
      </div>
      <Field id="age" label="Idade" required error={errors["age"]}>
        <input id="age" inputMode="numeric" className={inputClass(!!errors["age"])} value={value.age}
          onChange={(e) => set("age", e.target.value.replace(/\D/g, "").slice(0, 3))} placeholder="Ex.: 28" />
      </Field>
      <Field id="city_state" label="Cidade e estado" required error={errors["city_state"]}>
        <input id="city_state" autoComplete="address-level2" className={inputClass(!!errors["city_state"])} value={value.city_state}
          onChange={(e) => set("city_state", e.target.value)} placeholder="Ex.: São Paulo - SP" maxLength={120} />
      </Field>
      <Field id="whatsapp" label="WhatsApp" required error={errors["whatsapp"]} hint="Entraremos em contato por este número.">
        <input id="whatsapp" type="tel" inputMode="tel" autoComplete="tel" className={inputClass(!!errors["whatsapp"])}
          value={value.whatsapp} onChange={(e) => set("whatsapp", maskWhatsapp(e.target.value))} placeholder="(11) 91234-5678" />
      </Field>
      <Field id="instagram" label="Instagram" error={errors["instagram"]}>
        <input id="instagram" className={inputClass(!!errors["instagram"])} value={value.instagram}
          onChange={(e) => set("instagram", e.target.value.replace(/\s/g, ""))} placeholder="@seuperfil" maxLength={60} />
      </Field>
    </div>
  );
}
