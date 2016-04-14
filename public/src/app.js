import "/jspm_packages/npm/moment@2.12.0/locale/es";

export class App {

    title = "Antonio";

    data=[];

    constructor() {
        setTimeout(() => {
            for (let i = 0; i < 20000; i++) {
                this.data.push({id: i, l: "Es una prueba2 "+i});
            }
            console.log("Ya!");
        },2000);

        setTimeout(() => {
            this.title = "Antonio Hueso";
        },2000);

    }

    delete(it) {
        console.log(it);
        this.data.splice(this.data.indexOf(it),1);
        console.log(it);
    }


}
