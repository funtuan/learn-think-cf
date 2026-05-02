import { routeAgentRequest } from "agents";
import { Think } from "@cloudflare/think";
import { createExecuteTool } from "@cloudflare/think/tools/execute";
import { createWorkspaceTools } from "@cloudflare/think/tools/workspace";
import {
  createWorkspaceStateBackend,
  Workspace,
  WorkspaceFileSystem,
} from "@cloudflare/shell";
import { createGit, gitTools } from "@cloudflare/shell/git";
import { createWorkersAI } from "workers-ai-provider";

const SANDBOX_REPO_DIR = "/sandbox/Mobiuscooter";
const SANDBOX_REPO_URL = "https://github.com/funtuan/Mobiuscooter.git";

export class MyAgent extends Think<Env> {
  override workspace = new Workspace({
    sql: this.ctx.storage.sql,
    name: () => this.name,
  });

  async onStart() {
    const repoMarker = await this.workspace.stat(`${SANDBOX_REPO_DIR}/.git`);

    if (repoMarker) {
      return;
    }

    const git = createGit(new WorkspaceFileSystem(this.workspace));

    await git.clone({
      url: SANDBOX_REPO_URL,
      dir: SANDBOX_REPO_DIR,
      depth: 1,
    });
  }

  getModel() {
    return createWorkersAI({ binding: this.env.AI })(
      "@cf/moonshotai/kimi-k2.6"
    );
  }

  getTools() {
    const workspaceTools = createWorkspaceTools(this.workspace);

    return {
      execute: createExecuteTool({
        tools: workspaceTools,
        state: createWorkspaceStateBackend(this.workspace),
        providers: [gitTools(this.workspace, { dir: SANDBOX_REPO_DIR })],
        loader: this.env.LOADER,
      }),
    };
  }

  getSystemPrompt() {
    return [
      "You are a helpful coding assistant with access to a persistent workspace and a sandboxed execute tool.",
      `The repository ${SANDBOX_REPO_URL} is cloned into ${SANDBOX_REPO_DIR} when the agent starts.`,
      "Use the execute tool for multi-step work inside the sandbox.",
      "Inside execute, use state.* for filesystem operations and git.* for repository operations.",
    ].join(" ");
  }
}

export default {
  async fetch(request: Request, env: Env) {
    return (
      (await routeAgentRequest(request, env)) ||
      new Response("Not found", { status: 404 })
    );
  }
} satisfies ExportedHandler<Env>;