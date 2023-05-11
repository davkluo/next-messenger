"use client";

import Input from "@/app/components/inputs/Input";
import { useCallback, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

type Variant = "LOGIN" | "REGISTER";

/** Auth Form Component
 *
 * State:
 * - variant: Determines whether the form is for login or register
 * - isLoading: Used for loading state animations
 *
 * Props:
 *
 * Home -> AuthForm
 */

function AuthForm() {
  const [variant, setVariant] = useState<Variant>("LOGIN");
  const [isLoading, setIsLoading] = useState(false);

  /** Toggle variant state between "LOGIN" and "REGISTER" */
  const toggleVariant = useCallback(() => {
    setVariant((prevVariant) =>
      prevVariant === "LOGIN" ? "REGISTER" : "LOGIN"
    );
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    if (variant === "LOGIN") {
      console.log("Logging in with data:", data);
    }

    if (variant === "REGISTER") {
      console.log("Registering with data:", data);
    }
  };

  return (
    <div
      className="
        mt-8
        sm:mx-auto
        sm:w-full
        sm:max-w-md
      "
    >
      <div
        className="
          bg-white
          px-4
          py-8
          shadow
          sm:rounded-lg
          sm:px-10
        "
      >
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <Input label="First Name" />
        </form>
      </div>
    </div>
  );
}

export default AuthForm;
