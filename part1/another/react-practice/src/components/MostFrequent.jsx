import React, { useState } from "react";

function MostFrequent({arr}) {
    const [mostFrequent, setMostFrequent] = useState(null);
    const [count, setCount] = useState(0);

    const findMostFrequent = () => {
        const map = {};
        let max = 0;
        let maxItem = null;
        for (const item of arr) {
            if (map[item] == null) {
                map[item] = 1;
            } else {
                map[item]++;
            }
            if (map[item] > max) {
                max = map[item];
                maxItem = item;
            }
        }
        setMostFrequent(maxItem);
        setCount(max);
    };

    return (
        <div>
            <button onClick={findMostFrequent}>Find Most Frequent</button>
            <div>
                {mostFrequent != null && (
                    <p>
                        Most frequent item is {mostFrequent} with {count} times.
                    </p>
                )}
            </div>
        </div>
    );
}

export default MostFrequent;