// Helper function to compress an image
async function compressImage(base64, mimeType, targetSizeKB = 10, maxIterations = 20) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = `data:${mimeType};base64,${base64}`;
    img.onload = () => {
      let quality = 1.0;
      let iterations = 0;
      let currentBase64 = base64;
      let width = img.width;
      let height = img.height;

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      function checkSizeAndCompress() {
        const currentSizeKB = Math.round((currentBase64.length * 3) / 4 / 1024);

        if (currentSizeKB <= targetSizeKB || iterations >= maxIterations) {
          console.log(`Final image size: ${currentSizeKB}KB after ${iterations} iterations.`);
          resolve(currentBase64);
          return;
        }

        iterations++;
        quality *= 0.7;
        width *= 0.7;
        height *= 0.7;

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        currentBase64 = canvas.toDataURL(mimeType, quality).split(',')[1];
        
        setTimeout(checkSizeAndCompress, 0);
      }

      checkSizeAndCompress();
    };
    img.onerror = error => reject(error);
  });
}
(function() {
  const n=document.createElement("link").relList;
  if(n&&n.supports&&n.supports("modulepreload"))return;
  for(const s of document.querySelectorAll('link[rel="modulepreload"]'))o(s);
  new MutationObserver(s=> {
    for(const i of s)if(i.type==="childList")for(const r of i.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&o(r)
  }
  ).observe(document, {
    childList:!0, subtree:!0
  }
  );
  function t(s) {
    const i= {
    };
    return s.integrity&&(i.integrity=s.integrity), s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy), s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin", i
  }
  function o(s) {
    if(s.ep)return;
    s.ep=!0;
    const i=t(s);
    fetch(s.href, i)
  }
}
)();
const nt="GeminiChatDB",
ot=2,
V="settings",
k="messages",
G="memory";
let v;
function st() {
  return new Promise((e, n)=> {
    const t=indexedDB.open(nt, ot);
    t.onerror=o=>n("Error opening DB"), t.onsuccess=o=> {
      v=o.target.result, e(v)
    }
, t.onupgradeneeded=o=> {
      const s=o.target.result;
      s.objectStoreNames.contains(V)||s.createObjectStore(V, {
        keyPath:"id"
      }
      ), s.objectStoreNames.contains(k)||s.createObjectStore(k, {
        keyPath:"id", autoIncrement:!0
      }
      ).createIndex("timestamp", "timestamp", {
        unique:!1
      }
      ), s.objectStoreNames.contains(G)||s.createObjectStore(G, {
        keyPath:"id", autoIncrement:!0
      }
      )
    }
  }
  )
}
function it(e, n) {
  return new Promise((t, o)=> {
    if(!v)return o("DB not open");
    const r=v.transaction([e], "readonly").objectStore(e).get(n);
    r.onsuccess=()=>t(r.result), r.onerror=()=>o(r.error)
  }
  )
}
function De(e) {
  return new Promise((n, t)=> {
    if(!v)return t("DB not open");
    const i=v.transaction([e], "readonly").objectStore(e).getAll();
    i.onsuccess=()=>n(i.result), i.onerror=()=>t(i.error)
  }
  )
}
function oe(e, n) {
  return new Promise((t, o)=> {
    if(!v)return o("DB not open");
    const r=v.transaction([e], "readwrite").objectStore(e).put(n);
    r.onsuccess=()=>t(r.result), r.onerror=()=>o(r.error)
  }
  )
}
function Be(e) {
  return new Promise((n, t)=> {
    if(!v)return t("DB not open");
    const i=v.transaction([e], "readwrite").objectStore(e).clear();
    i.onsuccess=()=>n(), i.onerror=()=>t(i.error)
  }
  )
}
async function T(e, n) {
  const t=await it(V, e);
  return t?t.value:n
}
async function F(e, n) {
  await oe(V, {
    id:e, value:n
  }
  )
}
async function ke() {
  return await De(k)
}
async function se(e) {
  await oe(k, {
    ...e, timestamp:new Date
  }
  )
}
async function rt() {
  await Be(k)
}
async function at(e) {
  await oe(G, {
    ...e, timestamp:new Date
  }
  )
}
async function ie() {
  return await De(G)
}
async function ct() {
  await Be(G)
}
const lt='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8 text-slate-400"><path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clip-rule="evenodd"></path></svg>',
dt='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8 text-slate-400"><path fill-rule="evenodd" d="M4.5 3.75a3 3 0 00-3 3v10.5a3 3 0 003 3h15a3 3 0 003-3V6.75a3 3 0 00-3-3h-15zm4.125 3.375a.75.75 0 000 1.5h6.75a.75.75 0 000-1.5h-6.75zm0 3.75a.75.75 0 000 1.5h6.75a.75.75 0 000-1.5h-6.75zm0 3.75a.75.75 0 000 1.5h6.75a.75.75 0 000-1.5h-6.75z" clip-rule="evenodd"></path></svg>',
ue='<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>',
ut='<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>';
const SearchIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>`;
function re(e) {
  e.scrollTop=e.scrollHeight
}
function J(e, n) {
  e.innerHTML=`<p><strong>Oops! Something went wrong.</strong></p><p>${n}</p>`,
  e.classList.remove("hidden")
}
function A(e, n, t, o, s) {
  n.disabled=e,
  e?(o.classList.remove("hidden"), re(s)):(o.classList.add("hidden"), t.focus())
}
function Ge(e) {
  e.querySelectorAll("pre").forEach(t=> {
    if(t.parentElement.parentElement?.classList.contains("code-block-wrapper"))return;
    const o=document.createElement("div");
    o.className="code-block-wrapper";
    const s=document.createElement("div");
    t.parentNode.insertBefore(o, t);
    const i=document.createElement("button");
    i.className="copy-button", i.innerHTML=`${ue} Copy`, i.addEventListener("click", ()=> {
      const r=t.querySelector("code")?.innerText||"";
      navigator.clipboard.writeText(r).then(()=> {
        i.innerHTML=`${ut} Copied!`, setTimeout(()=> {
          i.innerHTML=`${ue} Copy`
        }
, 2e3)
      }
      ).catch(a=> {
        i.textContent="Failed!"
      }
      )
    }
    ), s.appendChild(t), o.appendChild(i), o.appendChild(s)
  }
  )
}
function createSourcesElement(chunks,  parentId) {
  const sourcesContainer = document.createElement('div');
  sourcesContainer.className = 'mt-4 pt-3 border-t border-slate-600';
  sourcesContainer.id = `sources-${parentId}`;
  const sourcesHeader = document.createElement('h4');
  sourcesHeader.className = 'text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1.5';
  sourcesHeader.innerHTML = `${SearchIcon} Sources`;
  sourcesContainer.appendChild(sourcesHeader);
  const sourcesList = document.createElement('ul');
  sourcesList.className = 'space-y-1.5';
  chunks.forEach(chunk => {
    if (chunk.web?.uri) {
      const listItem = document.createElement('li');
      const link = document.createElement('a');
      link.href = chunk.web.uri;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.className = 'text-xs text-teal-400 hover:text-teal-300 hover:underline break-all';
      link.textContent = chunk.web.title || chunk.web.uri;
      listItem.appendChild(link);
      sourcesList.appendChild(listItem);
    }
  }
  );
  sourcesContainer.appendChild(sourcesList);
  return sourcesContainer;
}
function W(e, n, t=[]) {
  const {
    role:o,
    text:s,
    image:i
  }
  =n,
  r=`message-${Date.now()}-${Math.random()}`,
  a=document.createElement("div");
  a.id=r,
  a.classList.add("flex", "items-end", "gap-2");
  const c=o==="user",
  f=c?"bg-blue-600 rounded-br-none":"bg-slate-700 rounded-bl-none";
  a.classList.add(c?"justify-end":"justify-start");
  const y=document.createElement("div");
  if(y.classList.add("px-4", "py-3", "rounded-2xl", "text-white", "prose", ...f.split(" ")), y.style.maxWidth="85vw", i) {
    const m = document.createElement("img");
    const imageToDisplay = i.compressed ? i.compressed : (i.original ? i.original : i);
    m.src = imageToDisplay.base64.startsWith("data:") ? imageToDisplay.base64 : `data:${imageToDisplay.mimeType};base64,${imageToDisplay.base64}`;
    m.className = "max-w-[200px] md:max-w-[256px] rounded-lg mb-2 cursor-pointer";
    m.draggable = true;
    m.addEventListener("dragstart", e => {
      const fullImage = i.original ? i.original : i;
      e.dataTransfer.setData("application/json", JSON.stringify(fullImage));
    });
    m.addEventListener("click", () => {
      const lightbox = document.getElementById("image-lightbox");
      const lightboxImage = document.getElementById("lightbox-image");
      const downloadButton = document.getElementById("download-image-button");
      const fullImage = i.original ? i.original : i;
      const fullSrc = fullImage.base64.startsWith("data:") ? fullImage.base64 : `data:${fullImage.mimeType};base64,${fullImage.base64}`;
      lightboxImage.src = fullSrc;
      downloadButton.href = fullSrc;
      downloadButton.download = `image-${Date.now()}.png`;
      lightbox.classList.remove("hidden");
    });
    y.appendChild(m);
  }
  if(s) {
    const m=document.createElement("div");
    m.innerHTML=marked.parse(s),
    y.appendChild(m)
  }
  if(o==="model"&&t.length>0) {
    const m=createSourcesElement(t, r);
    y.appendChild(m)
  }
  const h=document.createElement("div");
  return h.classList.add("flex-shrink-0"),
  h.innerHTML=c?lt:dt,
  c?(a.appendChild(y), a.appendChild(h)):(a.appendChild(h), a.appendChild(y)),
  e.appendChild(a),
  Ge(a),
  re(e),
  r
}
var fe;
(function(e) {
  e.STRING="string", e.NUMBER="number", e.INTEGER="integer", e.BOOLEAN="boolean", e.ARRAY="array", e.OBJECT="object"
}
)(fe||(fe= {
}
));
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var he;
(function(e) {
  e.LANGUAGE_UNSPECIFIED="language_unspecified", e.PYTHON="python"
}
)(he||(he= {
}
));
var me;
(function(e) {
  e.OUTCOME_UNSPECIFIED="outcome_unspecified", e.OUTCOME_OK="outcome_ok", e.OUTCOME_FAILED="outcome_failed", e.OUTCOME_DEADLINE_EXCEEDED="outcome_deadline_exceeded"
}
)(me||(me= {
}
));
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ge=["user", "model", "function", "system"];
var pe;
(function(e) {
  e.HARM_CATEGORY_UNSPECIFIED="HARM_CATEGORY_UNSPECIFIED", e.HARM_CATEGORY_HATE_SPEECH="HARM_CATEGORY_HATE_SPEECH", e.HARM_CATEGORY_SEXUALLY_EXPLICIT="HARM_CATEGORY_SEXUALLY_EXPLICIT", e.HARM_CATEGORY_HARASSMENT="HARM_CATEGORY_HARASSMENT", e.HARM_CATEGORY_DANGEROUS_CONTENT="HARM_CATEGORY_DANGEROUS_CONTENT", e.HARM_CATEGORY_CIVIC_INTEGRITY="HARM_CATEGORY_CIVIC_INTEGRITY"
}
)(pe||(pe= {
}
));
var ye;
(function(e) {
  e.HARM_BLOCK_THRESHOLD_UNSPECIFIED="HARM_BLOCK_THRESHOLD_UNSPECIFIED", e.BLOCK_LOW_AND_ABOVE="BLOCK_LOW_AND_ABOVE", e.BLOCK_MEDIUM_AND_ABOVE="BLOCK_MEDIUM_AND_ABOVE", e.BLOCK_ONLY_HIGH="BLOCK_ONLY_HIGH", e.BLOCK_NONE="BLOCK_NONE"
}
)(ye||(ye= {
}
));
var Ee;
(function(e) {
  e.HARM_PROBABILITY_UNSPECIFIED="HARM_PROBABILITY_UNSPECIFIED", e.NEGLIGIBLE="NEGLIGIBLE", e.LOW="LOW", e.MEDIUM="MEDIUM", e.HIGH="HIGH"
}
)(Ee||(Ee= {
}
));
var ve;
(function(e) {
  e.BLOCKED_REASON_UNSPECIFIED="BLOCKED_REASON_UNSPECIFIED", e.SAFETY="SAFETY", e.OTHER="OTHER"
}
)(ve||(ve= {
}
));
var B;
(function(e) {
  e.FINISH_REASON_UNSPECIFIED="FINISH_REASON_UNSPECIFIED", e.STOP="STOP", e.MAX_TOKENS="MAX_TOKENS", e.SAFETY="SAFETY", e.RECITATION="RECITATION", e.LANGUAGE="LANGUAGE", e.BLOCKLIST="BLOCKLIST", e.PROHIBITED_CONTENT="PROHIBITED_CONTENT", e.SPII="SPII", e.MALFORMED_FUNCTION_CALL="MALFORMED_FUNCTION_CALL", e.OTHER="OTHER"
}
)(B||(B= {
}
));
var Ce;
(function(e) {
  e.TASK_TYPE_UNSPECIFIED="TASK_TYPE_UNSPECIFIED", e.RETRIEVAL_QUERY="RETRIEVAL_QUERY", e.RETRIEVAL_DOCUMENT="RETRIEVAL_DOCUMENT", e.SEMANTIC_SIMILARITY="SEMANTIC_SIMILARITY", e.CLASSIFICATION="CLASSIFICATION", e.CLUSTERING="CLUSTERING"
}
)(Ce||(Ce= {
}
));
var we;
(function(e) {
  e.MODE_UNSPECIFIED="MODE_UNSPECIFIED", e.AUTO="AUTO", e.ANY="ANY", e.NONE="NONE"
}
)(we||(we= {
}
));
var Ie;
(function(e) {
  e.MODE_UNSPECIFIED="MODE_UNSPECIFIED", e.MODE_DYNAMIC="MODE_DYNAMIC"
}
)(Ie||(Ie= {
}
));
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class g extends Error {
  constructor(n) {
    super(`[GoogleGenerativeAI Error]: ${n}`)
  }
}
class R extends g {
  constructor(n, t) {
    super(n),
    this.response=t
  }
}
class $e extends g {
  constructor(n, t, o, s) {
    super(n),
    this.status=t,
    this.statusText=o,
    this.errorDetails=s
  }
}
class O extends g {
}
class He extends g {
}
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ft="https://generativelanguage.googleapis.com",
ht="v1beta",
mt="0.24.1",
gt="genai-js";
var S;
(function(e) {
  e.GENERATE_CONTENT="generateContent", e.STREAM_GENERATE_CONTENT="streamGenerateContent", e.COUNT_TOKENS="countTokens", e.EMBED_CONTENT="embedContent", e.BATCH_EMBED_CONTENTS="batchEmbedContents"
}
)(S||(S= {
}
));
class pt {
  constructor(n, t, o, s, i) {
    this.model=n,
    this.task=t,
    this.apiKey=o,
    this.stream=s,
    this.requestOptions=i
  }
  toString() {
    var n,
    t;
    const o=((n=this.requestOptions)===null||n===void 0?void 0:n.apiVersion)||ht;
    let i=`${((t=this.requestOptions)===null||t===void 0?void 0:t.baseUrl)||ft}/${o}/${this.model}:${this.task}`;
    return this.stream&&(i+="?alt=sse"),
    i
  }
}
function yt(e) {
  const n=[];
  return e?.apiClient&&n.push(e.apiClient),
  n.push(`${gt}/${mt}`),
  n.join(" ")
}
async function Et(e) {
  var n;
  const t=new Headers;
  t.append("Content-Type", "application/json"),
  t.append("x-goog-api-client", yt(e.requestOptions)),
  t.append("x-goog-api-key", e.apiKey);
  let o=(n=e.requestOptions)===null||n===void 0?void 0:n.customHeaders;
  if(o) {
    if(!(o instanceof Headers))try {
      o=new Headers(o)
    }
    catch(s) {
      throw new O(`unable to convert customHeaders value ${JSON.stringify(o)} to Headers: ${s.message}`)
    }
    for(const[s, i]of o.entries()) {
      if(s==="x-goog-api-key")throw new O(`Cannot set reserved header name ${s}`);
      if(s==="x-goog-api-client")throw new O(`Header name ${s} can only be set using the apiClient field`);
      t.append(s, i)
    }
  }
  return t
}
async function vt(e, n, t, o, s, i) {
  const r=new pt(e, n, t, o, i);
  return {
    url:r.toString(),
    fetchOptions:Object.assign(Object.assign( {
    }
, _t(i)), {
      method:"POST", headers:await Et(r), body:s
    }
    )
  }
}
async function j(e, n, t, o, s, i= {
}
, r=fetch) {
  const {
    url:a,
    fetchOptions:c
  }
  =await vt(e, n, t, o, s, i);
  return Ct(a, c, r)
}
async function Ct(e, n, t=fetch) {
  let o;
  try {
    o=await t(e, n)
  }
  catch(s) {
    wt(s, e)
  }
  return o.ok||await It(o, e),
  o
}
function wt(e, n) {
  let t=e;
  throw t.name==="AbortError"?(t=new He(`Request aborted when fetching ${n.toString()}: ${e.message}`), t.stack=e.stack):e instanceof $e||e instanceof O||(t=new g(`Error fetching from ${n.toString()}: ${e.message}`), t.stack=e.stack),
  t
}
async function It(e, n) {
  let t="",
  o;
  try {
    const s=await e.json();
    t=s.error.message,
    s.error.details&&(t+=` ${JSON.stringify(s.error.details)}`, o=s.error.details)
  }
  catch {
  }
  throw new $e(`Error fetching from ${n.toString()}: [${e.status} ${e.statusText}] ${t}`, e.status, e.statusText, o)
}
function _t(e) {
  const n= {
  };
  if(e?.signal!==void 0||e?.timeout>=0) {
    const t=new AbortController;
    e?.timeout>=0&&setTimeout(()=>t.abort(), e.timeout),
    e?.signal&&e.signal.addEventListener("abort", ()=> {
      t.abort()
    }
    ),
    n.signal=t.signal
  }
  return n
}
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ae(e) {
  return e.text=()=> {
    if(e.candidates&&e.candidates.length>0) {
      if(e.candidates.length>1&&console.warn(`This response had ${e.candidates.length} candidates. Returning text from the first candidate only. Access response.candidates directly to use the other candidates.`), P(e.candidates[0]))throw new R(`${w(e)}`, e);
      return bt(e)
    }
    else if(e.promptFeedback)throw new R(`Text not available. ${w(e)}`, e);
    return""
  }
,
  e.functionCall=()=> {
    if(e.candidates&&e.candidates.length>0) {
      if(e.candidates.length>1&&console.warn(`This response had ${e.candidates.length} candidates. Returning function calls from the first candidate only. Access response.candidates directly to use the other candidates.`), P(e.candidates[0]))throw new R(`${w(e)}`, e);
      return console.warn("response.functionCall() is deprecated. Use response.functionCalls() instead."),
      _e(e)[0]
    }
    else if(e.promptFeedback)throw new R(`Function call not available. ${w(e)}`, e)
  }
,
  e.functionCalls=()=> {
    if(e.candidates&&e.candidates.length>0) {
      if(e.candidates.length>1&&console.warn(`This response had ${e.candidates.length} candidates. Returning function calls from the first candidate only. Access response.candidates directly to use the other candidates.`), P(e.candidates[0]))throw new R(`${w(e)}`, e);
      return _e(e)
    }
    else if(e.promptFeedback)throw new R(`Function call not available. ${w(e)}`, e)
  }
,
  e
}
function bt(e) {
  var n,
  t,
  o,
  s;
  const i=[];
  if(!((t=(n=e.candidates)===null||n===void 0?void 0:n[0].content)===null||t===void 0)&&t.parts)for(const r of(s=(o=e.candidates)===null||o===void 0?void 0:o[0].content)===null||s===void 0?void 0:s.parts)r.text&&i.push(r.text),
  r.executableCode&&i.push("\n```"+r.executableCode.language+`
