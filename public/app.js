import React from 'react';
import ReactDOM from 'react-dom';
import {observer} from "mobx-react";
import {observable} from "mobx";

@observer
export class Main extends React.Component {

    caca = "Hola Hueso!";

    static propTypes = {
        list: React.PropTypes.object.isRequired
    }

    render() {
        return (
          <h1>Hello World React JSPM {this.caca} {this.props.list.title}</h1>
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
    list.title = "Me la chupas?";
},3000);