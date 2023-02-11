import React, { Fragment } from "react";
import { Helmet } from "react-helmet";
import Header from "./header";

const Page = (props: {
  title: string;
  children: React.ReactNode;
}): JSX.Element => (
  <Fragment>
    <Helmet title={props.title}>
      <link href="https://julialang.social/@hasnep" rel="me" />
    </Helmet>
    <div className="content">
      <Header />
      <hr />
      {props.children}
    </div>
  </Fragment>
);

export default Page;
