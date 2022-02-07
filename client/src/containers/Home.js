import React, { useState, useEffect, Component } from "react";
import PropTypes from "prop-types";
import { sortByOptions } from "../enums";
import { useHistory } from "react-router-dom";
import { getLoggedUser } from "../utils";
import { createMedia } from "@artsy/fresnel";
import HomeDesktop from '../components/Home/HomeDesktop';
import HomeMobile from '../components/Home/HomeMobile';

const breakpoint = 768;

const { MediaContextProvider, Media } = createMedia({
  breakpoints: {
    mobile: 0,
    tablet: 768,
    computer: 1024,
  },
});

class DesktopContainer extends Component {
  
  constructor() {
    super();
    this.state = {
      
    };
  }

  render() {

    return <Media greaterThan="mobile">
      <HomeDesktop width={this.props.width}
        message={this.props.message} messageVisibility={this.props.messageVisibility} handleLogoClick={this.props.handleLogoClick} 
        getSearch={this.props.getSearch} search={this.props.search} updateSearch={this.props.updateSearch} user={this.props.user}
        openNewRecipeModal={this.props.openNewRecipeModal} createRecipe={this.props.createRecipe} cancelCreateRecipe={this.props.cancelCreateRecipe}
        showMessage={this.props.showMessage} onChangeSort={this.props.onChangeSort} handleIsAscSort={this.props.handleIsAscSort}
        isAscSort={this.props.isAscSort} onChangeCategory={this.props.onChangeCategory} handleLogOut={this.props.handleLogOut} query={this.props.query}
        selectedSort={this.props.selectedSort} categoryOptions={this.props.categoryOptions} recipeCreated={this.props.recipeCreated} selectedCategory={this.props.selectedCategory} />
      </Media>;
  }
}

DesktopContainer.propTypes = {
  children: PropTypes.node,
};

class MobileContainer extends Component {
  constructor() {
    super();
    this.state = {
      
    };
  }

  render() {

    return <Media at="mobile">
       <HomeMobile width={this.props.width}
        message={this.props.message} messageVisibility={this.props.messageVisibility} handleLogoClick={this.props.handleLogoClick} 
        getSearch={this.props.getSearch} search={this.props.search} updateSearch={this.props.updateSearch} user={this.props.user}
        openNewRecipeModal={this.props.openNewRecipeModal} createRecipe={this.props.createRecipe} cancelCreateRecipe={this.props.cancelCreateRecipe}
        showMessage={this.props.showMessage} onChangeSort={this.props.onChangeSort} handleIsAscSort={this.props.handleIsAscSort}
        isAscSort={this.props.isAscSort} onChangeCategory={this.props.onChangeCategory} handleLogOut={this.props.handleLogOut} query={this.props.query}
        selectedSort={this.props.selectedSort} categoryOptions={this.props.categoryOptions} recipeCreated={this.props.recipeCreated} selectedCategory={this.props.selectedCategory} />
      </Media>;
  }
}

MobileContainer.propTypes = {
  children: PropTypes.node,
};

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
  const [width, setWidth] = useState(window.innerWidth);

  let history = useHistory();

  useEffect(()=>{
    window.addEventListener("resize", () => setWidth(window.innerWidth));
  },[]);

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
        history.push("/login");
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
        history.push("/login");
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
    let selectedValue = data.value;
    setSelectedCategory(selectedValue);
  };

  const handleLogOut = () => {
    localStorage.removeItem("rcp_userName");
    localStorage.removeItem("rcp_token");
    fetch("/api/users/logout");

    history.push("/login");
  };

  const handleLogoClick = () => {
    history.push("/");
  };

  return (
    <MediaContextProvider>
      {width > breakpoint ? (
        <DesktopContainer
          width={width} message={message} messageVisibility={messageVisibility} handleLogoClick={handleLogoClick} 
          getSearch={getSearch} search={search} updateSearch={updateSearch} user={user}
          openNewRecipeModal={openNewRecipeModal} createRecipe={createRecipe} cancelCreateRecipe={cancelCreateRecipe}
          showMessage={showMessage} onChangeSort={onChangeSort} handleIsAscSort={handleIsAscSort}
          isAscSort={isAscSort} onChangeCategory={onChangeCategory} handleLogOut={handleLogOut} query={query}
          selectedSort={selectedSort} categoryOptions={categoryOptions} recipeCreated={recipeCreated} selectedCategory={selectedCategory}>
        </DesktopContainer>):(
        <MobileContainer
          width={width} message={message} messageVisibility={messageVisibility} handleLogoClick={handleLogoClick} 
          getSearch={getSearch} search={search} updateSearch={updateSearch} user={user}
          openNewRecipeModal={openNewRecipeModal} createRecipe={createRecipe} cancelCreateRecipe={cancelCreateRecipe}
          showMessage={showMessage} onChangeSort={onChangeSort} handleIsAscSort={handleIsAscSort}
          isAscSort={isAscSort} onChangeCategory={onChangeCategory} handleLogOut={handleLogOut} query={query}
          selectedSort={selectedSort} categoryOptions={categoryOptions} recipeCreated={recipeCreated} selectedCategory={selectedCategory}>
        </MobileContainer>)}
  </MediaContextProvider>
  );
};

export default Home;
