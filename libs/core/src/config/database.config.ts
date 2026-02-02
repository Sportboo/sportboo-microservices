export const DatabaseServiceConfig = {
        url: process.env.DATABASE_URL,
        host: process.env.DATABASE_HOSTNAME,
        port: parseInt(process.env.DATABASE_PORT, 10),
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        name: process.env.DATABASE_NAME,
    }