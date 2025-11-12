import jwt from "jsonwebtoken"

export function verifyToken(req) {
    const token = req.cookies.token;
    if (!token) throw new Error("No Token Provided")

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET || "default_Secret")
        return decode;
    } catch (error) {
        throw new Error("Invalid or expired token")
    }
}