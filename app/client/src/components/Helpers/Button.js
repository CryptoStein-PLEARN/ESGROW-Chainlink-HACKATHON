import React from "react";

function Button({ text, active, disabled }) {
  return (
    <button
      disabled
      className={`relative inline-flex items-center justify-center hover:border rounded p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium ${
        active ? "text-white" : "text-black"
      } group dark:text-white focus:ring-4 focus:outline-none`}
    >
      <span
        className={`relative px-2 py-2.5 transition-all ease-in duration-75 rounded ${
          active ? "bg-black" : "bg-white"
        } dark:bg-gray-900 group-hover:bg-opacity-0`}
      >
        {text}
      </span>
    </button>
  );
}

export default Button;
