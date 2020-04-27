import React, { useState } from 'react';
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';

const LoginForm = () => {

    const [isRedirectToHome,setIsRedirectToHome]=useState(false);

    const redirectToHome=()=>{
        if(isRedirectToHome){
            return <Redirect to='/home' />;
        }
    }

    const handleLogin=()=>{
        debugger;
        setIsRedirectToHome(true);
    };

    const userOnChange=(e)=>{

    };

    const passwordOnChange=(e)=>{

    };


    return(
        <div>
            {redirectToHome()}
        <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
            <Grid.Column style={{ maxWidth: 450 }}>
            <Header as='h2' color='olive' textAlign='center'>
                Log-in to your account
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

                <Button color='olive' fluid size='large' onClick={handleLogin}>
                    Login
                </Button>
                </Segment>
            </Form>
            <Message style={{width:"100%"}}>
                New to us? <a href='/register'>Sign Up</a>
            </Message>
            </Grid.Column>
        </Grid>
        </div>
    )
};

export default LoginForm;