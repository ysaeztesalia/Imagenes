export interface ProductData {
  description: string;
  url: string;
  referenceImage: string | null; // Base64
  referenceMimeType: string | null;
}

export interface GeneratedImage {
  url: string;
  promptUsed: string;
}

export enum AppState {
  IDLE = 'IDLE',
  GENERATING_PROMPT = 'GENERATING_PROMPT',
  PROMPT_REVIEW = 'PROMPT_REVIEW',
  GENERATING_IMAGE = 'GENERATING_IMAGE',
  IMAGE_READY = 'IMAGE_READY',
  ERROR = 'ERROR',
}

export interface GroundingUrl {
  uri: string;
  title: string;
}