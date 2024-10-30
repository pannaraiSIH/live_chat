import React from "react";

const SideBarContainer = ({ title, children }) => {
  return (
    <div className="mx-4 py-2">
      {/* <p className="mx-2 py-2 font-bold">{title}</p> */}
      {/* <div className="w-full h-0.5 bg-dark-blue" /> */}
      <ul className="flex flex-col gap-1">{children}</ul>
    </div>
  );
};

export default SideBarContainer;
