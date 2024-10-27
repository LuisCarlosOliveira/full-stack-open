function AbilityList(props) {
    return(
        <>
            <p>My Abilities</p>
            <ul>
                {props.abilities.map((ability, index) => (
                    <li key={index}>{ability}</li>
                ))}
            </ul>
        </>
    )
}

export default AbilityList;