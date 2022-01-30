import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import { Dropdown } from 'semantic-ui-react';
import {getSeasonsList}from '../utils';

const SeasonList =({defaultValue,getSeason})=> {
    
  const [value, setValue]=useState(defaultValue);
  const [seasons, setSeasons]=useState([]);
  
  useEffect(()=>{
    getSeasons();
  },[]);
  
  useEffect(()=>{
    setValue(defaultValue);
  },[defaultValue]);

  const handleOnChange = (e, { value }) => {
      debugger;
    // setIsLoading(true);
    setValue(value);
    getSeason(value);
  };

  const getSeasons=() => { 
      setSeasons(getSeasonsList());
    };

    return (
          <Dropdown placeholder='Zvoľte obdobie' options={seasons} value={value} onChange={handleOnChange}
          />
    )
}

export default SeasonList;