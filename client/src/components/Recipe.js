import React from 'react';
import style from'./recipe.module.css';

const Recipe = ({name, date}) => {
    return (
        <div className={style.recipe}>
            <h1>{name}</h1>
            <p>{new Intl.DateTimeFormat('en-GB',{
                year: "numeric",
                month:"long",
                day:"2-digit"
            }).format(new Date(date))}</p>
        </div>
    );
};

export default Recipe; //