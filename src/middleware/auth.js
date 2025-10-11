export function auth(req, res, next) {
    if (req.session.user) {
        return next();
    }
    req.flash('error', 'Silakan login terlebih dahulu');
    res.redirect('/login');
}

export function guest(req, res, next) {
    if (req.session.user) {
        return res.redirect('/');
    }
    next();
}
