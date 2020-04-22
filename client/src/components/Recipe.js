import React,{useState} from 'react';
import style from'./recipe.module.css';
import { Image } from 'semantic-ui-react';
import ViewRecipeModal from './ViewRecipeModal';
import {getImageUrl} from '../utils';

const Recipe = ({recipe}) =>{

    const [openViewRecipeModal, setOpenViewRecipeModal] = useState(false);

    const onRecipeClick=(value)=>{
        setOpenViewRecipeModal(value);
      };

      const cancelViewRecipeModal=()=>{
          setOpenViewRecipeModal(false);
      }

    return (
        <div key={recipe._id} className={style.recipe}>
            <h1 className={style.recipe_header} onClick={onRecipeClick.bind(onRecipeClick,true)}>{recipe.name}</h1>
            <Image className={style.recipe_img} src={getImageUrl(recipe.img)} alt=''  onClick={onRecipeClick.bind(onRecipeClick,true)} />
            <ViewRecipeModal
                recipe={recipe}
                openViewRecipeModal = {openViewRecipeModal}
                cancelViewRecipeModal = {cancelViewRecipeModal} />
        </div>
    );
};

export default Recipe;