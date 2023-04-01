const express = require("express");
const fileManager = require("../actions/fileUpload");

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

router.route('/candidates/createcandidates').post(isAdminLogin, isAdmin,
    fileManager.uploadDocument.fields([
		{
			name: "passportImage",
			maxCount: process.env.MAX_NO_OF_PASSPORT_IMAGES,
		},
		{
			name: "imageUrl",
			maxCount: process.env.MAX_NO_OF_IMAGES,
		},
        {
			name: "visaImageUrl",
			maxCount: process.env.MAX_NO_OF_IMAGES,
		},
        {
			name: "cvImageUrl",
			maxCount: process.env.MAX_NO_OF_IMAGES,
		},
        {
			name: "cnicImageUrl",
			maxCount: process.env.MAX_NO_OF_IMAGES,
		},
        {
			name: "licenseImageUrl",
			maxCount: process.env.MAX_NO_OF_IMAGES,
		},
	]),
    createCandidate);

router.route('/candidates/delete/:id').delete(isAdminLogin, isAdmin, deleteCandidate);
router.route('/candidates/record').get(isAdminLogin, isAdmin, getCandidatesOfAdmin);
router.route('/candidates/update/:id').patch(isAdminLogin, isAdmin, updateCandidate);
router.route('/candidates/getsinglecandidate/:id').get(isAdminLogin, isAdmin, getSingleCandidateOfAdmin);


module.exports = router;