import React from 'react';
import ReactDOM from 'react-dom';
import {observer} from "mobx-react";
import {observable, transaction} from "mobx";
import {Service} from "./src/services/service";

@observer
export class Main extends React.Component {

    @observable data = [];

    componentDidMount() {

    }

    onClick() {
        Service.fetch("/rest/sprint/36/issues").then(issues => this.data = issues);
    }

    render() {

        console.log("Render Main!");
        return (
          <div>
              <h1>Hello World React JSPM</h1>
              <button onClick={this.onClick.bind(this)}>Pincha</button>
              <Issues data={this.data} />
          </div>
        );
    }
}

@observer
export class Issues extends React.Component {

    static propTypes = {
        data: React.PropTypes.object.isRequired
    }

    render() {
        console.log("Issues!");

        const {data} = this.props;

        return (
            <ul>
                {data.map(issue => {
                    return <li key={issue.issuekey}>{issue.issuekey} - {issue.summary}</li>
                })}
            </ul>
        );
    }
}



ReactDOM.render(
    <Main />,
    document.getElementById("app")
);
