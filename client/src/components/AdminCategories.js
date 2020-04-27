import React, { useState,useEffect } from 'react';
import _ from 'lodash';
import {Table,Checkbox,Button,Icon,Dimmer,Loader} from 'semantic-ui-react';
import AdminCategoriesRow from './AdminCategoriesRow';

const AdminCategories=()=>{

    const [column, setColumn]=useState('');
    const [data,setData]=useState([]);
    const [direction,setDirection]=useState('');
    const [isDeleteDisabled, setIsDeleteDisabled]=useState(true);
    const [checkedCategories, setCheckedCateories]=useState([]); 
    const [isLoading, setIsLoading]=useState(true);
    const [wasDeleted, setWasDeleted]=useState(0);
    const [isCheckedAll, setIsCheckedAll]=useState(false);
    
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
                checked:false
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

      const handleChecked=(isChecked,name)=>{
          debugger;
          let cat = {name:name};
          if(isChecked){
            setCheckedCateories([...checkedCategories, cat]);
            setIsDeleteDisabled(false);
          }else{
            for (var i = checkedCategories.length - 1; i >= 0; --i) {
                if (checkedCategories[i].name === name) {
                    checkedCategories.splice(i,1);
                }
            }
            setCheckedCateories([...checkedCategories]);

            if(checkedCategories.length<=0){
                setIsDeleteDisabled(true);
            }
        }
      }

      const handleCheckAll=(e,dt)=>{
          debugger;
        setIsCheckedAll(dt.checked);

        if(dt.checked){
            let checkedCats=[];
            data.forEach(cat=>{
                checkedCats.push({name:cat.name, checked:true});
                setCheckedCateories([...checkedCategories, {name:cat.name}]);
            });
            setData(checkedCats);
        }else{
            let checkedCats=[];
            data.forEach(cat=>{
                checkedCats.push({name:cat.name, checked:false});
                for (var i = checkedCategories.length - 1; i >= 0; --i) {
                    if (checkedCategories[i].name === cat.name) {
                        checkedCategories.splice(i,1);
                    }
                }
                setCheckedCateories([...checkedCategories]);
            });
            setData(checkedCats);
        }
      };

    return (
        <div>
            <Dimmer active={isLoading} inverted>
                <Loader size='huge'>Loading...</Loader>
            </Dimmer>

            <Table sortable fixed celled collapsing>
                <Table.Header >
                <Table.Row>
                    <Table.HeaderCell width={1} ><Checkbox checked={isCheckedAll} style={{margin:'0px 15px'}} fitted onChange={handleCheckAll} /></Table.HeaderCell>
                    <Table.HeaderCell width={14} sorted={column === 'name' ? direction : null}onClick={handleSort('name')}>Name</Table.HeaderCell>
                    <Table.HeaderCell width={1}></Table.HeaderCell>
                </Table.Row>
                </Table.Header>
                <Table.Body>
                    {_.map(data, ({ name,checked }) => (
                        <AdminCategoriesRow 
                            name={name} 
                            setIsLoading={setIsLoading}
                            handleDeleted={handleDeleted}
                            handleChecked={handleChecked}
                            isChecked={checked}/>
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
                    <Button size='small' color='red' disabled={isDeleteDisabled}>Delete</Button>
                    </Table.HeaderCell>
                </Table.Row>
                </Table.Footer>
            </Table>
        </div>
    );
};

export default AdminCategories;