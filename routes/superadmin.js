const express = require("express");
const {
    superAdminLogin,
    registerAdmins,
    superAdminLogout,
    deleteAdmin,
    getAllAdmins,
    getSingleAdmin,
    superAdminProfile
} = require("../controllers/superadmin");
const {
    isSuperAdminLogin,
    isSuperAdmin
} = require("../middlewares/auth");
const router = express.Router();

router.route('/login/admin').post(superAdminLogin);
router.route('/login/admin/register').post(isSuperAdminLogin, isSuperAdmin, registerAdmins);
router.route('/admin/logout').get(isSuperAdminLogin, isSuperAdmin, superAdminLogout);
router.route('/admin/delete/record/:id').delete(isSuperAdminLogin, isSuperAdmin, deleteAdmin);
router.route('/admin/getallrecords').get(isSuperAdminLogin, isSuperAdmin, getAllAdmins);
router.route('/admin/getsingleadmin/:id').get(isSuperAdminLogin, isSuperAdmin, getSingleAdmin);
router.route('/admin/me').get(isSuperAdminLogin, isSuperAdmin, superAdminProfile);


module.exports = router;