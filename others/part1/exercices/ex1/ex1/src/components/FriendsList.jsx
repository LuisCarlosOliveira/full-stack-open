import PropTypes from 'prop-types';

function FriendsList(props) {
    return (
        <>
            <h1>My Friends</h1>
            <ul>
                {props.friends.map((friend, index) => (
                    <li key={index}>{friend}</li>
                ))}
            </ul>
            {props.fromWhere && (
                <div>
                    <h1>{props.fromWhere}</h1>
                </div>
            )}

            <h1>Another friends</h1>
            <ul>
                {props.friends2.map((friend, index) => (
                    <li key={index}>{friend}</li>
                ))}
            </ul>
            {props.fromWhere2 && (
                <div>
                    <h1>{props.fromWhere2}</h1>
                </div>
            )}
        </>
    );
}

FriendsList.propTypes = {
    friends: PropTypes.array.isRequired,
    fromWhere: PropTypes.string,
    friends2: PropTypes.array.isRequired,
    fromWhere2: PropTypes.string,
};

export default FriendsList;
