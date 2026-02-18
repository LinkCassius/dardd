import React from 'react';
import { Link } from 'react-router-dom'
import { Media } from 'reactstrap';
import PropTypes from 'prop-types';
import {
    Card,
    CardTitle,
    CardBody,
    Col
  } from 'reactstrap';

const Widgets = (props) => {
  let link = '#'
  let color = 'primary'
  if(props.title.toLowerCase() === 'customer' ) {
    link = 'customers/'
    color = 'primary'
  }
  if(props.title.toLowerCase() === 'devices' ) {
    link = 'units/'
    color = 'danger'
  }
  if(props.title.toLowerCase() === 'active devices' ) {
    link = 'units?type=Active'
    color = 'primary'
  }
  if(props.title.toLowerCase() === 'inactive devices' ) {
    link = 'units?type=InActive'
    color = 'primary'
  }
  // if(props.title.toLowerCase() == 'trips' ) {
  //   link = '#'
    // color = 'primary'
  // }
  // if(props.title.toLowerCase() == 'active trips' ) {
  //   link = '#'
    // color = 'primary'
  // }
  // if(props.title.toLowerCase() == 'overspeeding' ) {
  //   link = '#'
    // color = 'primary'
  // }
  // if(props.title.toLowerCase() == 'harshacceleration' ) {
  //   link = '#'
    // color = 'primary'
  // }
  // if(props.title.toLowerCase() == 'harshcornering' ) {
  //   link = '#'
    // color = 'primary'
  // }
  // if(props.title.toLowerCase() == 'suddenbraking' ) {
  //   link = '#'
    // color = 'primary'
  // }
    return (
        <Col xl={props.column}  key={props.title}>
        <Link to={link}>
          <Card color={props.color}>
          <Media object src={process.env.REACT_APP_IMAGE_PATH_URL+'widgets/'+props.icon} height="30" width="30" alt="Icon" />
          <CardBody>
            <CardTitle>{props.title}</CardTitle>
            <h1 className="display-4">{props.count}</h1>
            <hr
                style={{
                    // color: color,
                    backgroundColor: color,
                    height: 3
                }}
            />
            <span className="info">More Info</span>
          </CardBody>
          </Card>
          </Link>
        </Col>
    )
}

Widgets.propTypes = {
  title: PropTypes.string.isRequired,
  column: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  
};

Widgets.defaultProps = {
  title: 'Title',
  column: 2,
  color: 'primary',
  count: 0
};

export default Widgets;