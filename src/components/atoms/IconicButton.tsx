import { IconPosition } from "@/types/iconPosition";
import cc from "classcat";
import { ClipLoader, PacmanLoader, PulseLoader } from "react-spinners";

interface IconicButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  label: string;
  onClick: () => void;
  iconPosition?: IconPosition;
  isLoading?: boolean;
}

export const IconicButton = ({
  icon,
  label,
  onClick,
  className,
  iconPosition = IconPosition.LEFT,
  isLoading,
  disabled,
  ...props
}: IconicButtonProps) => {
  return (
    <button
      {...props}
      onClick={onClick}
      className={cc([
        "hover:bg-primary flex w-full items-center justify-center gap-2 space-x-3 rounded-md px-4 py-2 text-base font-medium text-brandBlack transition",
        { "flex-row-reverse": iconPosition === IconPosition.RIGHT },
        { "bg-whiteOpacity05": disabled },
        { "bg-brandGreen": !disabled },
        className,
      ])}
      disabled={disabled}
    >
      {!isLoading ? (
        icon && <div className="h-5 w-5">{icon}</div>
      ) : (
        <PulseLoader size={8}></PulseLoader>
      )}
      {label}
    </button>
  );
};
