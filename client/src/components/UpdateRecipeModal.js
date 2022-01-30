import React, { useState, useRef, useEffect } from 'react';
import { Typeahead} from 'react-bootstrap-typeahead';
import { Button, Modal,Form,Icon,TextArea,Input } from 'semantic-ui-react';
import {youtubeParser,createTag,parseTags} from '../utils';
import SearchCategory from './SearchCategory';
import Compress from 'compress.js';
import NewCategoryModal from './NewCategoryModal';
import SeasonList  from './SeasonList';
import { useHistory } from "react-router-dom";
import  _  from 'lodash';

import 'react-bootstrap-typeahead/css/Typeahead.css';

const compress = new Compress();

const UpdateRecipeModal = ({recipe,openUpdateRecipeModal, cancelUpdateRecipeModal, setUpdatedRecipe}) => {

    const [ingredients, setIngredients]=useState(recipe.ingredients);
    const [category, setCategory] = useState(recipe.category);
    const [season, setSeason]=useState(recipe.season);
    const [name, setName] = useState(recipe.name);
    const [youtube, setYoutube]=useState(recipe.youtube==='' ? '' : 'https://www.youtube.com/watch?v='+recipe.youtube);
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
    const typeaheadRef = useRef(null);
    const [selectedTag, setSelectedTag] = useState([]);
    const [tags, setTags] = useState([]);
    const errorMessage='Vyplňte všetky povinné polia, prosím.';

    let history = useHistory();

    useEffect(() => {
        const getTags = async () => {
          try {
            let data = [];

            const requestOptions = {
              method: "GET",
              headers: { Authorization: localStorage.getItem("rcp_token") },
            };
    
            const resp = await fetch("/api/tags", requestOptions);
            let result = await resp.json();
            
            debugger;
            
            result.forEach((tag) => {
              data.push({
                key: tag._id,
                label: tag.name,
                value: tag.name,
              });
            });
            setTags(data);
          } catch (err) {
            console.log(err.message);
            history.push("/");
          }
        };
    
        getTags();
        setSelectedTag(parseTags(recipe.tags));
      }, [history,recipe]);



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

    const getSeason=(value)=>{
        let seasonValue=value;
        setSeason(seasonValue);
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
            size: 4,
            quality: .75, 
            maxWidth: 1920,
            maxHeight: 1920,
            resize: true,
          }).then((data) => {
              setFileData(data[0].data);
          })
    }

    const handleAddIngredientName=(e,index)=>{
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
        updateRecipeWithIngredients(value);
    };
    
    const updateRecipeWithIngredients= async(value)=>{
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

debugger;

        const recipeToUpdate = {
            name:name,
            description: description,
            ingredients: ings,
            category: category,
            youtube: youtubeParser(youtube),
            season: season,
            tags: selectedTag.map(function(obj){ return obj.label; }).join(";")
        };

        if(fileData && fileContentType){
            recipeToUpdate.img={};
            recipeToUpdate.img.data=fileData;
            recipeToUpdate.img.contentType= fileContentType;
        }

        const requestOptions = {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('rcp_token') },
            body: JSON.stringify(recipeToUpdate)
        };

        await createTag(selectedTag);

        let resp = await fetch('/api/recipes/' + recipe._id, requestOptions);
        recipe = await resp.json();

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
    };

    const tagOnChange=(value) => {
        debugger;
        setSelectedTag(value);
        // Keep the menu open when making multiple selections.
        // typeaheadRef.current.toggleMenu();
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
                    <label className='requiredField'>Kategória</label>
                        <SearchCategory
                        defaultValue={category}
                        getCategory={getCategory}
                        categoryError={categoryError}
                        isNewCategory={isNewCategory} />
                        <Button color='green' circular icon style={{margin:"0px 10px"}} type='button' title='Pridať novú kategóriu' onClick={handleAddCategory} >
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
                        <label>Obdobie</label>
                        <SeasonList defaultValue={season} getSeason={getSeason} />
                    </Form.Field>
                    <Form.Field>
                        <label className='requiredField'>Názov</label>
                        <input type="text" value={name} onChange={updateName} placeholder='Názov' error={nameError} required={true} />
                    </Form.Field>
                    <Form.Field>
                        <label>Ingrediencie</label>
                        {
                            ingredients.map((ingredient,index)=>{
                                return(
                                    <div key={index} className="floatLeft">
                                        <div className="floatLeft"><Input placeholder='názov' onChange={(e)=>handleAddIngredientName(e,index)} value={ingredient.name} /></div>
                                        <div className="floatLeft"><Input placeholder='množstvo' onChange={(e)=>handleAddIngredientQuantity(e,index)} value={ingredient.quantity} /></div>
                                        <div className="floatLeft"><Input placeholder='jednotka' onChange={(e)=>handleAddIngredientUnit(e,index)} value={ingredient.unit} /></div>
                                        <div className="floatLeft"><Button type="button" onClick={()=>handleRemoveIngredient(index)}>Odstrániť</Button></div>
                                    </div>
                                );
                            })
                        }
                        <div className="floatLeft"><Button type='button' onClick={handleAddIngredient}>Pridať</Button></div>
                        
                    </Form.Field>
                    <Form.Field>
                        <label>Obrázok</label>
                        <div style={{"display":"table"}}>
                            <Button as="label" htmlFor="file" type="button" style={{ width: "100px",float:"left" }}>Nahrať</Button>
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
                    <label>Tagy</label>
                        <Typeahead
                            multiple
                            id="keep-menu-open"
                            onChange={tagOnChange}
                            options={tags}
                            placeholder="Vyberte tag..."
                            ref={typeaheadRef}
                            selected={selectedTag}
                            allowNew
                            />
                    </Form.Field> 
                    <Form.Field>
                        <label className='requiredField'>Popis</label>
                        <TextArea rows="20" value={description} onChange={updateDescription} placeholder='Popis' required={true} error={descriptionError} />
                    </Form.Field> 
                    </Form>
            </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
                <Button type='button' floated='right' onClick={handleCancelView} disabled={isInProgressUpdateBool}>Zrušiť</Button>
                <Button type='button' color="blue" onClick={handleUpdateRecipe.bind(handleUpdateRecipe, false)} disabled={isInProgressUpdateBool}>Uložiť</Button>
                {formError?<p style={{"color":"red","fontSize":"medium","float":"left"}}>{errorMessage}</p>:<div></div>}
            </Modal.Actions>
        </Modal>
        </div>
    )}; 

export default UpdateRecipeModal;