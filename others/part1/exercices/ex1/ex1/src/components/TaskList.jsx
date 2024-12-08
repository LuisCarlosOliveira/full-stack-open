import React, { useState } from "react";

const tasks = [
    {id: 1, name: "Task 1", completed: false},
    {id: 2, name: "Task 2", completed: false},
    {id: 3, name: "Task 3", completed: false},
    {id: 4, name: "Task 4", completed: false}
];

function TaskList() {
    const [taskList, setTaskList] = useState(tasks);

    return (
        <>
        <div>Task List </div>
        {taskList.map((task, index) => (
            <li key={index}>{task.id} = {task.name}</li>
            
        ))}
        </>
    );
    
}

export default TaskList;
