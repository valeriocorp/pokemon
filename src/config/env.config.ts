export const EnvConfig = () => ({
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    mongodb: process.env.MONGODB || 'mongodb://localhost:27017/nest',
})