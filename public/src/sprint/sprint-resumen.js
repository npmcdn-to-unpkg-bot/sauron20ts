import {bindable,inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import {Promise} from 'bluebird';

@inject(HttpClient)
export class SprintResumen {

    @bindable sprintId;

    http = null;

    sprint = null;

    constructor(http) {
        this.http = http;
    }

    attached() {
        Promise.all([
            this.http.fetch(`/rest/sprint/${this.sprintId}`),
            this.http.fetch(`/rest/sprint/${this.sprintId}/issues`)
        ]).then(result => {
            console.log(result);
        });

    }



}
