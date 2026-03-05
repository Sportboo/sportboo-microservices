import { registerAs } from "@nestjs/config"

export default registerAs('database', () => {
    return {
        url: process.env.DATABASE_URL!,
        host: process.env.DATABASE_HOSTNAME,
        port: parseInt(process.env.PORT ?? '3001', 10),
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        name: process.env.DATABASE_NAME,
    }
})
