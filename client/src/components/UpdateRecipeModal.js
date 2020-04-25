import React, { useState } from 'react';
import { Button, Modal,Form,Icon,TextArea,Input } from 'semantic-ui-react';
import {getBase64,youtubeParser} from '../utils';
import SearchCategory from './SearchCategory';

const UpdateRecipeModal = ({recipe,openUpdateRecipeModal, cancelUpdateRecipeModal, setUpdatedRecipe}) => {

    const [ingredients, setIngredients]=useState(recipe.ingredients);
    const [category, setCategory] = useState(recipe.category);
    const [name, setName] = useState(recipe.name);
    const [youtube, setYoutube]=useState(recipe.youtube==="false" ? '' : 'https://www.youtube.com/watch?v='+recipe.youtube);
    const [fileData, setFileData] = useState('');
    const [fileName, setFileName]=useState('');
    const [fileContentType, setFileContentType]=useState('');
    const [description, setDescription]=useState(recipe.description);
    const [isInProgressUpdate, setIsInProgressUpdate]=useState('');
    const [isInProgressUpdateBool, setIsInProgressUpdateBool]=useState(false);
    const [categoryError, setCategoryError] = useState(recipe.category==='');
    const [descriptionError, setDescriptionError] = useState(recipe.description==='');
    const [nameError, setNameError]=useState(recipe.name==='');
    const [formError, setFormError]=useState(recipe.category===''||recipe.description===''||recipe.name==='');
    const errorMessage='Please complete all required fields.';

    const updateYoutube = (e) =>{
        setYoutube(e.target.value); 
    };

    const checkFormError=()=>{
        if(category!==''&&name!==''&&description!==''){
            setFormError(false);
        }else{
            setFormError(true);
        }
    };

    const updateDescription=(e)=>{
        let descriptionValue=e.target.value
        setDescription(descriptionValue);

        if(descriptionValue===''){
            setDescriptionError(true);
        }else{
            setDescriptionError(false);
        }

        checkFormError();
    };

    const getCategory=(value)=>{
        let categoryValue=value;
        setCategory(categoryValue);

        if(categoryValue===''){
            setCategoryError(true);
        }else{
            setCategoryError(false);
        }

        checkFormError();
    };

    const updateName = (e) =>{
        let nameValue=e.target.value
        setName(nameValue);

        if(nameValue===''){
            setNameError(true);
        }else{
            setNameError(false);
        }

        checkFormError();
    }

    const onRemoveImage=(e)=>{
        setFileData('');
        setFileName('');
        setFileContentType('');
    }

    const onUploadImageChange= (e)=>{
        let file = e.target.files[0];
        
        setFileContentType(file.type);
        setFileName(file.name);

        getBase64(file, (result) => {
            setFileData(result);
        });
    }

    const handleAddIngredientName=(e,index)=>{
        debugger;
        let value=e.target.value;
        ingredients[index].name=value;
        setIngredients([...ingredients]);
    };

    const handleAddIngredientQuantity=(e,index)=>{
        let value=e.target.value;
        ingredients[index].quantity=value;
        setIngredients([...ingredients]);
    };

    const handleAddIngredientUnit=(e,index)=>{
        let value=e.target.value;
        ingredients[index].unit=value;
        setIngredients([...ingredients]);
    };

    const handleAddIngredient=()=>{
        setIngredients([...ingredients, {
        }]);
    };

    const handleRemoveIngredient =(index)=>{
        ingredients.splice(index,1)
        setIngredients([...ingredients]);
    };

    const handleUpdateRecipe=(value)=>{
        debugger;
        updateRecipeWithIngredients(value);
    };
    const updateRecipeWithIngredients= async(value)=>{

        setIsInProgressUpdate('loading');
        setIsInProgressUpdateBool(true);

        let ings=[];
        ingredients.forEach(ingredient=>{
            ings.push({
                name:ingredient.name,
                quantity:ingredient.quantity,
                unit:ingredient.unit
            });
        });

        const recipeToUpdate = {
            name:name,
            description: description,
            ingredients: ings,
            category: category,
            youtube: youtubeParser(youtube)
        };

        if(fileData && fileContentType){
            recipe.img={};
            recipe.img.data=fileData;
            recipe.img.contentType= fileContentType;
        }

debugger;
        const requestOptions = {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(recipeToUpdate)
        };
        let resp = await fetch('/api/recipes/' + recipe._id, requestOptions);
        recipe = await resp.json();
        
        debugger;
        setNameError(true);
        setCategoryError(true);
        setDescriptionError(true);
        setFormError(true);

        setIsInProgressUpdateBool(false);
        setIsInProgressUpdate('');
        setUpdatedRecipe(recipe);
        handleCancelView();
    };

    const handleCancelView = ()=> {
        setIngredients([]);
        setName('');
        setDescription('');
        setCategory('');
        setYoutube('');

        setNameError(true);
        setCategoryError(true);
        setDescriptionError(true);
        setFormError(true);

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
                <Form error={formError} className={isInProgressUpdate}>
                    <Form.Field>
                    <label>Category</label>
                        <SearchCategory
                        defaultValue={category}
                        getCategory={getCategory}
                        categoryError={categoryError} />
                    </Form.Field>
                    <Form.Field>
                        <label>Name</label>
                        <input type="text" value={name} onChange={updateName} placeholder='Name' error={nameError} required={true} />
                    </Form.Field>
                    <Form.Field>
                        <label>Ingredients</label>
                        {
                            ingredients.map((ingredient,index)=>{
                                return(
                                    <div key={index} className="floatLeft">
                                        <div className="floatLeft"><Input placeholder='name' onChange={(e)=>handleAddIngredientName(e,index)} value={ingredient.name} /></div>
                                        <div className="floatLeft"><Input placeholder='quantity' onChange={(e)=>handleAddIngredientQuantity(e,index)} value={ingredient.quantity} /></div>
                                        <div className="floatLeft"><Input placeholder='unit' onChange={(e)=>handleAddIngredientUnit(e,index)} value={ingredient.unit} /></div>
                                        <div className="floatLeft"><Button type="button" onClick={()=>handleRemoveIngredient(index)}>Remove</Button></div>
                                    </div>
                                );
                            })
                        }
                        <div className="floatLeft"><Button type='button' onClick={handleAddIngredient}>Add</Button></div>
                        
                    </Form.Field>
                    <Form.Field>
                    <label>Image</label>
                        <Button as="label" htmlFor="file" type="button" style={{ width: "100px",float:"left" }}>Upload</Button>
                        <Icon link name='close' style={{float:"left"}} onClick={onRemoveImage} />
                        <input type="file" id="file" style={{ display: "none" }} onChange={onUploadImageChange} />
                        <label>{fileName}</label>
                    </Form.Field>
                    <Form.Field>
                        <label>Youtube</label>
                        <input type="text" value={youtube} onChange={updateYoutube} />
                    </Form.Field> 
                    <Form.Field>
                        <label>Description</label>
                        <TextArea rows="5" value={description} onChange={updateDescription} placeholder='Description' required={true} error={descriptionError} />
                    </Form.Field>  
                    </Form>
            </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
                <Button type='button' floated='right' onClick={handleCancelView} disabled={isInProgressUpdateBool}>Cancel</Button>
                <Button type='button' color="blue" onClick={handleUpdateRecipe.bind(handleUpdateRecipe, false)} disabled={isInProgressUpdateBool}>Update</Button>
                {formError?<p style={{"color":"red","fontSize":"medium","float":"left"}}>{errorMessage}</p>:<div></div>}
            </Modal.Actions>
        </Modal>
        </div>
    )}; 

export default UpdateRecipeModal;