import {bindable} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';

export class Resumen {

    constructor() {
        this.service = new HttpClient();
    }

    activate(params, routeConfig, navigationInstruction) {
        this.service.fetch(`/sprint/rest/result/${params.projectKey}/${params.sprintId}/resumen`)
            .then(response => response.json())
            .then(result => {
                this.project = result.project;
                this.sprint = result.sprint;
                this.chartInfo = result.chartInfo;
                console.log(result);
            });
    }


}
