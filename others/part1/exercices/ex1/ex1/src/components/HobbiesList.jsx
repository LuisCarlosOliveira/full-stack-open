import PropTypes from 'prop-types';

function HobbiesList(props){
    return (
        <>
            <hi>My Hobbies</hi>
            <ul>
                <div>My list</div>
                {props.HobbiesList.map((hobby, index) => {
                    return <li key={index}>{hobby}</li>
                })}
            </ul>
        </>
    )
}
HobbiesList.propTypes = {
    HobbiesList: PropTypes.array.isRequired,
};

export default HobbiesList;

