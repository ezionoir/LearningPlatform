const tokenHelper = require('../helper/Token')
const { UserRoleEnum } = require('../constants/Enum')
var AuthMiddleware = {
    authorizeUser: (req, res, next, role) => {
        data = tokenHelper.getDataFromToken(req.cookies.token)
        if (data === 0 || !data.user || data.user.role!=role)
            res.status(403).send({
                status: 403,
                message: 'Bad authentication'
            })
        else {
            req.user = data.user
            next()
        }
    },
    isContributor: (req, res, next) => {
        this.authorizeUser(req,res,next,UserRoleEnum.contributor)
    },
    isPartner: (req, res, next) => {
        this.authorizeUser(req,res,next,UserRoleEnum.partner)
    },
    isAdmin: (req, res, next) => {
        this.authorizeUser(req,res,next,UserRoleEnum.admin)
    }
}

module.exports = AuthMiddleware