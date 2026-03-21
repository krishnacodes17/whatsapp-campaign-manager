import { useEffect, useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import GobackButton from "../components/GobackButton";

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    const id = toast.loading("Loading groups...");

    try {
      const res = await API.get("/groups");
      setGroups(res.data.groups);

      toast.dismiss(id);
    } catch (error) {
      toast.dismiss(id);
      toast.error("Failed to load groups");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    const loading = toast.loading("Deleting group...");

    try {
      await API.delete(`/groups/${id}`);

      toast.dismiss(loading);
      toast.success("Group deleted");

      setGroups((prev) => prev.filter((group) => group._id !== id));
    } catch (error) {
      toast.dismiss(loading);
      toast.error("Delete failed");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Groups</h2>

        <Link to="/create-group">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow">
            + Create Group
          </button>
        </Link>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-sm uppercase">
              <th className="p-4">Name</th>
              <th className="p-4">Description</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {groups.length > 0 ? (
              groups.map((group) => (
                <tr
                  key={group._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-4 font-medium">{group.name}</td>
                  <td className="p-4 text-gray-600">
                    {group.description || "-"}
                  </td>

                  <td className="p-4 flex justify-center gap-2">

                    <button
                      onClick={() => navigate(`/edit-group/${group._id}`)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-md"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(group._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                    >
                      Delete
                    </button>

                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center p-6 text-gray-500">
                  No groups found 😢
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Go Back */}
      <div className="mt-6 flex justify-center">
        <GobackButton />
      </div>
    </div>
  );
};

export default Groups;