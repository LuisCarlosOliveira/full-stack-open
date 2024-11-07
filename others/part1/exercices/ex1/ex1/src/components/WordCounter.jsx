import React, { useState } from "react";

function WordCounter() {
    const [text, setText] = useState("");
    const [count, setCount] = useState(0);

    const handleTextChange = (e) => {
        setText(e.target.value); 
        countWords(e.target.value); 
    };
    
    const countWords = (inputText) => {
        const words = inputText.trim().split(/\s+/).filter(Boolean);
        setCount(words.length);
    };

    return(
        <>
        <input 
        type = "text"
        value = {text}
        onChange = {handleTextChange}
        placeholder = "Type something"
        />
        <p>Word Count: {count}</p>
        </>
    )
}

export default WordCounter;