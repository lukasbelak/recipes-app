import _ from "lodash";
import React, { useState, useEffect } from "react";
import { Search } from "semantic-ui-react";

const SearchCategory = ({
  defaultValue,
  getCategory,
  categoryError,
  isNewCategory,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [value, setValue] = useState(defaultValue);
  const [categories, setCategories] = useState([]);
  const [isCategoryError, setIsCategoryError] = useState(categoryError);

  useEffect(() => {
    getCategories();
  }, [isNewCategory]);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const getCategories = async () => {
    const requestOptions = {
      method: "GET",
      headers: { Authorization: localStorage.getItem("rcp_token") },
    };

    const resp = await fetch("/api/categories", requestOptions);

    let data = await resp.json();

    let res = [];
    data.forEach((element) => {
      res.push({ title: element.name });
    });
    setCategories(res);
    setResults(res);
  };

  const handleResultSelect = (e, { result }) => {
    setValue(result.title);
    getCategory(result.title);
  };

  const handleSearchChange = (e, { value }) => {
    setIsLoading(true);
    setValue(value);
    getCategory(value);
    if (value === "") {
      setIsCategoryError(true);
    }

    setTimeout(() => {
      if (value.length < 1) {
        setIsLoading(false);
        setValue("");
        setResults([]);
      }

      const re = new RegExp(_.escapeRegExp(value), "i");
      const isMatch = (result) => re.test(result.title);

      setIsLoading(false);
      setResults(_.filter(categories, isMatch));
    }, 300);
  };

  return (
    <Search
      className={`${
        isCategoryError && value === "" ? "error" : ""
      } required field category-search`}
      loading={isLoading}
      onResultSelect={handleResultSelect}
      onSearchChange={_.debounce(handleSearchChange, 500, {
        leading: true,
      })}
      results={results}
      value={value}
      minCharacters={0}
    />
  );
};

export default SearchCategory;
