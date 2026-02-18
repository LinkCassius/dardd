import React from 'react';
import PropTypes from 'prop-types';
import {
    Card,
    CardTitle,
    CardBody,
    CardText,
    Col
  } from 'reactstrap';

const Box = (props) => {
  const scrollClick = () => {
    let navigationBar = document.getElementById('top-nav');
    if(props.title=="drivers" || props.title=="Devices"){
      navigationBar.scrollLeft += 1000;
    }
    } 
    return (
        <Col xl={props.column} >
          <Card color={props.color}>
          <CardBody onClick={()=>{ props.handleToggle(); scrollClick();} }>
            <CardTitle>{props.title}</CardTitle>
            <h1 className="display-4">{props.count}</h1>
          </CardBody>
          </Card>
        </Col>
    )
}

Box.propTypes = {
  title: PropTypes.string.isRequired,
  column: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  
};

Box.defaultProps = {
  title: 'Title',
  column: 2,
  color: 'primary',
  count: 0
};

export default Box;