import { describe, expect, it } from "vitest";
import { maskWhatsapp, personalSchema, validateAnswers, INVEST_RANGES } from "@/lib/applications";
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
    const base = { valor: INVEST_RANGES[0], experiencia: "Sim", objetivo: "Participar do crescimento" };
    expect(validateAnswers("investidor", { ...base, ciente_riscos: "Não" }).ciente_riscos).toBeDefined();
    expect(validateAnswers("investidor", { ...base, ciente_riscos: "Sim, estou ciente dos riscos" })).toEqual({});
  });
  it("investor value must be one of the five ranges", () => {
    expect(INVEST_RANGES).toHaveLength(5);
    expect(validateAnswers("investidor", { valor: "R$ 1.000" }).valor).toBe("Selecione uma opção válida");
  });
  it("CSV export neutralizes formulas", () => {
    expect(csvCell("=HYPERLINK()")).toBe("'=HYPERLINK()");
  });
});
