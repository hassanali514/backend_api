const Candidate = require("../models/Candidates");
const Admins = require("../models/Admins");

exports.createCandidate = async (req, res) => {
    try {

        const candidateData = {
            name: req.body.name,
            fatherName: req.body.fatherName,
            passportNo: req.body.passportNo,
            dateOfBirth: req.body.dateOfBirth,
            passportExpiryDate: req.body.passportExpiryDate,
            nationality: req.body.nationality,
            trade: req.body.trade,
            careOf: req.body.careOf,
            status: req.body.status,
            owner: req.admin._id
        }

        const newCandidate = await Candidate.create(candidateData);

        const admin = await Admins.findById(req.admin._id);

        admin.record.push(newCandidate._id);

        await admin.save();

        res.status(201).json({
            success: true,
            candidate: newCandidate,
            admins: admin
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.deleteCandidate = async (req, res) => {

    try {

        const candidate = await Candidate.findById(req.params.id);

        if (!candidate) {
            return res.status(404).json({
                success: false,
                message: "candidate not found"
            })
        }

        if (candidate.owner.toString() !== req.admin._id.toString()) {
            return res.status(401).json({
                success: false,
                message: "unauthorize"
            })
        }

        await Candidate.deleteOne({ _id: candidate._id });

        const admin = await Admins.findById(req.admin._id);

        const index = admin.record.indexOf(req.params.id)

        admin.record.splice(index, 1);

        await admin.save();

        res.status(200).json({
            success: true,
            message: "candidate deleted"
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

exports.getCandidatesOfAdmin = async (req, res) => {
    try {
        const admin = await Admins.findById(req.admin._id);

        const candidates = await Candidate.find({
            "owner": {
                $in: admin._id
            }
        });

        res.status(200).json({
            success: true,
            candidates,
            admin: admin.record,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

exports.updateCandidate = async (req, res) => {
    try {

        const candidate = await Candidate.findById(req.params.id);

        if (!candidate) {
            return res.status(404).json({
                success: false,
                message: "candidate not found"
            })
        }

        if (candidate.owner.toString() !== req.admin._id.toString()) {
            return res.status(401).json({
                success: false,
                message: "unauthorize"
            })
        }

        if (
            !req.body.name ||
            !req.body.fatherName ||
            !req.body.passportNo ||
            !req.body.dateOfBirth ||
            !req.body.passportExpiryDate ||
            !req.body.nationality ||
            !req.body.trade ||
            !req.body.careOf ||
            !req.body.status
        ) {
            return res.status(400).json({
                success: false,
                message: "insufficient data"
            })
        }

        candidate.name = req.body.name;
        candidate.fatherName = req.body.fatherName;
        candidate.passportNo = req.body.passportNo;
        candidate.dateOfBirth = req.body.dateOfBirth;
        candidate.passportExpiryDate = req.body.passportExpiryDate;
        candidate.nationality = req.body.nationality;
        candidate.trade = req.body.trade;
        candidate.careOf = req.body.careOf;
        candidate.status = req.body.status;

        await candidate.save();

        res.status(200).json({
            success: true,
            message: "candidate updated"
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.getSingleCandidateOfAdmin = async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.params.id);

        if (!candidate) {
            return res.status(404).json({
                success: false,
                message: "candidate not found"
            })
        }

        if (candidate.owner.toString() !== req.admin._id.toString()) {
            return res.status(401).json({
                success: false,
            message: "unauthorize"
            })
        }

        res.status(200).json({
            success: true,
            candidate
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }

}