import React, { useEffect, useState } from 'react';
import './App.css';
import Recipe from './components/Recipe';
import NewRecipeModal from './components/NewRecipeModal';
//import {Grid} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css'

const App=()=> {

  const [recipes, setRecipes]=useState([]);
  const [search, setSearch]=useState('');
  const [query, setQuery]=useState('');
  const [recipeCreated, setRecipeCreated]=useState(false);
  const [openNewRecipeModal, setOpenNewRecipeModal] = useState(false);

  useEffect(()=>{
    getRecipes(query);
    console.log('effect run');
  }, [query,recipeCreated]);

  const getRecipes =async (filter)=>{
    console.log('getrecipes '+filter);
    let data=[];
    if(filter){
      const resp = await fetch('/api/recipes/byfilter/' + filter);
      data = await resp.json();
    }else{
      const resp = await fetch('/api/recipes');
      data = await resp.json();
    }
    console.log(data);
    setRecipes(data);
    console.log('end getrecipes');
  };

  const updateSearch = (e)=>{
    setSearch(e.target.value);
  };

  const getSearch = (e) => {
    e.preventDefault();
    setQuery(search);
    setSearch('');
  };

  const createRecipe=(value)=>{
    setOpenNewRecipeModal(value);
    setRecipeCreated(value);
  };

  const cancelCreateRecipe=()=>{
    setOpenNewRecipeModal(false);
  };

  return (
    <div className="App">

      <form className="search-form" onSubmit={getSearch}>
      
        <div className="ui action input">
          <input type="text" placeholder="Search..." value={search} onChange={updateSearch} />
          <button className="ui button blue" type="submit">Search</button>
        </div>
        <NewRecipeModal 
          className="new-recipe-button"
          openNewRecipeModal={openNewRecipeModal}
          createRecipe={createRecipe}
          cancelCreateRecipe={cancelCreateRecipe}
          newRecipeRef={React.createRef()} />
      </form>

      <div className="recipes">
        {recipes.map(recipe => (
            <Recipe 
              key={recipe._id} 
              recipe={recipe}
              />
        ))}
      </div>

    </div>
  );
}

export default App;
