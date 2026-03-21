import API from "../services/api";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatsCard from "../components/StatsCard";

const Dashboard = () => {

  return (
    <div className="flex h-screen bg-gray-100">
      
      <Sidebar />

      <div className="flex-1 flex flex-col">
        
        <Topbar />

        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Overview</h2>

          <div className="grid grid-cols-3 gap-4">
            <StatsCard title="Total Members" value="120" />
            <StatsCard title="Invited" value="80" />
            <StatsCard title="Joined" value="50" />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;