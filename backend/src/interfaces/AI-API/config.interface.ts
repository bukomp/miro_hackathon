export interface AIConfiguration {
  baseURL: string;
  apiKey: string;
  organization: string;
  [key: string]: string | number;
}

export interface Message {
  role: string;
  content: string;
}
