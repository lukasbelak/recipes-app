import React, { useState } from "react";
import { Container, Menu, Responsive, Image,Grid } from "semantic-ui-react";
import AdminCategories from "../components/Admin/AdminCategories";
import AdminRecipes from "../components/Admin/AdminRecipes";
import AdminTags from "../components/Admin/AdminTags";
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
    history.push("/");
  };

  /* jshint ignore:start */
  return (
    <div>
      <Responsive>
        <Menu fixed="top" inverted>
          <Container >
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

        
        <Grid stackable>
        <Grid.Row columns={1}>
          <Grid.Column>
        <Container
          style={
            isCategoriesVisible
              ? { display: "block", marginTop: "8em" }
              : { display: "none" }
          }
        >
          <AdminCategories />
        </Container>
          </Grid.Column>
          </Grid.Row>
          </Grid>

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
  /* jshint ignore:end */
};

export default Admin;
