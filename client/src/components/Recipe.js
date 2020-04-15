import React from 'react';
import style from'./recipe.module.css';

const Recipe = ({name, date}) => {
    return (
        <div className={style.recipe}>
            <h1>{name}</h1>
            <p>{date}</p>
        </div>
    );
};

export default Recipe; //