import React from "react";
import ReactDOM from "react-dom";
import {Service} from "./services/service";
import {MainMenu} from "./menus";

export class SauronApp extends React.Component {

    constructor() {
        super();
        this.state = { data:null };
    }

    componentDidMount() {
        console.log("Siiii",Service);
        Service.fetch("/sprint/rest/result/SC/36/situacion").then(result => {
            console.log(result);
            this.setState({data:result})
        });
    }

    render() {

        if(this.state.data == null) return false;

        var data = this.state.data.data;

        var renderData = () => {
            return Object.keys(data).map(key => {
                return(
                    <tr key={key}>
                        <td>{key}</td>
                        <td>{data[key].count}</td>
                        <td>{data[key].sum}</td>
                    </tr>
                );
            });
        };



        return (
            <div>

                <MainMenu selected="backlog" />

                <div className="container main-content">

                    <table className="table table-bordered">
                        <thead>
                        <tr>
                            <th>Situación</th>
                            <th>Tareas</th>
                            <th>Esfuerzo</th>
                        </tr>
                        </thead>
                        <tbody>
                        {renderData()}
                        </tbody>
                    </table>

                </div>
            </div>
        );
    }

}


google.charts.load('current', {packages: ['corechart']});

google.charts.setOnLoadCallback(()=>{

    ReactDOM.render(
    <SauronApp  />,
        document.getElementById('app')
    );

});
