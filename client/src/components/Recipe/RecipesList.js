import React, { useEffect, useState } from "react";
import { Pagination, Dimmer, Loader, Container, Grid } from "semantic-ui-react";
import Recipe from "./Recipe";
import style from "./recipeslist.module.css";
import { useHistory } from "react-router-dom";

const breakpoint = 768;

const RecipesList = ({
  width,
  user,
  query,
  isAscSort,
  selectedFilter,
  recipeCreated,
  showMessage,
  selectedCategory,
}) => {
  const [recipes, setRecipes] = useState([]);
  const [totalPages, setTotalPages] = useState(100);
  const [activePage, setActivePage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefresh, setIsRefresh] = useState(1);

  let history = useHistory();

  useEffect(() => {
    const getRecipes = async () => {
      console.log("getrecipes " + query);

      setIsLoading(true);
      window.scrollTo(0, 0);
      let data = [];

      const requestOptions = {
        method: "GET",
        headers: { Authorization: localStorage.getItem("rcp_token") },
      };

      try {
        if (query) {
          const resp = await fetch(
            "/api/recipes/bysearch/" +
              query +
              "/" +
              activePage +
              "/" +
              selectedFilter +
              "/" +
              isAscSort +
              "/" +
              selectedCategory,
            requestOptions
          );
          data = await resp.json();
        } else {
          const resp = await fetch(
            "/api/recipes/" +
              activePage +
              "/" +
              selectedFilter +
              "/" +
              isAscSort +
              "/" +
              selectedCategory,
            requestOptions
          );
          data = await resp.json();
        }
        console.log(data.docs);

        setIsLoading(false);
        setRecipes(data.docs);
        setTotalPages(data.totalPages);

        console.log("end getrecipes");
      } catch (err) {
        console.log(err);
        history.push("/login");
      }
    };

    getRecipes();
    console.log("effect run");
  }, [
    query,
    recipeCreated,
    activePage,
    selectedFilter,
    isAscSort,
    setIsLoading,
    isRefresh,
    selectedCategory,
    history,
  ]);

  const onPaginationChange = (e, pageInfo) => {
    setActivePage(pageInfo.activePage);
  };

  const reloadList = () => {
    setIsRefresh(isRefresh + 1);
  };

// debugger;

  /* jshint ignore:start */
  return (
    <Container fluid>
      <Dimmer active={isLoading} inverted>
        <Loader size="huge">Načítavanie...</Loader>
      </Dimmer>

      <Grid>
        <Grid.Row>
          <Grid.Column>
              <div className={width > breakpoint? style.recipes_desktop:style.recipes_mobile}>
                {recipes.map((recipe) => (
                  <Recipe
                    key={recipe._id}
                    width={width}
                    user={user}
                    recipe={recipe}
                    reloadList={reloadList}
                    showMessage={showMessage}
                  />
                ))}
              </div>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column textAlign="center"
              className={
                !isLoading && recipes.length > 0 && totalPages > 1
                  ? "center show"
                  : "hidden"
              }>
              <Pagination
                activePage={activePage}
                onPageChange={onPaginationChange}
                ellipsisItem={null}
                totalPages={totalPages}
              />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
  /* jshint ignore:end */
};

export default RecipesList;
