import React, { useState, useEffect } from 'react';
import {Table,Checkbox,Button,Icon} from 'semantic-ui-react';

const AdminCategoriesRow =({name,setIsLoading,handleDeleted,handleChecked,isChecked}) =>{

    //const [isCatChecked,setIsCatChecked]=useState(isChecked);

    const handleCheck=(e,data)=>{
        debugger;
        //setIsCatChecked(data.checked);
        handleChecked(data.checked,e.target.parentNode.parentNode.parentNode.children[1].innerText);
    }

    const handleDelete=()=>{
        debugger;
        setIsLoading(true);

        const requestOptions = {
            method: 'DELETE'
        };

        fetch('/api/categories/byname/'+name, requestOptions)
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
    };

    return (
            <Table.Row key={name}>
                <Table.Cell><Checkbox style={{margin:'0px 15px'}} checked={isChecked} fitted onChange={handleCheck} /></Table.Cell>
                <Table.Cell>{name}</Table.Cell>
                <Table.Cell>
                    <Button icon circular color='red' style={{margin:'0px 15px'}} onClick={handleDelete}><Icon name='delete' color='white' /></Button>
                </Table.Cell>
            </Table.Row>
    );
}

export default AdminCategoriesRow;