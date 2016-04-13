import React from "react"
import ReactDOM from "react-dom"
import {Service} from "./services/service"
import {MainMenu} from "./menus"
import {SprintPage} from "./sprintpage"

import { Router, Route, Link, hashHistory } from "react-router"


export class SauronApp extends React.Component {
    render() {
        return (
            <div>
                <MainMenu />

                {this.props.children}
            </div>
        )
    }
}

export class PageNotFound extends React.Component {

    render() {
        return (
            <div className="container main-content">
                <h1>Error, la página no existe.</h1>
            </div>
        );
    }
}

export class PageTest extends React.Component {

    render() {

        console.log("Vale2: ",this.props);

        return (
            <h2>Página de Test</h2>
        );
    }
}



google.charts.load('current', {packages: ['corechart']});

google.charts.setOnLoadCallback(()=>{

    ReactDOM.render(
        <Router history={hashHistory}>
            <Route path="/" component={SauronApp}>
                <Route path="sprint/:projectKey/:sprintId" component={SprintPage}>
                    <Route path="informe-general" component={PageTest}/>
                </Route>
                <Route path="*" component={PageNotFound}/>
            </Route>
        </Router>
        , document.getElementById('app')
    );

});
