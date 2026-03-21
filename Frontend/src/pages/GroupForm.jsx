import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

const GroupForm = () => {
  const { id } = useParams(); // edit mode me milega
  const navigate = useNavigate();

  const { register, handleSubmit, setValue } = useForm();

  const isEdit = Boolean(id);

  useEffect(() => {
    if (isEdit) {
      fetchGroup();
    }
  }, []);

  const fetchGroup = async () => {
    try {
      const res = await API.get("/groups");

      const group = res.data.groups.find(g => g._id === id);

      if (group) {
        setValue("name", group.name);
        setValue("description", group.description);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit = async (data) => {
    const loading = toast.loading(
      isEdit ? "Updating group..." : "Creating group..."
    );

    try {
      if (isEdit) {
        await API.put(`/groups/${id}`, data);
      } else {
        await API.post("/groups", data);
      }

      toast.dismiss(loading);
      toast.success(isEdit ? "Group updated" : "Group created");

      navigate("/groups");

    } catch (error) {
      toast.dismiss(loading);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">
        {isEdit ? "Edit Group" : "Create Group"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        <input
          type="text"
          placeholder="Group Name"
          className="border p-2 rounded w-full"
          {...register("name", { required: true })}
        />

        <textarea
          placeholder="Description"
          className="border p-2 rounded w-full"
          {...register("description")}
        />

        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          {isEdit ? "Update Group" : "Create Group"}
        </button>
      </form>
    </div>
  );
};

export default GroupForm;