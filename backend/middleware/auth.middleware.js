export const requireAuth = (req, res, next) => {
    if (!req.cookies.user) {
        return res.status(401).json({ success: false });
    }
    next();
};