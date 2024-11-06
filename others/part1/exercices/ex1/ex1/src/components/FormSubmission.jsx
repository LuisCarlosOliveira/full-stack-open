import React, { useState } from 'react';

function FormSubmission() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={handleNameChange}
          placeholder="Name"
        />
        <input
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="Email"
        />
        <button type="submit">Submit</button>
      </form>
      {submitted && (
        <div>
          <h3>Submitted data:</h3>
          <p>Name: {name}</p>
          <p>Email: {email}</p>
        </div>
      )}
    </div>
  );
}

export default FormSubmission;
