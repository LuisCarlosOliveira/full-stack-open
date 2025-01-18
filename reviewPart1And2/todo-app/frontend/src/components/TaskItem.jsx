import React from 'react';

const TaskItem = ({ task, onDelete }) => {
  return (
    <li className="task-item">
      <span>{task.description}</span>
      <button onClick={() => onDelete(task._id)}>Delete</button>
    </li>
  );
};

export default TaskItem;
