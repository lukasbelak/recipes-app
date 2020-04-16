import React from 'react';
import style from'./recipe.module.css';

const Recipe = ({name, description, date, ingredients}) => {
    return (
        <div className={style.recipe}>
            <h1>{name}</h1>
            <p>{description}</p>
            <ul>
                {ingredients.map(i=>(
                    <li key={i.name}>{i.name} {i.quantity} {i.unit}</li>
                ))}
            </ul>
            <p>{new Intl.DateTimeFormat('en-GB',{
                year: "numeric",
                month:"long",
                day:"2-digit"
            }).format(new Date(date))}</p>
        </div>
    );
};

export default Recipe;