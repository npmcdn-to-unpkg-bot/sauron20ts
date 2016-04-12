import {bindable} from 'aurelia-framework';

export class MainMenu {

    @bindable router;

    bind() {
        console.log(this.router.navigation);
    }
}
