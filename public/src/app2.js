import React from "react"
import ReactDOM from "react-dom"
import {Service} from "./services/service"
import {MainMenu} from "./menus"
import { Router, Route, Link, hashHistory } from "react-router"


export class SauronApp extends React.Component {

    render() {
        return (
            <div>
                <h1>APP1!</h1>
                <ul>
                    <li><Link      to="/">/</Link></li>
                    <li><Link      to="/users">/users</Link></li>
                    <li><Link      to="/user/ryan">/users/ryan</Link></li>
                    <li><Link      to="/about" >/about</Link></li>
                </ul>

                {this.props.children}
            </div>
        )
    }

}

export class About extends React.Component {

    constructor() {
        super();
        console.log("Siiiiii, about");
    }

    render() {
        return (
            <h1>About</h1>
        )
    }
}

export class Users extends React.Component {
    render() {
        console.log("!Si")
        return (
            <div>
                <h1>Users</h1>
                {this.props.children}
            </div>
        )
    }
}

export class Child extends React.Component {

    render() {
        return (
            <h1>Child <span> {this.props.params.userId}</span></h1>
        )
    }
}

export class NoMatch extends React.Component {

    render() {
        return <h1>Error, no encontrada página</h1>
    }
}



google.charts.load('current', {packages: ['corechart']});

google.charts.setOnLoadCallback(()=>{

    ReactDOM.render(
        <Router history={hashHistory}>
            <Route path="/" component={SauronApp}>
                <Route path="about" component={About}/>
                <Route path="users" component={Users}>
                    <Route path="/user/:userId" component={Child}/>
                </Route>
                <Route path="*" component={NoMatch}/>
            </Route>
        </Router>
        , document.getElementById('app')
    );

});
