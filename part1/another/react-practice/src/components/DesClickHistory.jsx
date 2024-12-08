import React, { useState } from "react";

const DesClickHistory = ({ onAction }) => {
  const [clickHistory, setClickHistory] = useState([]);

  const addAction = (action) => {
    setClickHistory((prev) => [...prev, action]);
    if (onAction) onAction(action); // Callback opcional para o App
  };

  return (
    <div>
      <ul>
        {clickHistory.map((action, index) => (
          <li key={index}>{action}</li>
        ))}
      </ul>
      {/* Botões que adicionam ações diretamente no ClickHistory */}
      <button onClick={() => addAction("Increment")}>Increment</button>
      <button onClick={() => addAction("Reset")}>Reset</button>
      <button onClick={() => addAction("Change Name")}>Change Name</button>
    </div>
  );
};

export default DesClickHistory;
