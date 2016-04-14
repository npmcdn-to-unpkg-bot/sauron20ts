import React from 'react';
import ReactDOM from 'react-dom';
import {Service} from "./src/services/service";

export class Main extends React.Component {

    constructor(){
        super();
        this.state = {
            data:[]
        }
    }

    onClick() {
        Service.fetch("/rest/sprint/36/issues").then(issues => this.setState({data:issues}));
    }

    render() {

        console.log("Render Main!");
        return (
          <div>
              <h1>Hello World React JSPM</h1>
              <button onClick={this.onClick.bind(this)}>Pincha</button>
              <Issues data={this.state.data} />
          </div>
        );
    }
}

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
