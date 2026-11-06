import "dotenv/config";
import express from "express";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const client = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;
app.use(express.json({ limit: "1mb" }));
app.use(express.static(__dirname));

app.get("/api/health", (_req, res) => res.json({ aiConfigured: Boolean(client) }));
app.post("/api/tutor", async (req, res) => {
  const { text, mode, scene, level, task, history = [] } = req.body ?? {};
  if (!client) return res.status(503).json({ error: "AI_NOT_CONFIGURED" });
  if (typeof text !== "string" || !text.trim() || text.length > 4000) return res.status(400).json({ error: "INVALID_TEXT" });
  const safeHistory = Array.isArray(history)
    ? history.slice(-12).filter(m => m && ["user", "assistant"].includes(m.role) && typeof m.content === "string")
      .map(m => ({ role: m.role, content: m.content.slice(0, 2000) }))
    : [];
  const instructions = `你是一位耐心的拉丁美洲西班牙语口语教练，面向中文母语学习者。优先自然易懂的秘鲁表达。难度：${level === "adaptive" ? "根据表现从 A2 逐步提升" : level}。场景：${scene}。模式：${mode}。
结合历史对话继续扮演真实对话伙伴，而不是只点评句子。先判断学习者原意，区分错误、可接受表达和地区差异，不要误判正确句子。提供自然修正版、中文翻译、简明解释、逐词/短语解析（动词需标原形、人称、时态/语式），最后给鼓励和一个与上下文衔接的下一轮问题。只返回 JSON 对象，字段 original, corrected, translation, explanation, natural, words(数组，每项 word,meaning,grammar), next_question_es, next_question_zh, is_correct。当前任务：${JSON.stringify(task)}。`;
  try {
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5.5",
      instructions,
      input: [...safeHistory, { role: "user", content: text.trim() }],
    });
    const raw = response.output_text.trim().replace(/^```json\s*/i, "").replace(/\s*```$/, "");
    res.json(JSON.parse(raw));
  } catch (err) {
    console.error("Tutor request failed:", err.message);
    res.status(500).json({ error: "AI tutor request failed" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`IRUN Español running on http://localhost:${port}`));
