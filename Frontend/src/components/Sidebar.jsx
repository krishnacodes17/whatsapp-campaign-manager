import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 bg-white shadow-md p-5">
      <h2 className="text-xl font-bold mb-6">Dashboard</h2>

      <ul className="space-y-4">
        <li>
          <NavLink to="/dashboard" className={({isActive})=> isActive ? "text-blue-500 font-bold" : "hover:text-blue-500"}>
            Home
          </NavLink>
        </li>

        <li>
          <NavLink to="/groups" className={({isActive})=> isActive ? "text-blue-500 font-bold" : "hover:text-blue-500"}>
            Groups
          </NavLink>
        </li>

        <li>
          <NavLink to="/members" className={({isActive})=> isActive ? "text-blue-500 font-bold" : "hover:text-blue-500"}>
            Members
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
