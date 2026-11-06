const $=id=>document.getElementById(id);
const tasks={
 wholesale:[{title:"客户询问最低起订量",zh:"客户问你：你们的最低起订量是多少？",hint:"批发 · 最低数量 · 一打（12件）",es:"¿Cuál es la cantidad mínima de pedido?",cn:"你们的最低起订量是多少？"},{title:"介绍你们的产品",zh:"向新客户介绍：我们是服装厂家，主要做批发。",hint:"厂家 · 专门从事 · 批发",es:"Somos fabricantes de ropa y nos dedicamos a la venta al por mayor.",cn:"我们是服装厂家，专门从事批发销售。"}],
 business:[{title:"安排商务会面",zh:"告诉对方：我们明天下午可以见面讨论价格。",hint:"明天下午 · 可以 · 讨论价格",es:"Mañana por la tarde podemos reunirnos para conversar sobre los precios.",cn:"明天下午我们可以见面讨论价格。"}],
 warehouse:[{title:"确认货物是否到达",zh:"询问同事：货物今天已经到仓库了吗？",hint:"货物 · 到达 · 仓库",es:"¿La mercadería ya llegó al almacén hoy?",cn:"货物今天已经到仓库了吗？"}],
 restaurant:[{title:"询问菜单推荐",zh:"询问服务员：你推荐哪一道菜？",hint:"推荐 · 哪一道菜",es:"¿Qué plato me recomienda?",cn:"你推荐我点哪道菜？"}],
 daily:[{title:"聊聊最近的工作",zh:"告诉朋友：最近工作很多，但是我很喜欢这份工作。",hint:"最近 · 工作很多 · 喜欢",es:"Últimamente tengo mucho trabajo, pero me gusta mucho este trabajo.",cn:"最近我工作很多，但是我很喜欢这份工作。"}],
 travel:[{title:"询问行李",zh:"询问工作人员：我的行李在哪里领取？",hint:"行李 · 在哪里 · 领取",es:"¿Dónde puedo recoger mi equipaje?",cn:"我在哪里可以领取行李？"}]};
let current=tasks.wholesale[0],lastCorrection=null,levelScore=0;
function addBubble(text,who){const el=document.createElement("div");el.className="bubble "+who;el.textContent=text;$("chatLog").appendChild(el);$("chatLog").scrollTop=$("chatLog").scrollHeight}
function setTask(){const arr=tasks[$("scene").value]||tasks.wholesale;current=arr[Math.floor(Math.random()*arr.length)];$("taskTitle").textContent=current.title;$("promptZh").textContent=current.zh;$("promptHint").textContent="提示："+current.hint;$("answer").value="";$("feedback").hidden=true;$("modeTag").textContent=$("mode").value==="guided"?"AI 引导":"自由表达";$("answer").placeholder=$("mode").value==="guided"?"请把上面的中文表达成西班牙语…":"想说什么就说什么，输入或直接说西班牙语…"}
$("newPrompt").onclick=setTask;$("scene").onchange=setTask;$("mode").onchange=setTask;
function speech(text){if(!("speechSynthesis"in window))return;const u=new SpeechSynthesisUtterance(text);u.lang="es-MX";u.rate=.88;speechSynthesis.cancel();speechSynthesis.speak(u)}
$("repeatBtn").onclick=()=>lastCorrection&&speech(lastCorrection.corrected);
$("retryBtn").onclick=()=>{$("answer").value="";$("answer").focus();$("feedback").hidden=true;addBubble("Inténtalo otra vez. ¡Tú puedes!","ai")};
const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;let recognition;
if(SpeechRecognition){recognition=new SpeechRecognition();recognition.lang="es-419";recognition.interimResults=true;recognition.continuous=false;recognition.onresult=e=>{$("answer").value=Array.from(e.results).map(r=>r[0].transcript).join("");};recognition.onend=()=>{$("micBtn").textContent="🎙 开始语音输入";$("micStatus").textContent="语音输入结束，可以检查你的回答。"};recognition.onerror=e=>$("micStatus").textContent="语音识别提示："+e.error;}
$("micBtn").onclick=()=>{if(!recognition){$("micStatus").textContent="当前浏览器不支持语音识别。请使用最新版 Chrome 或 Safari，或先打字练习。";return;}try{recognition.start();$("micBtn").textContent="正在聆听…";$("micStatus").textContent="请开始说西班牙语。"}catch(e){$("micStatus").textContent="语音识别正在运行，请稍候。"}};
function fallbackAnalysis(input){
 let corrected=input.trim(),explanation="这是一条演示反馈。连接 AI 服务后，系统会根据完整语境分析语法、自然度和秘鲁/拉美用法。";
 const rules=[[/\bayer\s+yo\s+voy\b/i,"Ayer fui","“Ayer”表示过去时间，ir 的第一人称简单过去时是 fui。"],[/\byo\s+tener\b/i,"Yo tengo","tener 的现在时第一人称单数是 tengo。"],[/\buna\s+docena\s+de\s+prendas\b/i,"una docena de prendas","表达一打衣服时可以这样说。"]];
 for(const [re,repl,why] of rules){if(re.test(corrected)){corrected=corrected.replace(re,repl);explanation=why;break;}}
 return {original:input,corrected,translation:current.cn,explanation,words:[{word:"Ayer / hoy",meaning:"昨天 / 今天",grammar:"时间表达"},{word:"fui / tengo",meaning:"去了 / 有、拥有",grammar:"动词变位需结合主语和时态判断"}],natural:"拉美通用表达；具体自然度需结合上下文判断。"};
}
async function analyze(input){
 const payload={text:input,mode:$("mode").value,scene:$("scene").value,level:$("level").value,task:current};
 try{const r=await fetch("/api/tutor",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});if(!r.ok)throw Error("API unavailable");return await r.json()}catch(e){return fallbackAnalysis(input)}
}
$("submitBtn").onclick=async()=>{const input=$("answer").value.trim();if(!input){$("answer").focus();return;}addBubble(input,"user");$("submitBtn").disabled=true;$("submitBtn").textContent="正在分析…";const data=await analyze(input);lastCorrection=data;
 $("original").textContent=data.original||input;$("corrected").textContent=data.corrected||input;$("translation").textContent=data.translation||"";$("explanation").textContent=(data.explanation||"")+(data.natural?" "+data.natural:"");
 $("words").innerHTML="";(data.words||[]).forEach(w=>{const d=document.createElement("div");d.className="word-item";const b=document.createElement("b");b.textContent=w.word;const s=document.createElement("span");s.textContent=(w.meaning||"")+(w.grammar?" · "+w.grammar:"");d.append(b,s);$("words").append(d)});
 $("feedback").hidden=false;addBubble((data.corrected||input)+"\n"+(data.translation||""),"ai");$("submitBtn").disabled=false;$("submitBtn").textContent="检查并继续 →";if($("level").value==="adaptive"){levelScore++;if(levelScore%4===0)addBubble("¡Muy bien! Vamos a subir un poco la dificultad.","ai")}
};
if("serviceWorker"in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("/sw.js").catch(()=>{}));
setTask();