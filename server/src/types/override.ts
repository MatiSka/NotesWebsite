declare global {
    namespace Express {
        interface Request {
            user:           any
            accessToken:    any
        }
    }
}

export {}