`+r.executableCode.code+"\n```\n"),
  r.codeExecutionResult&&i.push("\n```\n"+r.codeExecutionResult.output+"\n```\n");
  return i.length>0?i.join(""):""
}
function _e(e) {
  var n,
  t,
  o,
  s;
  const i=[];
  if(!((t=(n=e.candidates)===null||n===void 0?void 0:n[0].content)===null||t===void 0)&&t.parts)for(const r of(s=(o=e.candidates)===null||o===void 0?void 0:o[0].content)===null||s===void 0?void 0:s.parts)r.functionCall&&i.push(r.functionCall);
  if(i.length>0)return i
}
const Ot=[B.RECITATION, B.SAFETY, B.LANGUAGE];
function P(e) {
  return!!e.finishReason&&Ot.includes(e.finishReason)
}
function w(e) {
  var n,
  t,
  o;
  let s="";
  if((!e.candidates||e.candidates.length===0)&&e.promptFeedback)s+="Response was blocked",
  !((n=e.promptFeedback)===null||n===void 0)&&n.blockReason&&(s+=` due to ${e.promptFeedback.blockReason}`),
  !((t=e.promptFeedback)===null||t===void 0)&&t.blockReasonMessage&&(s+=`: ${e.promptFeedback.blockReasonMessage}`);
  else if(!((o=e.candidates)===null||o===void 0)&&o[0]) {
    const i=e.candidates[0];
    P(i)&&(s+=`Candidate was blocked due to ${i.finishReason}`, i.finishMessage&&(s+=`: ${i.finishMessage}`))
  }
  return s
}
function $(e) {
  return this instanceof $?(this.v=e, this):new $(e)
}
function At(e, n, t) {
  if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");
  var o=t.apply(e, n||[]),
  s,
  i=[];
  return s= {
  }
,
  r("next"),
  r("throw"),
  r("return"),
  s[Symbol.asyncIterator]=function() {
    return this
  }
,
  s;
  function r(l) {
    o[l]&&(s[l]=function(d) {
      return new Promise(function(m, C) {
        i.push([l, d, m, C])>1||a(l, d)
      }
      )
    }
    )
  }
  function a(l, d) {
    try {
      c(o[l](d))
    }
    catch(m) {
      h(i[0][3], m)
    }
  }
  function c(l) {
    l.value instanceof $?Promise.resolve(l.value.v).then(f, y):h(i[0][2], l)
  }
  function f(l) {
    a("next", l)
  }
  function y(l) {
    a("throw", l)
  }
  function h(l, d) {
    l(d),
    i.shift(),
    i.length&&a(i[0][0], i[0][1])
  }
}
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const be=/^data\: (.*)(?:\n\n|\r\r|\r\n\r\n)/;
function St(e) {
  const n=e.body.pipeThrough(new TextDecoderStream("utf8", {
    fatal:!0
  }
  )),
  t=Nt(n),
  [o, s]=t.tee();
  return {
    stream:Tt(o),
    response:Rt(s)
  }
}
async function Rt(e) {
  const n=[],
  t=e.getReader();
  for(;
;
  ) {
    const {
      done:o,
      value:s
    }
    =await t.read();
    if(o)return ae(Mt(n));
    n.push(s)
  }
}
function Tt(e) {
  return At(this, arguments, function*() {
    const t=e.getReader();
    for(;
;
    ) {
      const {
        value:o, done:s
      }
      =yield $(t.read());
      if(s)break;
      yield yield $(ae(o))
    }
  }
  )
}
function Nt(e) {
  const n=e.getReader();
  return new ReadableStream( {
    start(o) {
      let s="";
      return i();
      function i() {
        return n.read().then(( {
          value:r, done:a
        }
        )=> {
          if(a) {
            if(s.trim()) {
              o.error(new g("Failed to parse stream"));
              return
            }
            o.close();
            return
          }
          s+=r;
          let c=s.match(be), f;
          for(;
          c;
          ) {
            try {
              f=JSON.parse(c[1])
            }
            catch {
              o.error(new g(`Error parsing JSON response: "${c[1]}"`));
              return
            }
            o.enqueue(f), s=s.substring(c[0].length), c=s.match(be)
          }
          return i()
        }
        ).catch(r=> {
          let a=r;
          throw a.stack=r.stack, a.name==="AbortError"?a=new He("Request aborted when reading from the stream"):a=new g("Error reading from the stream"), a
        }
        )
      }
    }
  }
  )
}
function Mt(e) {
  const n=e[e.length-1],
  t= {
    promptFeedback:n?.promptFeedback
  };
  for(const o of e) {
    if(o.candidates) {
      let s=0;
      for(const i of o.candidates)if(t.candidates||(t.candidates=[]), t.candidates[s]||(t.candidates[s]= {
        index:s
      }
      ), t.candidates[s].citationMetadata=i.citationMetadata, t.candidates[s].groundingMetadata=i.groundingMetadata, t.candidates[s].finishReason=i.finishReason, t.candidates[s].finishMessage=i.finishMessage, t.candidates[s].safetyRatings=i.safetyRatings, i.content&&i.content.parts) {
        t.candidates[s].content||(t.candidates[s].content= {
          role:i.content.role||"user", parts:[]
        }
        );
        const r= {
        };
        for(const a of i.content.parts)a.text&&(r.text=a.text),
        a.functionCall&&(r.functionCall=a.functionCall),
        a.executableCode&&(r.executableCode=a.executableCode),
        a.codeExecutionResult&&(r.codeExecutionResult=a.codeExecutionResult),
        Object.keys(r).length===0&&(r.text=""),
        t.candidates[s].content.parts.push(r)
      }
      s++
    }
    o.usageMetadata&&(t.usageMetadata=o.usageMetadata)
  }
  return t
}
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function je(e, n, t, o) {
  const s=await j(n, S.STREAM_GENERATE_CONTENT, e, !0, JSON.stringify(t), o);
  return St(s)
}
async function Ue(e, n, t, o) {
  const i=await(await j(n, S.GENERATE_CONTENT, e, !1, JSON.stringify(t), o)).json();
  return {
    response:ae(i)
  }
}
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Fe(e) {
  if(e!=null) {
    if(typeof e=="string")return {
      role:"system",
      parts:[ {
        text:e
      }
      ]
    };
    if(e.text)return {
      role:"system",
      parts:[e]
    };
    if(e.parts)return e.role?e: {
      role:"system",
      parts:e.parts
    }
  }
}
function H(e) {
  let n=[];
  if(typeof e=="string")n=[ {
    text:e
  }
  ];
  else for(const t of e)typeof t=="string"?n.push( {
    text:t
  }
  ):n.push(t);
  return Lt(n)
}
function Lt(e) {
  const n= {
    role:"user",
    parts:[]
  }
,
  t= {
    role:"function",
    parts:[]
  };
  let o=!1,
  s=!1;
  for(const i of e)"functionResponse"in i?(t.parts.push(i), s=!0):(n.parts.push(i), o=!0);
  if(o&&s)throw new g("Within a single message, FunctionResponse cannot be mixed with other type of part in the request for sending chat message.");
  if(!o&&!s)throw new g("No content is provided for sending chat message.");
  return o?n:t
}
function xt(e, n) {
  var t;
  let o= {
    model:n?.model,
    generationConfig:n?.generationConfig,
    safetySettings:n?.safetySettings,
    tools:n?.tools,
    toolConfig:n?.toolConfig,
    systemInstruction:n?.systemInstruction,
    cachedContent:(t=n?.cachedContent)===null||t===void 0?void 0:t.name,
    contents:[]
  };
  const s=e.generateContentRequest!=null;
  if(e.contents) {
    if(s)throw new O("CountTokensRequest must have one of contents or generateContentRequest, not both.");
    o.contents=e.contents
  }
  else if(s)o=Object.assign(Object.assign( {
  }
, o), e.generateContentRequest);
  else {
    const i=H(e);
    o.contents=[i]
  }
  return {
    generateContentRequest:o
  }
}
function Oe(e) {
  let n;
  return e.contents?n=e:n= {
    contents:[H(e)]
  }
,
  e.systemInstruction&&(n.systemInstruction=Fe(e.systemInstruction)),
  n
}
function Dt(e) {
  return typeof e=="string"||Array.isArray(e)? {
    content:H(e)
  }
  :e
}
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ae=["text", "inlineData", "functionCall", "functionResponse", "executableCode", "codeExecutionResult"],
Bt= {
  user:["text", "inlineData"],
  function:["functionResponse"],
  model:["text", "functionCall", "executableCode", "codeExecutionResult"],
  system:["text"]
};
function kt(e) {
  let n=!1;
  for(const t of e) {
    const {
      role:o,
      parts:s
    }
    =t;
    if(!n&&o!=="user")throw new g(`First content should be with role 'user', got ${o}`);
    if(!ge.includes(o))throw new g(`Each item should include role field. Got ${o} but valid roles are: ${JSON.stringify(ge)}`);
    if(!Array.isArray(s))throw new g("Content should have 'parts' property with an array of Parts");
    if(s.length===0)throw new g("Each Content should have at least one part");
    const i= {
      text:0,
      inlineData:0,
      functionCall:0,
      functionResponse:0,
      fileData:0,
      executableCode:0,
      codeExecutionResult:0
    };
    for(const a of s)for(const c of Ae)c in a&&(i[c]+=1);
    const r=Bt[o];
    for(const a of Ae)if(!r.includes(a)&&i[a]>0)throw new g(`Content with role '${o}' can't contain '${a}' part`);
    n=!0
  }
}
function Se(e) {
  var n;
  if(e.candidates===void 0||e.candidates.length===0)return!1;
  const t=(n=e.candidates[0])===null||n===void 0?void 0:n.content;
  if(t===void 0||t.parts===void 0||t.parts.length===0)return!1;
  for(const o of t.parts)if(o===void 0||Object.keys(o).length===0||o.text!==void 0&&o.text==="")return!1;
  return!0
}
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Re="SILENT_ERROR";
class Gt {
  constructor(n, t, o, s= {
  }
  ) {
    this.model=t,
    this.params=o,
    this._requestOptions=s,
    this._history=[],
    this._sendPromise=Promise.resolve(),
    this._apiKey=n,
    o?.history&&(kt(o.history), this._history=o.history)
  }
  async getHistory() {
    return await this._sendPromise,
    this._history
  }
  async sendMessage(n, t= {
  }
  ) {
    var o,
    s,
    i,
    r,
    a,
    c;
    await this._sendPromise;
    const f=H(n),
    y= {
      safetySettings:(o=this.params)===null||o===void 0?void 0:o.safetySettings,
      generationConfig:(s=this.params)===null||s===void 0?void 0:s.generationConfig,
      tools:(i=this.params)===null||i===void 0?void 0:i.tools,
      toolConfig:(r=this.params)===null||r===void 0?void 0:r.toolConfig,
      systemInstruction:(a=this.params)===null||a===void 0?void 0:a.systemInstruction,
      cachedContent:(c=this.params)===null||c===void 0?void 0:c.cachedContent,
      contents:[...this._history, f]
    }
,
    h=Object.assign(Object.assign( {
    }
, this._requestOptions), t);
    let l;
    return this._sendPromise=this._sendPromise.then(()=>Ue(this._apiKey, this.model, y, h)).then(d=> {
      var m;
      if(Se(d.response)) {
        this._history.push(f);
        const C=Object.assign( {
          parts:[], role:"model"
        }
, (m=d.response.candidates)===null||m===void 0?void 0:m[0].content);
        this._history.push(C)
      }
      else {
        const C=w(d.response);
        C&&console.warn(`sendMessage() was unsuccessful. ${C}. Inspect response object for details.`)
      }
      l=d
    }
    ).catch(d=> {
      throw this._sendPromise=Promise.resolve(), d
    }
    ),
    await this._sendPromise,
    l
  }
  async sendMessageStream(n, t= {
  }
  ) {
    var o,
    s,
    i,
    r,
    a,
    c;
    await this._sendPromise;
    const f=H(n),
    y= {
      safetySettings:(o=this.params)===null||o===void 0?void 0:o.safetySettings,
      generationConfig:(s=this.params)===null||s===void 0?void 0:s.generationConfig,
      tools:(i=this.params)===null||i===void 0?void 0:i.tools,
      toolConfig:(r=this.params)===null||r===void 0?void 0:r.toolConfig,
      systemInstruction:(a=this.params)===null||a===void 0?void 0:a.systemInstruction,
      cachedContent:(c=this.params)===null||c===void 0?void 0:c.cachedContent,
      contents:[...this._history, f]
    }
,
    h=Object.assign(Object.assign( {
    }
, this._requestOptions), t),
    l=je(this._apiKey, this.model, y, h);
    return this._sendPromise=this._sendPromise.then(()=>l).catch(d=> {
      throw new Error(Re)
    }
    ).then(d=>d.response).then(d=> {
      if(Se(d)) {
        this._history.push(f);
        const m=Object.assign( {
        }
, d.candidates[0].content);
        m.role||(m.role="model"), this._history.push(m)
      }
      else {
        const m=w(d);
        m&&console.warn(`sendMessageStream() was unsuccessful. ${m}. Inspect response object for details.`)
      }
    }
    ).catch(d=> {
      d.message!==Re&&console.error(d)
    }
    ),
    l
  }
}
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function $t(e, n, t, o) {
  return(await j(n, S.COUNT_TOKENS, e, !1, JSON.stringify(t), o)).json()
}
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ht(e, n, t, o) {
  return(await j(n, S.EMBED_CONTENT, e, !1, JSON.stringify(t), o)).json()
}
async function jt(e, n, t, o) {
  const s=t.requests.map(r=>Object.assign(Object.assign( {
  }
, r), {
    model:n
  }
  ));
  return(await j(n, S.BATCH_EMBED_CONTENTS, e, !1, JSON.stringify( {
    requests:s
  }
  ), o)).json()
}
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Te {
  constructor(n, t, o= {
  }
  ) {
    this.apiKey=n,
    this._requestOptions=o,
    t.model.includes("/")?this.model=t.model:this.model=`models/${t.model}`,
    this.generationConfig=t.generationConfig|| {
    }
,
    this.safetySettings=t.safetySettings||[],
    this.tools=t.tools,
    this.toolConfig=t.toolConfig,
    this.systemInstruction=Fe(t.systemInstruction),
    this.cachedContent=t.cachedContent
  }
  async generateContent(n, t= {
  }
  ) {
    var o;
    const s=Oe(n),
    i=Object.assign(Object.assign( {
    }
, this._requestOptions), t);
    return Ue(this.apiKey, this.model, Object.assign( {
      generationConfig:this.generationConfig, safetySettings:this.safetySettings, tools:this.tools, toolConfig:this.toolConfig, systemInstruction:this.systemInstruction, cachedContent:(o=this.cachedContent)===null||o===void 0?void 0:o.name
    }
, s), i)
  }
  async generateContentStream(n, t= {
  }
  ) {
    var o;
    const s=Oe(n),
    i=Object.assign(Object.assign( {
    }
, this._requestOptions), t);
    return je(this.apiKey, this.model, Object.assign( {
      generationConfig:this.generationConfig, safetySettings:this.safetySettings, tools:this.tools, toolConfig:this.toolConfig, systemInstruction:this.systemInstruction, cachedContent:(o=this.cachedContent)===null||o===void 0?void 0:o.name
    }
, s), i)
  }
  startChat(n) {
    var t;
    return new Gt(this.apiKey, this.model, Object.assign( {
      generationConfig:this.generationConfig, safetySettings:this.safetySettings, tools:this.tools, toolConfig:this.toolConfig, systemInstruction:this.systemInstruction, cachedContent:(t=this.cachedContent)===null||t===void 0?void 0:t.name
    }
, n), this._requestOptions)
  }
  async countTokens(n, t= {
  }
  ) {
    const o=xt(n, {
      model:this.model, generationConfig:this.generationConfig, safetySettings:this.safetySettings, tools:this.tools, toolConfig:this.toolConfig, systemInstruction:this.systemInstruction, cachedContent:this.cachedContent
    }
    ),
    s=Object.assign(Object.assign( {
    }
, this._requestOptions), t);
    return $t(this.apiKey, this.model, o, s)
  }
  async embedContent(n, t= {
  }
  ) {
    const o=Dt(n),
    s=Object.assign(Object.assign( {
    }
, this._requestOptions), t);
    return Ht(this.apiKey, this.model, o, s)
  }
  async batchEmbedContents(n, t= {
  }
  ) {
    const o=Object.assign(Object.assign( {
    }
, this._requestOptions), t);
    return jt(this.apiKey, this.model, n, o)
  }
}
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ce {
  constructor(n) {
    this.apiKey=n
  }
  getGenerativeModel(n, t) {
    if(!n.model)throw new g("Must provide a model name. Example: genai.getGenerativeModel({ model: 'my-model-name' })");
    return new Te(this.apiKey, n, t)
  }
  getGenerativeModelFromCachedContent(n, t, o) {
    if(!n.name)throw new O("Cached content must contain a `name` field.");
    if(!n.model)throw new O("Cached content must contain a `model` field.");
    const s=["model", "systemInstruction"];
    for(const r of s)if(t?.[r]&&n[r]&&t?.[r]!==n[r]) {
      if(r==="model") {
        const a=t.model.startsWith("models/")?t.model.replace("models/", ""):t.model,
        c=n.model.startsWith("models/")?n.model.replace("models/", ""):n.model;
        if(a===c)continue
      }
      throw new O(`Different value for "${r}" specified in modelParams (${t[r]}) and cachedContent (${n[r]})`)
    }
    const i=Object.assign(Object.assign( {
    }
, t), {
      model:n.model, tools:n.tools, toolConfig:n.toolConfig, systemInstruction:n.systemInstruction, cachedContent:n
    }
    );
    return new Te(this.apiKey, i, o)
  }
}
function Pe(e) {
  const n=e.match(/```json\n([\s\S]*?)\n```/);
  return n?n[1]:e
}
async function Ut(e, n, t) {
  let o=0;
  const s=e.length;
  let i=n;
  for(;
  o<s;
  ) {
    const r=e[i];
    console.log(`(Memory) Attempting to use API key #${i+1}`);
    try {
      const a=new ce(r).getGenerativeModel( {
        model:"gemini-2.5-flash"
      }
      ),
      c=`
        You are a memory agent. Your task is to analyze the following conversation and extract key information to be stored in a long-term memory.
        Extract facts, user preferences, and any other important details that should be remembered for future conversations.
        Return ONLY the information as a valid JSON object with a single key "memory" which contains an array of strings.
        If no new information is present, return an empty array.

        Conversation:
        ${JSON.stringify(t)}
    `;
      const f=(await(await a.generateContent(c)).response).text();
      return console.log(`(Memory) API key #${i+1} succeeded.`),
      JSON.parse(Pe(f)).memory
    }
    catch(l) {
      console.warn(`(Memory) API key #${i+1} failed.`, l),
      o++,
      i=(i+1)%e.length,
      await F("currentKeyIndex", i)
    }
  }
  return console.error("All API keys failed for memory task."),
  []
}
async function V_t(e, n) {
  const t=await ie();
  if(t.length<5)return;
  console.log("Consolidating memories...");
  let o=0;
  const s=e.length;
  let i=n;
  for(;
  o<s;
  ) {
    const r=e[i];
    console.log(`(Consolidation) Attempting to use API key #${i+1}`);
    try {
      const a=new ce(r).getGenerativeModel( {
        model:"gemini-2.5-flash"
      }
      ),
      c=`
        You are a memory consolidation agent. Your task is to review the following list of memories and consolidate them into a more concise, organized, and coherent set of facts.
        - **Merge related facts aggressively.** For example, "User likes dogs" and "User has a golden retriever" must become "User has a golden retriever dog."
        - **Remove redundant or outdated information.** If a memory is a less specific version of another, delete it.
        - **Eliminate meta-commentary.** Remove memories about the AI's own limitations or capabilities (e.g., "I cannot access personal information").
        - **Rephrase memories to be clearer and more objective.**
        - Return ONLY the consolidated information as a valid JSON object with a single key "consolidated_memories" which contains an array of strings.

        Memories to consolidate:
        ${JSON.stringify(t.map(y=>y.text))}
    `;
      const f=(await(await a.generateContent(c)).response).text(),
      y=JSON.parse(Pe(f)).consolidated_memories;
      return await ct(),
      await Ft(y, !0),
      void console.log(`(Consolidation) API key #${i+1} succeeded.`)
    }
    catch(h) {
      console.warn(`(Consolidation) API key #${i+1} failed.`, h),
      o++,
      i=(i+1)%e.length,
      await F("currentKeyIndex", i)
    }
  }
  console.error("All API keys failed for memory consolidation.")
}
async function Ft(e, n=!1) {
  const t=await ie(),
  o=new Set(t.map(i=>i.text.trim().toLowerCase())),
  s=e.filter(i=> {
    const r=i.trim().toLowerCase();
    return o.has(r)?!1:(o.add(r), !0)
  }
  );
  for(const i of s)await at( {
    text:i
  }
  );
  const i=await T("enableMemoryDefrag", !0);
  !n&&i&&s.length>0&&t.length>0&&t.length%5==0&&setTimeout(()=>V_t(X, Ye), 1e3)
}
async function Pt(e, n, t) {
  const o=await ie();
  if(o.length===0)return[];
  let s=0;
  const i=e.length;
  let r=n;
  for(;
  s<i;
  ) {
    const a=e[r];
    console.log(`(Retrieval) Attempting to use API key #${r+1}`);
    try {
      const c=new ce(a).getGenerativeModel( {
        model:"gemini-2.5-flash"
      }
      ),
      f=`
        You are a retrieval agent. Your task is to select the most relevant memories from the following list to help answer the user's query.
        - Analyze the user's query to understand its intent, even if it is vague. For example, a query like "what about my car" should be interpreted as a request for any stored information about their car.
        - Return ONLY the most relevant memories as a valid JSON object with a single key "relevant_memories" which contains an array of strings.
        - If no memories are relevant, or if the query is a simple greeting, return an empty array.
        - Do not return more than 5 memories.

        Memories:
        ${JSON.stringify(o.map(y=>y.text))}

        Query:
        ${t}
    `;
      const y=(await(await c.generateContent(f)).response).text();
      return console.log(`(Retrieval) API key #${r+1} succeeded.`),
      JSON.parse(Pe(y)).relevant_memories
    }
    catch(h) {
      console.warn(`(Retrieval) API key #${r+1} failed.`, h),
      s++,
      r=(r+1)%e.length,
      await F("currentKeyIndex", r)
    }
  }
  return console.error("All API keys failed for memory retrieval."),
  []
}
async function handleMemoryTasks(e, n) {
  try {
    const t = await ke();
    const memoryConversation = [...t, {
      role: "user",
      parts: [{ text: e }]
    }, {
      role: "model",
      parts: [{ text: n }]
    }].map(msg => {
      if (msg.image && msg.image.original) {
        return {
          ...msg,
          image: { compressed: msg.image.compressed }
        };
      }
      return msg;
    });

    const o = await Ut(X, Ye, memoryConversation);
    await Ft(o);
  }
  catch(t) {
    console.error("Error in background memory task:", t)
  }
}
async function Kt(e, n=null, t, o, s) {
  let i=0;
  const r=t.length;
  for(;
  i<r;
  ) {
    const a=t[o];
    console.log(`Attempting to use API key #${o+1}`);
    try {
      const c=new ce(a),
      f=await T("modelName", "gemini-2.5-flash"),
      y=await ke();
      let h = y.map(p => {
        const L = [];
        if (p.text) {
          L.push({ text: p.text });
        }
        if (p.image && p.role === 'user') {
          // Use compressed image for history, fallback to original/old format
          const imageForHistory = p.image.compressed ? p.image.compressed : p.image;
          L.push({
            inlineData: {
              mimeType: imageForHistory.mimeType,
              data: imageForHistory.base64,
            },
          });
        }
        return {
          role: p.role,
          parts: L,
        };
      }).filter(p => p.parts.length > 0);
      const l=h.findIndex(p=>p.role==="user");
      l>-1?h=h.slice(l):h=[];
      const m=new UAParser().getResult(),
      C=`${m.os.name} ${m.os.version}`,
      Ve=`${m.browser.name} ${m.browser.version}`,
      Je=new Date,
      We=Intl.DateTimeFormat().resolvedOptions().timeZone,
      ze=Je.toLocaleString();
      const Xe=await Pt(t, o, e);
      let memoryContext = "";
      if (Xe.length > 0) {
           memoryContext = `Here are some relevant memories from past conversations:
           ${Xe.join(`
`)}`
      }
      const Qe=`You are a helpful and friendly conversational AI. Your name is Gemini.
           When the user asks for information that may be recent or requires up-to-date knowledge (like current events, specific product details, or exchange rates), you MUST use the Google Search tool to find the answer. Do not tell the user what you *would* find; perform the search and provide the information directly, citing your sources when available.
           Current user context:
           - OS: ${C}
           - Browser: ${Ve}
           - Current Time: ${ze}
           - Timezone: ${We}
           
           ${memoryContext}

           Always format your responses using Markdown. For code, use language-specific code blocks.`,
      Ze=c.getGenerativeModel( {
        model:f, systemInstruction:Qe, tools:[ {
          googleSearch: {
          }
        }
        ]
      }
      ).startChat( {
        history:h.slice(0, -1)
      }
      ),
      Q=[];
      e&&Q.push(e),
      n&&Q.push( {
        inlineData: {
          mimeType:n.mimeType, data:n.base64
        }
      }
      );
      const et=await Ze.sendMessageStream(Q);
      console.log(`API key #${o+1} succeeded.`);
      let U,
      M="",
      collectedChunks=[];
      for await(const p of et.stream) {
        const L=p.text();
        M+=L;
        const newChunks = p.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
        if(newChunks.length>0) {
          newChunks.forEach(newChunk=> {
            if(newChunk.web?.uri&&!collectedChunks.some(c=>c.web.uri===newChunk.web.uri)) {
              collectedChunks.push(newChunk)
            }
          }
          )
        }
        U||(U=W(s, {
          role:"model", text:"..."
        }
        ));
        const le=document.getElementById(U);
        if(le) {
          const de=le.querySelector(".prose div");
          de&&(de.innerHTML=marked.parse(M+" ▋"));
          const messageBubble=de.parentElement;
          let sourcesContainer=document.getElementById(`sources-${U}`);
          if(collectedChunks.length>0) {
            if(!sourcesContainer) {
              sourcesContainer=createSourcesElement(collectedChunks, U);
              messageBubble.appendChild(sourcesContainer)
            }
            else {
              const newList=createSourcesElement(collectedChunks, U);
              sourcesContainer.replaceWith(newList)
            }
          }
          re(s)
        }
      }
      const Z=document.getElementById(U);
      if(Z) {
        const p=Z.querySelector(".prose div");
        p&&(p.innerHTML=marked.parse(M)),
        Ge(Z)
      }
      await se( {
        role:"model", text:M
      }
      );
      return M
    }
    catch(c) {
      console.warn(`API key #${o+1} failed.`, c),
      i++,
      o=(o+1)%t.length,
      await F("currentKeyIndex", o)
    }
  }
  throw new Error("All API keys failed. Please check your keys in the settings.")
}

