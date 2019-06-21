import React, { Component } from 'react'
import { Link } from 'react-router-dom';

import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';

import { AuthUserContext } from '../Session';

import {MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavItem, MDBNavLink} from "mdbreact";


class Navigation extends Component {
  render() {
    return (
        <div>
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? <NavigationAuth /> : <NavigationNonAuth />
      }

    </AuthUserContext.Consumer>
        </div>
    );
  }
}



// const Navigation = () => (
//   <div>
//     <AuthUserContext.Consumer>
//       {authUser =>
//         authUser ? <NavigationAuth /> : <NavigationNonAuth />
//       }
//     </AuthUserContext.Consumer>
//   </div>
// );
//


const NavigationAuth = () => (
  <MDBNavbar color="indigo" dark expand="md">
    <MDBNavbarBrand>
      <strong className="white-text">GyMeal Planner</strong>
    </MDBNavbarBrand>
      <MDBNavbarNav left>
        <MDBNavItem>
          <MDBNavLink to={ROUTES.LANDING}>Landing</MDBNavLink>
        </MDBNavItem>
        <MDBNavItem>
          <MDBNavLink to={ROUTES.HOME}>Home</MDBNavLink>
        </MDBNavItem>
        <MDBNavItem>
          <MDBNavLink to={ROUTES.ACCOUNT}>Account</MDBNavLink>
        </MDBNavItem>
        <MDBNavItem>
          <MDBNavLink to={ROUTES.ADMIN}>Admin</MDBNavLink>
        </MDBNavItem>


      </MDBNavbarNav>
      <MDBNavbarNav right>
        <MDBNavItem>
          <SignOutButton />
        </MDBNavItem>
      </MDBNavbarNav>
  </MDBNavbar>

);

const NavigationNonAuth = () => (

  <MDBNavbar color="indigo" dark expand="md">
    <MDBNavbarBrand>
      <strong className="white-text">Navbar</strong>
    </MDBNavbarBrand>
    <MDBNavbarNav left>
      <MDBNavItem active>
        <MDBNavLink to={ROUTES.LANDING}>Landing</MDBNavLink>
      </MDBNavItem>
      <MDBNavItem>
        <MDBNavLink to={ROUTES.SIGN_IN}>Sign in</MDBNavLink>
      </MDBNavItem>
    </MDBNavbarNav>
  </MDBNavbar>

);


export default Navigation;
