import React, { useState } from "react";

const PreviewImage = ({ file }) => {
  const [preview, setPreview] = useState(null);
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    setPreview(reader.result);
  };
  return (
    <div>
      <img
        src={preview}
        alt="ImagePreview"
        style={{ width: "20rem", height: "20rem" }}
      />
    </div>
  );
};

export default PreviewImage;
