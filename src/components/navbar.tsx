import React, { Fragment } from "react";
import { Link } from "gatsby";

const navItems = [
  { name: "Home", link: "/" },
  { name: "Projects", link: "/projects/" },
  { name: "Blog", link: "/blog/" },
  { name: "CV", link: "/cv/" },
];

const NavItem = (props: { name: string; link: string }): JSX.Element => (
  <li>
    <Link to={props.link}>{props.name}</Link>
  </li>
);

const Navbar = (): JSX.Element => (
  <nav>
    <ul>
      {navItems.map((link_info: { name: string; link: string }) => (
        <Fragment key={link_info.link}>
          <NavItem name={link_info.name} link={link_info.link} />
        </Fragment>
      ))}
    </ul>
  </nav>
);

export default Navbar;
