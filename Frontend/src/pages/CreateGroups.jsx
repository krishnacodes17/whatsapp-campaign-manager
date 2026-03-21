import React from "react";
import { useForm } from "react-hook-form";
import API from "../services/api";
import toast from "react-hot-toast";
import GobackButton from "../components/GobackButton";
function CreateGroups() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const id = toast.loading("Creating group...");

    try {
      await API.post("/groups", data);

      toast.dismiss(id);
      toast.success("Group created successfully 🎉");

      reset();
    } catch (error) {
      toast.dismiss(id);
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Create Group</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Enter group name"
            className="border p-2 rounded w-full"
            {...register("name", {
              required: "group name is required",
            })}
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        <textarea
          placeholder="Description"
          className="border p-2 rounded w-full"
          {...register("description", {})}
        />

        <div >
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded transition"
          >
            Create Group
          </button>

          {<GobackButton />}
        </div>
      </form>
    </div>
  );
}

export default CreateGroups;
