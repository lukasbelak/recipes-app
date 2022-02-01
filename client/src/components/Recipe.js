import React,{useState, useEffect} from 'react';
import style from'./recipe.module.css';
import { Image } from 'semantic-ui-react';
import ViewRecipeModal from './ViewRecipeModal';
import {getImageUrl,getRequestOptions} from '../utils';
import { useHistory } from "react-router-dom";

const Recipe = ({user,recipe,reloadList,showMessage}) =>{

    const [openViewRecipeModal, setOpenViewRecipeModal] = useState(false);
    const [recipeCreatedBy, setRecipeCreatedBy] = useState('');
    // const [loggedUser, setLoggedUser] = useState(null);

     let history = useHistory();

    useEffect(()=>{
      
      const getUser= async () => {
        try{

          const resp = await fetch('/api/users/byid/'+recipe.user_id,getRequestOptions('GET'));
          let user=await resp.json();
debugger;
          if(user){
            // setLoggedUser(user);
            setRecipeCreatedBy(user.firstName + " " + user.lastName);
          } else{
            // setLoggedUser(null);
            setRecipeCreatedBy('');
          }
        }catch(err){
          console.log(err.message);

        //   setLoggedUser(null);
          setRecipeCreatedBy('');

          history.push('/login');
        }
      };
 
      getUser();
    },[history,recipe]);

    const onRecipeClick=(value)=>{
        setOpenViewRecipeModal(value);
      };

      const cancelViewRecipeModal=(isCancel)=>{
          if(isCancel){
              setOpenViewRecipeModal(false);
          }
      };

     recipe.createdBy=recipeCreatedBy;

    return (
        <div key={recipe._id} className={`${style.recipe} hvr-grow`}>
            <h1 className={style.recipe_header} onClick={onRecipeClick.bind(onRecipeClick,true)}>{recipe.name}</h1>
            <Image className={style.recipe_img} src={recipe.img ? getImageUrl(recipe.img) : ''} alt='' onClick={onRecipeClick.bind(onRecipeClick,true)} />
            <ViewRecipeModal
                recipe={recipe}
                user={user}
                openViewRecipeModal = {openViewRecipeModal}
                cancelViewRecipeModal = {cancelViewRecipeModal}
                reloadList={reloadList}
                showMessage={showMessage} />
        </div>
    );
};

export default Recipe;