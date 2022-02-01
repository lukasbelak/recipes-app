import React, { useState, useEffect,useRef } from 'react';
import { Button, Modal,Form, Embed, Image,Label } from 'semantic-ui-react';
import {getImageUrl,parseTags} from '../utils';
import UpdateRecipeModal from './UpdateRecipeModal';
import DeleteRecipeModal from './DeleteRecipeModal';
import {getSeasonsList} from '../utils';
import { Typeahead} from 'react-bootstrap-typeahead';
import { useHistory } from "react-router-dom";

const ViewRecipeModal = ({recipe, user, openViewRecipeModal, cancelViewRecipeModal,reloadList,showMessage}) => {
    const [openUpdateRecipeModal, setOpenUpdateRecipeModal] = useState(false);
    const [viewRecipe, setViewRecipe]=useState(recipe);
    const [openDeleteRecipeModal, setOpenDeleteRecipeModal]=useState(false);
    const [selectedTag, setSelectedTag] = useState([]);
    const typeaheadRef = useRef(null);

    let history = useHistory();

    useEffect(() => {
        setSelectedTag(parseTags(viewRecipe.tags));
      }, [history,viewRecipe]);

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
        setOpenDeleteRecipeModal(true);
    };

    const cancelDeleteRecipeModal=(isDeleted)=>{
        setOpenDeleteRecipeModal(false);
        if(isDeleted){
            cancelViewRecipeModal(true);
            reloadList();
        }
    };

    const getSeasonText=()=>{
        let seasons=getSeasonsList();
        let season= seasons.find(x=>x.value===viewRecipe.season);
        return season.text;
    };

    const getHeaderColor=()=>{

        switch(viewRecipe.season)
        {
            case 1:
                return {backgroundColor:'#52d178'};
            case 2:
                return {backgroundColor:'#ffff5d'};
            case 3:
                return {backgroundColor:'#ff582c'};
            case 4:
                return {backgroundColor:'#2dcfff'};
            default:break;
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
debugger;
    return(
        <div>
        <Modal open={openViewRecipeModal} 
            dimmer='blurring' 
            closeOnDimmerClick={true} 
            closeOnEscape={true} 
            onClose={handleCancelView}>
            <Modal.Header style={getHeaderColor()}>
            <Label as='a' color='brown' style={{fontSize:'20px', float:'left'}} horizontal> {recipe.category} </Label>
                <div style={{display:'flex', justifyContent:'space-between'}}>
                    <div style={{display:'flex', flexDirection:'column-reverse', alignSelf:'center'}}>
                        {viewRecipe.name}
                    </div>
                    <div>          
                        <Button style={{display:user?.isAdmin || user?._id===viewRecipe.user_id ?'inline':'none'}} type='button' color="blue" onClick={handleUpdateRecipe}>Zmeniť</Button>
                        <Button style={{display:user?.isAdmin?'inline':'none'}} type='button' color="red" onClick={handleDeleteRecipe}>Vymazať</Button>
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
                    {viewRecipe.season>0?(
                    <Form.Field>
                        <label>Obdobie</label>
                        {getSeasonText()}
                    </Form.Field>):null}
                    <Form.Field>
                        <label>Ingrediencie</label>
                        <ul>
                            {viewRecipe.ingredients.map(i=>(
                                <li key={i.name}>{i.name} {i.quantity} {i.unit}</li>
                            ))}
                        </ul>
                    </Form.Field>
                    {recipe.tags?.length>2?(
                    <Form.Field>
                    <label>Tagy</label>
                        <Typeahead
                            multiple
                            id="keep-menu-open"
                            ref={typeaheadRef}
                            selected={selectedTag}
                            disabled={true}
                            />
                    </Form.Field> ):null}
                    <Form.Field>
                        <label>Popis</label>
                        <p style={{"whiteSpace":"pre-line"}}>{viewRecipe.description}</p>
                    </Form.Field>
                    <Form.Field>
                        {video}
                    </Form.Field>
                    <Form.Field>
                        <p style={{"textAlign":"center"}}>Vytvorené dňa: {new Intl.DateTimeFormat('en-GB',{
                            year: "numeric",
                            month:"long",
                            day:"2-digit"
                        }).format(new Date(viewRecipe.date))}</p>
                    </Form.Field>
                    <Form.Field>
                        <p style={{"textAlign":"center"}}>Vytvoril: <b>{viewRecipe.createdBy}</b></p>
                    </Form.Field>
                    </Form>
            </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
                <Button type='button' onClick={handleCancelView}>Zrušiť</Button>
                {/* <Button type='button' color="blue" onClick={handleUpdateRecipe}>Update</Button> */}
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
