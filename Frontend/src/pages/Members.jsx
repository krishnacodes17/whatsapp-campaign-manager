import { useEffect, useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

const Members = () => {
  const [members, setMembers] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const id = toast.loading("Loading members...");

    try {
      const res = await API.get("/members");
      setMembers(res.data.members);

      toast.dismiss(id);
    } catch {
      toast.dismiss(id);
      toast.error("Failed to load members");
    }
  };

  const filteredMembers =
    filter === "all"
      ? members
      : members.filter((m) => m.status === filter);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <h2 className="text-2xl font-bold mb-4">Members</h2>

      {/* Filters */}
      <div className="mb-4 flex gap-2">
        {["all", "pending", "invited", "joined", "opted_out"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1 rounded ${
              filter === status
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Group</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredMembers.map((m) => (
              <tr key={m._id} className="border-t">
                <td className="p-4">{m.name}</td>
                <td className="p-4">{m.phone}</td>
                <td className="p-4">{m.group?.name}</td>
                <td className="p-4 capitalize">{m.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Members;