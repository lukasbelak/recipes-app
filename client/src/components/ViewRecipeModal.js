import React, { useState } from 'react';
import { Button, Modal,Form, Embed, Image } from 'semantic-ui-react';
import {getImageUrl} from '../utils';
import UpdateRecipeModal from './UpdateRecipeModal';

const ViewRecipeModal = ({recipe, openViewRecipeModal, cancelViewRecipeModal}) => {
    debugger;
    const [openUpdateRecipeModal, setOpenUpdateRecipeModal] = useState(false);

    const handleUpdateRecipe = ()=>{
        setOpenUpdateRecipeModal(true);
    };

    const cancelUpdateRecipeModal=()=>{
        setOpenUpdateRecipeModal(false);
    };

    const handleCancelView =()=>{
        cancelViewRecipeModal();
    };

    return(
        <div>
        <Modal open={openViewRecipeModal} 
            dimmer='blurring' 
            closeOnDimmerClick={true} 
            closeOnEscape={true} 
            onClose={handleCancelView}>
            <Modal.Header>{recipe.name}</Modal.Header>
            <Modal.Content>
            <Modal.Description>
                <Form>
                    <Form.Field>
                        <Image src={getImageUrl(recipe.img)} alt='' style={{"width":"100%"}} />
                    </Form.Field>
                    <Form.Field>
                        <label>Ingredients</label>
                        <ul>
                            {recipe.ingredients.map(i=>(
                                <li key={i.name}>{i.name} {i.quantity} {i.unit}</li>
                            ))}
                        </ul>
                    </Form.Field>
                    <Form.Field>
                        <label>Description</label>
                        <p style={{"whiteSpace":"pre"}}>{recipe.description}</p>
                    </Form.Field>
                    <Form.Field>
                        <label>Video</label>
                        <Embed
                            id={recipe.youtube}
                            source='youtube'
                        />
                    </Form.Field>
                    <Form.Field>
                        <p style={{"textAlign":"center"}}>Created on: {new Intl.DateTimeFormat('en-GB',{
                            year: "numeric",
                            month:"long",
                            day:"2-digit"
                        }).format(new Date(recipe.date))}</p>
                    </Form.Field>
                    </Form>
            </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
                <Button floated='right' type='button' onClick={handleCancelView}>Cancel</Button>
                <Button type='button' color="blue" onClick={handleUpdateRecipe}>Update</Button>
                <UpdateRecipeModal
                    recipe={recipe}
                    openUpdateRecipeModal={openUpdateRecipeModal}
                    cancelUpdateRecipeModal={cancelUpdateRecipeModal} />
            </Modal.Actions>
        </Modal>
        </div>
    )}; 

export default ViewRecipeModal;
