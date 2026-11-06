# IRUN Español — PWA

这是一个可运行的 PWA 原型，包含：
- AI 引导 / 自由表达两种练习模式
- 服装批发、商务、仓库、餐厅、日常、旅行场景
- 中文任务提示、西语输入、浏览器语音识别
- 双语反馈、逐词解析、动词语法提示
- 带上下文的多轮 OpenAI Responses API 对话
- 本地学习统计与错误表达间隔复习
- PWA manifest 与 service worker

## 本地启动
需要 Node.js 20+。

```bash
npm install
cp .env.example .env
# 在 .env 中填入自己的 OPENAI_API_KEY（仅保存在服务端）
npm start
```
然后打开 http://localhost:3000

## 重要说明
1. 未配置 API 密钥时，页面和离线演示模式仍可使用；连续 AI 对话及完整纠错需要服务端配置密钥。
2. 浏览器语音识别需要 HTTPS 或 localhost，并且不同浏览器支持情况不同。
3. 要安装为 iPhone 主屏幕 PWA，需要把项目部署到 HTTPS 域名后，用 Safari 打开并选择“添加到主屏幕”。
4. 语音输入使用浏览器 SpeechRecognition，AI 回复通过浏览器 speechSynthesis 朗读。对话上下文、进度与复习计划存于当前设备；清除浏览器数据会删除它们。
5. 不要把 API Key 放进前端代码；只放在服务端环境变量中。

## 当前能力与限制
- 服务端仅在配置 `OPENAI_API_KEY` 后调用 OpenAI；密钥不进入浏览器。
- 每轮最多向模型发送最近 12 条对话消息；页面会生成西语追问和中文译文并朗读。
- 间隔复习与统计使用设备本地存储，没有账号或云同步。
- 实时语音对话、音素级发音评分、跨设备同步和生产环境托管尚未配置。
