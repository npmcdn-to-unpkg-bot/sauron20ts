import React from 'react';
import ReactDOM from 'react-dom';
import {observer} from "mobx-react";
import {observable, transaction} from "mobx";

@observer
export class Main extends React.Component {

    nombre = "Hola Hueso!";

    @observable data = [];

    constructor() {
        super();

        setTimeout(() => {
            transaction(() => {
                for (let i = 0; i < 20000; i++) {
                    this.data.push({id:i,l:"Es una prueba2 "});
                }
            });
        },5000);

    }

    static propTypes = {
        list: React.PropTypes.object.isRequired
    }

    render() {

        console.log("Render Main!");
        return (
          <div>
              <h1>Hello World React JSPM {this.nombre} {this.props.list.title}</h1>
              <Child data={this.data} />
          </div>
        );
    }
}

@observer
export class Child extends React.Component {

    static propTypes = {
        data: React.PropTypes.object.isRequired
    }

    render() {
        console.log("Render Child!");
        return (
            <ul>
                {this.props.data.map(n => {
                    return <li key={n.id}>{n.l}</li>
                })}
            </ul>
        );
    }
}


class TodoList {
    @observable title = "mierda";
}

const list = new TodoList();

ReactDOM.render(
    <Main list={list}/>,
    document.getElementById("app")
);

setTimeout(() => {
    list.title = "Es una prueba?";
},3000);