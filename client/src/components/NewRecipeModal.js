import React, { useState } from 'react';
import { Button, Modal,Form,TextArea,Input } from 'semantic-ui-react';

const NewRecipeModal = ({openModal, createRecipe, cancelCreateRecipe}) => {

    const [ingredients, setIngredients]=useState([]);
    const [name, setName]=useState('');
    const [description, setDescription]=useState('');

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
            ingredients: ingredients
        };

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

            createRecipe(value);
        });
    };

    const handleCancelCreate = () =>{
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

    const updateName=(e)=>{
        setName(e.target.value);
    };

    const updateDescription=(e)=>{
        setDescription(e.target.value);
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
                    <input type="text" value={name} onChange={updateName} />
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