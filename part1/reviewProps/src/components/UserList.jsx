const UserList = ({ users }) => {
    return (
      <ul>
        {users.map((user, index) => (
          <li key={index}>
            {user.name} - {user.age} years old
          </li>
        ))}
      </ul>
    );
  };

  export default UserList;  