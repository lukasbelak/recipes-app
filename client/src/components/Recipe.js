import React from 'react';
import style from'./recipe.module.css';
import { Image, Embed } from 'semantic-ui-react';

const Recipe = ({recipe}) =>{

    var imgArrByte= Uint8Array.from(Buffer.from(recipe.img.data))
    let image = new Blob([imgArrByte], { type: recipe.img.contentType });
    let imageUrl = URL.createObjectURL(image);

    const onRecipeClick=(e)=>{
        debugger;
      };

    return (
        <div key={recipe._id} className={style.recipe} onClick={onRecipeClick}>
            <h1>{recipe.name}</h1>
            <p>{recipe.category}</p>
            <p>{recipe.description}</p>
            <ul>
                {recipe.ingredients.map(i=>(
                    <li key={i.name}>{i.name} {i.quantity} {i.unit}</li>
                ))}
            </ul>
            <div><Image src={imageUrl} alt='' size="medium"/></div>
            <p>{recipe.youtube}</p>
            <Embed
                    id={recipe.youtube}
                    source='youtube'
                />
            <p>{new Intl.DateTimeFormat('en-GB',{
                year: "numeric",
                month:"long",
                day:"2-digit"
            }).format(new Date(recipe.date))}</p>
            
        </div>
    );
};

export default Recipe;