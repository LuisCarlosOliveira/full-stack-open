import "./Person.css";

const Person = ({ person }) => {
  if (!person) {
    return null;
  }
  
  return (
    <div className="contact-card">
      <div className="contact-avatar">
        <span className="avatar-initial">
          {person.name.charAt(0).toUpperCase()}
        </span>
      </div>
      <div className="contact-details">
        <span className="contact-name">{person.name}</span>
        <span className="contact-number">{person.number}</span>
      </div>
    </div>
  );
};

export default Person;