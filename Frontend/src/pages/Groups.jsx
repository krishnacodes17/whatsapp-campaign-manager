import { useEffect, useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

const Groups = () => {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    const id = toast.loading("Loading groups...");

    try {
      const res = await API.get("/groups");

      setGroups(res.data.groups);

      toast.dismiss(id);
      toast.success("Groups loaded ✅");

    } catch (error) {
      toast.dismiss(id);
      toast.error("Failed to load groups");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Groups</h2>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Name</th>
            <th className="p-2">Description</th>
          </tr>
        </thead>

        <tbody> 
          {groups.map((group, index) => (
            <tr key={index} className="border-t">
              <td className="p-2">{group.name}</td>
              <td className="p-2">{group.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Groups;