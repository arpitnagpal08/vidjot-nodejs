const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require("../helpers/auth")

require("../model/Ideas");

const Ideas = mongoose.model("ideas");


router.get("/add", ensureAuthenticated, (req, res) => {
    res.render("ideas/add")
})

router.get("/edit/:id", (req, res) => {
    Ideas.findOne({ _id: req.params.id })
        .then(ideas => {
            if(ideas.user_id != req.user.id){
                req.flash("error_msg", "Not Authorized");
                res.redirect("/ideas");
            }
            else{
                res.render("ideas/edit", {
                    ideas: ideas
                })
            }
        })
});


//process form
router.post("/", ensureAuthenticated, (req, res) => {
    let errors = [];

    if (!req.body.title) {
        errors.push({
            text: "Please add a Title"
        })
    }
    if (!req.body.details) {
        errors.push({
            text: "Please add some Details"
        })
    }
    if (errors.length > 0) {
        res.render("ideas/add", {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        })
    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details,
            user_id: req.user.id
        }

        new Ideas(newUser)
            .save()
            .then(idea => {
                req.flash("success_msg", "Video Idea Added")
                res.redirect("/ideas")
            })
    }
})

router.get("/", ensureAuthenticated, (req, res) => {
    Ideas.find({user_id: req.user.id})
        .sort({ date: "desc" })
        .then(ideas => {
            res.render("ideas/index", {
                ideas: ideas
            });
        })

})

router.put("/:id", ensureAuthenticated, (req, res) => {
    Ideas.findOne({ _id: req.params.id })
        .then(idea => {
            idea.title = req.body.title;
            idea.details = req.body.details;

            idea.save()
                .then(ideas => {
                    req.flash("success_msg", "Video Idea Updated");
                    res.redirect("/ideas");
                })
        })
})

router.delete("/:id", ensureAuthenticated, (req, res) => {
    Ideas.remove({ _id: req.params.id })
        .then(() => {
            req.flash('success_msg', 'Video Idea Removed');
            res.redirect("/ideas")
        })
})

module.exports = router