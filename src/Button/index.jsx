import React from 'react';
import Proptypes from 'prop-types';
import './index.css';

const Button = ({ onClick, className, children }) => (
  <button onClick={onClick} className={className} type="button">
    {children}
  </button>
);

Button.propTypes = {
  onClick: Proptypes.func.isRequired,
  className: Proptypes.string,
  children: Proptypes.node.isRequired
};
Button.defaultProps = {
  className: ''
};

export default Button;
