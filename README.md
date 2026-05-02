# learn-think-cf

這是一個 Cloudflare Think 範例專案，示範如何在 Cloudflare Workers 上建立一個帶有聊天介面、持久化工作區與沙箱執行能力的 agent。

`@cloudflare/think` 是 Cloudflare Agents 上一個偏向高層封裝的 chat agent 基底類別。它把聊天生命週期中常見的基礎工作包起來，例如訊息持久化、串流回應、工具呼叫、client tools、恢復中斷的串流，以及以 Durable Object SQLite 為基礎的狀態管理。這個專案就是用最小可運行範例，把這套能力接上 Workers AI、React chat UI，以及一個可持續存在的 workspace。

官方 Think 文件：<https://github.com/cloudflare/agents/blob/main/docs/think/index.md>

## 這個範例做了什麼

- 在 [src/server.ts](/Users/funtuan/side-project/learn-think-cf/src/server.ts) 中建立 `MyAgent`，並繼承 `Think<Env>`。
- 使用 Workers AI 的 `@cf/moonshotai/kimi-k2.6` 作為模型。
- 啟動時將 `https://github.com/funtuan/Mobiuscooter.git` clone 到 agent 的持久化 workspace：`/sandbox/Mobiuscooter`。
- 透過 `createExecuteTool()` 提供沙箱執行能力，讓 agent 可以在 workspace 內做多步驟操作。
- 透過 `gitTools()` 將 Git 操作暴露給 execute tool 使用。
- 在 [src/client.tsx](/Users/funtuan/side-project/learn-think-cf/src/client.tsx) 中提供一個最小 React chat 介面，直接用 `useAgent()` 與 `useAgentChat()` 連到後端 agent。

## 為什麼用 Think

相較於自己手動拼接 chat protocol、訊息儲存、LLM 串流與工具執行流程，Think 比較適合這種想快速驗證 agent 能力的場景。你只需要覆寫像 `getModel()`、`getTools()`、`getSystemPrompt()` 這類局部能力，就能把完整 agent loop 跑起來。

這個範例特別適合拿來理解以下幾件事：

- 如何在 Cloudflare Workers 上掛一個可聊天的 Think agent
- 如何把持久化 workspace 接進 agent
- 如何讓 agent 使用 sandbox execute tool 處理多步工作
- 如何把 React chat client 接到 Cloudflare Agents protocol

## 專案結構

```text
src/
  client.tsx   # React chat client
  server.ts    # Think agent, workspace, execute tool, route handler
index.html     # 前端入口
wrangler.jsonc # Cloudflare Workers / Durable Objects / AI 綁定設定
vite.config.ts # Vite + Cloudflare plugin 設定
```

## 執行需求

- Node.js `>=24`
- 一個已啟用 Cloudflare Workers 與 Workers AI 的帳號
- 已登入 `wrangler`

## 本機開發

安裝依賴：

```bash
npm install
```

啟動本機開發：

```bash
npm run start
```

型別檢查：

```bash
npm run check
```

建置：

```bash
npm run build
```

## 部署到 Cloudflare

```bash
npm run deploy
```

這會先執行 Vite build，再透過 Wrangler 部署 Worker。

## 重要設定

[wrangler.jsonc](/Users/funtuan/side-project/learn-think-cf/wrangler.jsonc) 目前包含以下核心綁定：

- `AI`: 給 Workers AI model 使用
- `LOADER`: 提供 `createExecuteTool()` 的 worker loader
- `MyAgent`: Durable Object 綁定，負責 agent 狀態與 SQLite 儲存

## 可客製化的地方

- 如果你想改成自己的 repo sandbox，調整 [src/server.ts](/Users/funtuan/side-project/learn-think-cf/src/server.ts) 內的 `SANDBOX_REPO_URL` 與 `SANDBOX_REPO_DIR`。
- 如果你想換模型，調整 `getModel()`。
- 如果你想增加更多工具，擴充 `getTools()` 回傳的 tool set。
- 如果你想換成更完整的系統提示，調整 `getSystemPrompt()`。

## 參考

- Think 官方文件：<https://github.com/cloudflare/agents/blob/main/docs/think/index.md>
- Cloudflare Agents repo：<https://github.com/cloudflare/agents>