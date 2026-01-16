"use client";
import ConnectedAccount from "./ConnectedAccount";
import ConnectionButton from "./ConnectionButton";
import { PROVIDER_LABELS, ProviderIds, ProviderState } from "@/constants";
import { Mail } from "lucide-react";

type Props = {
  accounts: ProviderState[];
  isLoading: boolean;
  deleteAccount: (id: string, type: ProviderIds) => void;
  connectAccount: (provider: string) => Promise<void>;
};

const EmailSection = ({
  accounts,
  isLoading,
  deleteAccount,
  connectAccount,
}: Props) => {
  return (
    <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-200">
      <div className="flex items-start gap-4 mb-6">
        <div className="bg-purple-100 p-3 rounded-lg">
          <Mail className="text-purple-600" size={28} />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-1">Email</h3>
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
                connectAccount={connectAccount}
              />
            )
          )}
      </div>
    </div>
  );
};

export default EmailSection;
