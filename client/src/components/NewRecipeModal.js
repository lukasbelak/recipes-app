import React from 'react';
import { Button, Modal,Form } from 'semantic-ui-react';

const NewRecipeModal = ({openModal, createRecipe}) => {

    const handleNewRecipe=(value)=>{
        debugger;
        createRecipe(value);
    };

    const handleCreate = (value) =>{
        debugger;
        createRecipe(value);
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
                    
                </Form.Field>
                <Form.Field>
                
                </Form.Field>
                <Button type='submit' onClick={handleCreate.bind(handleCreate, false)}>Create</Button>
            </Form>
            </Modal.Description>
            </Modal.Content>
        </Modal>
        </div>
)};

export default NewRecipeModal;