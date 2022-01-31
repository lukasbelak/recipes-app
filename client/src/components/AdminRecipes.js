import React,{useState,useEffect} from 'react';
import _ from 'lodash';
import {Table,Checkbox,Button,Segment,Dimmer,Loader} from 'semantic-ui-react';
import AdminRecipesRow from './AdminRecipesRow';
import withSelections from "react-item-select";
import { useHistory } from "react-router-dom";

const AdminRecipes=({
    areAnySelected,
    selectedCount,
    handleClearAll,
    areAllSelected,
    areAllIndeterminate,
    handleSelectAll,
    isItemSelected,
    handleSelect,
    selections
  })=>{

    const [column, setColumn]=useState('');
    const [data,setData]=useState([]);
    const [direction,setDirection]=useState('');
    const [isLoading, setIsLoading]=useState(true);
    const [isReload, setIsReload]=useState(0);

    let history=useHistory();

    const segmentStyle = {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      };

    useEffect(()=>{
        const getRecipes =async()=>{
            setIsLoading(true);
          let recipes=[];
          try{
            
          const requestOptions = {
            method: 'GET',
            headers: { 'Authorization': localStorage.getItem('rcp_token') }
          };

            const resp = await fetch('/api/recipes',requestOptions);
            let cats=await resp.json();
            cats.forEach(cat=>{
                recipes.push({
                name:cat.name,
                category:cat.category,
                description:cat.description,
                youtube:cat.youtube,
                ingredients:cat.ingredients,
                createdOn:cat.date,
                id:cat._id
              });
            });
            setData(recipes);
            setIsLoading(false);
            console.log('recipes: '+recipes);
          }catch(err){
            console.log(err.message);
            history.push('/');
          }
        };
    
        getRecipes();
      },[isReload,history]);

      const handleDeleted=()=>{
        setIsReload(isReload+1);
        handleClearAll();
      };

      const handleSort = (clickedColumn) => () => {    
          debugger;
        if (column !== clickedColumn) {
            setColumn(clickedColumn);
            setData(_.sortBy(data, [clickedColumn]));
            setDirection('ascending');
    
            return;
        }
    
        setData(data.reverse());
        setDirection(direction === 'ascending' ? 'descending' : 'ascending');
      }

      const handleDelete=()=>{
        debugger;
        let itemArray=Object.entries(selections);
        let items=[];
        itemArray.forEach(i=>{
            items.push(i[0]);
        });

        const requestOptions = {
            method: 'DELETE',
            headers: { 'Authorization': localStorage.getItem('rcp_token') }
        };

        debugger;

        items.forEach(item=>{
            setIsLoading(true);

            fetch('/api/recipes/'+item, requestOptions)
            .then(resp=>{
                resp.json();
            })
            .then((err)=>{
                setIsLoading(false);
                handleDeleted();
                if(err && err.message){
                    console.log(err.message);
                    history.push('/');
                }
            });
        });
      };

    return (
      <div style={{margin:'auto',width:'900px'}}>
      <Dimmer active={isLoading} inverted>
          <Loader size='huge'>Načítavanie...</Loader>
      </Dimmer>

      <Segment textAlign="left" style={segmentStyle}>
          {!areAnySelected && <span>Zvoľte položky v tabuľke</span>}
          <div style={{ visibility: areAnySelected ? "visible" : "hidden" }}>
              <span style={{ marginRight: "8px" }}>{selectedCount} selected</span>
              <Button basic onClick={handleClearAll}>
                  Vymazať
              </Button>
          </div>
          <div>
              {data.length===1?<span>{data.length} Recept</span>:<span>{data.length} Recepty</span>}
          </div>
      </Segment>
      <Table sortable fixed celled collapsing>
          <Table.Header >
          <Table.Row>
              <Table.HeaderCell width={1} >
                  <Checkbox
                      checked={areAllSelected(data)}
                      indeterminate={areAllIndeterminate(data)}
                      onChange={() => handleSelectAll(data)}
                  />
                  </Table.HeaderCell>
              <Table.HeaderCell width={14} sorted={column === 'name' ? direction : null}onClick={handleSort('name')}>Názov</Table.HeaderCell>
              <Table.HeaderCell width={14} sorted={column === 'category' ? direction : null}onClick={handleSort('categry')}>Kategória</Table.HeaderCell>
              <Table.HeaderCell width={14} sorted={column === 'youtube' ? direction : null}onClick={handleSort('youtube')}>Youtube</Table.HeaderCell>
              <Table.HeaderCell width={14} sorted={column === 'description' ? direction : null}onClick={handleSort('description')}>Popis</Table.HeaderCell>
              <Table.HeaderCell width={14} sorted={column === 'createdOn' ? direction : null}onClick={handleSort('createdOn')}>Vytvorené dňa</Table.HeaderCell>
              <Table.HeaderCell width={1}></Table.HeaderCell>
          </Table.Row>
          </Table.Header>
          <Table.Body>
               {data.map(recipe => (
                   <AdminRecipesRow
                   key={recipe.id}
                   recipe={recipe}
                   isItemSelected={isItemSelected}
                   handleSelect={handleSelect}
                   setIsLoading={setIsLoading}
                   handleDeleted={handleDeleted}
                   />
              ))}
          </Table.Body>
          <Table.Footer fullWidth>
            <Table.Row>
                <Table.HeaderCell />
                <Table.HeaderCell colSpan='6'>
                <Button size='small' color='red' disabled={!areAnySelected} onClick={handleDelete}>Vymazať</Button>
                </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
      </Table>
  </div>
    );
};

export default withSelections(AdminRecipes);