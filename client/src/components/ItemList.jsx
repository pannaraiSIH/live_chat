import PropTypes from "prop-types";
import React from "react";

const ItemList = ({ text, icon, unread, className, onClick }) => {
  return (
    <li
      className={`cursor-pointer rounded-md p-2 ${className} flex gap-2 items-center`}
      onClick={onClick}
    >
      <div>{icon}</div>
      <p className="text-nowrap">{text}</p>
      {unread && (
        <p className="bg-red-400 px-2 rounded-full text-white text-sm ml-auto">
          new
        </p>
      )}
    </li>
  );
};

ItemList.propTypes = {
  text: PropTypes.string,
  icon: PropTypes.element,
  unread: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default ItemList;
