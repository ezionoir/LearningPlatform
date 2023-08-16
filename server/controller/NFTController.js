const mongoose = require("mongoose");
const NFT = require("../model/NFT");
const Course = require("../model/Course");
const User = require("../model/User");
const { parseQuery } = require("./utils");

const NFTController = {
    addNFT: async (req, res, next) => {
        if (!req.body.courseId || !req.body.uri) {
            next({
                invalidFields: true,
                message: "Missing fields."
            });
            return;
        }

        const courseDetails = await Course.findOne({_id: req.body.courseId}).exec();
        const lecturerId = courseDetails.lecturer;
        const lecturer = []
        for (id of lecturerId) {
            lecturer.push(await User.findOne({_id: id}).select("userName"));
        }

        const newNFT = new NFT({
            _id: new mongoose.Types.ObjectId,
            uri: req.body.uri,
            metadata: {
                name: "Name NFT",
                description: "Description",
                image: "[image url]",
                externalUrl: "[website to learn more about the NFT]",
                attributes: [
                    {traitType: "course", value: {id: req.body.courseId, courseName: courseDetails.courseName}},
                    {traitType: "lecturer", value: lecturer}
                ]
            }
        });

        try {
            await newNFT.save();
        } catch (err) {
            next({
                success: false,
                message: "NFT insertion failed."
            });
            return;
        }
        res.send({
            success: true,
            message: "successfully",
            NFT: newNFT
        });
    }
}

module.exports = NFTController;