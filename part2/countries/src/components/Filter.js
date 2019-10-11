import React from 'react';

const Filter = ({ filterText, handlerFunction }) => {
  return (
    <p>find countries <input value={filterText} onChange={handlerFunction} /></p>
  );
}

export default Filter;