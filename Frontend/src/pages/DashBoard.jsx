import API from "../services/api";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatsCard from "../components/StatsCard";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    invited: 0,
    joined: 0,
  });

  const handleSendInvites = async () => {
    const loading = toast.loading("Sending invites...");

    try {
      await API.post("/invites/start");

      toast.dismiss(loading);
      toast.success("Invites sent successfully ");
      
    } catch (error) {
      toast.dismiss(loading);
      toast.error("Failed to send invites");
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get("/members/stats");
      setStats(res.data.stats);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Topbar />

        <div className="p-6">
          {/* Header + Button */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Overview</h2>

            <button
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              onClick={handleSendInvites}
            >
              Send Invites{" "}
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <StatsCard title="Total Members" value={stats.total} />
            <StatsCard title="Invited" value={stats.invited} />
            <StatsCard title="Joined" value={stats.joined} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
