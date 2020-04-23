import React, { useEffect, useState, useCallback } from 'react';
import './App.css';
import Recipe from './components/Recipe';
import NewRecipeModal from './components/NewRecipeModal';
import {Dimmer, Loader, Pagination} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css'

const App=()=> {

  const [recipes, setRecipes]=useState([]);
  const [search, setSearch]=useState('');
  const [query, setQuery]=useState('');
  const [recipeCreated, setRecipeCreated]=useState(false);
  const [openNewRecipeModal, setOpenNewRecipeModal] = useState(false);
  const [isLoading, setIsLoading] =useState(true);
  const [activePage, setActivePage]=useState(1);
  const [apiRecipesUrl, setApiRecipesUrl]=useState('/api/recipes');

  useEffect(()=>{
    const getRecipes =  async ()=>{
      console.log('getrecipes '+query);
  
      setIsLoading(true);
      let data=[];
  
      if(query){
        //setApiRecipesUrl('/api/recipes/byfilter/' + filter);
        const resp = await fetch('/api/recipes/byfilter/' + query);
        data = await resp.json();
      }else{
        //setApiRecipesUrl('/api/recipes');
        const resp = await fetch('/api/recipes');
        data = await resp.json();
      }
      console.log(data);
      setIsLoading(false);
      setRecipes(data);
      console.log('end getrecipes');
    };

    getRecipes();
    console.log('effect run');
  }, [query,recipeCreated]);

  

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

  const onPaginationChange=(e, pageInfo)=>{
    setActivePage(pageInfo.activePage);
    // implement pagination o backend
  };

  return (
    <div className="App">

      <Dimmer active={isLoading} inverted>
        <Loader size='huge'>Loading...</Loader>
      </Dimmer>

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

        <div className="center">
          <Pagination 
            activePage={activePage}
            onPageChange={onPaginationChange}
            ellipsisItem={null}
            totalPages={100}
          />
        </div>

    </div>
  );
}

export default App;
