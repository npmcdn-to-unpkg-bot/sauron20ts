import $ from "jquery";

export class Service {

    /*** En vez de utilizar jquery form serialize
    var elements = this.refs.form.getDOMNode().elements;
    ***/
    static fetch(path,data) {
        return Service._send("GET",path, data);
    }

    static post(path,data) {
        return Service._send("POST",path,data);
    }

    static _send(method, path, data) {

        var deferred = $.ajax(
            {
                url: path,
                method: method,
                contentType: 'application/json',
                data: data
            })
            .fail(err => {
                console.log("Se ha producido un error al acceder a la URL: ", this.rootPath + " (" + method + ":" + path + ") ,", err);
            });

        return deferred;
    }
}


