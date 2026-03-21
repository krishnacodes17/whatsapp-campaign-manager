const Sidebar = () => {
  return (
    <div className="w-64 bg-white shadow-md p-5">
      <h2 className="text-xl font-bold mb-6">Dashboard</h2>

      <ul className="space-y-4">
        <li className="cursor-pointer hover:text-blue-500">Home</li>
        <li className="cursor-pointer hover:text-blue-500">Groups</li>
        <li className="cursor-pointer hover:text-blue-500">Members</li>
      </ul>
    </div>
  );
};

export default Sidebar;