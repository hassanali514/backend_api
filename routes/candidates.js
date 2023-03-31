const express = require("express");
const {
    createCandidate,
    deleteCandidate,
    getCandidatesOfAdmin,
    updateCandidate,
    getSingleCandidateOfAdmin
} = require("../controllers/candidates");
const {
    isAdminLogin,
    isAdmin
} = require("../middlewares/auth");
const router = express.Router();

router.route('/candidates/createcandidates').post(isAdminLogin, isAdmin, createCandidate);
router.route('/candidates/delete/:id').delete(isAdminLogin, isAdmin, deleteCandidate);
router.route('/candidates/record').get(isAdminLogin, isAdmin, getCandidatesOfAdmin);
router.route('/candidates/update/:id').patch(isAdminLogin, isAdmin, updateCandidate);
router.route('/candidates/getsinglecandidate/:id').get(isAdminLogin, isAdmin, getSingleCandidateOfAdmin);


module.exports = router;