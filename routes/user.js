const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");


require("../model/User");
const User = mongoose.model("users")


router.get("/login", (req, res) => {
    res.render("users/login")
})

router.get("/register", (req, res) => {
    res.render("users/register");
})


router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
      successRedirect:'/ideas',
      failureRedirect: '/user/login',
      failureFlash: true
    })(req, res, next);
  });

  

router.post("/register", (req, res) => {
    let errors = [];
    if (req.body.password != req.body.password2) {
        errors.push({ text: "Passwords donot match" })
    }
    if (req.body.password.length < 4) {
        errors.push({ text: "Passwords must be atleast 4 characters" })
    }

    if (errors.length > 0) {
        res.render("users/register", {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        })
    }
    else {

        User.findOne({ email: req.body.email })
            .then(user => {
                if (user) {
                    req.flash("error_msg", "Email Already Exists");
                    res.redirect("/user/login");
                }
                else {
                    let newUser = {
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password
                    }
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (error, hash) => {
                            if (error) throw error
                            newUser.password = hash;
                            new User(newUser).save()
                                .then(user => {
                                    req.flash("success_msg", "You are now registered");
                                    res.redirect("/user/login")
                                })
                                .catch(err => {
                                    console.log(err);
                                    return;
                                })
                        })
                    })

                }
            });
    }
})


router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success_msg", "Successfullt logged out");
    res.redirect("/user/login");
})



module.exports = router