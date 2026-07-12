import { defineCliConfig } from "sanity/cli";
import { dataset, projectId } from "./src/sanity/env";

// Enables `npx sanity ...` CLI commands (dataset management, schema deploy, typegen).
export default defineCliConfig({
  api: { projectId, dataset },
  autoUpdates: true,
});
