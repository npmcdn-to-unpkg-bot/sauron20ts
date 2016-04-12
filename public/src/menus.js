import React from "react"
import { Link } from "react-router"

export class MainMenu extends React.Component {

    static propTypes() {
        return {
            selected: React.PropTypes.string
        };
    }

    options() {

        var selected = this.props.selected || "sprint";

        return [
            {id: "seguimiento", label: "Seguimiento", url: "/seguimiento/search", icon: "glyphicon-eye-open"},
            {id: "sprint", label: "Sprint", url: "/sprint/search", icon: "glyphicon-calendar"},
            {id: "backlog", label: "Backlog", url: "/backlog/search", icon: "glyphicon-list-alt"},
            {id: "historico", label: "Histórico", url: "/historico/search", icon: "glyphicon-folder-close"}
        ].map(option => {
            return (
                <li key={option.id} className={option.id == selected?'active':null}>
                    <Link to={option.url}>
                        <span><i className={'glyphicon '+option.icon}> </i> {option.label}</span>
                    </Link>
                </li>
            );
        });
    }

    render() {

        return (
            <div id="menu-principal" className="navbar navbar-default navbar-fixed-top" role="navigation">
                <div className="container">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle collapsed"
                                data-toggle="collapse" data-target=".navbar-collapse">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                                <span className="icon-bar">
                                </span> <span className="icon-bar">
                                </span>
                        </button>
                        <a className="navbar-brand" href="/"><span>Sauron</span></a>
                    </div>
                    <div className="collapse navbar-collapse">
                        <ul className="nav navbar-nav">
                            {this.options()}
                        </ul>

                    </div>
                </div>
            </div>
        );
    }

}
