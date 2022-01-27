import React,{useState} from 'react';
import {Container,Menu,Responsive,Image} from 'semantic-ui-react';
import AdminCategories from '../components/AdminCategories';
import AdminRecipes from '../components/AdminRecipes';
import './Admin.css';
import logo from '../images/logo_white.png';
import { useHistory } from "react-router-dom";

const Admin = () => {

  const [isCategoriesVisible, setIsCategoriesVisible]=useState(true);
  const [isRecipesVisible,setIsRecipesVisible ]=useState(false);

  let history=useHistory();

  const handleCategoriesClick=()=>{
    setIsCategoriesVisible(true);
    setIsRecipesVisible(false);
  }

  const handleRecipesClick=()=>{
    setIsCategoriesVisible(false);
    setIsRecipesVisible(true);
  }

const handleLogoClick=()=>{
    debugger;
    history.push('/home');
}

  return(
    <div>
        <Responsive>
            <Menu fixed='top' inverted >
                <Container>
                    <Menu.Item>
                        <Image size='small' src={logo} onClick={handleLogoClick} />
                    </Menu.Item>
                    <Menu.Item as='a' onClick={handleCategoriesClick}>Categories</Menu.Item>
                    <Menu.Item as='a' onClick={handleRecipesClick}>Recipes</Menu.Item>
                </Container>
            </Menu>

            <Container  style={isCategoriesVisible?{ display: 'block',marginTop:'8em' }:{display:'none'}}>
                <AdminCategories />
            </Container>

            <Container style={isRecipesVisible?{ display: 'block',marginTop:'8em' }:{display:'none'}}>
                <AdminRecipes />
            </Container>
        </Responsive>
    </div>
)};

export default Admin;