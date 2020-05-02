import React,{useState} from 'react';
import { Button, Modal,Form } from 'semantic-ui-react';

const NewCategoryModal = ({openNewCategoryModal, cancelNewCategoryModal, getCategory, reloadCategories}) => {

    const [isInProgressCreate, setIsInProgressCreate]=useState('');
    const [isInProgressCreateBool, setIsInProgressCreateBool]=useState(false);
    const [name, setName]=useState('');
    const [nameError,setNameError]=useState(true);

    const handleCreateOption=()=>{
        setIsInProgressCreate('loading');
        setIsInProgressCreateBool(true);

        let category={
            name:name
        };

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('rcp_token') },
            body: JSON.stringify(category)
        };

        fetch('/api/categories/', requestOptions)
        .then(resp=>{
            resp.json();
        })
        .then((err)=>{
            if(err && err.message){
                console.log(err.message);
            }

            if(getCategory!==undefined)getCategory(name);
            reloadCategories();

            setName('');
            setIsInProgressCreate('');
            setIsInProgressCreateBool(false);
            cancelNewCategoryModal(true);
        });
    };

    const handleCancelOption=()=>{
        setName('');
        cancelNewCategoryModal(false);
    };

    const updateName=(e)=>{
        let value=e.target.value;
        setName(value);
        if(value===''){
            setNameError(true);
        }else{
            setNameError(false);
        }
    };

    const enterPressed=(event)=> {
        var code = event.keyCode || event.which;
        if(code === 13) { //13 is the enter keycode
            handleCreateOption();
        } 
    }

    return (
        <div>
            <Modal size='tiny' 
                open={openNewCategoryModal} 
                onClose={cancelNewCategoryModal}
                closeOnDimmerClick={false} 
                closeOnEscape={false} 
                dimmer='blurring'
                centered>
                <Modal.Header>New category</Modal.Header>
                <Modal.Content>
                    <Form className={isInProgressCreate}>
                        <Form.Field>
                            <label className='requiredField'>Name</label>
                            <input type="text" value={name} autoFocus onChange={updateName} onKeyPress={enterPressed} placeholder='Name' error={nameError} required={true} />
                        </Form.Field>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button negative onClick={handleCancelOption} disabled={isInProgressCreateBool}>Cancel</Button>
                    <Button positive onClick={handleCreateOption} disabled={isInProgressCreateBool}>Create</Button>
                </Modal.Actions>
            </Modal>
        </div>
    )
};

export default NewCategoryModal;