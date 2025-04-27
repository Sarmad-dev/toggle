import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export async function generateInitialTasks(
  projectTitle: string,
  projectDescription: string
) {
  const prompt = `
You are a task management assistant. Based on the following project details, suggest 4 initial tasks to get started. Each task must follow this format:

{
  id: uuidv4()
  name: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  tags: { name: string; color: string }[]
}

Use appropriate task names and clear, actionable descriptions. Assign priority based on the importance and urgency of each task. Include 1–3 relevant tags per task. Output must be a valid JSON array of 4 tasks.

Project Title: ${projectTitle}
Project Description: ${projectDescription}
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  const rawContent = response.choices[0].message.content;
  const tasks = JSON.parse(rawContent ?? "[]");
  return tasks;
}
