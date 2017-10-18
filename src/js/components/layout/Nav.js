import React from "react";
import { IndexLink, Link } from "react-router";

export default class Nav extends React.Component {
  constructor() {
    super()
    this.setCollapse = this.setCollapse.bind(this);
  }

  setCollapse() {
    $('.navbar-collapse').collapse('hide');
  }

  render() {
    const { location } = this.props;
    
    const todoClass = location.pathname === "/" ? "active" : "";
    // const archivesClass = location.pathname.match(/^\/?archives\/?/) ? "active" : "";
    
    return (
      <nav className="navbar navbar-inverse navbar-fixed-top" role="navigation">
        <div className="container">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
          </div>
          <div className={"navbar-collapse collapse"} id="bs-example-navbar-collapse-1">
            <ul className="nav navbar-nav">
              <li className = {todoClass} >
                <IndexLink to="/" onlyActiveOnIndex={true} onClick={this.setCollapse}>TodoGo - React.js Example</IndexLink>
              </li>
              {/* <li className = {archivesClass}>
                <Link to="archives" onClick={this.setCollapse}>Archives (Router Demo)</Link>
              </li> */}
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}