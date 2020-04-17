import React from 'react';
import style from'./recipe.module.css';
import { Image } from 'semantic-ui-react';

const Recipe = ({name, category, description, date, ingredients, img}) => {

    var imgArrByte= Uint8Array.from(Buffer.from(img.data))
    let image = new Blob([imgArrByte], { type: img.contentType });
    let imageUrl = URL.createObjectURL(image);
    debugger;

    return (
        <div className={style.recipe}>
            <h1>{name}</h1>
            <p>{category}</p>
            <p>{description}</p>
            <ul>
                {ingredients.map(i=>(
                    <li key={i.name}>{i.name} {i.quantity} {i.unit}</li>
                ))}
            </ul>
            <div><Image src={imageUrl} alt='' size="medium"/></div>
            <p>{new Intl.DateTimeFormat('en-GB',{
                year: "numeric",
                month:"long",
                day:"2-digit"
            }).format(new Date(date))}</p>
            
        </div>
    );
};

export default Recipe;