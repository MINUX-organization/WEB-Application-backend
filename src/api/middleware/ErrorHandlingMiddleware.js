import { ApiError } from "../../error/ApiError.js"

function errorHandler(err, req, res, next) {
    if (err instanceof ApiError) {
        return res.status(err.status).json({ error: err.message })
    }
    return res.status(500).json({ error: `Unexpected error: ${err.message}` })
}

export { errorHandler }
