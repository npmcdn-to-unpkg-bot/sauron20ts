import {bindable} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';

export class Situacion {

    filtro = null;

    constructor() {
        this.service = new HttpClient();
    }

    onFiltrar(event) {

        var d = JSON.parse(JSON.stringify(this.bckdata));

        Object.keys(d).forEach(key => {

            d[key].issues = d[key].issues.filter(issue => {
                return (issue.status_name.toLowerCase().indexOf(this.filtro.toLowerCase()) > -1
                     || issue.status_name.toLowerCase().indexOf(this.filtro.toLowerCase()) > -1)
            });

        });

        this.data = JSON.parse(JSON.stringify(d));
    }

    activate(params, routeConfig, navigationInstruction) {
        this.service.fetch(`/sprint/rest/result/${params.projectKey}/${params.sprintId}/situacion`)
            .then(response => response.json())
            .then(result => {
                this.data = JSON.parse(JSON.stringify(result.data));
                this.bckdata = JSON.parse(JSON.stringify(result.data));
                console.log(this.data);
                this.chartInfo = result.chartInfo;

            });
    }


}
