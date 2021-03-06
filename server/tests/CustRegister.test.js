"use strict"

const app = require("../app.js")
const request = require("supertest")
const {User} = require("../models")

describe("Customer", ()=>{

    beforeAll(done=>{
          User.create({
            name: 'John Doe',
            email: 'johndoe@mail.com',
            password: '123456',
            role: '',
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        )
        .then(res=>{return User.create({
            name: 'John Doe',
            email: 'johndoe@gmail.com',
            password: '',
            role: '',
            createdAt: new Date(),
            updatedAt: new Date(),
        })})
        .then(res=>{done()})
        .catch(err=>console.log(err))
    })

    afterAll(done=>{
        User.destroy({
          cascade:true,
          where:{role:'customer'}
            })
        .then(res=>done())
        .catch(err=>console.log(err))
    })

    test("customer register success",(done)=>{
        request(app)
        .post("/register")
        .send({
            name: 'John Doe',
            email: 'johndoe@email.com',
            password: '123456'
        })
        .end((err,res)=>{
            console.log(res.body)
            if (err) done(err)
            expect(res.status).toBe(201)
            expect(res.body).toBeInstanceOf(Object)
            expect(res.body).toHaveProperty("access_token")
            done()
        })
    })

    test("customer register failed - duplicate email", done=>{
        request(app)
        .post("/register")
        .send({
            name: 'John Doe',
            email: "johndoe@mail.com",
            password: "123456"
        })
        .end((err,res)=>{
            if (err) done(err)
            expect(res.status).toBe(400)
            expect(res.body).toBeInstanceOf(Object)
            expect(res.body).toHaveProperty("message", "Preferred email has been taken")
            done()
        })
    })

    test("customer register failed - register attempt with previous Social Login", done=>{
        request(app)
        .post("/register")
        .send({
            name: 'John Doe',
            email: "johndoe@gmail.com",
            password: "123456"
        })
        .end((err,res)=>{
            if (err) done(err)
            expect(res.status).toBe(400)
            expect(res.body).toBeInstanceOf(Object)
            expect(res.body).toHaveProperty("message", "Did you login via Social Login previously?")
            done()
        })
    })

    test("customer register failed - empty name", done=>{
        request(app)
        .post("/register")
        .send({
            name: '',
            email:"johndoe@email.com",
            password:"1234"
        })
        .end((err,res)=>{
            if (err) done(err)
            expect(res.status).toBe(400)
            expect(res.body).toBeInstanceOf(Object)
            expect(res.body).toHaveProperty("message", "Please fill in your name")
            done()
        })
    })

    test("customer register failed - empty email", done=>{
        request(app)
        .post("/register")
        .send({
            name: 'John Doe',
            email:"",
            password:"1234"
        })
        .end((err,res)=>{
            if (err) done(err)
            expect(res.status).toBe(400)
            expect(res.body).toBeInstanceOf(Object)
            expect(res.body).toHaveProperty("message", "Please fill in the email")
            done()
        })
    })

    test("customer register failed - empty password", done=>{
        request(app)
        .post("/register")
        .send({
            name: 'John Doe',
            email:"johndoe@email.com",
            password:""
        })
        .end((err,res)=>{
            if (err) done(err)
            expect(res.status).toBe(400)
            expect(res.body).toBeInstanceOf(Object)
            expect(res.body).toHaveProperty("message", "Please fill in the password")
            done()
        })
    })
})