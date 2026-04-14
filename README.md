<div align="center">

<br />

```
██████╗ ██╗   ██╗ ██████╗ █████╗ ██╗     ██╗      ███╗   ██╗ ██████╗ ██████╗ ███████╗
██╔══██╗╚██╗ ██╔╝██╔════╝██╔══██╗██║     ██║      ████╗  ██║██╔═══██╗██╔══██╗██╔════╝
██████╔╝ ╚████╔╝ ██║     ███████║██║     ██║      ██╔██╗ ██║██║   ██║██║  ██║█████╗
██╔═══╝   ╚██╔╝  ██║     ██╔══██║██║     ██║      ██║╚██╗██║██║   ██║██║  ██║██╔══╝
██║        ██║   ╚██████╗██║  ██║███████╗███████╗ ██║ ╚████║╚██████╔╝██████╔╝███████╗
╚═╝        ╚═╝    ╚═════╝╚═╝  ╚═╝╚══════╝╚══════╝ ╚═╝  ╚═══╝ ╚═════╝ ╚═════╝ ╚══════╝
```

### **Call Python ML/AI functions from Node.js as native async functions**
### Zero HTTP · Pure stdio · Production-grade

<br />

[![npm version](https://img.shields.io/npm/v/pycall-node?color=00e5ff&labelColor=0a0a0f&style=for-the-badge&logo=npm)](https://www.npmjs.com/package/pycall-node)
[![npm downloads](https://img.shields.io/npm/dm/pycall-node?color=ffaa00&labelColor=0a0a0f&style=for-the-badge)](https://www.npmjs.com/package/pycall-node)
[![license](https://img.shields.io/npm/l/pycall-node?color=7c5cfc&labelColor=0a0a0f&style=for-the-badge)](./LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-339933?labelColor=0a0a0f&style=for-the-badge&logo=nodedotjs)](https://nodejs.org)
[![Python](https://img.shields.io/badge/python-%3E%3D3.8-3776AB?labelColor=0a0a0f&style=for-the-badge&logo=python)](https://python.org)
[![TypeScript](https://img.shields.io/badge/typescript-first-3178C6?labelColor=0a0a0f&style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-pycall--demo.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://pycall-demo.vercel.app/)

<br />

```
  ┌─────────────────┐                            ┌─────────────────┐
  │                 │  ──── stdin (request) ────▶ │                 │
  │   Node.js  🟢   │  { id, function, args }     │   Python  🐍    │
  │  async / await  │  ◀──── stdout (result) ───  │   @expose'd     │
  │                 │  { id, status, result }      │   functions     │
  └─────────────────┘                            └─────────────────┘
                         NDJSON over stdio
                    zero HTTP · zero sockets
```

<br />

[**📦 npm**](https://www.npmjs.com/package/pycall-node) &nbsp;·&nbsp;
[**🌐 Interactive Docs**](https://py-flow-bridge.base44.app) &nbsp;·&nbsp;
[**🚀 Live Demo**](https://pycall-demo.vercel.app/) &nbsp;·&nbsp;
[**👩‍💻 GitHub**](https://github.com/sanju234-san-)

<br />

</div>

---

## 🚀 Why pycall-node?

Most Node ↔ Python bridges **spawn a fresh process on every call** — adding hundreds of milliseconds of overhead. `pycall-node` keeps **one persistent subprocess** alive and communicates over a raw stdio NDJSON pipe.

```
❌  Traditional:   Node → spawn() → python → result → kill()   (~300ms per call)
✅  pycall-node:   Node → stdin write → Python → stdout read   (~1ms per call)
```

---

## ✨ Features

|  | Feature | Description |
|--|---------|-------------|
| ⚡ | **Native async/await** | Call `@expose`'d Python functions like local JS async functions |
| 📡 | **NDJSON over stdio** | Zero-overhead pipe — no HTTP, no sockets, no network stack |
| 🔄 | **Auto-restart** | Exponential backoff process recovery with configurable max restarts |
| 🏊 | **Worker pools** | `BridgePool` for parallel, round-robin workload distribution |
| 🛡️ | **Typed error hierarchy** | `PyTimeoutError`, `PyProcessError`, `PyRuntimeError` with full Python tracebacks |
| 🧠 | **Framework agnostic** | sklearn · PyTorch · HuggingFace · YOLOv8 · LangChain · anything Python |
| 📘 | **TypeScript-first** | Full type definitions, zero `any` in the public API |
| 🔑 | **UUID call tracking** | Fully concurrent in-flight calls — no race conditions |

---

## 📦 Installation

```bash
npm install pycall-node
```

> **Requirements:** Node.js ≥ 18 · Python ≥ 3.8 on your `PATH`

---

## ⚡ Quick Start

**1 — Write your Python script**

```python
# my_model.py
from bridge_runner import expose   # bundled with pycall-node

@expose
def predict(data):
    # drop in any ML framework here
    return {"label": "cat", "confidence": 0.97}

@expose
def preprocess(text: str) -> str:
    return text.strip().lower()
```

**2 — Call it from Node.js**

```typescript
import { Bridge } from 'pycall-node';

const bridge = new Bridge({ pythonScript: './my_model.py' });
await bridge.ready();

const result = await bridge.call('predict', { input: [1, 2, 3] });
console.log(result);
// → { label: 'cat', confidence: 0.97 }

await bridge.destroy();
```

No servers. No config files. No boilerplate.

---

## 📖 API Reference

### `new Bridge(options)`

Spawns the Python subprocess immediately on construction.

```typescript
const bridge = new Bridge({
  pythonScript: './script.py',     // ✅ required  — path to your Python file
  pythonPath:   'python3',         // ⚙️ optional  — python executable (default: 'python3')
  timeout:       30_000,           // ⚙️ optional  — default call timeout ms (default: 30000)
  maxRestarts:   3,                // ⚙️ optional  — max crash restarts (default: 3)
  env: { MY_API_KEY: 'secret' },   // ⚙️ optional  — extra env vars for Python
  cwd: '/path/to/project',         // ⚙️ optional  — working directory for Python
});
```

<br />

### `bridge.ready() → Promise<void>`

Resolves once Python sends its `__ready__` handshake. Always `await` this before calling.

```typescript
await bridge.ready();
// ✅ Python subprocess is up and accepting calls
```

<br />

### `bridge.call(fn, ...args) → Promise<unknown>`

Two calling conventions supported:

```typescript
// Variadic args
const result = await bridge.call('predict', inputData);

// Explicit args array + per-call timeout override
const result = await bridge.call('predict', [inputData], { timeout: 5_000 });
```

<br />

### `bridge.callWithKwargs(fn, args, kwargs, options?)`

Pass both positional and keyword arguments to Python:

```typescript
const result = await bridge.callWithKwargs(
  'train_model',
  [dataset],
  { epochs: 10, lr: 0.001, device: 'cuda' },
  { timeout: 120_000 }
);
```

<br />

### `bridge.exposedFunctions → readonly string[]`

Function names registered via `@expose` in the Python script. Available after `ready()`.

```typescript
await bridge.ready();
console.log(bridge.exposedFunctions);
// → ['predict', 'preprocess', 'train_model']
```

<br />

### `bridge.destroy() → Promise<void>`

Graceful shutdown: closes stdin → waits for exit → force-kills after 2s → rejects all pending calls.

```typescript
await bridge.destroy();
```

---

## 🏊 Worker Pool

Scale horizontally with `BridgePool` — manages N Python workers with automatic round-robin dispatch.

```typescript
import { BridgePool } from 'pycall-node';

const pool = new BridgePool({
  pythonScript: './worker.py',
  size:          4,          // 4 parallel Python processes
  timeout:       30_000,
});

await pool.ready(); // waits for ALL workers

// Round-robin dispatch — all 3 calls run in parallel
const [r1, r2, r3] = await Promise.all([
  pool.call('process', chunk1),   // → Worker 0
  pool.call('process', chunk2),   // → Worker 1
  pool.call('process', chunk3),   // → Worker 2
]);

await pool.destroy();
```

**`BridgePoolOptions`**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `pythonScript` | `string` | required | Path to Python script |
| `size` | `number` | `os.cpus().length` | Number of parallel workers |
| `timeout` | `number` | `30_000` | Default call timeout (ms) |
| `maxRestarts` | `number` | `3` | Max restarts per worker |
| `pythonPath` | `string` | `'python3'` | Python executable |
| `env` | `Record<string, string>` | `—` | Extra environment variables |
| `cwd` | `string` | `—` | Working directory |

---

## 🛡️ Error Handling

`pycall-node` ships a structured error hierarchy — catch broadly or handle each failure mode precisely.

```
PyCallNodeError              ← base class — catch-all safety net
├── PyTimeoutError           ← call() exceeded its deadline
├── PyProcessError           ← subprocess crashed or failed to spawn
└── PyRuntimeError           ← Python raised an exception inside your function
```

```typescript
import {
  PyTimeoutError,
  PyProcessError,
  PyRuntimeError,
} from 'pycall-node';

try {
  const result = await bridge.call('predict', data, { timeout: 2_000 });

} catch (err) {

  if (err instanceof PyTimeoutError) {
    // ⏱️ Call took too long
    console.error(`Timed out after ${err.timeoutMs}ms`);

  } else if (err instanceof PyRuntimeError) {
    // 🐍 Python raised an exception
    console.error(`${err.pythonType}: ${err.message}`);
    console.error(err.pythonTraceback);   // full Python stack trace

  } else if (err instanceof PyProcessError) {
    // 💥 Subprocess died unexpectedly
    console.error(`Process exited with code ${err.exitCode}`);
    console.error(err.stderr);            // last stderr output
  }
}
```

**Error properties:**

| Error Class | Extra Properties |
|-------------|-----------------|
| `PyTimeoutError` | `.timeoutMs: number` |
| `PyProcessError` | `.exitCode: number \| null` &nbsp; `.stderr: string` |
| `PyRuntimeError` | `.pythonType: string` &nbsp; `.pythonTraceback: string` |

---

## 📡 Events

`Bridge` and `BridgePool` extend `EventEmitter`:

```typescript
bridge.on('ready',   (fns: string[]) => console.log('✅ Ready, exposed:', fns));
bridge.on('stderr',  (text: string)  => console.warn('🐍 Python stderr:', text));
bridge.on('restart', (n: number)     => console.log(`🔄 Restart attempt ${n}`));
bridge.on('crash',   (err: Error)    => console.error('💀 Crashed permanently', err));
bridge.on('exit',    (code, signal)  => console.log(`Process exited (${code})`));
bridge.on('destroy', ()              => console.log('🛑 Bridge destroyed'));
```

---

## 🔄 Auto-Restart & Resilience

When the Python process crashes, `pycall-node` automatically restarts it using **exponential backoff**:

```
delay = min( 2ⁿ × 1000ms , 10000ms )

  Crash #1  ──▶  wait  1 000ms  ──▶  restart ✅
  Crash #2  ──▶  wait  2 000ms  ──▶  restart ✅
  Crash #3  ──▶  wait  4 000ms  ──▶  restart ✅
  Crash #4  ──▶  💀 emit 'crash' event, stop retrying
```

```typescript
bridge.on('crash', (err) => {
  console.error('Bridge permanently failed:', err.message);
  process.exit(1);
});
```

> All pending calls during a crash are immediately rejected with `PyProcessError`.

---

## 🔌 NDJSON Protocol

The internal wire format — plain newline-delimited JSON over stdio. No framing, no overhead.

**Node → Python `stdin` (request):**
```json
{ "id": "a3f7c2d1-...", "function": "predict", "args": [[1,2,3]], "kwargs": {} }
```

**Python → Node `stdout` on success:**
```json
{ "id": "a3f7c2d1-...", "status": "ok", "result": { "label": "cat", "confidence": 0.97 } }
```

**Python → Node `stdout` on error:**
```json
{
  "id": "a3f7c2d1-...",
  "status": "error",
  "error": "division by zero",
  "type": "ZeroDivisionError",
  "traceback": "Traceback (most recent call last):\n  File ..."
}
```

Each call registers its `resolve`/`reject` in an in-memory `Map<uuid, PendingCall>`. Dozens of concurrent in-flight calls are fully safe.

---

## 🧠 Framework Examples

<details>
<summary><b>🔬 scikit-learn</b></summary>

```python
@expose
def classify(features: list) -> dict:
    import pickle
    model = pickle.load(open('model.pkl', 'rb'))
    prediction = model.predict([features])
    proba      = model.predict_proba([features])
    return { "class": int(prediction[0]), "confidence": float(proba.max()) }
```
</details>

<details>
<summary><b>🔥 PyTorch</b></summary>

```python
@expose
def infer(image_path: str) -> int:
    import torch
    from torchvision import models, transforms
    from PIL import Image

    model     = models.resnet50(pretrained=True).eval()
    transform = transforms.Compose([transforms.Resize(256), transforms.ToTensor()])
    img       = transform(Image.open(image_path)).unsqueeze(0)

    with torch.no_grad():
        return model(img).argmax().item()
```
</details>

<details>
<summary><b>🤗 HuggingFace Transformers</b></summary>

```python
@expose
def sentiment(text: str) -> dict:
    from transformers import pipeline
    return pipeline('sentiment-analysis')(text)[0]
    # → { label: 'POSITIVE', score: 0.998 }

@expose
def summarize(text: str, max_length: int = 130) -> str:
    from transformers import pipeline
    return pipeline('summarization')(text, max_length=max_length)[0]['summary_text']
```
</details>

<details>
<summary><b>🎯 YOLOv8 Object Detection</b></summary>

```python
@expose
def detect(image_path: str, confidence: float = 0.5) -> list:
    from ultralytics import YOLO
    model   = YOLO('yolov8n.pt')
    results = model(image_path, conf=confidence)
    return [
        {
            "label":      r.names[int(c)],
            "confidence": round(float(conf), 4),
            "bbox":       b.tolist()
        }
        for r in results
        for b, conf, c in zip(r.boxes.xyxy, r.boxes.conf, r.boxes.cls)
    ]
```
</details>

<details>
<summary><b>🔗 LangChain RAG</b></summary>

```python
@expose
def query(question: str) -> dict:
    from langchain.chains      import RetrievalQA
    from langchain.vectorstores import Chroma
    from langchain.embeddings   import HuggingFaceEmbeddings
    from langchain.llms         import Ollama

    db = Chroma(persist_directory='./chroma_db',
                embedding_function=HuggingFaceEmbeddings())
    qa = RetrievalQA.from_chain_type(
             llm=Ollama(model='llama3'),
             retriever=db.as_retriever())
    return { "answer": qa.run(question) }
```
</details>

<details>
<summary><b>📊 Pandas / NumPy</b></summary>

```python
@expose
def analyze(csv_path: str) -> dict:
    import pandas as pd
    df = pd.read_csv(csv_path)
    return {
        "rows":    len(df),
        "columns": list(df.columns),
        "summary": df.describe().to_dict()
    }
```
</details>

---

## 📘 TypeScript Types

All public types are exported from the package root:

```typescript
import type {
  BridgeOptions,       // Constructor options for Bridge
  BridgePoolOptions,   // Constructor options for BridgePool
  CallOptions,         // Per-call options  { timeout?: number }
  RequestMessage,      // NDJSON message sent to Python
  ResponseMessage,     // NDJSON message received from Python
  SuccessResponse,     // { id, status: 'ok', result }
  ErrorResponse,       // { id, status: 'error', error, type, traceback }
} from 'pycall-node';
```

---

## ⚖️ Comparison

| Feature | **pycall-node** | HTTP / REST | IPC Sockets | node-calls-python |
|---------|:-----------:|:-----------:|:-----------:|:-----------------:|
| Per-call latency | ⚡ ~1ms | 🐢 ~10–50ms | ~5ms | ⚡ ~1ms |
| Setup complexity | ✅ Zero config | ❌ Server required | ⚠️ Complex | ⚠️ node-gyp build |
| Worker pool | ✅ Built-in | ❌ | ❌ | ❌ |
| Auto-restart | ✅ Built-in | ❌ | ❌ | ❌ |
| TypeScript types | ✅ Full | Partial | ❌ | ❌ |
| Typed error tracebacks | ✅ | ❌ | ❌ | ❌ |
| Process isolation | ✅ Subprocess | ✅ | ✅ | ❌ in-process |
| No native compilation | ✅ | ✅ | ✅ | ❌ |

---

## 📁 Project Structure

```
pycall-node/
├── src/
│   ├── bridge.ts          # Core Bridge — subprocess lifecycle + NDJSON I/O
│   ├── pool.ts            # BridgePool  — round-robin worker management
│   ├── errors.ts          # Typed error hierarchy
│   ├── types.ts           # Shared TypeScript interfaces
│   └── index.ts           # Public exports
├── python/
│   └── bridge_runner.py   # Python runner — @expose registry + NDJSON handler
└── dist/                  # Compiled output (CJS + ESM)
```

---

## 📋 Requirements

- **Node.js** `≥ 18.0.0`
- **Python** `≥ 3.8`
- Python must be on your `PATH` (or pass `pythonPath` in options)
- No native addons — pure JS + spawned subprocess, no `node-gyp`

---

## 📄 License

[MIT](./LICENSE) © 2026 [Sanjeevni Dhir](https://github.com/sanju234-san-)

---

<div align="center">

<br />

```
  Node.js  ──── NDJSON over stdio ────  Python
    🟢          zero overhead            🐍
  async/await                        @expose
```

<br />

Made with 💙 by [**Sanjeevni Dhir**]
MIT License

Copyright (c) 2026

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

<br />

[![npm](https://img.shields.io/badge/npm-pycall--node-CC3534?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/package/pycall-node)
[![vercel](https://img.shields.io/badge/Live%20Demo-pycall--demo.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://pycall-demo.vercel.app/)
[![github](https://img.shields.io/badge/github-sanju234--san---%23181717?style=for-the-badge&logo=github)](https://github.com/sanju234-san-)
[![linkedin](https://img.shields.io/badge/linkedin-sanjeevnidhir-0A66C2?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/sanjeevnidhir)

<br />

**⭐ Star the repo if this saved you from writing a REST API just to call Python**

<br />

</div>
