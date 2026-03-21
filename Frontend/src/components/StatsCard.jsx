const StatsCard = ({ title, value }) => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <p>{title}</p>
      <h3 className="text-2xl font-bold">{value}</h3>
    </div>
  );
};

export default StatsCard;