"use client";

import clsx from "clsx";

interface ButtonProps {
  type?: "button" | "submit" | "reset" | undefined;
  fullWidth?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
  secondary?: boolean;
  danger?: boolean;
  disabled?: boolean;
}

/** Button Component
 *
 * Props:
 * - children: Button content
 * - onClick: Function to run when button is clicked
 * - type: Button type (defaults to "button")
 * - fullWidth: Whether the button should be full width (defaults to false)
 * - secondary: Whether the button should be a secondary button (defaults to false)
 * - danger: Whether the button should be a danger button (defaults to false)
 * - disabled: Whether the button should be disabled (defaults to false)
 *
 * AuthForm -> Button
 */

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  fullWidth = false,
  secondary = false,
  danger = false,
  disabled = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        `
        flex
        justify-center
        rounded-md
        px-3
        py-2
        text-sm
        font-semibold
        focus-visible:outline
        focus-visible:outline-2
        focus-visible:outline-offset-2
        `,
        disabled && "opacity-50 cursor-default",
        fullWidth && "w-full",
        secondary ? "text-gray-900" : "text-white",
        danger && "bg-rose-500 hover:bg-rose-600 focus-visible:ring-rose-600",
        !secondary &&
          !danger &&
          "bg-sky-500 hover:bg-sky-600 focus-visible:outline-sky-600"
      )}
    >
      {children}
    </button>
  );
};

export default Button;
