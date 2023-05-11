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
      <input id={id} type={type} required={required} disabled={disabled} />
    </div>
  );
};

export default Input;
