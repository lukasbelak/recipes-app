import React, { useState } from 'react';
import { Button, Modal,Form, Embed, Image,Icon } from 'semantic-ui-react';
import {getImageUrl} from '../utils';

const UpdateRecipeModal = ({recipe,openUpdateRecipeModal, cancelUpdateRecipeModal}) => {

    const handleCancelView = ()=> {
        cancelUpdateRecipeModal();
    };

    return(
        <div>
        <Modal open={openUpdateRecipeModal}
            dimmer='blurring' 
            closeOnDimmerClick={true} 
            closeOnEscape={true} 
            onClose={handleCancelView}
            >
            <Modal.Header>Update</Modal.Header>
            <Modal.Content>
            <Modal.Description>
                <Form>
                    <Form.Field>
                        
                    </Form.Field>
                    
                    </Form>
            </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
                <Button type='button' onClick={handleCancelView}>Cancel</Button>
            </Modal.Actions>
        </Modal>
        </div>
    )}; 

export default UpdateRecipeModal;