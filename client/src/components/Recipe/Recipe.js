import React, { useState, useEffect } from "react";
import style from "./recipe.module.css";
import { Image } from "semantic-ui-react";
import ViewRecipeModal from "../Modals/ViewRecipeModal";
import { getImageUrl } from "../../utils";

const breakpoint = 768;

const Recipe = ({ user, recipe, reloadList, showMessage }) => {
  const [openViewRecipeModal, setOpenViewRecipeModal] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(()=>{
    window.addEventListener("resize", () => setWidth(window.innerWidth));
  },[]);

  const onRecipeClick = (value) => {
    setOpenViewRecipeModal(value);
  };

  const cancelViewRecipeModal = (isCancel) => {
    if (isCancel) {
      setOpenViewRecipeModal(false);
    }
  };

  return (
          <div key={recipe._id} className={`${width>breakpoint? style.recipe_desktop: style.recipe_mobile} hvr-grow`}>
            <div className={style.recipe_header}>
            <h2
              style={{paddingLeft:'15px', paddingBottom:'5px', paddingTop:'5px'}}
              onClick={onRecipeClick.bind(onRecipeClick, true)}
            >
              {recipe.name}
            </h2>
            </div>
            <Image
              className={style.recipe_img}
              src={recipe.img ? getImageUrl(recipe.img) : ""}
              alt=""
              onClick={onRecipeClick.bind(onRecipeClick, true)}
            />
            <ViewRecipeModal
              recipe={recipe}
              user={user}
              openViewRecipeModal={openViewRecipeModal}
              cancelViewRecipeModal={cancelViewRecipeModal}
              reloadList={reloadList}
              showMessage={showMessage}
            />
          </div>
  );
};

export default Recipe;
