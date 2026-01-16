"use client";
import { useState, useEffect, ReactNode } from "react";
import { Mail, MessageCircle, Trash2, Linkedin, Instagram } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

type ProviderIds = "GOOGLE" | "OUTLOOK" | "LINKEDIN" | "INSTAGRAM";
type ProviderState = {
  type: "mail" | "social";
  provider: ProviderIds;
  connected: boolean;
  id: string;
  name: string;
};
const PROVIDERS: ProviderState[] = [
  { type: "mail", provider: "GOOGLE", connected: false, id: "", name: "" },
  { type: "mail", provider: "OUTLOOK", connected: false, id: "", name: "" },
  { type: "social", provider: "LINKEDIN", connected: false, id: "", name: "" },
  { type: "social", provider: "INSTAGRAM", connected: false, id: "", name: "" },
];

const SUBSCRIBE_PLAN = 1;

const PROVIDER_LABELS = {
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

const STORAGE_KEY = "connectedAccounts";

const UnipileConnections = () => {
  const router = useRouter();
  const qParams = useSearchParams();
  const provider = qParams.get("provider") as ProviderIds | null;
  const accountId = qParams.get("account_id");
  const success = qParams.get("success") === "true";

  const [accounts, setAccounts] = useState<ProviderState[]>(PROVIDERS);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const subscribed = accounts.filter((acc) => acc.connected).length;

  useEffect(() => {
    if (localStorage) {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setAccounts(parsed);
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(PROVIDERS));
        setAccounts(PROVIDERS);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;

    if (!success || !provider || !accountId) return;

    async function getAccountName(cancelled: boolean) {
      if (cancelled) return;
      try {
        const res = await fetch(`/api/unipile/accounts/${accountId}`);
        if (!res.ok) return;

        const { name } = await res.json();

        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;

        const providers: ProviderState[] = JSON.parse(raw);

        const updated = providers.map((p) =>
          p.provider === provider
            ? { ...p, connected: true, id: accountId!, name }
            : p
        );

        setAccounts(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

        router.replace("/", { scroll: false });
      } catch (e) {
        console.error("Sync account failed:", e);
      }
    }
    getAccountName(cancelled);
    return () => {
      cancelled = true;
    };
  }, [accountId, provider, success]);

  async function connectNewAccount(provider: string) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CLIENT_API_BASE_URL}/api/unipile/connect?provider=${provider}`,
        { method: "POST" }
      );
      console.log(response);
      if (!response.ok) {
        throw new Error(`Something went wrong fetching `);
      }
      router.push(response.url);
    } catch (error) {
      console.error("Bad credentials:", error);
    }
  }

  async function deleteAccount(id: string, provider: ProviderIds) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CLIENT_API_BASE_URL}/api/unipile/accounts/${id}`,
        { method: "DELETE" }
      );
      console.log(response);
      if (!response.ok) {
        throw new Error(`Something went wrong fetching `);
      }

      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const providers: ProviderState[] = JSON.parse(raw);
      const updated = providers.map((p) =>
        p.provider === provider
          ? { ...p, connected: false, id: "", name: "" }
          : p
      );
      setAccounts(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      router.push(process.env.NEXT_PUBLIC_CLIENT_API_BASE_URL!);
    } catch (error) {
      console.error("Bad credentials:", error);
    }
  }

  async function getAccountsList() {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CLIENT_API_BASE_URL}/api/unipile/accounts`
      );

      const data = await response.json();

      if (response.ok) {
        console.log("✅ Успех!");
        console.log(data);
      } else {
        console.log("❌ Ошибка от сервера Unipile:");
        console.log(data);
      }
    } catch (error) {
      console.error("💥 Ошибка сети или выполнения:", error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Connections</h1>
        <p className="text-gray-600 mb-8">
          Manage and sync outreach and campaign tracking across accounts
        </p>
        {/* <UpgradePlanButton title="get accounts" onClick={getAccountsList} />
        <UpgradePlanButton
          title="delete unused accounts"
          onClick={() => deleteAccount("QO-WyMcDSmewDZfIQ7NJIQ", "LINKEDIN")}
        /> */}
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Outreach</h2>

        {/* Email Section */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-200">
          <div className="flex items-start gap-4 mb-6">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Mail className="text-purple-600" size={28} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                Email
              </h3>
              <p className="text-gray-600">
                Connect your email address to send messages and manage replies
              </p>
            </div>
          </div>

          {/* Connected Email Accounts */}
          <div className="flex justify-start items-center gap-3 mb-4 space-y-3">
            {accounts
              .filter((acc) => acc.type === "mail")
              .map((acc, i) =>
                acc.connected ? (
                  <ConnectedAccount
                    key={acc.provider + i}
                    account={acc}
                    deleteAccount={deleteAccount}
                    isLoading={isLoading}
                  />
                ) : (
                  <ConnectionButton
                    key={acc.provider + i}
                    provider={acc.provider}
                    label={PROVIDER_LABELS[acc.provider].label}
                    icon={PROVIDER_LABELS[acc.provider].icon}
                    isLoading={isLoading}
                    connectNewAccount={connectNewAccount}
                  />
                )
              )}
          </div>
        </div>

        {/* Social Media Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-start gap-4 mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <MessageCircle className="text-purple-600" size={28} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                Social Media Inbox
              </h3>
              <p className="text-gray-600 mb-2">
                Connect your social media accounts to send direct messages and
                manage replies
              </p>
              <p className="text-gray-500 text-sm">
                Your plan allows {SUBSCRIBE_PLAN} accounts. {subscribed}/
                {SUBSCRIBE_PLAN} accounts connected
              </p>
            </div>
          </div>

          {/* Connected Social Accounts */}
          <div className="flex justify-start items-center gap-3 mb-4 space-y-3">
            {subscribed >= SUBSCRIBE_PLAN ? (
              <>
                {accounts
                  .filter((acc) => acc.type === "social" && acc.connected)
                  .map((acc, i) => (
                    <ConnectedAccount
                      key={acc.provider + i}
                      account={acc}
                      deleteAccount={deleteAccount}
                      isLoading={isLoading}
                    />
                  ))}
                <UpgradePlanButton />
              </>
            ) : (
              accounts
                .filter((acc) => acc.type === "social")
                .map((acc, i) =>
                  acc.connected ? (
                    <ConnectedAccount
                      key={acc.provider + i}
                      account={acc}
                      deleteAccount={deleteAccount}
                      isLoading={isLoading}
                    />
                  ) : (
                    <ConnectionButton
                      key={acc.provider + i}
                      provider={acc.provider}
                      label={PROVIDER_LABELS[acc.provider].label}
                      icon={PROVIDER_LABELS[acc.provider].icon}
                      isLoading={isLoading}
                      connectNewAccount={connectNewAccount}
                    />
                  )
                )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnipileConnections;

type ConnectionButtonType = {
  provider: string;
  label: string;
  icon: ReactNode;
  isLoading: boolean;
  connectNewAccount: (provider: string) => Promise<void>;
};
const ConnectionButton = ({
  provider,
  label,
  icon,
  isLoading,
  connectNewAccount,
}: ConnectionButtonType) => {
  return isLoading ? (
    <LoadingSkeleton />
  ) : (
    <button
      onClick={() => connectNewAccount(provider)}
      className="cursor-pointer px-2 py-1 m-0 rounded-lg font-medium transition-all flex items-center gap-2 bg-white text-gray-700 border border-gray-300 hover:bg-gray-200 disabled:opacity-50"
    >
      {icon}
      Connect <span className="font-bold">{label}</span> Account
    </button>
  );
};

type UpgradePlanButtonType = {
  title?: string;
  onClick?: () => void;
};
const UpgradePlanButton = ({
  title = "Other platforms available on Pro Plan",
  onClick,
}: UpgradePlanButtonType) => {
  return (
    <button
      onClick={onClick ? onClick : () => {}}
      className="px-2 py-1 rounded-lg font-medium bg-purple-600 text-white cursor-pointer opacity-90"
    >
      {title}
    </button>
  );
};

type ConnectedAccountType = {
  account: ProviderState;
  isLoading: boolean;
  deleteAccount: (id: string, type: ProviderIds) => void;
};
const ConnectedAccount = ({
  account,
  isLoading,
  deleteAccount,
}: ConnectedAccountType) => {
  return isLoading ? (
    <LoadingSkeleton />
  ) : (
    <div className="px-2 py-1 m-0 rounded-lg font-medium transition-all flex items-center gap-2 bg-white text-gray-700 border border-gray-300 disabled:opacity-50">
      <div className="cursor-default flex items-center gap-3">
        <div className="flex items-center justify-center bg-gray-50 rounded">
          {PROVIDER_LABELS[account.provider].icon}
        </div>
        <span className="text-gray-900 font-medium">{account.name}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="cursor-default bg-green-50 text-green-700 rounded-full text-sm font-medium">
          Connected
        </span>
        <button
          onClick={() => deleteAccount(account.id, account.provider)}
          className="cursor-pointer flex items-center p-1 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Delete account"
        >
          <Trash2 size={18} className="text-red-500" />
        </button>
      </div>
    </div>
  );
};

const LoadingSkeleton = () => {
  return (
    <div className="m-0 flex flex-col items-center justify-center">
      <div className="w-40 h-6 bg-gray-500 rounded animate-pulse"></div>
    </div>
  );
};
