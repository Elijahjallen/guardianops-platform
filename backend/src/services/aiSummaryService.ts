import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateCaseSummary(caseData: any) {
  const response = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: `
You are an operations assistant for GuardianOps.

Create a professional case summary using this data:
${JSON.stringify(caseData, null, 2)}

Use this format:

Executive Summary:
Risk Considerations:
Behavioral Notes:
Family / Custody Notes:
Recommended Staff Actions:
Follow-Up Questions:

Rules:
- Do not invent facts.
- If missing, say "Not provided."
- Keep it professional.
- Do not diagnose medical conditions.
`,
  });

  return response.output_text;
}