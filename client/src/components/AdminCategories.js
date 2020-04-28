import React, { useState,useEffect } from 'react';
import _ from 'lodash';
import {Table,Checkbox,Button,Icon,Dimmer,Loader,Segment} from 'semantic-ui-react';
import AdminCategoriesRow from './AdminCategoriesRow';
import withSelections from "react-item-select";

const AdminCategories=({
    areAnySelected,
    selectedCount,
    handleClearAll,
    areAllSelected,
    areAllIndeterminate,
    handleSelectAll,
    isItemSelected,
    handleSelect
  })=>{

    const [column, setColumn]=useState('');
    const [data,setData]=useState([]);
    const [direction,setDirection]=useState('');
    const [isDeleteDisabled, setIsDeleteDisabled]=useState(true);
    const [isLoading, setIsLoading]=useState(true);
    const [wasDeleted, setWasDeleted]=useState(0);
    
    const segmentStyle = {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      };

    useEffect(()=>{
        const getCategories =async()=>{
            setIsLoading(true);
          let categories=[];
          try{
            const resp = await fetch('/api/categories');
            let cats=await resp.json();
            cats.forEach(cat=>{
                categories.push({
                name:cat.name,
                id:cat._id
              });
            });
            setData(categories);
            setIsLoading(false);
            console.log('categories: '+categories);
          }catch(err){
            console.log(err.message);
          }
        };
    
        getCategories();
      },[wasDeleted]);

      const handleDeleted=()=>{
        setWasDeleted(wasDeleted+1);
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

    return (
        <div>
            <Dimmer active={isLoading} inverted>
                <Loader size='huge'>Loading...</Loader>
            </Dimmer>

            <Segment textAlign="left" style={segmentStyle}>
                {!areAnySelected && <span>Select items in the table below</span>}
                <div style={{ visibility: areAnySelected ? "visible" : "hidden" }}>
                    <span style={{ marginRight: "8px" }}>{selectedCount} selected</span>
                    <Button basic onClick={handleClearAll}>
                        Clear
                    </Button>
                </div>
                <div>
                    <span>{data.length} Categories</span>
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
                    <Table.HeaderCell width={14} sorted={column === 'name' ? direction : null}onClick={handleSort('name')}>Name</Table.HeaderCell>
                    <Table.HeaderCell width={1}></Table.HeaderCell>
                </Table.Row>
                </Table.Header>
                <Table.Body>
                     {data.map(category => (
                         <AdminCategoriesRow
                         category={category}
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
                    <Table.HeaderCell colSpan='4'>
                    <Button
                        floated='right'
                        icon
                        labelPosition='left'
                        color='green'
                        size='small'
                    >
                        <Icon name='add' /> New Category
                    </Button>
                    <Button size='small' color='red' disabled={!areAnySelected}>Delete</Button>
                    </Table.HeaderCell>
                </Table.Row>
                </Table.Footer>
            </Table>
        </div>
    );
};

export default withSelections(AdminCategories);