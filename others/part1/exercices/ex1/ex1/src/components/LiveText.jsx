import React, { useState } from "react";

function LiveText() {
  const [text, setText] = useState("");

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  return (
    <div>
      <input
        type="text"
        value={text}
        onChange={handleTextChange}
        placeholder="Type something"
      />
      <p>Current Text: {text}</p>
    </div>
  );
}

export default LiveText;
