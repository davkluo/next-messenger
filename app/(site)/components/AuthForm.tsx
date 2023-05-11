"use client";

import axios from "axios";
import { useCallback, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { BsGithub, BsGoogle } from "react-icons/bs";
import { toast } from "react-hot-toast";
import { signIn } from "next-auth/react";

import Button from "@/app/components/Button";
import Input from "@/app/components/inputs/Input";
import AuthSocialButton from "./AuthSocialButton";

type Variant = "LOGIN" | "REGISTER";

/** Auth Form Component
 *
 * State:
 * - variant: Determines whether the form is for login or register
 * - isLoading: Used for loading state animations
 *
 * Props:
 *
 * Home -> AuthForm -> { AuthSocialButton, Input, Button }
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

  /** Login or register user upon form submission, depending on variant */
  const submitAuthForm: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    if (variant === "LOGIN") {
      signIn("credentials", {
        ...data,
        redirect: false,
      })
        .then((callback) => {
          if (callback?.error) {
            toast.error("Invalid credentials. Please try again.");
          }

          if (callback?.ok && !callback?.error) {
            toast.success("Successfully logged in!");
          }
        })
        .finally(() => setIsLoading(false));
    }

    if (variant === "REGISTER") {
      axios
        .post("/api/register", data)
        .then(() => toast.success("Welcome aboard! Your account is now ready."))
        .catch(() => toast.error("Something went wrong. Please try again."))
        .finally(() => setIsLoading(false));

      // TODO: See if we can use this alternative with loading state
      // toast.promise(registerPromise, {
      //   loading: "Creating account...",
      //   success: "Success! Welcome aboard!",
      //   error: "Something went wrong. Please try again.",
      // });
    }
  };

  /** Login or register user using social */
  const authViaSocial = (social: string) => {
    setIsLoading(true);

    signIn(social, { redirect: false })
      .then((callback) => {
        if (callback?.error) {
          toast.error("Unable to authenticate. Please try again.");
        }

        if (callback?.ok && !callback?.error) {
          toast.success("Successfully logged in!");
        }
      })
      .finally(() => setIsLoading(false));
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
        <form className="space-y-6" onSubmit={handleSubmit(submitAuthForm)}>
          {variant === "REGISTER" && (
            <>
              <Input
                id="firstName"
                label="First Name"
                register={register}
                errors={errors}
                disabled={isLoading}
              />
              <Input
                id="lastName"
                label="Last Name"
                register={register}
                errors={errors}
                disabled={isLoading}
              />
            </>
          )}
          <Input
            id="email"
            label="Email Address"
            register={register}
            errors={errors}
            type="email"
            disabled={isLoading}
          />
          <Input
            id="password"
            label="Password"
            register={register}
            errors={errors}
            type="password"
            disabled={isLoading}
          />
          <div>
            <Button type="submit" disabled={isLoading} fullWidth>
              {variant === "LOGIN" ? "Log in" : "Register"}
            </Button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div
              className="
              absolute
              inset-0
              flex
              items-center
            "
            >
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <AuthSocialButton
              icon={BsGithub}
              onClick={() => authViaSocial("github")}
            />
            <AuthSocialButton
              icon={BsGoogle}
              onClick={() => authViaSocial("google")}
            />
          </div>

          <div
            className="
            flex
            gap-2
            justify-center
            text-sm
            mt-6
            px-2
            text-gray-500
          "
          >
            <div>
              {variant === "LOGIN"
                ? "Don't have an account?"
                : "Already have an account?"}
            </div>
            <div onClick={toggleVariant} className="underline cursor-pointer">
              {variant === "LOGIN" ? "Create one today!" : "Log in here!"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthForm;
