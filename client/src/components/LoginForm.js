import React, { useState } from 'react';
import { Button, Form, Grid, Header, Image, Message, Segment, Label } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';
import RegisterUserForm from './RegisterUserForm';
import { ToastContainer, toast } from 'react-toastify';

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
        debugger;

        setErrorMessage('');

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({userName:userName,password:password})
        };

        fetch('/api/users/signin', requestOptions)
        .then(resp=>resp.json())
        .then((result)=>{
            debugger;
            if(result.isError){
                setErrorMessage(result.message);
            }else{
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
            <Header as='h2' color='green' textAlign='center'>
                {/* <Image size="mini" src="https://react.semantic-ui.com/logo.png" /> */}
                Log-in to Reciperaptor
            </Header>
            <Form size='large'>
                <Segment stacked>
                    <Form.Input fluid icon='user' iconPosition='left' placeholder='E-mail address' onChange={userOnChange} />
                    <Form.Input
                        fluid
                        icon='lock'
                        iconPosition='left'
                        placeholder='Password'
                        type='password'
                        onChange={passwordOnChange}
                    />

                    <Button color='green' fluid size='large' onClick={handleLogin}>Login</Button>
                    {errorMessage?<Label color='red' style={{textAlign:"center",margin:'10px'}}>{errorMessage}</Label>:<div></div>}
                </Segment>
            </Form>
            <Message style={{width:"100%"}}>
                New to us? <Button onClick={handleOpenSignUpModal}>Sign Up</Button>
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