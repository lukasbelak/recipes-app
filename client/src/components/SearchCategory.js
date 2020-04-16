import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import { Search } from 'semantic-ui-react';

const SearchCategory =({getCategory})=> {

  const [isLoading, setIsLoading]=useState(false);
  const [results, setResults]=useState([]);
  const [value, setValue]=useState('');
  const [categories, setCategories]=useState([]);
  
  useEffect(()=>{
      getCategories();
  },[]);
  
  const getCategories=async ()=>{
    debugger;
      const resp = await fetch('/api/categories');

      let data = await resp.json();

      let res=[];
      data.forEach(element => {
          res.push({
              title: element.name
          })
      });
      setCategories(res);
  };

  const handleResultSelect = (e, { result }) => {
        setValue(result.title);
        getCategory(result.title);
    };

  const handleSearchChange = (e, { value }) => {
    setIsLoading(true);
    setValue(value);

    setTimeout(() => {
      if (value.length < 1) {
          setIsLoading(false);
          setValue('');
          setResults([]);
      }

      const re = new RegExp(_.escapeRegExp(value), 'i')
      const isMatch = (result) => re.test(result.title)
    setIsLoading(false);
    setResults(_.filter(categories, isMatch));
    }, 300)
  };

    return (
          <Search
            loading={isLoading}
            onResultSelect={handleResultSelect}
            onSearchChange={_.debounce(handleSearchChange, 500, {
              leading: true,
            })}
            results={results}
            value={value}
          />
    )
}

export default SearchCategory;