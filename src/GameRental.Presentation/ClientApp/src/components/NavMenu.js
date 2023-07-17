// import React, { Component } from 'react';
// import { Collapse, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
// import { Link } from 'react-router-dom';
// import './NavMenu.css';
// import '../App.css'

// export class NavMenu extends Component {
//   static displayName = NavMenu.name;

//   constructor (props) {
//     super(props);

//     this.toggleNavbar = this.toggleNavbar.bind(this);
//     this.state = {
//       collapsed: true
//     };
//   }

//   toggleNavbar () {
//     this.setState({
//       collapsed: !this.state.collapsed
//     });
//   }

//   render() {
//     return (
//       <header>
//         <Navbar className="nav navbar-expand-sm navbar-toggleable-sm ng-white box-shadow" container light>
//           <NavbarBrand className='navbar-logo' tag={Link} to="/">GameRental</NavbarBrand>
//           <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
//           <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
//             <ul className="navbar-nav flex-grow">
//               <NavItem>
//                 <NavLink tag={Link} className="text-light" to="/">Home</NavLink>
//               </NavItem>
//               <NavItem>
//                 <NavLink tag={Link} className="text-light" to="/counter">Counter</NavLink>
//               </NavItem>
//               <NavItem>
//                 <NavLink tag={Link} className="text-light" to="/games">Games</NavLink>
//               </NavItem>
//               <NavItem>
//                 <NavLink tag={Link} className="text-light" to="/explore">Explore</NavLink>
//               </NavItem>
//               <NavItem>
//                 <NavLink tag={Link} className="text-light" to="/contracts">Contracts</NavLink>
//               </NavItem>
//             </ul>
//           </Collapse>
//         </Navbar>
//       </header>
//     );
//   }
// }


import React, { Component } from 'react';
import { NavbarUser } from './NavbarUser';
import { NavbarAdmin } from './NavbarAdmin';
import { Link } from 'react-router-dom';

export class NavMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAdmin: false
    };
  }

  toggleRole = () => {
    this.setState(prevState => ({
      isAdmin: !prevState.isAdmin
    }));
  }

  render() {
    const { isAdmin } = this.state;
    return (
      <header className='navmenu-container'>
        <Link to={isAdmin ? "/" : "/dashboard" }>
          <button className='switch-btn' onClick={this.toggleRole}>
          {isAdmin ? 'Switch to User' : 'Switch to Admin'}
        </button>
        </Link>
        <div className="nav navbar-expand-sm navbar-toggleable-sm ng-white box-shadow">
        {isAdmin ? <NavbarAdmin /> : <NavbarUser />}
        </div>
      </header>
    );
  }
}
