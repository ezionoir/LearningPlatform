const router=require('express').Router();
const userRouter = require('./UserRouter')
const adminRouter = require('./AdminRouter')
const testRouter = require('./TestRouter')
router.use('/user',userRouter);
router.use('/admin', adminRouter);
router.use('/test', testRouter);





router.use((err, req, res, next) => {
    if (err) res.status(400).send(err)
})
router.use('/', (req, res, next) => {
    res.status(404).send({error:"Page not found"})
})



module.exports = router