import PropTypes from 'prop-types';

import { check } from "../../../utils/authHelper";

const Can = props =>
  check (props.perform) ? props.yes () : props.no ();

Can.propTypes = {
  yes: PropTypes.func.isRequired,
  no: PropTypes.func.isRequired,
};

Can.defaultProps = {
  yes: () => null,
  no: () => null,
};

export default Can;
