import { IconPosition } from "@/types/iconPosition";
import cc from "classcat";
import { ClipLoader, PacmanLoader, PulseLoader } from "react-spinners";

interface PrimaryButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  label: string;
  onClick?: () => void;
  iconPosition?: IconPosition;
  isLoading?: boolean;
}

export const PrimaryButton = ({
  icon,
  label,
  onClick,
  className,
  iconPosition = IconPosition.LEFT,
  isLoading,
  disabled,
  ...props
}: PrimaryButtonProps) => {
  return (
    <button
      {...props}
      onClick={onClick}
      className={cc([
        "flex w-full space-x-3 items-center justify-center gap-2 px-4 py-2 text-base font-medium text-brandBlack hover:bg-primary transition",
        { "flex-row-reverse": iconPosition === IconPosition.RIGHT },
        { "bg-whiteOpacity05": disabled },
        { "bg-brandGreen": !disabled },
        className,
      ])}
      disabled={disabled}
    >
      {!isLoading ? (
        icon && <div className="w-5 h-5">{icon}</div>
      ) : (
        <PulseLoader size={8}></PulseLoader>
      )}
      {label}
    </button>
  );
};
