import React from "react";

const SideBarContainer = ({ children }) => {
  return (
    <div className="mx-4 py-2">
      <ul className="flex flex-col gap-1">{children}</ul>
    </div>
  );
};

export default SideBarContainer;
