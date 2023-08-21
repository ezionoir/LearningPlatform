const mongoose = require("mongoose");
const Question = require("../model/Question");
const DifficultyEnum = require("../constants/Enum");
const { parseQuery } = require("./utils");

const QuestionController = {
    addQuestion: async (req, res, next) => {

        // input format:
        // {
        //     courseId: String,
        //     question: String,
        //     options: [String],
        //     answer: String,
        //     difficulty: Number
        // }

        if (
            !req.body.courseId ||
            !req.body.question ||
            !req.body.options ||
            !req.body.answer ||
            !req.body.difficulty
        ) {
            next({
                invalidFields: true,
                message: "Missing fields."
            });
            return;
        }

        console.log(typeof DifficultyEnum);

        const newQuestion = new Question({
            _id: new mongoose.Types.ObjectId,
            courseId: req.body.courseId,
            content: {
                question: req.body.question,
                options: req.body.options,
                answer: req.body.answer.split(".")[0]
            },
            difficulty: req.body.difficulty
        });

        try {
            await newQuestion.save();
        } catch (err) {
            next({
                success: false,
                message: "Question insertion failed.",
                error: err
            });
            return;
        }
        res.send({
            success: true,
            message: "successfully",
            course: newQuestion
        });
    },

    getQuestionsByDifficulty: async (req, res, next) => {
        const query = await parseQuery(req.query);

        if (!query.courseId || !query.difficulty) {
            next({
                invalidFields: true,
                message: "Missing difficulty."
            });
            return;
        }

        try {
            const questions = await Question.find({
                courseId: query.courseId,
                difficulty: query.difficulty
            }).select("courseId content.question content.options difficulty");
            res.status(200).json({
                success: true,
                questions: questions
            });
        } catch (err) {
            next({
                success: false,
                message: `No questions available at difficulty ${req.body.difficulty}`
            });
            return;
        }
    },

    verifyAnswer: async (req, res, next) => {
        if (!req.body.answer || !req.body.id) {
            next({
                invalidFields: true,
                message: "Missing fields."
            });
            return;
        }

        try {
            const correctAnswer = await Question.findOne({_id: req.body.id}).select("content.answer -_id");
            res.send({
                success: true,
                verification: correctAnswer.content.answer === req.body.answer
            });
        } catch (err) {
            next({
                success: false,
                message: "Query error."
            })
            return;
        }
    }
}

module.exports = QuestionController;