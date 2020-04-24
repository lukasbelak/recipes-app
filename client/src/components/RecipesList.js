import React, { useEffect, useState } from 'react';
import {Pagination,Dimmer,Loader} from 'semantic-ui-react';
import Recipe from './Recipe';
import style from'./recipeslist.module.css';

const RecipesList =({query,isAscSort,selectedFilter,recipeCreated}) => {

    const [recipes, setRecipes]=useState([]);
    const [totalPages, setTotalPages]=useState(100);
    const [activePage, setActivePage]=useState(1);
    const [isLoading, setIsLoading] =useState(true);

    useEffect(()=>{
        const getRecipes =  async ()=>{
          console.log('getrecipes '+query);
          
          setIsLoading(true);
          window.scrollTo(0, 0);
          let data=[];
    debugger;
          try{
            if(query){
              const resp = await fetch('/api/recipes/bysearch/' + query+"/"+activePage+"/"+selectedFilter+"/"+isAscSort);
              data = await resp.json();
            }else{
              const resp = await fetch('/api/recipes/'+activePage+"/"+selectedFilter+"/"+isAscSort);
              data = await resp.json();
            }
            console.log(data.docs);
    
            setIsLoading(false);
            setRecipes(data.docs);
            setTotalPages(data.totalPages);
            
            console.log('end getrecipes');
          }catch(err){
            console.log(err);
          }
        };
    
        getRecipes();
        console.log('effect run');
      }, [query,recipeCreated,activePage,selectedFilter,isAscSort,setIsLoading]);

      const onPaginationChange=(e, pageInfo)=>{
        setActivePage(pageInfo.activePage);
      };

    return(
        <div>
            <Dimmer active={isLoading} inverted>
                <Loader size='huge'>Loading...</Loader>
            </Dimmer>

            <div className={style.recipes}>
                {recipes.map(recipe => (
                    <Recipe 
                        key={recipe._id} 
                        recipe={recipe}
                    />
                ))}
            </div>

            <div className={!isLoading && recipes.length>0 ? "center show" : "hidden"}>
            <Pagination 
                activePage={activePage}
                onPageChange={onPaginationChange}
                ellipsisItem={null}
                totalPages={totalPages}
            />
            </div>
        </div>
    );
};

export default RecipesList;