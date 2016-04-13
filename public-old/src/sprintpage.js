import React from "react"
import { Link } from "react-router"

export class SprintPage extends React.Component {

    static propTypes() {
        return {
            selected: React.PropTypes.string
        };
    }

    render() {

        console.log(this.props.selected);

        return (
            <div className="container-fluid main-content">

                <div className="row">

                    <div className="col-md-3 hidden-print">
                        <h1>Menu Sprint</h1>
                    </div>

                    <div className="col-md-9">

                        <h1>Report!</h1>

                        {this.props.children}

                    </div>

                </div>
            </div>
        );
    }

}
