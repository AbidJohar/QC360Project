import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  
  return (
    <div className="flex flex-col gap-8 items-center justify-center min-h-screen ">
      <h2 className="font-bold text-2xl">welcome to the dashboard</h2>
      <Link
        to={"/"}
        className="px-6 py-2 rounded-full bg-amber-400 hover:bg-amber-500 text-white font-bold"
      >
        Back to Home page
      </Link>
    </div>
  );
};

export default Dashboard;
