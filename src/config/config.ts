export default {
    ENV: process.env.NODE_ENV || 'development',
    KEY: {
        SECRET: process.env.SECRET_KEY || '//password',
        SALT: Number(process.env.SALT) || 11
    },
    DB: {
        URI: process.env.MONGO_URI || 'mongodb://localhost/database',
        USER: process.env.MONGO_USER,
        PASSWORD: process.env.MONGO_PASSWORD
    }
}