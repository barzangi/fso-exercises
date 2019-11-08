import React from 'react'

const Filter = ({ filterText, handlerFunction }) => <div>filter shown with <input value={filterText} onChange={handlerFunction} /></div>

export default Filter