import React from "react";

const ItemList = ({ text, icon, className, onClick }) => {
  return (
    <li
      className={`cursor-pointer rounded-md p-2 ${className} flex gap-2 items-center`}
      onClick={onClick}
    >
      <div>{icon}</div>
      <p className="text-nowrap">{text}</p>
    </li>
  );
};

export default ItemList;
