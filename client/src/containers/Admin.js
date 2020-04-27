import React,{useState} from 'react'
import {Container,Header,Menu,Responsive,Image} from 'semantic-ui-react'

const Admin = () => {

  const [isHomeVisible, setIsHomeVisible]=useState(true);
  const [isAboutVisible,setIsAboutVisible ]=useState(false);

  const handleHomeClick=()=>{
    setIsHomeVisible(true);
    setIsAboutVisible(false);
  }

  const handleAboutClick=()=>{
    setIsHomeVisible(false);
    setIsAboutVisible(true);
  }

  return(
    <div>
        <Responsive>
            <Menu fixed='top' inverted >
            <Container>
                <Menu.Item>
                    <Image size="mini" src="https://react.semantic-ui.com/logo.png" />
                </Menu.Item>
                <Menu.Item as='a' onClick={handleHomeClick}>Home</Menu.Item>
                <Menu.Item as='a' onClick={handleAboutClick}>About</Menu.Item>
            </Container>
            </Menu>

            <Container style={isHomeVisible?{ display: 'block',marginTop:'8em' }:{display:'none'}}>
            <Header as='h1'>Semantic UI React Fixed Template</Header>
            <p>This is a basic fixed menu template using fixed size containers.</p>
            <p>
                A text container is used for the main container, which is useful for single column layouts. A text container is used for the main container, which is useful for single column layouts. A text container is used for the main container, which is useful for single column layouts. A text container is used for the main container, which is useful for single column layouts.
            </p>
            </Container>

            <Container style={isAboutVisible?{ display: 'block',marginTop:'8em' }:{display:'none'}}>
            <Header as='h1'>Semantic</Header>
            <p>This is a basic </p>
            </Container>
        </Responsive>
    </div>
)};

export default Admin;