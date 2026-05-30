/**
 * Remotion entry point — re-exports the Root component.
 * This is what Remotion's CLI discovers when launching Studio or rendering.
 */

import { registerRoot } from "remotion";
import { RemotionRoot } from "./Root";

registerRoot(RemotionRoot);
