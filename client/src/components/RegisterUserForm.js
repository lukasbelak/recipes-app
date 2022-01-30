import React, { useState } from 'react';
import { Button, Form, Modal } from 'semantic-ui-react';
import { ToastContainer, toast } from 'react-toastify';

const RegisterUserForm =({openSignUpModal,cancelSignupModal,setUserName,setPassword}) => {

    const [isInProgressRegister, setIsInProgressRegister]=useState('');
    const [userNameRegister, setUserNameRegister]=useState('');
    const [passwordRegister, setPasswordRegister]=useState('');
    const [firstNameRegister, setFirstNameRegister]=useState('');
    const [lastNameRegister, setLastNameRegister]=useState('');
    const [userNameError, setUserNameError]=useState(true);
    const [passwordError, setPasswordError]=useState(true);
    const [firstNameError, setFirstNameError]=useState(true);
    const [lastNameError, setLastNameError]=useState(true);
    const [formError, setFormError]=useState(true); 
    const [isInProgressRegisterBool, setIsInProgressRegisterBool]=useState(false);

    const updateUserName = (e) =>{
        let userNameValue=e.target.value;
        setUserNameRegister(userNameValue);

        if(userNameValue===''){
            setUserNameError(true);
        }else{
            setUserNameError(false);
        }

        checkFormError(userNameValue, passwordRegister, firstNameRegister, lastNameRegister);
    };

    const updateFirstName = (e) =>{
        let firstNameValue=e.target.value;
        setFirstNameRegister(firstNameValue);

        if(firstNameValue===''){
            setFirstNameError(true);
        }else{
            setFirstNameError(false);
        }

        checkFormError(userNameRegister, passwordRegister, firstNameValue, lastNameRegister);
    };

    const updateLastName = (e) =>{
        let lastNameValue=e.target.value;
        setLastNameRegister(lastNameValue);

        if(lastNameValue===''){
            setLastNameError(true);
        }else{
            setLastNameError(false);
        }

        checkFormError(userNameRegister, passwordRegister, firstNameRegister, lastNameValue);
    };

    const updatePassword = (e) =>{
        let passwordValue=e.target.value;
        setPasswordRegister(passwordValue);

        if(passwordValue===''){
            setPasswordError(true);
        }else{
            setPasswordError(false);
        }

        checkFormError(userNameRegister, passwordValue, firstNameRegister, lastNameRegister);
    };

    const checkFormError=(user, pass, first, last)=>{
        if(user!==''&&pass!==''&&first!==''&&last!==''){
            setFormError(false);
        }else{
            setFormError(true);
        }
    };

    const handleRegisterOption =() =>{
        if(formError)return;

        setIsInProgressRegister('loading');
        setIsInProgressRegisterBool(true);

        let user={
            userName:userNameRegister,
            password:passwordRegister,
            firstName:firstNameRegister,
            lastName:lastNameRegister
        }

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        };

        fetch('/api/users/signup', requestOptions)
        .then(resp=>resp.json())
        .then((result)=>{
            debugger;
            if(result.isError){
                console.log(result.message);

                toast.error(result.message, {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    containerId: 'registerUserForm'
                    });
                    
                setIsInProgressRegisterBool(false);
                setIsInProgressRegister('');
            } if(result.details){
                console.log(result.details[0].message);    

                toast.error(result.details[0].message, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    containerId: 'registerUserForm'
                    });
                    
                setIsInProgressRegisterBool(false);
                setIsInProgressRegister('');
            }else{
                resetForm();

                setIsInProgressRegisterBool(false);
                setIsInProgressRegister('');

                debugger;
                //setUserName(data.userName);

                cancelSignupModal();
            }
        })
        .catch(err=>{
            debugger;
        });
    };

    const handleCancelOption =()=>{
        resetForm();
        cancelSignupModal();
    };

    const resetForm=()=>{
        setUserNameRegister('');
        setPasswordRegister('');
        setFirstNameRegister('');
        setLastNameRegister('');

        setUserNameError(true);
        setPasswordError(true);
        setFirstNameError(true);
        setLastNameError(true);
    };

    return (
        <div>
            <Modal 
                open={openSignUpModal} 
                onClose={cancelSignupModal}
                closeOnDimmerClick={false} 
                closeOnEscape={false} 
                dimmer='blurring'
                centered>
                <Modal.Header>Nový používateľ</Modal.Header>
                <Modal.Content>
                    <Form className={isInProgressRegister}>
                        <Form.Field>
                            <label className='requiredField'>Používateľské meno (email)</label>
                            <input type="text" value={userNameRegister} autoFocus onChange={updateUserName} placeholder='Email' error={userNameError} required={true} />
                        </Form.Field>
                        <Form.Field>
                            <label className='requiredField'>Heslo</label>
                            <input type="password" value={passwordRegister} autoFocus onChange={updatePassword} placeholder='Heslo' error={passwordError} required={true} />
                        </Form.Field>
                        <Form.Field>
                            <label className='requiredField'>Meno</label>
                            <input type="text" value={firstNameRegister} autoFocus onChange={updateFirstName} placeholder='Meno' error={firstNameError} required={true} />
                        </Form.Field>
                        <Form.Field>
                            <label className='requiredField'>Priezvisko</label>
                            <input type="text" value={lastNameRegister} autoFocus onChange={updateLastName} placeholder='Priezvisko' error={lastNameError} required={true} />
                        </Form.Field>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button type='submit' color='blue' onClick={handleRegisterOption} disabled={isInProgressRegisterBool}>Registrovať</Button>
                    <Button type='button' onClick={handleCancelOption} disabled={isInProgressRegisterBool}>Zrušiť</Button>
                    <ToastContainer
                        position="top-right"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        enableMultiContainer
                        containerId='registerUserForm'
                        />
                </Modal.Actions>
            </Modal>
        </div>
    );
};

export default RegisterUserForm;