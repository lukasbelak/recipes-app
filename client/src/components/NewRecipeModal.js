import React, { useState } from 'react';
import { Button, Modal,Form,TextArea,Input,Icon } from 'semantic-ui-react';
import SearchCategory from './SearchCategory';
import {youtubeParser} from '../utils';

const NewRecipeModal = ({openNewRecipeModal, createRecipe, cancelCreateRecipe}) => {

    const [ingredients, setIngredients]=useState([]);
    const [name, setName]=useState('');
    const [description, setDescription]=useState('');
    const [category, setCategory]=useState('');
    const [youtube, setYoutube]=useState('');
    const [fileData, setFileData] = useState('');
    const [fileName, setFileName]=useState('');
    const [fileContentType, setFileContentType]=useState('');

    const handleNewRecipe=(value)=>{
        createRecipe(value);
    };

    const handleCreate = (value) =>{
        createRecipeWithIngredients(value);
    };

    const createRecipeWithIngredients=(value)=>{
        const recipe = {
            name:name,
            description:description,
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
        .then(()=>{
            setIngredients([]);
            setName('');
            setDescription('');
            setCategory('');
            setYoutube('');

            createRecipe(value);
        });
    };

    const handleCancelCreate = () =>{
        // setIngredients([]);
        //     setName('');
        //     setDescription('');
        //     setCategory('');
        // setYoutube('');
        cancelCreateRecipe();
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
        setName(e.target.value);
    };

    const updateDescription=(e)=>{
        setDescription(e.target.value);
    };

    const getCategory=(value)=>{
        setCategory(value);
    };

    const onUploadImageChange= (e)=>{
        let file = e.target.files[0];
        
        setFileContentType(file.type);
        setFileName(file.name);

        getBase64(file, (result) => {
            setFileData(result);
        });
    }

    const onRemoveImage=(e)=>{
        setFileData('');
        setFileName('');
        setFileContentType('');
    }

    const getBase64=(file, cb)=> {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            cb(reader.result)
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    }

    return(
        <div>
        <Modal open={openNewRecipeModal} trigger={<Button color="green" floated="right" className="new-recipe-button" onClick={handleNewRecipe.bind(handleNewRecipe,true)}>New Recipe</Button>}>
            <Modal.Header>New recipe</Modal.Header>
            <Modal.Content>
            <Modal.Description>
                <Form>
                    <Form.Field>
                        <label>Category</label>
                        <SearchCategory
                        getCategory={getCategory} />
                    </Form.Field>
                    <Form.Field>
                        <label>Name</label>
                        <input type="text" value={name} onChange={updateName} />
                    </Form.Field>
                    <Form.Field>
                        <label>Image</label>
                        <Button as="label" htmlFor="file" type="button" style={{ width: "100px",float:"left" }}>Upload</Button>
                        <Icon link name='close' style={{float:"left"}} onClick={onRemoveImage} />
                        <input type="file" id="file" style={{ display: "none" }} onChange={onUploadImageChange} />
                        <label>{fileName}</label>
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
                        <TextArea rows="5" value={description} onChange={updateDescription} />
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