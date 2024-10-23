import PropTypes from 'prop-types';

function HobbiesList(props) {
  return (
    <>
      <h1>My Hobbies</h1>
      <ul>
        <div>My list</div>
        {props.hobbies.map((hobby, index) => (
          <li key={index}>{hobby}</li>
        ))}
      </ul>

      {/* Conditionally render 'climbing' only if it's provided */}
      {props.climbing && (
        <div>
          <h1>{props.climbing}</h1>
        </div>
      )}
    </>
  );
}

// PropTypes validation
HobbiesList.propTypes = {
  hobbies: PropTypes.array.isRequired,
  climbing: PropTypes.string,
};

export default HobbiesList;
