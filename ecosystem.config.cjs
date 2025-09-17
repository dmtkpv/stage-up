module.exports = {
    apps: [



        // -----------------
        // Servers
        // -----------------

        {
            name: 'backend',
            script: 'pnpm',
            args: 'backend serve'
        },
        {
            name: 'frontend',
            script: 'pnpm',
            args: 'frontend serve'
        },



        // -----------------
        // Scripts
        // -----------------

        {
            name: 'sitemap',
            script: 'pnpm',
            args: 'backend script sitemap ../frontend/dist',
            cron_restart: '0 2 * * *',
        },
        {
            name: 'messages',
            script: 'pnpm',
            args: 'backend script messages',
            cron_restart: '*/15 * * * *',
        },
        {
            name: 'views',
            script: 'pnpm',
            args: 'backend script views',
            cron_restart: '0 * * * *',
        }



    ]
}