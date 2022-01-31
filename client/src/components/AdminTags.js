import React, { useState,useEffect } from 'react';
import _ from 'lodash';
import {Table,Checkbox,Button,Icon,Dimmer,Loader,Segment} from 'semantic-ui-react';
import AdminTagsRow from './AdminTagsRow';
import withSelections from "react-item-select";
import NewTagModal from './NewTagModal';
import { useHistory } from "react-router-dom";

const AdminTags=({
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
    const [openNewTagModal, setOpenNewTagModal]=useState(false);
    
    let history=useHistory();

    const segmentStyle = {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      };

    useEffect(()=>{
        const getTags =async()=>{
            setIsLoading(true);
          let tags=[];
          try{

            const requestOptions = {
                method: 'GET',
                headers: { 'Authorization': localStorage.getItem('rcp_token') }
              };

            const resp = await fetch('/api/tags',requestOptions);
            let data=await resp.json();
            data.forEach(tag=>{
                tags.push({
                name:tag.name,
                id:tag._id
              });
            });
            setData(tags);
            setIsLoading(false);
            console.log('tags: '+tags);
          }catch(err){
            console.log(err.message);
            history.push('/');
          }
        };
    
        getTags();
      },[isReload,history]);

      const cancelNewTagModal=()=>{
        setOpenNewTagModal(false);
    };

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

            fetch('/api/tags/byid/'+item, requestOptions)
            .then(resp=>{
                resp.json();
            })
            .then((err)=>{
                setIsLoading(false);
                handleDeleted();
                if(err && err.message){
                    console.log(err.message);
                }
            });
        });
      };

      const handleAddTag=()=>{
        setOpenNewTagModal(true);
        };

    const reloadTags=()=>{
        setIsReload(isReload+1);
        handleClearAll();
    }

    return (
        <div style={{margin:'auto',width:'700px'}}>
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
                    {data.length===1?<span>{data.length} Tag</span>:<span>{data.length} Tagov</span>}
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
                    <Table.HeaderCell width={1}></Table.HeaderCell>
                </Table.Row>
                </Table.Header>
                <Table.Body>
                     {data.map(tag => (
                         <AdminTagsRow
                         key={tag.id}
                         tag={tag}
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
                            onClick={handleAddTag}
                        >
                            <Icon name='add' />Nový tag
                        </Button>
                        <NewTagModal
                                openNewTagModal={openNewTagModal}
                                cancelNewTagModal={cancelNewTagModal}
                                reloadTags={reloadTags}
                                />
                        <Button size='small' color='red' disabled={!areAnySelected} onClick={handleDelete}>Vymazať</Button>
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Footer>
            </Table>
        </div>
    );
};

export default withSelections(AdminTags);