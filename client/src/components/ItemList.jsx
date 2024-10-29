import React from "react";

const ItemList = ({ text, icon, className }) => {
  return (
    <li
      className={`cursor-pointer rounded-md p-2 ${className} flex gap-2 items-center`}
    >
      <div>{icon}</div>
      <p>{text}</p>
    </li>
  );
};

export default ItemList;
