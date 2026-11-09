export interface AppScreenshot {
  file: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  capturedAt: string;
  sha256: string;
  source: string;
}
export interface AppEntry {
  id: string;
  title: string;
  inspiration: string;
  category: string;
  tagline: string;
  description: string;
  status: 'preview' | 'live';
  repo: string | null;
  launch: string | null;
  verified: string | null;
  features: string[];
  screenshots: AppScreenshot[];
}
