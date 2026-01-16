import { Instagram, Linkedin } from "lucide-react";

export type ProviderIds = "GOOGLE" | "OUTLOOK" | "LINKEDIN" | "INSTAGRAM";
export type ProviderState = {
  type: "mail" | "social";
  provider: ProviderIds;
  connected: boolean;
  id: string;
  name: string;
};
export const PROVIDERS: ProviderState[] = [
  { type: "mail", provider: "GOOGLE", connected: false, id: "", name: "" },
  { type: "mail", provider: "OUTLOOK", connected: false, id: "", name: "" },
  { type: "social", provider: "LINKEDIN", connected: false, id: "", name: "" },
  { type: "social", provider: "INSTAGRAM", connected: false, id: "", name: "" },
];

export const SUBSCRIBE_PLAN = 1;

export const STORAGE_KEY = "connectedAccounts";

export const PROVIDER_LABELS = {
  GOOGLE: {
    label: "Gmail",
    icon: <span className="font-bold text-lg">G</span>,
  },
  OUTLOOK: {
    label: "Outlook",
    icon: <span className="font-bold text-lg">⊞</span>,
  },
  LINKEDIN: {
    label: "LinkedIn",
    icon: <Linkedin size={20} className="text-blue-700" />,
  },
  INSTAGRAM: {
    label: "Instagram",
    icon: <Instagram size={20} className="text-pink-600" />,
  },
};
