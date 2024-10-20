import PropTypes from 'prop-types';

function Salute(props) {
    return (
        <div>
            <h1> Hello, {props.salute}</h1>
        </div>
    );
}

// Adding PropTypes validation
Salute.propTypes = {
    salute: PropTypes.string.isRequired, 
};

export default Salute;
