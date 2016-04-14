import "/jspm_packages/npm/moment@2.12.0/locale/es";

export class App {

    configureRouter(config, router) {
        config.title = 'Sauron';
        config.map([

            {
                route: "/seguimiento/search",
                name: 'seguimiento',
                moduleId: './seguimiento',
                nav: true,
                title: 'Seguimiento',
                href: "/seguimiento/search",
                settings: {
                    icon: "glyphicon-eye-open"
                }
            },

            {
                route: ['/sprint/:projectKey/:sprintId'],
                name: 'sprint',
                moduleId: './sprint/sprint',
                title: 'Sprint',
                settings: {
                    icon: "glyphicon-calendar"
                }
            },

            {
                route: "/backlog/search",
                name: 'backlog',
                moduleId: './backlog',
                nav: true,
                title: 'Backlog',
                settings: {
                    icon: "glyphicon-list-alt"
                }
            },

            {
                route: "/historico/search",
                name: 'historico',
                moduleId: './historico',
                nav: true,
                title: 'Histórico',
                settings: {
                    icon: "glyphicon-folder-close"
                }
            },
            {
                route: '',
                redirect: '/sprint/SC/36'
            }


        ]);

        config.mapUnknownRoutes(instruction => {
            console.log("COÑO!",instruction);
            return "not-found";
            //check instruction.fragment
            //return moduleId
        });

        this.router = router;
    }

}
