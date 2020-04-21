import React,{useState} from 'react';
import style from'./recipe.module.css';
import { Image, Embed, Button } from 'semantic-ui-react';
import ViewRecipeModal from './ViewRecipeModal';

const Recipe = ({recipe}) =>{

    // debugger;
    var imgArrByte= Uint8Array.from(Buffer.from(recipe.img.data))
    let image = new Blob([imgArrByte], { type: recipe.img.contentType });
    let imageUrl = URL.createObjectURL(image);

    const [openViewRecipeModal, setOpenViewRecipeModal] = useState(false);

    const onRecipeClick=(value)=>{
        setOpenViewRecipeModal(value);
      };

      const cancelViewRecipeModal=()=>{
          setOpenViewRecipeModal(false);
      }

    return (
        <div key={recipe._id} className={style.recipe}>
            <h1 onClick={onRecipeClick.bind(onRecipeClick,true)} style={{"position":"absolute","z-index":"1","color":"white"}}>{recipe.name}</h1>
            {/* <p>{recipe.category}</p>
            <p>{recipe.description}</p>
            <ul>
                {recipe.ingredients.map(i=>(
                    <li key={i.name}>{i.name} {i.quantity} {i.unit}</li>
                ))}
            </ul> */}
            <div><Image src={imageUrl} alt='' size='large' onClick={onRecipeClick.bind(onRecipeClick,true)} /></div>
            {/* <p>{recipe.youtube}</p>
            <div>
            <Embed
                    id={recipe.youtube}
                    source='youtube'
                /></div>
            <p>{new Intl.DateTimeFormat('en-GB',{
                year: "numeric",
                month:"long",
                day:"2-digit"
            }).format(new Date(recipe.date))}</p> */}
            <ViewRecipeModal
                recipe={recipe}
                openViewRecipeModal = {openViewRecipeModal}
                cancelViewRecipeModal = {cancelViewRecipeModal} />
        </div>
    );
};

export default Recipe;