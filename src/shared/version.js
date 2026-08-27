// Named import lets Vite tree-shake package.json down to just this field.
import { version } from "../../package.json";

/** App version, single source of truth = package.json. */
export const APP_VERSION = version;
