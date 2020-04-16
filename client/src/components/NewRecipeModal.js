import React from 'react';
import { Button, Modal,Form,TextArea } from 'semantic-ui-react';

const NewRecipeModal = ({openModal, createRecipe, cancelCreateRecipe}) => {

    const handleNewRecipe=(value)=>{
        debugger;
        createRecipe(value);
    };

    const handleCreate = (value) =>{
        debugger;
        createRecipe(value);
    };

    const handleCancelCreate = () =>{
        cancelCreateRecipe();
    };

    return(
        <div>
        <Modal open={openModal} trigger={<Button color="green" floated="right" className="new-recipe-button" onClick={handleNewRecipe.bind(handleNewRecipe,true)}>New Recipe</Button>}>
            <Modal.Header>New recipe</Modal.Header>
            <Modal.Content>
            <Modal.Description>
                <Form>
                <Form.Field>
                    <label>Name</label>
                    <input type="text" />
                </Form.Field>
                <Form.Field>
                    <label>Description</label>
                    <TextArea rows="5" />
                </Form.Field>
                <Form.Field>
                
                </Form.Field>
                <Button type='submit' color="blue" onClick={handleCreate.bind(handleCreate, false)}>Create</Button>
                <Button type='button' onClick={handleCancelCreate}>Cancel</Button>
            </Form>
            </Modal.Description>
            </Modal.Content>
        </Modal>
        </div>
)};

export default NewRecipeModal;