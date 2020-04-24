import React, { useState } from 'react';
import './App.css';
import NewRecipeModal from './components/NewRecipeModal';
import {Dropdown,Button, Icon,Message} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import {sortByOptions} from './enums';
import RecipesList from './components/RecipesList';

const App=()=> {

  const [search, setSearch]=useState('');
  const [query, setQuery]=useState('');
  const [recipeCreated, setRecipeCreated]=useState(false);
  const [openNewRecipeModal, setOpenNewRecipeModal] = useState(false);
  const [selectedFilter, setSelectedFilter]=useState(sortByOptions[0].text);
  const [isAscSort, setIsAscSort] = useState(true); 
  const [message, setMessage]=useState({});
  const [messageVisibility,setMessageVisibility]=useState('hidden');

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

  const onChangeFilter=(e)=>{
    debugger;
    let selectedValue = e.target.textContent;
    setSelectedFilter(selectedValue);
  }

  const handleIsAscSort=()=>{
    debugger;
    if(isAscSort===true){
      setIsAscSort(false);
    } else{
      setIsAscSort(true);
    }
  };

  const showMessage=(value)=>{
    setMessageVisibility('visible');
    setMessage(value);
    setTimeout(function(){
      setMessageVisibility('hidden');
      setMessage({});
    }, 5000);
  };

  return (
    <div className="App">

      <div className="message">
        <Message className={`${messageVisibility} ${message.header==='Error' ? 'negative' : 'positive'}`} >
          <Message.Header>{message.header}</Message.Header>
          <p>{message.text}</p>
        </Message>
      </div>

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
          showMessage={showMessage} />
        <span style={{"margin": "10px 5px"}}> 
          <Dropdown onChange={onChangeFilter}
          button 
          labeled 
          text='Filter'
          icon='filter'   
          className='icon' 
          options={sortByOptions}
          defaultValue={sortByOptions[0].value} 
          />
        </span>
        <Button size="small" color="grey" onClick={handleIsAscSort}>
          {isAscSort?<Icon name="sort content descending" />:<Icon name="sort content ascending" />}
        </Button>
      </form>

      <RecipesList
        query={query}
        isAscSort={isAscSort}
        selectedFilter={selectedFilter}
        recipeCreated={recipeCreated}
        />

    </div>
  );
}

export default App;
