import { Link, useNavigate } from "react-router-dom";
import { FieldValues, useForm } from "react-hook-form";
import apiClient from "../services/apiClient";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

const schema = z.object({
  firstName: z
    .string({ invalid_type_error: "Field required" })
    .min(2, { message: "Must be 2 or more characters" })
    .max(30, { message: "Must be less than 30 characters" }),
  lastName: z
    .string({ invalid_type_error: "Field required" })
    .min(2, { message: "Must be 2 or more characters" })
    .max(30, { message: "Must be less than 30 characters" }),
  email: z
    .string({ invalid_type_error: "Field required" })
    .min(2, { message: "Must be 2 or more characters" })
    .max(60, { message: "Must be less than 60 characters" }),
  password: z
    .string({ invalid_type_error: "Field required" })
    .min(2, { message: "Must be 2 or more characters" })
    .max(60, { message: "Must be less than 60 characters" }),
});

type FormData = z.infer<typeof schema>;

function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const [submitError, setSubmitError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const registerUser = (fields: FieldValues) => {
    setLoading(true);

    apiClient
      .post("/auth/register", fields)
      .then(() => {
        setSubmitError(undefined);
        setLoading(false);
        navigate("/auth/login");
      })
      .catch((err) => {
        setLoading(false);

        // Handle the error here
        if (err.response) {
          switch (err.response.status) {
            case 406:
              setSubmitError("Please enter all fields correctly!");
              break;
            case 409:
              setSubmitError("An account with this email already exists!");
              break;
            default:
              setSubmitError("Failed to create account!");
              break;
          }
        }
      });
  };

  return (
    <div className="px-14 py-8 text-gray-600">
      <span className="block text-xl font-bold mb-8">Create a new account</span>

      <form className="font-semibold" onSubmit={handleSubmit(registerUser)}>
        <div className="my-3 sm:my-8">
          <label htmlFor="email">Email</label>
          <input
            className="w-full h-8 py-5 px-2 border-[1px] rounded-md"
            id="email"
            type="email"
            {...register("email")}
          />
          {errors.email && <p className="text-sm">{errors.email.message}</p>}
        </div>
        <div className="flex flex-col sm:flex-row gap-5 sm:gap-3 sm:my-8">
          <div>
            <label htmlFor="firstName">First Name</label>
            <input
              className="w-full h-8 py-5 px-2 border-[1px] rounded-md"
              id="firstName"
              type="text"
              {...register("firstName")}
            />
            {errors.firstName && (
              <p className="text-sm">{errors.firstName.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="lastName">Last Name</label>
            <input
              className="w-full h-8 py-5 px-2 border-[1px] rounded-md"
              id="lastName"
              type="text"
              {...register("lastName")}
            />
            {errors.lastName && (
              <p className="text-sm">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div className="my-3 sm:my-8">
          <label htmlFor="password">Password</label>
          <input
            className="w-full h-8 py-5 px-2 border-[1px] rounded-md"
            id="password"
            type="password"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-sm">{errors.password.message}</p>
          )}
        </div>

        {submitError && (
          <p className="text-center text-sm text-red-500 my-5">{submitError}</p>
        )}

        <div className="flex flex-col ">
          <button
            className={
              "bg-indigo-500 hover:bg-indigo-700 py-1 rounded-md font-medium text-white drop-shadow-md " +
              (loading && "opacity-50")
            }
            disabled={loading}
          >
            Create Account
          </button>

          <Link
            className="my-5 self-center text-sky-400 hover:underline"
            to="/auth/login"
          >
            Log in
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Register;
