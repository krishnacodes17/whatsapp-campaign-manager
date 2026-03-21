import { useEffect, useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

const UploadMembers = () => {
  const [file, setFile] = useState(null);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const res = await API.get("/groups");
      setGroups(res.data.groups);
    } catch {
      toast.error("Failed to load groups");
    }
  };

  const handleUpload = async () => {
    if (!file || !selectedGroup) {
      return toast.error("Please select file and group");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("groupId", selectedGroup);

    const loading = toast.loading("Uploading members...");

    try {
      await API.post("/members/upload", formData);

      toast.dismiss(loading);
      toast.success("Members uploaded successfully 🎉");

      setFile(null);
      setSelectedGroup("");

    } catch (error) {
      toast.dismiss(loading);
      toast.error("Upload failed");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <div className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow">

        <h2 className="text-xl font-bold mb-4">Upload Members (CSV)</h2>

        {/* File Input */}
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-4 w-full "
        />

        {/* Group Dropdown */}
        <select
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        >
          <option value="">Select Group</option>
          {groups.map((g) => (
            <option key={g._id} value={g._id}>
              {g.name}
            </option>
          ))}
        </select>

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
        >
          Upload CSV
        </button>

      </div>
    </div>
  );
};

export default UploadMembers;