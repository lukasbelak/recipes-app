import React from "react";
import { Link } from "react-router-dom";
import NewRecipeModal from "../Modals/NewRecipeModal";
import {
  Dropdown,
  Button,
  Icon,
  Message,
  Grid,
  Container,
  Image,
} from "semantic-ui-react";
import { sortByOptions } from "../../enums";
import RecipesList from "../Recipe/RecipesList";
import logo from "../../images/logo_white.png";

const HomeMobile = ({message, messageVisibility, handleLogoClick, getSearch, search, updateSearch,
    user, openNewRecipeModal, createRecipe, cancelCreateRecipe, showMessage, onChangeSort, handleIsAscSort,
    isAscSort, onChangeCategory, handleLogOut, query, selectedSort, categoryOptions, recipeCreated, selectedCategory }) => {

    return (
        <Container fluid className="App">
        <div className="message">
          <Message
            className={`${messageVisibility} ${
              message.header === "Error" ? "negative" : "positive"
            }`}
          >
            <Message.Header>{message.header}</Message.Header>
            <p>{message.text}</p>
          </Message>
        </div>

        <Container fluid>
          <Grid columns={3} stackable style={{ backgroundColor: "#1b1c1d" }}>
            <Grid.Row>
              <Grid.Column style={{  }}>
                <Container>
                  <Image
                    src={logo}
                    onClick={handleLogoClick}
                  />
                </Container>
              </Grid.Column>
              <Grid.Column textAlign="center">
                <form onSubmit={getSearch} >
                  <div className="ui action input">
                    <input
                      type="text"
                      placeholder="hľadať..."
                      value={search}
                      onChange={updateSearch}
                    />
                    <Button className="ui button blue" type="submit">
                      Vyhľadať
                    </Button>
                  </div>
                </form>
                <NewRecipeModal
                  user={user}
                  openNewRecipeModal={openNewRecipeModal}
                  createRecipe={createRecipe}
                  cancelCreateRecipe={cancelCreateRecipe}
                  showMessage={showMessage}
                />
              </Grid.Column>
              <Grid.Column textAlign="center">
                <span >
                  <Dropdown
                    onChange={onChangeSort}
                    selection
                    options={sortByOptions}
                    defaultValue={sortByOptions[0].value}
                  />
                </span>
                <Button
                  size="medium"
                  color="grey"
                  onClick={handleIsAscSort}
                  style={{
                    height: "38px",
                    margin: "0 10px",
                  }}
                >
                  {isAscSort ? (
                    <Icon name="sort content descending" />
                  ) : (
                    <Icon name="sort content ascending" />
                  )}
                </Button>
                <Dropdown
                  style={{ marginTop:'10px' }}
                  onChange={onChangeCategory}
                  selection
                  options={categoryOptions}
                  defaultValue={categoryOptions[0].value}
                />
              </Grid.Column>
              <Grid.Column >
                <Container className="account-form" textAlign="center">
                  <Grid columns={1} stackable>
                    <Grid.Column>
                      <Button.Group>
                        <Button color="yellow" circular floated="right">
                          {user?.firstName}
                        </Button>
                        <Dropdown
                          className="button icon"
                          floating
                          trigger={<React.Fragment />}
                        >
                          <Dropdown.Menu>
                            <Dropdown.Item
                              style={{
                                display: user?.isAdmin ? "block" : "none",
                              }}
                            >
                              <Button
                                color="blue"
                                content="Admin"
                                fluid
                                as={Link}
                                to="/admin"
                              />
                            </Dropdown.Item>
                            <Dropdown.Item>
                              <Button
                                color="red"
                                content="Odhlásiť"
                                fluid
                                onClick={handleLogOut}
                              />
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </Button.Group>
                    </Grid.Column>
                  </Grid>
                </Container>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>

        <RecipesList
          user={user}
          query={query}
          isAscSort={isAscSort}
          selectedFilter={selectedSort}
          recipeCreated={recipeCreated}
          showMessage={showMessage}
          selectedCategory={selectedCategory}
        />

        <Container
          fluid
          style={{
            backgroundColor: "#1b1c1d",
            color: "white",
            bottom: "0",
            // position: "fixed",
            overflow: "hidden",
          }}
          textAlign="center"
        >
          <Grid>
            <Grid.Row>
              <Grid.Column>
                <p>Powered by RECIPERAPTOR</p>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </Container>
    );
}

export default HomeMobile;