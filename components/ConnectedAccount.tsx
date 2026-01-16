"use client";
import { PROVIDER_LABELS, ProviderIds, ProviderState } from "@/constants";
import { Trash2 } from "lucide-react";
import LoadingSkeleton from "./LoadingSkeleton";

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

export default ConnectedAccount;
