import React, { useState } from "react";

function GreetDestructed({name, age}) {

    return(
        <div>
            <h1>Hello, {name} with {age} old! </h1>
        </div>
    )
}
export default GreetDestructed;