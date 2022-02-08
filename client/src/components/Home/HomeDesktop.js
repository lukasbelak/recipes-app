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

const HomeDesktop = ({width, message, messageVisibility, handleLogoClick, getSearch, search, updateSearch,
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

        <Container fluid >
          <Grid columns={3} stackable style={{ backgroundColor: "#1b1c1d" }}>
            <Grid.Row>
              <Grid.Column width={4} style={{ alignSelf: "flex-end" }}>
                <Container>
                  <Image
                    size="small"
                    src={logo}
                    onClick={handleLogoClick}
                    style={{ marginLeft: "15px" }}
                  />
                </Container>
              </Grid.Column>
              <Grid.Column width={4} style={{ alignSelf: "flex-end" }}>
                <form onSubmit={getSearch} style={{ float: "left" }}>
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
                  width={width}
                  user={user}
                  openNewRecipeModal={openNewRecipeModal}
                  createRecipe={createRecipe}
                  cancelCreateRecipe={cancelCreateRecipe}
                  showMessage={showMessage}
                />
              </Grid.Column>
              <Grid.Column width={4} style={{ alignSelf: "flex-end" }}>
                <span style={{ float: "left" }}>
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
                    // height: "38px",
                    float: "left",
                    margin: "0 10px",
                    lineHeight:'normal'
                  }}
                >
                  {isAscSort ? (
                    <Icon name="sort content descending" />
                  ) : (
                    <Icon name="sort content ascending" />
                  )}
                </Button>
                <Dropdown
                //   style={{ display: "flex" }}
                  onChange={onChangeCategory}
                  selection
                  options={categoryOptions}
                  defaultValue={categoryOptions[0].value}
                />
              </Grid.Column>
              <Grid.Column width={4} style={{ alignSelf: "flex-end" }}>
                <Container className="account-form">
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
          width={width}
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
            position: "fixed",
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

export default HomeDesktop;