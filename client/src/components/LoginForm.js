import React, { useState } from 'react';
import { Button, Form, Grid, Message, Segment, Label,Image } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';
import RegisterUserForm from './RegisterUserForm';
import { ToastContainer } from 'react-toastify';
import logo from '../images/logo.png';

const LoginForm = () => {

    const [isRedirectToHome,setIsRedirectToHome]=useState(false);
    const [userName,setUserName]=useState('');
    const [password, setPassword]=useState('');
    const [openSignUpModal,setOpenSignUpModal]=useState(false);
    const [errorMessage,setErrorMessage]=useState('');

    const redirectToHome=()=>{
        if(isRedirectToHome){
            return <Redirect to='/home' />;
        }
    }

    const handleLogin=()=>{

        setErrorMessage('');

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({userName:userName,password:password})
        };

        fetch('/api/users/signin', requestOptions)
        .then(resp=>resp.json())
        .then((result)=>{
            if(!result.token){
                setErrorMessage('Not Authorized');
            }else{
                localStorage.removeItem('rcp_userName');
                localStorage.removeItem('rcp_token');
                localStorage.setItem('rcp_userName', userName);
                localStorage.setItem('rcp_token', result.token);
                setIsRedirectToHome(true);
            }
        })
        .catch(err=>{
            debugger;
        });    
    };

    const userOnChange=(e)=>{
        var userNameValue = e.target.value;
        setUserName(userNameValue);
    };

    const passwordOnChange=(e)=>{
        var passwordValue = e.target.value;
        setPassword(passwordValue);
    };

    const handleOpenSignUpModal=()=>{
        setOpenSignUpModal(true);
    };

    const cancelSignupModal=()=>{
        setOpenSignUpModal(false);
    }

    return(
        <div>
        <div className="login-blur App"></div>
        <div className='login-form'>
            {redirectToHome()}
        <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
            <Grid.Column style={{ maxWidth: 450 }}>
            <Image size='huge' src={logo}/> 
            <Form size='large'>
                <Segment stacked>
                    <Form.Input fluid icon='user' iconPosition='left' placeholder='E-mail' onChange={userOnChange} />
                    <Form.Input
                        fluid
                        icon='lock'
                        iconPosition='left'
                        placeholder='Heslo'
                        type='password'
                        onChange={passwordOnChange}
                    />

                    <Button color='green' fluid size='large' onClick={handleLogin}>Prihlásiť</Button>
                    {errorMessage?<Label color='red' style={{textAlign:"center",margin:'10px'}}>{errorMessage}</Label>:<div></div>}
                </Segment>
            </Form>
            <Message style={{width:"100%"}}>
                Ste tu nový? <Button onClick={handleOpenSignUpModal}>Vytvoriť konto</Button>
                <RegisterUserForm
                    openSignUpModal={openSignUpModal}
                    cancelSignupModal={cancelSignupModal}
                    setUserName={setUserName}
                    setPassword={setPassword}
                />
            </Message>
            </Grid.Column>
        </Grid>
        </div>
        <ToastContainer
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            enableMultiContainer
            containerId='loginFrom'
            />
        </div>
    )
};

export default LoginForm;