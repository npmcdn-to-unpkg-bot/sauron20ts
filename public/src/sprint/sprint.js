import {bindable} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';

export class Sprint {

    data = null;

    activate(params, routeConfig, navigationInstruction) {

        this.service = new HttpClient();

    }

    onClick() {
        this.service.fetch("/rest/sprint/36/issues")
            .then(response => response.json())
            .then(result => {
                console.log(result);
                this.data = result;
            });
    }



}
