const express = require("express");
const {
    adminLogin,
    adminLogout,
    resetAdminPassword,
    forgetAdminPassword,
    resetAdminForgetPassword
} = require("../controllers/admins");
const {
    isAdminLogin,
    isAdmin
} = require("../middlewares/auth");
const router = express.Router();

router.route('/login').post(adminLogin);
router.route('/logout').get(isAdminLogin, isAdmin, adminLogout);
router.route('/update/password').patch(isAdminLogin, isAdmin, resetAdminPassword);
router.route('/forgot/password').post(forgetAdminPassword);
router.route('/password/reset/:token').patch(resetAdminForgetPassword);

module.exports = router;