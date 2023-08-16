const mongoose = require("mongoose");
const User = require("../model/User.js");
const { UserRoleEnum, UserStatusEnum } = require("../constants/Enum.js");
const { parseQuery } = require("./utils");

const UserController = {
    // Add a user to database
    addUser: async (req, res, next) => {
        const userName = req.body.userName;

        if (!req.body.userName || !req.body.email || !req.body.walletAccount) {
            next({
                invalidFields: true,
                message: "Missing fields"
            })
            return;
        }

        const existing = await User.findOne({ userName: userName });
        if (existing) {
            res.status(401);
            res.json({
                message: "User name already exists",
                inValid: true,
                success: false
            })
            return;
        }

        const newUser = new User({
            _id: new mongoose.Types.ObjectId,
            userName: userName,
            email: req.body.email,
            walletAccount: req.body.walletAccount,
            createdDate: new Date(),
            role: UserRoleEnum.member,
            status: UserStatusEnum.active
        });
        
        try {
            await newUser.save();
        } catch (err) {
            next({
                success: false,
                isDuplicated: true,
                message: "User insertion failed.",
                error: err
            });
            return;
        }
        res.send({
            success: true,
            message: "successfully",
            user: newUser
        });
    },

    // Get details from query
    getDetails: async (req, res, next) => {
        const query = await parseQuery(req.query);

        if (query.email || query.walletAccount) {
            next({
                invalidFields: true,
                message: "Querying user details by email or MetaMask address is prohibited."
            })
            return;
        }

        try {
            const details = await User.find(query).select("userName createdDate role status -_id");
            res.status(200).json({
                success: true,
                accountDetails: details
            })
        } catch (err) {
            next({
                success: false,
                message: "Couldn't find user name",
                error: err
            });
            return;
        };
    },

    getUserNameFromId: async (req, res, next) => {
        const query = await parseQuery(req.query);

        if (!query.id) {
            next({
                invalidFields: true,
                message: "Missing ID"
            });
        }

        try {
            const userName = await User.findOne({_id: query.id}).select("userName");
            res.status(200).json({
                success: true,
                userName: userName
            });
        } catch (err) {
            next({
                success: false,
                message: "Couldn't find user name",
                error: err
            })
            return;
        }
    }
}

module.exports = UserController;