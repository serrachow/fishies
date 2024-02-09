import './button_layout.css'

import React from 'react';
import PropTypes from 'prop-types';



const ButtonLayout = ({ onClick, children, variant }) => {
  return (
    <button className={`btn btn-${variant} glassmorphism`} onClick={onClick}>
      {children}
    </button>
  );
};

ButtonLayout.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default']),
};

ButtonLayout.defaultProps = {
  variant: 'default',
};

export default ButtonLayout;