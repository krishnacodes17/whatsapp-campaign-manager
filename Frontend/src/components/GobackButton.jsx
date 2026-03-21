import React from "react";
import { useNavigate } from "react-router-dom";

function GobackButton() {
  const navigate = useNavigate();
  return (
    <div className="flex justify-center mt-6">
      <button
        onClick={() => navigate(-1)}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Go Back
      </button>
    </div>
  );
}

export default GobackButton;
