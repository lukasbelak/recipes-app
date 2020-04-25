import React,{useState} from 'react';
import { Button, Modal } from 'semantic-ui-react';

const DeleteRecipeModal = ({recipe, openDeleteRecipeModal, cancelDeleteRecipeModal}) => {

    // const [isInProgressDelete, setIsInProgressDelete]=useState('');
    const [isInProgressDeleteBool, setIsInProgressDeleteBool]=useState(false);

    const handleYesOption=()=>{
        debugger;

        // setIsInProgressDelete('loading');
        setIsInProgressDeleteBool(true);

        const requestOptions = {
            method: 'DELETE'
        };

        fetch('/api/recipes/'+recipe._id, requestOptions)
        .then(resp=>{
            debugger;
            resp.json();
        })
        .then((err)=>{
            debugger;
            if(err && err.message){
                console.log(err.message);
                // showMessage({
                //     header:'Error',
                //     text: err.message
                // });
            }else{
                // showMessage({
                //     header: 'Success',
                //     text: 'Recipe \''+ recipe.name +'\' was created successfully.'
                // }); 
            }

            // setIsInProgressDelete('');
            setIsInProgressDeleteBool(false);
            cancelDeleteRecipeModal(true);
        });
    };

    const handleNoOption=()=>{
        cancelDeleteRecipeModal(false);
    };

    return (
        <div>
            <Modal size='tiny' 
                open={openDeleteRecipeModal} 
                onClose={cancelDeleteRecipeModal}
                closeOnDimmerClick={false} 
                closeOnEscape={false} 
                dimmer='blurring'
                centered>
                <Modal.Header>Delete recipe</Modal.Header>
                <Modal.Content>
                    <p>Are you sure you want to delete this recipe?</p>
                </Modal.Content>
                <Modal.Actions>
                    <Button negative onClick={handleNoOption} disabled={isInProgressDeleteBool}>No</Button>
                    <Button positive onClick={handleYesOption} disabled={isInProgressDeleteBool}>Yes</Button>
                </Modal.Actions>
            </Modal>
        </div>
    )
};

export default DeleteRecipeModal;