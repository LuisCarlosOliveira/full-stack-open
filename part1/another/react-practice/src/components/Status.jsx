import React , {useState} from 'react';

function Status({counter}) {
    if (counter > 5){
        return <p>More than 5???</p>
    }
    return <p>Less than 5</p>
}

export default Status;