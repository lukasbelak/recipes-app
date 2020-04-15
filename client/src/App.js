import React, { useEffect, useState } from 'react';
import './App.css';
import Recipe from './components/Recipe';

function App() {

  const [recipes, setRecipes]=useState([]);
  const [search, setSearch]=useState('');
  const [query, setQuery]=useState('');

  useEffect(()=>{
    getRecipes(query);
    console.log('effect run');
  }, [query]);

  const getRecipes =async (filter)=>{
    console.log('getrecipes '+filter);
    let data=[];
    if(filter){
      const resp = await fetch('/api/recipes/' + filter);
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

  return (
    <div className="App">
      <form className="search-form" onSubmit={getSearch}>
        <input className="search-bar" type="text" value={search} onChange={updateSearch} />
        <button className="search-button" type="submit" >Search</button>

      </form>
      <div className="recipes">
        {recipes.map(recipe => (
          <Recipe key={recipe.name} name= {recipe.name} date= {recipe.date} />
        ))}
      </div>
    </div>
  );
}

export default App;
