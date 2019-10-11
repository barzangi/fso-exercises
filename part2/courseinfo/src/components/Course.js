import React from 'react';

const Course = ({ course }) => {
  return (
    <>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </>
  );
}

const Header = ({ name }) => {
  return (
    <>
      <h1>{name}</h1>
    </>
  );
}

const Content = ({ parts }) => {
  return (
    <>
      {parts.map(part => <p key={part.id}>{part.name} {part.exercises}</p>)}
    </>
  );
}

const Total = ({ parts }) => {
  return (
    <>
      <p><strong>Total of {parts.reduce((total, part) => total + part.exercises, 0)} exercises</strong></p>
    </>
  );
}

export default Course;