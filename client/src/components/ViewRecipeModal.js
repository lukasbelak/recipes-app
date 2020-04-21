import React, { useState } from 'react';
import { Button, Modal,Form,TextArea,Input,Icon, Embed } from 'semantic-ui-react';

const ViewRecipeModal = ({recipe, openViewRecipeModal, cancelViewRecipeModal}) => {

const handleCancelView =()=>{
    cancelViewRecipeModal();
};

    return(
        <div>
        <Modal open={openViewRecipeModal} >
            <Modal.Header>{recipe.name}</Modal.Header>
            <Modal.Content>
            <Modal.Description>
                <Form>
                    <Form.Field>
                        <label>Category</label>
                    </Form.Field>
                    <Form.Field>
                    <Embed
                        id={recipe.youtube}
                        source='youtube'
                        />
                    </Form.Field>
                    <Button type='button' onClick={handleCancelView}>Cancel</Button>
                    </Form>
            </Modal.Description>
            </Modal.Content>
        </Modal>
        </div>
    )}; 

export default ViewRecipeModal;
