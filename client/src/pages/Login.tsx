import { Link, useNavigate } from "react-router-dom";
import { FieldValues, useForm } from "react-hook-form";
import useAuth from "../hooks/useAuth";
import apiClient from "../services/apiClient";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

const schema = z.object({
  email: z
    .string({ invalid_type_error: "Field required" })
    .min(2, { message: "Emails should be 2 or more characters" })
    .max(60, { message: "Emails must be less than 60 characters" }),
  password: z
    .string({ invalid_type_error: "Field required" })
    .min(2, { message: "" })
    .max(60, { message: "Passwords must be less than 60 characters" }),
});

type FormData = z.infer<typeof schema>;

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const [submitError, setSubmitError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const loginUser = (fields: FieldValues) => {
    setLoading(true);

    apiClient
      .post("/auth/login", fields)
      .then(({ data }) => {
        const { firstName, lastName, email, token } = data;

        setAuth({ firstName, lastName, email, token });
        setSubmitError(undefined);
        setLoading(false);
        navigate("/find");
      })
      .catch((err) => {
        setLoading(false);

        // Handle the error here
        if (err.response) {
          switch (err.response.status) {
            case 401:
              setSubmitError("Incorrect username or password!");
              break;
            case 406:
              setSubmitError("Please enter all fields correctly!");
              break;
            default:
              setSubmitError("Login failed!");
              break;
          }
        }
      });
  };

  return (
    <div className="px-14 py-8 text-gray-600">
      <span className="block text-xl font-bold mb-8">
        Log in to your account
      </span>

      <form className="font-semibold" onSubmit={handleSubmit(loginUser)}>
        <div className="my-8">
          <label htmlFor="email">Email</label>
          <input
            className="w-full h-8 py-5 px-2 border-[1px] rounded-md"
            id="email"
            type="email"
            {...register("email")}
          />
          {errors.email && <p className="text-sm">{errors.email.message}</p>}
        </div>

        <div className="my-8">
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
            Log in
          </button>

          <Link
            className="my-5 self-center text-sky-400 hover:underline"
            to="/auth/register"
          >
            Create an account
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