async function imageGenerationKt(e, n, t, o) {
  let i = 0;
  const r = n.length;
  for (; i < r;) {
    const a = n[t];
    console.log(`Attempting to use API key #${t + 1}`);
    try {
      const c = new ce(a);
      const f = "gemini-2.0-flash-preview-image-generation";
      const y = c.getGenerativeModel({
        model: f,
        generationConfig: {
          responseModalities: ["Text", "Image"]
        }
      });

      const h = await y.generateContent(e);
      const l = await h.response;

      console.log(`API key #${t + 1} succeeded.`);

      const imagePart = l.candidates[0].content.parts.find(p => p.inlineData);
      if (!imagePart) {
        throw new Error("The AI response did not contain an image. Please try a different prompt.");
      }
      const originalBase64 = imagePart.inlineData.data;
      const mimeType = imagePart.inlineData.mimeType;
      const compressedBase64 = await compressImage(originalBase64, mimeType, 10);

      const modelResponse = {
        role: "model",
        text: `Generated image for: "${e}"`,
        image: {
          original: { base64: originalBase64, mimeType: mimeType },
          compressed: { base64: compressedBase64, mimeType: mimeType }
        }
      };

      W(o, modelResponse);
      await se(modelResponse);

      return modelResponse;
    } catch (c) {
      console.warn(`API key #${t + 1} failed.`, c);
      i++;
      t = (t + 1) % n.length;
      await F("currentKeyIndex", t);
    }
  }
  throw new Error("All API keys failed for image generation. Please check your keys in the settings.");
}

