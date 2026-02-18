import React from 'react';
import PropTypes from 'prop-types';
import {ModalHeader} from 'reactstrap';

const Header = props => (
  <ModalHeader toggle={props.toggle}>{props.children}</ModalHeader>
);

Header.propTypes = {
    toggle: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired
}

export default Header;
