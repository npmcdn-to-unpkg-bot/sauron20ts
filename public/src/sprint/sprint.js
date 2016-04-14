import {bindable} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';

export class Sprint {

    nombre = "Adrián Hueso Soto, ese chico de la moto";

    activate(params, routeConfig, navigationInstruction) {

        console.log(this.router);

        /*
        this.service = new HttpClient();
        this.service.fetch(routeConfig.url)
            .then(response => response.json())
            .then(result => {
                console.log(result);
            }); */
    }

    configureRouter(config, router) {
        config.title = 'Sprint';
        config.map([

            {
                route: ['resumen',''],
                name: 'resumen',
                moduleId: './resumen',
                nav: true,
                title: 'Resumen'
            },
            {
                route: ['situacion'],
                name: 'situacion',
                moduleId: './situacion',
                nav: true,
                title: 'Situacion'
            }

        ]);

        this.router = router;
        console.log(router);
    }



}
