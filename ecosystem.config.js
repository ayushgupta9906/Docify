module.exports = {
    apps: [
        {
            name: 'docify-backend',
            script: './backend/dist/server.js',
            instances: 'max',
            exec_mode: 'cluster',
            watch: false,
            max_memory_restart: '1G',
            env: {
                NODE_ENV: 'production',
                PORT: 3001,
            },
            error_file: './logs/backend-error.log',
            out_file: './logs/backend-out.log',
            log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
            merge_logs: true,
        },
        {
            name: 'docify-frontend',
            script: 'node_modules/.bin/next',
            args: 'start -p 3000',
            instances: 1,
            exec_mode: 'fork',
            watch: false,
            max_memory_restart: '500M',
            env: {
                NODE_ENV: 'production',
                NEXT_PUBLIC_API_URL: 'http://localhost:3001/api',
            },
            error_file: './logs/frontend-error.log',
            out_file: './logs/frontend-out.log',
            log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
            merge_logs: true,
        },
    ],
};
