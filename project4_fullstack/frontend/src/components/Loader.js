import React from "react";

const Loader = () => { //this creates 3 rounded dots that's bounce up n down every second for waiting.
  return (
    <div className="flex">
      <div className="h-2.5 w-2.5 bg-current rounded-full mr-1 animate-bounce"></div>
      <div className="h-2.5 w-2.5 bg-current rounded-full mr-1 animate-bounce200"></div>
      <div className="h-2.5 w-2.5 bg-current rounded-full animate-bounce400"></div>
    </div>
  );
};

export default Loader;
