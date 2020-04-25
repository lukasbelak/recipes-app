import React, { useState } from 'react';
import { Button, Modal,Form,Input,Icon} from 'semantic-ui-react';
import SearchCategory from './SearchCategory';
import {youtubeParser} from '../utils';
const Compress = require('compress.js');

const compress = new Compress();

const NewRecipeModal = ({openNewRecipeModal, createRecipe, cancelCreateRecipe,showMessage }) => {

    const [ingredients, setIngredients]=useState([]);
    const [name, setName]=useState('');
    const [description, setDescription]=useState('');
    const [category, setCategory]=useState('');
    const [youtube, setYoutube]=useState('');
    const [fileData, setFileData] = useState('');
    const [fileName, setFileName]=useState('');
    const [fileContentType, setFileContentType]=useState('');
    const [isInProgressCreate, setIsInProgressCreate]=useState('');
    const [isInProgressCreateBool, setIsInProgressCreateBool]=useState(false);
    const [categoryError, setCategoryError] = useState(true);
    const [descriptionError, setDescriptionError] = useState(true);
    const [nameError, setNameError]=useState(true);
    const [formError, setFormError]=useState(true);
    const errorMessage='Please complete all required fields.';

    const handleNewRecipe=(value)=>{
        createRecipe(value);
    };

    const handleCreate = (value) =>{
        let error=false;

        if(name===''){
            setNameError(true);
            error=true;
        }else{
            setNameError(false);
            error=false;
        }

        if(error){
            setFormError(true);
            return;
        }else{
            setFormError(false);
        }

        createRecipeWithIngredients(value);
    };

    const createRecipeWithIngredients=(value)=>{
        setIsInProgressCreate('loading');
        setIsInProgressCreateBool(true);

        const recipe = {
            name:name,
            description: description,
            ingredients: ingredients,
            category: category,
            img: {
                data:fileData,
                contentType: fileContentType
            },
            youtube: youtubeParser(youtube)
        };
debugger;
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(recipe)
        };

        fetch('/api/recipes', requestOptions)
        .then(resp=>resp.json())
        .then((err)=>{
            if(err.message){
                console.log(err.message);
                showMessage({
                    header:'Error',
                    text: err.message
                });
            }else{
                showMessage({
                    header: 'Success',
                    text: 'Recipe \''+ recipe.name +'\' was created successfully.'
                }); 
            }

            resetForm();

            setIsInProgressCreateBool(false);
            setIsInProgressCreate('');
            createRecipe(value);
        })
        .catch(err=>{
            debugger;
        });
    };

    const checkFormError=()=>{
        if(category!==''&&name!==''&&description!==''){
            setFormError(false);
        }else{
            setFormError(true);
        }
    };

    const handleCancelCreate = () =>{
        resetForm();

        cancelCreateRecipe();
    };

    const resetForm =()=>{
        setIngredients([]);
        setName('');
        setDescription('');
        setCategory('');
        setYoutube('');
        setFileData('');
        setFileContentType('');
        setFileName('');

        setNameError(true);
        setCategoryError(true);
        setDescriptionError(true);
        setFormError(true);
    };

    const handleAddIngredient=()=>{
        setIngredients([...ingredients, {
        }]);
    };

    const handleRemoveIngredient =(index)=>{
        ingredients.splice(index,1)
        setIngredients([...ingredients]);
    };

    const handleAddIngredientName=(e,index)=>{
        let value=e.target.value;
        ingredients[index].name=value;
        setIngredients(ingredients);
    };

    const handleAddIngredientQuantity=(e,index)=>{
        let value=e.target.value;
        ingredients[index].quantity=value;
        setIngredients(ingredients);
    };

    const handleAddIngredientUnit=(e,index)=>{
        let value=e.target.value;
        ingredients[index].unit=value;
        setIngredients(ingredients);
    };

    const updateYoutube = (e) =>{
        setYoutube(e.target.value); 
    };

    const updateName=(e)=>{
        let nameValue=e.target.value
        setName(nameValue);

        if(nameValue===''){
            setNameError(true);
        }else{
            setNameError(false);
        }

        checkFormError();
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

    const onRemoveImage=(e)=>{
        setFileData('');
        setFileName('');
        setFileContentType('');
    }

    return(
        <div>

        <Modal open={openNewRecipeModal} 
            dimmer='blurring'
            onClose={handleCancelCreate}
            closeOnDimmerClick={true}
            closeOnEscape={true}
            trigger={<Button color="green" floated="right" className="new-recipe-button" onClick={handleNewRecipe.bind(handleNewRecipe,true)}>New Recipe</Button>}>
            <Modal.Header>New recipe</Modal.Header>
            <Modal.Content>
            <Modal.Description>
                <Form error={formError} className={isInProgressCreate}>
                    <Form.Field>
                        <label>Category</label>
                        <SearchCategory
                        defaultValue={''}
                        getCategory={getCategory} 
                        categoryError={categoryError}/>
                    </Form.Field>
                    <Form.Field>
                        <label>Name</label>
                        <Form.Input required={true} type="text" value={name} onChange={updateName} placeholder='Name' error={nameError} />
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
                        <label>Youtube</label>
                        <input type="text" value={youtube} onChange={updateYoutube} />
                    </Form.Field> 
                    <Form.Field>
                        <label>Description</label>
                        <Form.TextArea rows="5" value={description} onChange={updateDescription} placeholder='Description' required={true} error={descriptionError} />
                    </Form.Field>  
                </Form>
            </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
                <Button type='submit' color="blue" onClick={handleCreate.bind(handleCreate, false)} disabled={isInProgressCreateBool}> Create</Button>
                <Button type='button' onClick={handleCancelCreate} disabled={isInProgressCreateBool}>Cancel</Button>
                {formError?<p style={{"color":"red","fontSize":"medium","float":"left"}}>{errorMessage}</p>:<div></div>}
            </Modal.Actions>
        </Modal>
        </div>
)};

export default NewRecipeModal;