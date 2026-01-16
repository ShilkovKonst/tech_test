"use client";
import { ReactNode } from "react";
import LoadingSkeleton from "./LoadingSkeleton";

type ConnectionButtonType = {
  provider: string;
  label: string;
  icon: ReactNode;
  isLoading: boolean;
  connectAccount: (provider: string) => Promise<void>;
};
const ConnectionButton = ({
  provider,
  label,
  icon,
  isLoading,
  connectAccount,
}: ConnectionButtonType) => {
  return isLoading ? (
    <LoadingSkeleton />
  ) : (
    <button
      onClick={() => connectAccount(provider)}
      className="cursor-pointer px-2 py-1 m-0 rounded-lg font-medium transition-all flex items-center gap-2 bg-white text-gray-700 border border-gray-300 hover:bg-gray-200 disabled:opacity-50"
    >
      {icon}
      Connect <span className="font-bold">{label}</span> Account
    </button>
  );
};

export default ConnectionButton;
