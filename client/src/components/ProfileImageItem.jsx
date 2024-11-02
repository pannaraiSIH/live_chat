import React from "react";

const ProfileImageItem = ({ image, alt, className, status = null }) => {
  return (
    <div className={`border rounded-full ${className} relative`}>
      <img src={image} alt={alt} className="hover:scale-105" />
      {status !== null && (
        <div
          className={`${
            status ? "bg-green-600" : "bg-gray-300"
          } size-3 rounded-full absolute bottom-0 right-0`}
        />
      )}
    </div>
  );
};

export default ProfileImageItem;
