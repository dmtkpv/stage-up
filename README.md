# Stage Up
Showcase of an app built with Vue.js frontend, ExpressJS + PostgreSQL backend, and integrations with Socket.io, Google Cloud Storage, Stripe



## Installation

```shell
git clone https://github.com/dmtkpv/stage-up.git
cd stage-up
```
### Production version
```shell
docker compose up prod --build
```

### Development version
```shell
docker compose up dev --build

# backend (in a new terminal tab)
docker compose exec dev sh
pnpm install
pnpm backend serve

# frontend (in a new terminal tab)
docker compose exec dev sh
pnpm frontend serve
```

### URLs
http://localhost:49041 - Backend  
http://localhost:49042 - Frontend  
http://localhost:49044 - Mail



## Scripts

| Script                                           | Description                                                                                                    |
|--------------------------------------------------|----------------------------------------------------------------------------------------------------------------|
| `pnpm backend serve`                             | Run backend server                                                                                             |
| `pnpm backend database migrate:up`               | Apply migration                                                                                                |
| `pnpm backend database migrate:down`             | Undo migration                                                                                                 |
| `pnpm backend database migrate:latest`           | Apply all migrations                                                                                           |
| `pnpm backend script token [email]`              | Generate an auth token for the user with the specified email                                                   |
| `pnpm backend script sitemap [output directory]` | Generate a sitemap                                                                                             |
| `pnpm backend script cleanup`                    | Remove unused data                                                                                             |
| `pnpm backend script messages`                   | Notify users about unread messages                                                                             |
| `pnpm backend script views`                      | Create a fake view record                                                                                      |
| `pnpm backend script premium`                    | Set `jobs.premium = false` for inactive subscriptions                                                          |
| `pnpm frontend build`                            | Build frontend (production environment)                                                                        |
| `pnpm frontend serve`                            | Run frontend server                                                                                            |



## Directory structure

```sh
packages
    # API server and scripts
    backend
    |
    └── database
        |   # connection, extensions, views, triggers
        └── config
            # database migrations, used in `pnpm backend database [command]`
            migrations
            # models are knex extension
            # data - for updating M2M children `db('companies').update({ branches: [1, 2, 3] })`
            # relations - apply join `.relation('applications', 'rooms')`
            # queries - `.query('applications', 'filter', { ... })`
            models
            utils
            # knex instance
            knex.js
        # global things
        modules
        # API routes
        routes
        # used in `pnpm backend script [filename]`
        scripts
        # unlike modules, services are functions which is executed upon request
        services
        # email templates
        templates
        # PG_NOTIFY handlers
        actions.js
        # backend context
        index.js
        # runs `pnpm backend script [filename]`
        script.js
        # backend server
        server.js
    # Vue.js application
    frontend 
    |   # configuration files
    └── config
        # global components, composables, icons, etc.
        global
        # lg - https://icons8.com/line-awesome
        # sm - https://fontawesome.com/search?ic=free
        # il - illustrations
        icons
        # textboxes, dropdowns, etc.
        inputs
        # repeating components (in v-for)
        # units - tiles in the list
        # items - just repeating elements
        items
        # landing page components
        landing
        # large layout components
        layout
        # modal windows `useModal().show(name)`
        modals
        # public files
        public
        # application pages
        routes 
        # services are used in app.js
        # they are functions that are executed on every request
        # Vue provides returned data 
        services 
        # application styles
        styles
        # small ui components
        ui
        # vite's entry point
        index.html
        # app initialization
        app.js
        # SSR server
        server.js
        # vite configuration
        vite.config.js
        # root component
        index.vue
    # utils and constants used in frontend and backend
    shared
# PNPM patches
patches
# PM2 config
ecosystem.config.js
# .env files example
example.env
# PNPM workspaces
pnpm-workspace.yaml
```