const z="your-super-secret-key";
let E,
ee,
u,
_,
b,
N,
Yt,
Ne,
x,
K,
qt,
Vt,
te,
Ke,
Y,
q,
Me,
Le,
D,
Jt,
Wt,
ne,
xe,
zt,
nn,
on,
sn,
generateImageButton,
imageLightbox,
lightboxImage,
closeLightboxButton,
downloadImageButton,
X=[],
Ye=0,
I=null;

async function generateImage() {
  if (X.length === 0) return;
  const n = Xt(u.value);
  if (!n.trim()) return;

  A(!0, _, u, b, E);
  N.classList.add("hidden");

  const t = {
    role: "user",
    text: `Generate an image of: ${n.trim()}`,
  };

  W(E, t);
  await se(t);
  u.value = "";
  u.style.height = "auto";
  u.placeholder = "Type your message or add an image...";

  try {
    const modelResponse = await imageGenerationKt(t.text, X, Ye, E);
    A(!1, _, u, b, E);
  } catch (o) {
    J(N, o.message);
    A(!1, _, u, b, E);
  }
}

function Xt(e) {
  return e.replace(/&/g, "&").replace(/</g, "<").replace(/>/g, ">").replace(/"/g, '"').replace(/'/g, "&#039;")
}
function Qt(e) {
  let n="";
  for(let t=0;
  t<e.length;
  t++)n+=String.fromCharCode(e.charCodeAt(t)^z.charCodeAt(t%z.length));
  return btoa(n)
}
function qe(e) {
  let n="";
  const t=atob(e);
  for(let o=0;
  o<t.length;
  o++)n+=String.fromCharCode(t.charCodeAt(o)^z.charCodeAt(o%z.length));
  return n
}
async function Zt(e) {
  if(e.preventDefault(), X.length===0)return;
  const n=Xt(u.value);
  if(!n.trim()&&!I)return;
  A(!0, _, u, b, E),
  N.classList.add("hidden");
  const t= {
    role:"user",
    text:n.trim()
  };
  if (I) {
    t.image = I;
  }
  W(E, t),
  await se(t),
  u.value="",
  u.style.height="auto",
  u.placeholder="Type your message or add an image...",
  I&&(I=null, D.value="", Y.classList.add("hidden"), q.src="");
  try {
    const o = await Kt(t.text, t.image ? t.image.original : null, X, Ye, E);
    A(!1, _, u, b, E);
    setTimeout(() => handleMemoryTasks(t.text,  o),  0);
  }
  catch(o) {
    J(N, o.message),
    A(!1, _, u, b, E)
  }
}
async function en() {
  A(!0, _, u, b, E),
  u.placeholder="Initializing...";
  const e=await T("apiKeys", []);
  Ye=await T("currentKeyIndex", 0);
  const n=await T("modelName", "gemini-2.5-flash");
  if(e.length===0) {
    J(N, "No API Keys found. Please add your key(s) in the settings."),
    A(!0, _, u, b, E),
    u.placeholder="Please set API Key(s) in Settings.",
    x.classList.remove("hidden"),
    K.focus();
    return
  }
  X=e.map(qe);
  try {
    const t=await ke();
    if(E.innerHTML="", t.forEach(o=>W(E, o)), Ke.textContent=n, t.length===0) {
      const o= {
        role:"model",
        text:`Hello! I am Gemini, your personal AI assistant. Loaded ${X.length} API key(s). Your chat history will be saved. How can I help you today?`
      };
      W(E, o),
      await se(o)
    }
    A(!1, _, u, b, E),
    u.placeholder="Type your message..."
  }
  catch(t) {
    const o=t instanceof Error?t.message:"An unknown error occurred during initialization.";
    J(N, `Initialization failed: ${o}.`),
    A(!0, _, u, b, E),
    u.placeholder="Application is disabled."
  }
}
async function tn() {
  try {
    E=document.getElementById("chat-log"),
    ee=document.getElementById("chat-form"),
    u=document.getElementById("chat-input"),
    _=document.getElementById("send-button"),
    b=document.getElementById("typing-indicator"),
    N=document.getElementById("error-message"),
    Yt=document.getElementById("settings-button"),
    Ne=document.getElementById("clear-chat-button"),
    x=document.getElementById("settings-modal"),
    K=document.getElementById("api-key-input"),
    qt=document.getElementById("save-settings-button"),
    Vt=document.getElementById("cancel-settings-button"),
    te=document.getElementById("model-select"),
    Ke=document.getElementById("current-model"),
    Y=document.getElementById("image-preview-container"),
    q=document.getElementById("image-preview"),
    Me=document.getElementById("remove-image-button"),
    Le=document.getElementById("attach-file-button"),
    D=document.getElementById("file-input"),
    Jt=document.getElementById("clear-memory-button"),
    Wt=document.getElementById("view-memory-button"),
    ne=document.getElementById("memory-modal"),
    xe=document.getElementById("memory-content"),
    zt=document.getElementById("close-memory-modal-button"),
    nn=document.getElementById("import-memory-button"),
    on=document.getElementById("export-memory-button"),
    sn=document.getElementById("optimize-memory-button"),
    generateImageButton = document.getElementById("generate-image-button"),
    imageLightbox = document.getElementById("image-lightbox"),
    lightboxImage = document.getElementById("lightbox-image"),
    closeLightboxButton = document.getElementById("close-lightbox-button"),
    downloadImageButton = document.getElementById("download-image-button");
    await st(),
    ee.addEventListener("submit", Zt),
    Le.addEventListener("click", ()=>D.click()),
    generateImageButton.addEventListener("click", generateImage),
    closeLightboxButton.addEventListener("click", () => {
      imageLightbox.classList.add("hidden");
    });
    Ne.addEventListener("click", async()=> {
      confirm("Are you sure you want to clear the entire chat history? This cannot be undone.")&&(await rt(), location.reload())
    }
    ),
    D.addEventListener("change", e=> {
      const n=e.target.files[0];
      if(n&&n.type.startsWith("image/")) {
        const t=new FileReader;
        t.onloadend= async ()=> {
          const originalBase64 = t.result.split(",")[1];
          const compressedBase64 = await compressImage(originalBase64, n.type, 10);
          I = {
            original: { base64: originalBase64, mimeType: n.type },
            compressed: { base64: compressedBase64, mimeType: n.type }
          };
          q.src=t.result;
          Y.classList.remove("hidden");
          u.placeholder="Describe the image or ask a question...";
        }
, t.readAsDataURL(n)
      }
      e.target.value=""
    }
    ),
    Me.addEventListener("click", ()=> {
      I=null, D.value="", Y.classList.add("hidden"), q.src="", u.placeholder="Type your message or add an image..."
    }
    ),
    u.addEventListener("keydown", e=> {
      if(e.key==="Enter"&&!e.shiftKey) {
        e.preventDefault();
        if(!_.disabled)ee.dispatchEvent(new Event("submit", {
          cancelable:!0, bubbles:!0
        }
        ))
      }
    }
    ),
    ee.addEventListener("dragover", e => {
      e.preventDefault();
      ee.classList.add("drag-over");
    }),
    ee.addEventListener("dragleave", () => {
      ee.classList.remove("drag-over");
    }),
    ee.addEventListener("drop", async e => {
      e.preventDefault();
      ee.classList.remove("drag-over");
      const file = e.dataTransfer.files[0];
      const draggedImageData = e.dataTransfer.getData("application/json");

      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const originalBase64 = reader.result.split(",")[1];
          const compressedBase64 = await compressImage(originalBase64, file.type, 10);
          I = {
            original: { base64: originalBase64, mimeType: file.type },
            compressed: { base64: compressedBase64, mimeType: file.type }
          };
          q.src = reader.result;
          Y.classList.remove("hidden");
          u.placeholder = "Describe the image or ask a question...";
        };
        reader.readAsDataURL(file);
      } else if (draggedImageData) {
        try {
          const { base64, mimeType } = JSON.parse(draggedImageData);
          const compressedBase64 = await compressImage(base64, mimeType, 10);
          I = {
            original: { base64, mimeType },
            compressed: { base64: compressedBase64, mimeType }
          };
          q.src = `data:${mimeType};base64,${base64}`;
          Y.classList.remove("hidden");
          u.placeholder = "Describe the image or ask a question...";
        } catch (error) {
          console.error("Failed to handle dropped image data:", error);
        }
      }
    }),
    u.addEventListener("input", ()=> {
      u.style.height="auto";
      const e=Math.min(u.scrollHeight, 200);
      u.style.height=e+"px"
    }
    ),
    document.addEventListener("click", async e=> {
      const n=e.target.closest("button");
      if(n)switch(n.id) {
        case"settings-button": {
          const t=await T("apiKeys", []);
          K.value=t.map(qe).join(`
`), te.value=await T("modelName", "gemini-2.5-flash"), x.classList.remove("hidden");
          break
        }
        case"cancel-settings-button":x.classList.add("hidden");
        break;
        case"save-settings-button": {
          const t=K.value.split(`
`).map(o=>o.trim()).filter(o=>o);
          if(t.length>0) {
            const o=t.map(Qt);
            await F("apiKeys", o), await F("modelName", te.value), await F("currentKeyIndex", 0), x.classList.add("hidden"), location.reload()
          }
          else alert("API Key(s) cannot be empty.");
          break
        }
        case"view-memory-button": {
          const t=await ie();
          xe.innerHTML=t.length===0?'<p class="text-slate-400">No memories found.</p>':t.map(o=>`<div class="p-2 border-b border-slate-700">${o.text}</div>`).join(""), ne.classList.remove("hidden");
          break
        }
        case"clear-memory-button":confirm("Are you sure you want to clear the AI's memory? This cannot be undone.")&&(await ct(), alert("AI memory has been cleared."));
        break;
        case"close-memory-modal-button":ne.classList.add("hidden");
        break;
        case"export-memory-button": {
          const t=await ie(), o= {
            version:1, timestamp:new Date().toISOString(), memories:t.map(s=>s.text)
          };
          const s=new Blob([JSON.stringify(o, null, 2)], {
            type:"application/json"
          }
          ), i=URL.createObjectURL(s), r=document.createElement("a");
          r.href=i, r.download="gemini-memory.json", document.body.appendChild(r), r.click(), document.body.removeChild(r), URL.revokeObjectURL(i), alert("Memory exported successfully.");
          break
        }
        case"import-memory-button": {
          const t=document.createElement("input");
          t.type="file", t.accept=".json", t.onchange=async s=> {
            const i=s.target.files[0];
            if(!i)return;
            const r=new FileReader;
            r.onload=async a=> {
              try {
                const c=JSON.parse(a.target.result);
                if(!c.memories||!Array.isArray(c.memories)) {
                  alert("Invalid memory file format.");
                  return
                }
                const f=c.memories.filter(y=>typeof y=="string");
                await Ft(f), alert(`${f.length} memories imported successfully! Please reload the page to see the changes in the 'View Memory' modal.`)
              }
              catch(c) {
                alert("Failed to parse JSON or invalid file content.")
              }
            }
, r.readAsText(i)
          }
, t.click();
          break
        }
        case "optimize-memory-button":
            const optimizeButton = document.getElementById("optimize-memory-button");
            const originalButtonText = optimizeButton.innerHTML;
            optimizeButton.disabled = true;
            optimizeButton.innerHTML = `<svg class="animate-spin h-5 w-5 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
</svg> Optimizing...`;
            try {
                await V_t(X, Ye);
                alert("AI memory has been optimized.");
            } catch (t) {
                alert("An error occurred during memory optimization.");
                console.error("Memory optimization error:", t);
            } finally {
                optimizeButton.disabled = false;
                optimizeButton.innerHTML = originalButtonText;
            }
            break;
      }
    }
    ),
    marked.setOptions( {
      highlight:function(e, n) {
        const t=hljs.getLanguage(n)?n:"plaintext";
        return hljs.highlight(e, {
          language:t, ignoreIllegals:!0
        }
        ).value
      }
    }
    ),
    await en(),
    "serviceWorker"in navigator&&window.addEventListener("load", ()=> {
      navigator.serviceWorker.register("/sw.js").then(e=> {
        console.log("ServiceWorker registration successful with scope: ", e.scope)
      }
, e=> {
        console.log("ServiceWorker registration failed: ", e)
      }
      )
    }
    )
  }
  catch(e) {
    console.error("Fatal initialization error:", e),
    J(N, `Fatal Error: The application could not start. ${e.message}. Please refresh the page or clear site data.`),
    A(!0, _, u, b, E),
    u.placeholder="Application disabled due to an error."
  }
}
tn();