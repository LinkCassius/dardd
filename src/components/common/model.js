import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input, Media } from 'reactstrap';
const ModalExample = (props) => {   
    return (
        <Modal isOpen={props.widgetModal} toggle={props.toggle} className={'clssName'}>
            <ModalHeader >Select Widget</ModalHeader>
            <ModalBody>
                { 
                    props.widgets.map(function(value){
                        return ( 
                            <FormGroup check key={value._id}>
                                <Label check>
                                <Input type="checkbox" onChange={props.onChange} name="widgetCheck" value={JSON.stringify(value)} defaultChecked={value.select} />{' '}
                                <Media object src={process.env.REACT_APP_IMAGE_PATH_URL+'widgets/'+value.icon} height="30" width="30" alt="Icon" />
                                {value.name} ({value.type})<br/>
                                {value.description}
                                </Label>
                            </FormGroup>
                        )
                    }) 
                }
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={props.onSubmit}>Okay</Button>{' '}
                <Button color="secondary" onClick={props.toggle}>Close</Button>
            </ModalFooter>
        </Modal>
    );
}

export default ModalExample;