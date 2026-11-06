# IRUN Español — 第一版 PWA

这是一个可运行的 PWA 原型，包含：
- AI 引导 / 自由表达两种练习模式
- 服装批发、商务、仓库、餐厅、日常、旅行场景
- 中文任务提示、西语输入、浏览器语音识别
- 双语反馈、逐词解析、动词语法提示
- 可选 OpenAI Responses API 后端
- PWA manifest 与 service worker

## 本地启动
需要 Node.js 20+。

```bash
npm install
cp .env.example .env
# 在 .env 中填入自己的 OPENAI_API_KEY
npm start
```
然后打开 http://localhost:3000

## 重要说明
1. 如果未配置或未启动 AI 后端，前端会退回到少量规则的演示纠错；这不是完整 AI 判断。
2. 浏览器语音识别需要 HTTPS 或 localhost，并且不同浏览器支持情况不同。
3. 要安装为 iPhone 主屏幕 PWA，需要把项目部署到 HTTPS 域名后，用 Safari 打开并选择“添加到主屏幕”。
4. 当前语音输入使用浏览器 SpeechRecognition；AI 语音朗读使用浏览器 speechSynthesis。真正的低延迟双向实时语音、用户账号、云端学习进度和音素级发音评分属于后续版本。
5. 不要把 API Key 放进前端代码；只放在服务端环境变量中。

## 第一版后续开发建议
- 增加会话上下文，让 AI 记住对话前文并持续扮演场景角色
- 返回 AI 下一轮西语问题及中文翻译，形成真正多轮对话
- 按用户错误自动安排间隔复习
- 保存个人学习记录与薄弱语法
- 增加实时语音对话服务和发音反馈
