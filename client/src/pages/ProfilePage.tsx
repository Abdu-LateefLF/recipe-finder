import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { FieldValues, useForm } from "react-hook-form";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
});

type FormData = z.infer<typeof schema>;

function ProfilePage() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<string | undefined>();
  const [submitSuccess, setSubmitSuccess] = useState<boolean>();
  const [deleteError, setDeleteError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();

  const updateUserInfo = (fields: FieldValues) => {
    setLoading(true);

    axiosPrivate
      .post("/user", fields)
      .then(() => {
        setLoading(false);
        setSubmitError(undefined);
        setSubmitSuccess(true);
      })
      .catch(() => {
        setLoading(false);
        setSubmitSuccess(false);
        setSubmitError("Failed to update user profile!");
      });
  };

  const deleteUser = () => {
    axiosPrivate
      .delete("/user")
      .then(() => {
        setDeleteError(undefined);
        navigate("/");
      })
      .catch(() => setDeleteError("Failed to delete account. Try again."));
  };

  useEffect(() => {
    axiosPrivate
      .get("/user")
      .then(({ data }) => {
        setValue("firstName", data.firstName);
        setValue("lastName", data.lastName);
        setValue("email", data.email);
      })
      .catch((err) => console.log(err.response?.message));
  }, [axiosPrivate, setValue]);

  return (
    <>
      <NavBar>
        <button
          className="bg-gray-800 hover:bg-gray-900 px-3 py-1 mx-2 rounded-md font-medium text-white drop-shadow-md"
          onClick={() => navigate("/find")}
        >
          Back
        </button>
      </NavBar>

      <div className="w-[90%] max-w-[700px] mx-auto">
        <span className="block text-2xl text-gray-800 font-bold mt-12">
          Account Information
        </span>

        <form className="font-semibold" onSubmit={handleSubmit(updateUserInfo)}>
          <div className="flex gap-3 my-8 w-full">
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

          {submitError && (
            <p className="text-sm text-red-500 my-2">{submitError}</p>
          )}
          {submitSuccess === true && (
            <p className="text-sm text-green-500 my-2">Successful!</p>
          )}

          <button
            className={
              "bg-indigo-500 hover:bg-indigo-700 px-20 py-2 mb-16 rounded-md font-medium text-white drop-shadow-md " +
              (loading && "opacity-50")
            }
          >
            Update Information
          </button>
        </form>

        <span className="py-4 font-semibold text-lg">
          Delete Account (This is permanent)
        </span>
        <button
          className="bg-red-500 hover:bg-red-900 px-8 py-1 mx-2 rounded-md font-medium text-white drop-shadow-md"
          onClick={deleteUser}
        >
          Delete
        </button>
        {deleteError && (
          <p className="text-sm text-red-500 my-2">{deleteError}</p>
        )}
      </div>
    </>
  );
}

export default ProfilePage;
