/**
 * Props for the `<SnipForm>` container component.
 */
export interface SnipFormProps {
  /** Your form's unique key from the SnipForm dashboard */
  key: string;
  /** Fade transition duration in milliseconds (default: 150). Set to "none" to disable. */
  transition?: number | "none";
  /** Enable test mode — form won't actually submit */
  mode?: "test";
  /** Disable the readability directive parser */
  readability?: false;
  /** Disable the namespace directive parser */
  namespace?: false;
  /** Disable the shorthand directive parser */
  shorthand?: false;
}

/**
 * Options for the astro-snipform integration.
 */
export interface SnipFormIntegrationOptions {
  /** CDN URL override (default: official SnipForm CDN) */
  cdnUrl?: string;
  /** Disable automatic script injection on all pages (use `<SnipFormScript>` per-page instead) */
  scriptInjection?: boolean;
}
