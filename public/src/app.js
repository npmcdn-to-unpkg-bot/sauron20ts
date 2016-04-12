export class App {

    configureRouter(config, router) {
        config.title = 'Aurelia';
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
                route: ['','/sprint/:projectKey/:sprintId'],
                name: 'sprint',
                moduleId: './sprint/sprint',
                nav: true,
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
            }
        ]);

        this.router = router;
    }

}
