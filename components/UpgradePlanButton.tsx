"use client";

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

export default UpgradePlanButton;
