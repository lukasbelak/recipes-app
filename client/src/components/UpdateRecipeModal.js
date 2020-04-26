import React, { useState } from 'react';
import { Button, Modal,Form,Icon,TextArea,Input } from 'semantic-ui-react';
import {youtubeParser} from '../utils';
import SearchCategory from './SearchCategory';
import Compress from 'compress.js';
import NewCategoryModal from './NewCategoryModal';

const compress = new Compress();

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
    const [openNewCategoryModal, setOpenNewCategoryModal]=useState(false);
    const [isNewCategory, setIsNewCategory] = useState(0);
    const errorMessage='Please complete all required fields.';

    const updateYoutube = (e) =>{
        setYoutube(e.target.value); 
    };

    const checkFormError=(cat, nam, desc)=>{
        if(cat!==''&&nam!==''&&desc!==''){
            setFormError(false);
        }else{
            setFormError(true);
        }
    };

    const updateDescription=(e)=>{
        debugger;
        let descriptionValue=e.target.value
        setDescription(descriptionValue);

        if(descriptionValue===''){
            setDescriptionError(true);
        }else{
            setDescriptionError(false);
        }

        checkFormError(category,name,descriptionValue);
    };

    const getCategory=(value)=>{
        let categoryValue=value;
        setCategory(categoryValue);

        if(categoryValue===''){
            setCategoryError(true);
        }else{
            setCategoryError(false);
        }

        checkFormError(categoryValue,name,description);
    };

    const updateName = (e) =>{
        let nameValue=e.target.value
        setName(nameValue);

        if(nameValue===''){
            setNameError(true);
        }else{
            setNameError(false);
        }

        checkFormError(category,nameValue,description);
    }

    const onRemoveImage=(e)=>{
        setFileData('');
        setFileName('');
        setFileContentType('');
    }

    const onUploadImageChange= (e)=>{
        let file = e.target.files[0];
        if(file===undefined)return;
        if(!file.type.startsWith("image/"))return;

        setFileContentType(file.type);
        setFileName(file.name);

        compress.compress([...e.target.files], {
            size: 4, // the max size in MB, defaults to 2MB
            quality: .75, // the quality of the image, max is 1,
            maxWidth: 1920, // the max width of the output image, defaults to 1920px
            maxHeight: 1920, // the max height of the output image, defaults to 1920px
            resize: true, // defaults to true, set false if you do not want to resize the image width and height
          }).then((data) => {
              debugger;
              setFileData(data[0].data);
          })
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
        debugger;
        if(formError)return;

        setIsInProgressUpdate('loading');
        setIsInProgressUpdateBool(true);

        let ings=[];
        ingredients.forEach(ingredient=>{
            if(name!==''){
                ings.push({
                    name:ingredient.name,
                    quantity:ingredient.quantity,
                    unit:ingredient.unit
                });
            }
        });

        const recipeToUpdate = {
            name:name,
            description: description,
            ingredients: ings,
            category: category,
            youtube: youtubeParser(youtube)
        };

        if(fileData && fileContentType){
            recipeToUpdate.img={};
            recipeToUpdate.img.data=fileData;
            recipeToUpdate.img.contentType= fileContentType;
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

        setIsInProgressUpdateBool(false);
        setIsInProgressUpdate('');
        setUpdatedRecipe(recipe);
        handleCancelView();
    };

    const handleCancelView = ()=> {
        cancelUpdateRecipeModal();
    };

    const handleAddCategory=()=>{
        setOpenNewCategoryModal(true);
    };

    const cancelNewCategoryModal=()=>{
        setOpenNewCategoryModal(false);
    };

    const reloadCategories = ()=>{
        setIsNewCategory(isNewCategory+1);
    }

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
                    <label className='requiredField'>Category</label>
                        <SearchCategory
                        defaultValue={category}
                        getCategory={getCategory}
                        categoryError={categoryError}
                        isNewCategory={isNewCategory} />
                        <Button color='green' circular icon style={{margin:"0px 10px"}} type='button' title='Add new category' onClick={handleAddCategory} >
                            <Icon name='add' />
                        </Button>
                        <NewCategoryModal
                            openNewCategoryModal={openNewCategoryModal}
                            cancelNewCategoryModal={cancelNewCategoryModal}
                            getCategory={getCategory}
                            reloadCategories={reloadCategories}
                            />
                    </Form.Field>
                    <Form.Field>
                        <label className='requiredField'>Name</label>
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
                        <div style={{"display":"table"}}>
                            <Button as="label" htmlFor="file" type="button" style={{ width: "100px",float:"left" }}>Upload</Button>
                            <input type="file" id="file" style={{ display: "none" }} onChange={onUploadImageChange} accept='.png,.jpg,.jpeg' />
                            <label style={{display:"table-cell",verticalAlign:"middle"}}>{fileName}</label>
                            <Icon style={fileName===''?{display:'none'}:{display:'table-cell',verticalAlign:'middle'}} link color='red' name='close' onClick={onRemoveImage} />
                        </div>
                    </Form.Field>
                    <Form.Field>
                        <label>Youtube</label>
                        <input type="text" value={youtube} onChange={updateYoutube} />
                    </Form.Field> 
                    <Form.Field>
                        <label className='requiredField'>Description</label>
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