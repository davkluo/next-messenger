import { IconType } from "react-icons";

interface AuthSocialButtonProps {
  icon: IconType;
  onClick: () => void;
}

/** Auth Social Button Component
 *
 * Props:
 * - icon: Icon component from react-icons
 * - onClick: Function to run when button is clicked
 *
 * AuthForm -> AuthSocialButton
 */

const AuthSocialButton: React.FC<AuthSocialButtonProps> = ({
  icon: Icon,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        inline-flex
        w-full
        justify-center
        rounded-md
        bg-white
        px-4
        py-2
        text-gray-500
        shadow-sm
        ring-1
        ring-inset
        ring-gray-300
        hover:bg-gray-50
        focus:outline-offset-0
      "
    >
      <Icon />
    </button>
  );
};

export default AuthSocialButton;
