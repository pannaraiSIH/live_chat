import React from "react";

const SideBarContainer = ({ title, children }) => {
  return (
    <div className="mx-4 py-2">
      <p className="mx-2 py-2">{title}</p>
      <ul className="flex flex-col gap-1">{children}</ul>
    </div>
  );
};

export default SideBarContainer;
