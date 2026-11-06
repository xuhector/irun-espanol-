import "dotenv/config";
import express from "express";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";
const app=express(),__dirname=path.dirname(fileURLToPath(import.meta.url));
app.use(express.json({limit:"1mb"}));
app.use(express.static(__dirname));
const client=new OpenAI({apiKey:process.env.OPENAI_API_KEY});
app.post("/api/tutor",async(req,res)=>{
 try{
  const {text,mode,scene,level,task}=req.body;
  const instructions=`你是一位耐心的拉丁美洲西班牙语口语教练，面向中文母语学习者。口音/用法：拉丁美洲通用，优先自然、易懂的秘鲁表达。难度：${level==="adaptive"?"根据学习者表现动态调整，起点A2，逐步向B1/B2提升":level}。场景：${scene}。模式：${mode}。
分析学习者的西班牙语。必须区分真正错误、可接受但不够自然的表达、地区差异；不要把正确句子误判为错误。保留原意，给出最自然的修正版；中文翻译；简明中文解释；逐词/短语列表。对每个动词指出原形、人称、数、时态/语式；对非变位形式说明原形/不定式/分词。最后给一句鼓励和一个继续对话的问题。只返回JSON对象，字段：original, corrected, translation, explanation, natural, words(数组，每项word,meaning,grammar), next_question_es, next_question_zh, is_correct。当前任务：${JSON.stringify(task)}。`;
  const response=await client.responses.create({model:process.env.OPENAI_MODEL||"gpt-5.5",instructions,input:text});
  let raw=response.output_text.trim().replace(/^```json\s*/i,"").replace(/\s*```$/,"");
  const result=JSON.parse(raw);res.json(result);
 }catch(err){console.error(err);res.status(500).json({error:"AI tutor request failed"});}
});
const port=process.env.PORT||3000;app.listen(port,()=>console.log(`IRUN Español running on http://localhost:${port}`));