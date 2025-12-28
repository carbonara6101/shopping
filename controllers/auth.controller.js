function getSignup(req, res) {
    res.render("custom/auth/signup");
}

function getLogin(req, res) {

}

module.exports = {
    getSignup: getSignup,
    getLogin: getLogin
};