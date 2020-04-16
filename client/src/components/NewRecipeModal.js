import React, { useState } from 'react';
import { Button, Modal,Form,TextArea,Input } from 'semantic-ui-react';

const NewRecipeModal = ({openModal, createRecipe, cancelCreateRecipe}) => {

    const [ingredients, setIngredients]=useState([]);

    const handleNewRecipe=(value)=>{
        createRecipe(value);
    };

    const handleCreate = (value) =>{
        debugger;
        createRecipe(value);
    };

    const handleCancelCreate = () =>{
        cancelCreateRecipe();
    };

    const handleAddIngredient=()=>{
        setIngredients(oldIngredients=>[...oldIngredients, {

        }]);
    };

    const handleAddIngredientName=(e,index)=>{
        debugger;
        let value=e.target.value;
        ingredients[index].name=value;
    };

    const handleAddIngredientQuantity=(e,index)=>{
        let value=e.target.value;
        ingredients[index].quantity=value;
    };

    const handleAddIngredientUnit=(e,index)=>{
        let value=e.target.value;
        ingredients[index].unit=value;
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
                    <label>Ingredients</label>
                    {
                        ingredients.map((ingredient,index)=>{
                            return(
                                <div key={index} className="floatLeft">
                                    <div className="floatLeft"><Input placeholder='name' onChange={(e)=>handleAddIngredientName(e,index)} value={ingredient.name} /></div>
                                    <div className="floatLeft"><Input placeholder='quantity' onChange={(e)=>handleAddIngredientQuantity(e,index)} value={ingredient.quantity} /></div>
                                    <div className="floatLeft"><Input placeholder='unit' onChange={(e)=>handleAddIngredientUnit(e,index)} value={ingredient.unit} /></div>
                                </div>
                            );
                        })
                    }
                    <div className="floatLeft"><Button type='button' onClick={handleAddIngredient}>Add</Button></div>
                    
                </Form.Field>
                <Form.Field>
                    <label>Description</label>
                    <TextArea rows="5" />
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