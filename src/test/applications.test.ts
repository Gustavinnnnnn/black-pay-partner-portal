import { describe, expect, it } from "vitest";
import { maskWhatsapp, personalSchema, validateAnswers, ENTRY_OK } from "@/lib/applications";
import { whatsappLink } from "@/components/admin/types";
import { csvCell } from "@/lib/csv";

const personal = { full_name: "Ana Souza", age: "25", city_state: "São Paulo - SP", whatsapp: "(11) 91234-5678", instagram: "" };

describe("application rules", () => {
  it("masks WhatsApp as (11) 91234-5678", () => {
    expect(maskWhatsapp("11912345678")).toBe("(11) 91234-5678");
  });
  it("stores WhatsApp as digits only", () => {
    expect(personalSchema.parse(personal).whatsapp).toBe("11912345678");
  });
  it("rejects applicants under 18", () => {
    expect(personalSchema.safeParse({ ...personal, age: "17" }).success).toBe(false);
  });
  it("investor must acknowledge risk", () => {
    const base = { valor: "R$ 10.000", experiencia: "Sim", objetivo: "Participar do crescimento" };
    expect(validateAnswers("investidor", { ...base, ciente_riscos: "Não" })["ciente_riscos"]).toBeDefined();
    expect(validateAnswers("investidor", { ...base, ciente_riscos: "Sim, estou ciente dos riscos" })).toEqual({});
  });
  it("investor value is free text (a combinar)", () => {
    expect(validateAnswers("investidor", { valor: "quero conversar" })["valor"]).toBeUndefined();
  });
  it("expansion applicant must accept the R$ 2.000 entry", () => {
    expect(validateAnswers("expansao", { investimento: "Não" })["investimento"]).toBeDefined();
    expect(validateAnswers("expansao", { investimento: ENTRY_OK })["investimento"]).toBeUndefined();
  });
  it("wa.me link adds Brazil code", () => {
    expect(whatsappLink("11912345678")).toBe("https://wa.me/5511912345678");
  });
  it("CSV export neutralizes formulas", () => {
    expect(csvCell("=HYPERLINK()")).toBe("'=HYPERLINK()");
  });
});
