import { useNavigate } from "react-router-dom";
import API from "../services/api";

const Topbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await API.post("/auth/logout");
    navigate("/");
  };

  return (
    <div className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-lg font-semibold">Welcome 👋</h1>

      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default Topbar;