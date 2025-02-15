import React from "react";

const Home = () => {
  return (
    <>
      <div>Home</div>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => window.location.href = "/login"}>Login</button>
    </>
  );
};

export default Home;
