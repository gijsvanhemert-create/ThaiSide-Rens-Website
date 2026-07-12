import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";
import { dataset, projectId } from "../env";

// Built from projectId/dataset directly (not the client) so it is safe to import
// anywhere. Only ever called with real image data, which implies a configured project.
const builder = createImageUrlBuilder({ projectId, dataset });

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
