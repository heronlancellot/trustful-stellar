import cc from "classcat";
import { PacmanLoader } from "react-spinners";
import tailwindConfig from "tailwind.config";

type ActivityIndicatorModalProps = {
  isOpen: boolean;
};

const ActivityIndicatorModal = ({ isOpen }: ActivityIndicatorModalProps) => {
  return (
    <div
      className={cc([
        "fixed inset-0 bg-opacity-50 flex backdrop-blur-sm justify-center items-center transition-all duration-300",
        isOpen ? "z-50 opacity-100" : "hidden",
      ])}
    >
      <PacmanLoader
        size={36}
        color={tailwindConfig.theme.extend.colors.brandGreen}
      />
    </div>
  );
};

export default ActivityIndicatorModal;
