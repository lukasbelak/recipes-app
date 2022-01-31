import React,{useState} from 'react';
import { Button, Modal,Form } from 'semantic-ui-react';

const NewTagModal = ({openNewTagModal, cancelNewTagModal, getTag, reloadTags}) => {

    const [isInProgressCreate, setIsInProgressCreate]=useState('');
    const [isInProgressCreateBool, setIsInProgressCreateBool]=useState(false);
    const [name, setName]=useState('');
    const [nameError,setNameError]=useState(true);

    const handleCreateOption=()=>{
        setIsInProgressCreate('loading');
        setIsInProgressCreateBool(true);

        let tag={
            name:name
        };

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('rcp_token') },
            body: JSON.stringify(tag)
        };

        fetch('/api/tags/', requestOptions)
        .then(resp=>{
            resp.json();
        })
        .then((err)=>{
            if(err && err.message){
                console.log(err.message);
            }

            if(getTag!==undefined)getTag(name);
            reloadTags();

            setName('');
            setIsInProgressCreate('');
            setIsInProgressCreateBool(false);
            cancelNewTagModal(true);
        });
    };

    const handleCancelOption=()=>{
        setName('');
        cancelNewTagModal(false);
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
                open={openNewTagModal} 
                onClose={cancelNewTagModal}
                closeOnDimmerClick={false} 
                closeOnEscape={false} 
                dimmer='blurring'
                centered>
                <Modal.Header>Nový tag</Modal.Header>
                <Modal.Content>
                    <Form className={isInProgressCreate}>
                        <Form.Field>
                            <label className='requiredField'>Názov</label>
                            <input type="text" value={name} autoFocus onChange={updateName} onKeyPress={enterPressed} placeholder='Name' error={nameError} required={true} />
                        </Form.Field>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button negative onClick={handleCancelOption} disabled={isInProgressCreateBool}>Zrušiť</Button>
                    <Button positive onClick={handleCreateOption} disabled={isInProgressCreateBool}>Uložiť</Button>
                </Modal.Actions>
            </Modal>
        </div>
    )
};

export default NewTagModal;