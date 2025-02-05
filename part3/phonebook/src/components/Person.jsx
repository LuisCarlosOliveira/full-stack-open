const Person = ({ person }) => {
  if (!person) { 
    return null; 
  }

  return (
    <>
      <span className="person-name">{person.name}</span>
      <span className="person-number"> - {person.number}</span>
    </>
  );
};

export default Person;