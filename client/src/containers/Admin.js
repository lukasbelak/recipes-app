import React, { useState } from "react";
import { Container, Menu, Responsive, Image } from "semantic-ui-react";
import AdminCategories from "../components/AdminCategories";
import AdminRecipes from "../components/AdminRecipes";
import AdminTags from "../components/AdminTags";
import "./Admin.css";
import logo from "../images/logo_white.png";
import { useHistory } from "react-router-dom";

const Admin = () => {
  const [isCategoriesVisible, setIsCategoriesVisible] = useState(true);
  const [isTagsVisible, setIsTagsVisible] = useState(false);
  const [isRecipesVisible, setIsRecipesVisible] = useState(false);

  let history = useHistory();

  const handleCategoriesClick = () => {
    setIsCategoriesVisible(true);
    setIsRecipesVisible(false);
    setIsTagsVisible(false);
  };

  const handleTagsClick = () => {
    setIsCategoriesVisible(false);
    setIsTagsVisible(true);
    setIsRecipesVisible(false);
  };

  const handleRecipesClick = () => {
    setIsCategoriesVisible(false);
    setIsTagsVisible(false);
    setIsRecipesVisible(true);
  };

  const handleLogoClick = () => {
    debugger;
    history.push("/");
  };

  return (
    <div>
      <Responsive>
        <Menu fixed="top" inverted>
          <Container>
            <Menu.Item>
              <Image size="small" src={logo} onClick={handleLogoClick} />
            </Menu.Item>
            <Menu.Item as="a" onClick={handleCategoriesClick}>
              Kategórie
            </Menu.Item>
            <Menu.Item as="a" onClick={handleTagsClick}>
              Tagy
            </Menu.Item>
            <Menu.Item as="a" onClick={handleRecipesClick}>
              Recepty
            </Menu.Item>
          </Container>
        </Menu>

        <Container
          style={
            isCategoriesVisible
              ? { display: "block", marginTop: "8em" }
              : { display: "none" }
          }
        >
          <AdminCategories />
        </Container>

        <Container
          style={
            isTagsVisible
              ? { display: "block", marginTop: "8em" }
              : { display: "none" }
          }
        >
          <AdminTags />
        </Container>

        <Container
          style={
            isRecipesVisible
              ? { display: "block", marginTop: "8em" }
              : { display: "none" }
          }
        >
          <AdminRecipes />
        </Container>
      </Responsive>
    </div>
  );
};

export default Admin;
