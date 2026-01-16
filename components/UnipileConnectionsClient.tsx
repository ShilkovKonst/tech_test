"use client";
import { useEffect, useState } from "react";
import EmailSection from "./EmailSection";
import SocialSection from "./SocialSection";
import {
  ProviderIds,
  PROVIDERS,
  ProviderState,
  STORAGE_KEY,
} from "@/constants";
import { connectNewAccount, deleteAccountById, getAccountName } from "@/lib";
import { useRouter, useSearchParams } from "next/navigation";

const UnipileConnectionsClient = () => {
  const router = useRouter();
  const qParams = useSearchParams();
  const provider = qParams.get("provider") as ProviderIds | null;
  const accountId = qParams.get("account_id");
  const success = qParams.get("success") === "true";

  const [accounts, setAccounts] = useState<ProviderState[]>(PROVIDERS);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(PROVIDERS));
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAccounts(JSON.parse(stored));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (!success || !provider || !accountId) return;

    async function getName(cancelled: boolean) {
      if (cancelled) return;
      try {
        const name = await getAccountName(accountId!);

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

    getName(cancelled);

    return () => {
      cancelled = true;
    };
  }, [accountId, provider, router, success]);

  async function connectAccount(provider: string) {
    try {
      const url = await connectNewAccount(provider);
      router.push(url!);
    } catch (error) {
      console.error("Bad credentials:", error);
    }
  }

  async function deleteAccount(id: string, provider: ProviderIds) {
    try {
      const isDeleted = await deleteAccountById(id);
      if (!isDeleted) return;

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
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Connections</h1>
        <p className="text-gray-600 mb-8">
          Manage and sync outreach and campaign tracking across accounts
        </p>
        {/* <UpgradePlanButton title="Get accounts" onClick={getAccountsList} />
        <UpgradePlanButton
          title="Delete unused account manually"
          onClick={() => deleteAccount("QO-WyMcDSmewDZfIQ7NJIQ", "LINKEDIN")}
        /> */}
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Outreach</h2>
        <EmailSection
          accounts={accounts}
          isLoading={isLoading}
          connectAccount={connectAccount}
          deleteAccount={deleteAccount}
        />
        <SocialSection
          accounts={accounts}
          isLoading={isLoading}
          connectAccount={connectAccount}
          deleteAccount={deleteAccount}
        />
      </div>
    </div>
  );
};

export default UnipileConnectionsClient;
