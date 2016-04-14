import {bindable} from 'aurelia-framework';

export class IssueStatus {

    @bindable issue;

    labelClass;

    bind() {
        switch(parseInt(this.issue.status_id)) {
            case 1:
            case 10200:
            case 10005:
                this.labelClass = "label-danger";
                break;
            case 10004:
                this.labelClass = "label-info";
                break;
            default:
                this.labelClass = "label-success";

        }
    }

}
