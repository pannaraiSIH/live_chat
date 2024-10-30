import React from "react";

const ProfileImageItem = ({ image, alt, className }) => {
  return (
    <div className={`border rounded-full ${className}`}>
      <img src={image} alt={alt} className="hover:scale-105" />
    </div>
  );
};

export default ProfileImageItem;
