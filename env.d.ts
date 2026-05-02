/* eslint-disable */
declare namespace Cloudflare {
  interface GlobalProps {
    mainModule: typeof import("./src/server");
    durableNamespaces: "MyAgent";
  }

  interface Env {
    AI: Ai;
    LOADER: WorkerLoader;
    MyAgent: DurableObjectNamespace<import("./src/server").MyAgent>;
  }
}

interface Env extends Cloudflare.Env {}