"use client";
import UpgradePlanButton from "./UpgradePlanButton";
import ConnectedAccount from "./ConnectedAccount";
import ConnectionButton from "./ConnectionButton";
import {
  PROVIDER_LABELS,
  ProviderIds,
  ProviderState,
  SUBSCRIBE_PLAN,
} from "@/constants";
import { MessageCircle } from "lucide-react";

type Props = {
  accounts: ProviderState[];
  isLoading: boolean;
  deleteAccount: (id: string, type: ProviderIds) => void;
  connectAccount: (provider: string) => Promise<void>;
};

const SocialSection = ({
  accounts,
  isLoading,
  deleteAccount,
  connectAccount,
}: Props) => {
  const subscribed = accounts.filter((acc) => acc.connected).length;
  return (
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
                  connectAccount={connectAccount}
                />
              )
            )
        )}
      </div>
    </div>
  );
};

export default SocialSection;
