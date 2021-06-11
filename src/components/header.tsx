import React from "react";
import { Link } from "gatsby";
import { FaGithub, FaEnvelope, FaFile } from "react-icons/fa";

const Header = (props: { websiteTitle: string }): JSX.Element => (
  <header>
    <h1>
      <Link to={"/"} className="no-underline">
        {props.websiteTitle}
      </Link>
    </h1>
    <ul>
      <li>
        <a href="mailto:h@nnes.dev">
          <FaEnvelope style={{ marginRight: "0.5rem" }} />
          h@nnes.dev
        </a>
      </li>
      <li>
        <a href="https://github.com/hasnep">
          <FaGithub style={{ marginRight: "0.5rem" }} />
          Hasnep
        </a>
      </li>
      <li>
        <Link to="/cv">
          <FaFile style={{ marginRight: "0.5rem" }} />
          My CV
        </Link>
      </li>
    </ul>
  </header>
);

export default Header;
