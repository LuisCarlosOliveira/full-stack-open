const Person = ({ person }) => {
  if (!person) { 
    return null; 
  }

  return (
    <li className="person">
      <span className="person-name">{person.name}</span>
      <span className="person-number"> - {person.number}</span>
    </li>
  );
};

export default Person;