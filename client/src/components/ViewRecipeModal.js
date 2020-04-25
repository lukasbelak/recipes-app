import React, { useState } from 'react';
import { Button, Modal,Form, Embed, Image } from 'semantic-ui-react';
import {getImageUrl} from '../utils';
import UpdateRecipeModal from './UpdateRecipeModal';
import DeleteRecipeModal from './DeleteRecipeModal';

const ViewRecipeModal = ({recipe, openViewRecipeModal, cancelViewRecipeModal,reloadList,showMessage}) => {
    //debugger;
    const [openUpdateRecipeModal, setOpenUpdateRecipeModal] = useState(false);
    const [viewRecipe, setViewRecipe]=useState(recipe);
    const [openDeleteRecipeModal, setOpenDeleteRecipeModal]=useState(false);

    const handleUpdateRecipe = ()=>{
        setOpenUpdateRecipeModal(true);
    };

    const cancelUpdateRecipeModal=()=>{
        setOpenUpdateRecipeModal(false);
    };

    const handleCancelView =()=>{
        cancelViewRecipeModal(true);
    };

    const setUpdatedRecipe=(value)=>{
        setViewRecipe(value);
    };

    const handleDeleteRecipe=()=>{
        debugger;
        setOpenDeleteRecipeModal(true);
    };

    const cancelDeleteRecipeModal=(isDeleted)=>{
        debugger;
        setOpenDeleteRecipeModal(false);
        if(isDeleted){
            cancelViewRecipeModal(true);
            reloadList();
        }
    };

    let video;
    if(viewRecipe.youtube!==''){
        video=<div><label style={{fontWeight:"700"}}>Video</label>
        <Embed
            id={viewRecipe.youtube}
            source='youtube'
        /></div>;
    }

    return(
        <div>
        <Modal open={openViewRecipeModal} 
            dimmer='blurring' 
            closeOnDimmerClick={true} 
            closeOnEscape={true} 
            onClose={handleCancelView}>
            <Modal.Header>
                <div style={{display:'flex', justifyContent:'space-between'}}>
                    <div style={{display:'flex', flexDirection:'column-reverse'}}>
                        {viewRecipe.name}
                    </div>
                    <div>
                        <Button type='button' color="red" onClick={handleDeleteRecipe}>Delete</Button>
                        <DeleteRecipeModal
                            recipe={recipe}
                            openDeleteRecipeModal={openDeleteRecipeModal}
                            cancelDeleteRecipeModal={cancelDeleteRecipeModal} 
                            showMessage={showMessage} />
                    </div>
                </div>
                </Modal.Header>
            <Modal.Content>
            <Modal.Description>
                <Form>
                    <Form.Field>
                        <Image src={getImageUrl(viewRecipe.img)} alt='' style={{"width":"100%"}} />
                    </Form.Field>
                    <Form.Field>
                        <label>Ingredients</label>
                        <ul>
                            {viewRecipe.ingredients.map(i=>(
                                <li key={i.name}>{i.name} {i.quantity} {i.unit}</li>
                            ))}
                        </ul>
                    </Form.Field>
                    <Form.Field>
                        <label>Description</label>
                        <p style={{"whiteSpace":"pre-line"}}>{viewRecipe.description}</p>
                    </Form.Field>
                    <Form.Field>
                        {video}
                    </Form.Field>
                    <Form.Field>
                        <p style={{"textAlign":"center"}}>Created on: {new Intl.DateTimeFormat('en-GB',{
                            year: "numeric",
                            month:"long",
                            day:"2-digit"
                        }).format(new Date(viewRecipe.date))}</p>
                    </Form.Field>
                    </Form>
            </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
                <Button floated='right' type='button' onClick={handleCancelView}>Cancel</Button>
                <Button type='button' color="blue" onClick={handleUpdateRecipe}>Update</Button>
                <UpdateRecipeModal
                    recipe={viewRecipe}
                    openUpdateRecipeModal={openUpdateRecipeModal}
                    cancelUpdateRecipeModal={cancelUpdateRecipeModal}
                    setUpdatedRecipe={setUpdatedRecipe} />
            </Modal.Actions>
        </Modal>
        </div>
    )}; 

export default ViewRecipeModal;
