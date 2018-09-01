import React from 'react';
import Proptypes from 'prop-types';

const Search = ({ value, onChange, onSubmit, children }) => (
  <form onSubmit={onSubmit}>
    <input type="text" value={value} onChange={onChange} />
    <button type="submit">{children}</button>
  </form>
);

Search.propTypes = {
  value: Proptypes.string,
  onChange: Proptypes.func.isRequired,
  onSubmit: Proptypes.func.isRequired,
  children: Proptypes.node.isRequired
};

export default Search;
