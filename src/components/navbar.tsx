import React, { Fragment } from "react";
import { Link } from "gatsby";

const NavItem = (props: { name: string; link: string }): JSX.Element => {
  return (
    <li className={"nav-item"}>
      <Link to={props.link}>{props.name}</Link>
    </li>
  );
};

const NavBar = (): JSX.Element => (
  <nav>
    <ul>
      {[
        { name: "home", link: "/" },
        { name: "contact", link: "contact" },
        { name: "cv", link: "cv" },
        { name: "music", link: "music" },
        { name: "pictures", link: "pictures" },
        { name: "projects", link: "projects" },
      ].map((link_info: { name: string; link: string }) => (
        <Fragment key={link_info.link}>
          <NavItem name={link_info.name} link={link_info.link} />
        </Fragment>
      ))}
    </ul>
  </nav>
);

export default NavBar;
