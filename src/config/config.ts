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
    },
    AUTH: {
        READ: Number(process.env.AUTH_READ) || 2,
        WRITE: Number(process.env.AUTH_WRITE) || 4,
        EDIT: Number(process.env.AUTH_EDIT) || 8,
        GRANT: Number(process.env.AUTH_GRANT) || 16,
        ADMIN: Number(process.env.AUTH_ADMIN) || 32
    },
    // CDB: {
    //     C_ENV_VAR: process.env.C_ENV_VAR,
    //     C_NAME: process.env.C_NAME,
    //     C_KEY: process.env.C_KEY,
    //     C_SECRET: process.env.C_SECRET
    // }
}