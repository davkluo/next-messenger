"use client";

import clsx from "clsx";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

interface InputProps {
  id: string;
  label: string;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  type?: string;
  required?: boolean;
  disabled?: boolean;
}

/** Form Input Component
 *
 * State:
 * - None
 *
 * Props:
 * - id: HTML id attribute
 * - label: Input label
 * - register: react-hook-form register function
 * - errors: react-hook-form errors object
 * - type: Input type (defaults to "text")
 * - required: Whether the input is required (defaults to false)
 * - disabled: Whether the input is disabled (defaults to false)
 *
 * AuthForm -> Input
 */

const Input: React.FC<InputProps> = ({
  id,
  label,
  register,
  errors,
  type,
  required,
  disabled,
}) => {
  return (
    <div>
      <label
        className="
          block
          text-sm
          font-medium
          leading-6
          text-gray-900
        "
        htmlFor={id}
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        disabled={disabled}
        autoComplete={id}
        {...register(id, { required })}
        className={clsx(
          `
          mt-2
          form-input
          block
          w-full
          rounded-md
          border-0
          py-1.5
          text-gray-900
          shadow-sm
          ring-1
          ring-inset
          ring-gray-300
          placeholder:text-gray-400
          focus:ring-2
          focus:ring-offset
          focus:ring-sky-600
          sm:text-sm
          sm:leading-6
          `,
          errors[id] && "focus:ring-rose-500",
          disabled && "opacity-50 cursor-default"
        )}
      />
    </div>
  );
};

Input.defaultProps = {
  type: "text",
  required: false,
  disabled: false,
};

export default Input;
