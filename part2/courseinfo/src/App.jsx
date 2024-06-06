import React from 'react';

const App = () => {
  const course = {
    id: 1,
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      },
      {
        name: 'Redux',
        exercises: 11,
        id: 4
      }
    ]
  };

  return <Course course={course} />;
};

// Define the Course component
const Course = ({ course }) => {
  return (
    <div>
      <Header courseName={course.name} />
      <Content parts={course.parts} />
      <Total total ={course.parts} />
    </div>
  );
};

const Total = ({total}) => {
  const totalExercises = total[0].exercises + total[1].exercises + total[2].exercises + total[3].exercises;
  return <p><strong>Number of exercises {totalExercises}</strong></p>;
}


// Define the Header component
const Header = ({ courseName }) => {
  return <h1>{courseName}</h1>;
};

// Define the Content component
const Content = ({ parts }) => {
  return (
    <div>
      {parts.map(part => (
        <Part key={part.id} part={part} />
      ))}
    </div>
  );
};

// Define the Part component
const Part = ({ part }) => {
  return (
    <p>
      {part.name} {part.exercises}
    </p>
  );
};

export default App;

