import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NewRecipeModal from "../components/NewRecipeModal";
import {
  Dropdown,
  Button,
  Icon,
  Message,
  Grid,
  Segment,
  Container,
  GridColumn,
} from "semantic-ui-react";
import { sortByOptions } from "../enums";
import RecipesList from "../components/RecipesList";
import { useHistory } from "react-router-dom";
import { getLoggedUser } from "../utils";

const Home = () => {
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [recipeCreated, setRecipeCreated] = useState(false);
  const [openNewRecipeModal, setOpenNewRecipeModal] = useState(false);
  const [selectedSort, setSelectedSort] = useState(sortByOptions[0].value);
  const [categoryOptions, setCategoryOptions] = useState([
    { key: "All", text: "Všetky", value: "All" },
  ]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isAscSort, setIsAscSort] = useState(true);
  const [message, setMessage] = useState({});
  const [messageVisibility, setMessageVisibility] = useState("hidden");
  const [user, setUser] = useState(null);

  let history = useHistory();

  useEffect(() => {
    const getUser = async () => {
      try {
        let user = await getLoggedUser();

        if (user) {
          setUser(user);
        } else {
          setUser("");
        }
      } catch (err) {
        console.log(err.message);
        setUser("");
        history.push("/");
      }
    };

    getUser();
  }, [history]);

  useEffect(() => {
    const getCategories = async () => {
      let data = [{ key: "All", text: "Všetky", value: "All" }];
      try {
        const requestOptions = {
          method: "GET",
          headers: { Authorization: localStorage.getItem("rcp_token") },
        };

        const resp = await fetch("/api/categories", requestOptions);
        let cats = await resp.json();
        cats.forEach((cat) => {
          data.push({
            key: cat.name,
            text: cat.name,
            value: cat.name,
          });
        });
        setCategoryOptions(data);
      } catch (err) {
        console.log(err.message);
        history.push("/");
      }
    };

    getCategories();
  }, [history]);

  const updateSearch = (e) => {
    setSearch(e.target.value);
  };

  const getSearch = (e) => {
    e.preventDefault();
    setQuery(search);
    setSearch("");
  };

  const createRecipe = (value) => {
    setOpenNewRecipeModal(value);
    setRecipeCreated(value);
  };

  const cancelCreateRecipe = () => {
    setOpenNewRecipeModal(false);
  };

  const onChangeSort = (e) => {
    debugger;
    let selectedValue = e.currentTarget.id;
    setSelectedSort(selectedValue);
  };

  const handleIsAscSort = () => {
    if (isAscSort === true) {
      setIsAscSort(false);
    } else {
      setIsAscSort(true);
    }
  };

  const showMessage = (value) => {
    setMessageVisibility("visible");
    setMessage(value);
    setTimeout(function () {
      setMessageVisibility("hidden");
      setMessage({});
    }, 5000);
  };

  const onChangeCategory = (e, data) => {
    debugger;
    let selectedValue = data.value;
    setSelectedCategory(selectedValue);
  };

  const handleLogOut = () => {
    localStorage.removeItem("rcp_userName");
    localStorage.removeItem("rcp_token");
    fetch("/api/users/logout");

    history.push("/");
  };

  return (
    <div className="App">
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

      <Grid columns={3} stackable>
        {/* <Grid.Row> */}
        <Grid.Column style={{ width: "20%" }}></Grid.Column>

        <Grid.Column style={{ width: "60%" }}>
          <Container className="search-form">
            <Grid columns={2} stackable>
              <Grid.Column>
                <Grid>
                  <Grid.Column style={{ textAlign: "left", width: "80%" }}>
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
                      user={user}
                      openNewRecipeModal={openNewRecipeModal}
                      createRecipe={createRecipe}
                      cancelCreateRecipe={cancelCreateRecipe}
                      showMessage={showMessage}
                    />
                  </Grid.Column>
                </Grid>
              </Grid.Column>
              <Grid.Column>
                <Grid>
                  <Grid.Column>
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
                        height: "38px",
                        float: "left",
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
                      style={{ display: "flex" }}
                      onChange={onChangeCategory}
                      selection
                      options={categoryOptions}
                      defaultValue={categoryOptions[0].value}
                    />
                  </Grid.Column>
                </Grid>
              </Grid.Column>
            </Grid>
          </Container>
        </Grid.Column>

        <Grid.Column style={{ width: "20%" }}>
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
                        style={{ display: user?.isAdmin ? "block" : "none" }}
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
        {/* </Grid.Row> */}
      </Grid>
      <RecipesList
        user={user}
        query={query}
        isAscSort={isAscSort}
        selectedFilter={selectedSort}
        recipeCreated={recipeCreated}
        showMessage={showMessage}
        selectedCategory={selectedCategory}
      />
    </div>
  );
};

export default Home;
