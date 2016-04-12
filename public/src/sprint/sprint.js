import {bindable} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';

export class Welcome {

    nombre = "Adrián Hueso Soto, ese chico de la moto";

    activate(params, routeConfig, navigationInstruction) {
        console.log(params);
        console.log(routeConfig);
        console.log(navigationInstruction);

        this.service = new HttpClient();
        this.service.fetch(routeConfig.url)
            .then(response => response.json())
            .then(result => {
                console.log(result);
            });
    }


}
