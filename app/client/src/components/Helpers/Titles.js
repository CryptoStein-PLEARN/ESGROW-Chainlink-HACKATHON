import React from "react";

function Text({ text, size, underline, customStyles }) {
  return (
    <h1 className="relative inline-block text-sm font-medium text-[#ffffff] group active:text-white-500 focus:outline-none focus:ring es-bold-font">
      {underline ? (
        <span className="absolute h-4 inset-0 transition-transform translate-x-5 bg-[#7EBA70] translate-y-11"></span>
      ) : null}
      <span
        className={`relative block text-white ${size} uppercase font-bold ${customStyles}`}
      >
        {text}
      </span>
    </h1>
  );
}

export default Text;
