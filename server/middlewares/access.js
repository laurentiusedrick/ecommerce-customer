"use strict"

const {User, Cart, Favorite} = require("../models/index.js")
const jwt = require("jsonwebtoken")

class Access {
    static async authenticate(req,res,next) {
        try {
            const credential = jwt.verify(req.headers.access_token,process.env.JWT_SECRET || "123456")
            let user = await User.findOne({where:{email:credential.email}})
            if (user) {
                req.access_id = user.id
                req.access_email = user.email    
                req.access_role = user.role
                next()
            } else {
                throw new Error("Invalid token")
            }
        } catch (error) {
            next(error)
        }
    }
    static async adminAuthorize(req,res,next) {
        try {
            if (req.access_role === "admin") {
                next()
            } else {
                throw new Error("Unauthorized access")
            }
        } catch (error) { 
            next(error)
        }
    }
    static async cartAuthorize(req,res,next) {
        try {
          const cart = await Cart.findByPk(req.params.id)
            if (cart.UserId === req.access_id) {
                next()
            } else {
                throw new Error("Unauthorized access")
            }
        } catch (error) { 
            next(error)
        }
    }
    static async favoriteAuthorize(req,res,next) {
        try {
          const favorite = await Favorite.findByPk(req.params.id)
            if (favorite.userId === req.access_id) {
                next()
            } else {
                throw new Error("Unauthorized access")
            }
        } catch (error) { 
            next(error)
        }
    }
}

module.exports = Access