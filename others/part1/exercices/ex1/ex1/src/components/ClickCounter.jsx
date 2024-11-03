import React, { useState } from "react";

function ClickCounter() {
    const [count, setCount] = useState(0);

    const countClicks = () => {
        setCount(count + 1);
    }

    return (
        <div>
            <p>Clicks: {count}</p>
            <button onClick={countClicks}>Btn 1</button>
            <button onClick={countClicks}>Btn 2</button>
            <button onClick={countClicks}>Btn 3</button>
        </div>
    );

}   

export default ClickCounter;