import React, { useState } from "react";

function VoteCounter() {
    const [voteA, setVoteA] = useState(0);
    const [voteB, setVoteB] = useState(0);

    const countVoteA = () => {
        setVoteA(voteA + 1);
    }

    const countVoteB = () => {
        setVoteB(voteB + 1);
    }

    const resetVotes = () => {
        setVoteA(0);
        setVoteB(0);
    }

    return (
        <>
            <p>Buttons:</p>
            <button onClick = {countVoteA}>Vote A</button>
            <button onClick = {countVoteB}>Vote B</button>
            <p>Votes:</p>
            <p>A: {voteA}</p>
            <p>B: {voteB}</p>
            <button onClick = {resetVotes}>Reset Votes</button>
        </>
    )

}

export default VoteCounter;