"use strict";
const express = require("express");
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

const User = require('../models/user');


// Register
router.post('/register', (req, res, next) => {
    User.findOne({
        'username': req.body.username
    }, (err, user) => {
        if (err) throw err;
        if (user) {
            res.json({ success: false, msg: 'This username is already registered. Please try another' });
        } else {
            let newUser = new User({
                name: req.body.name,
                email: req.body.email,
                username: req.body.username,
                password: req.body.password
            });

            User.addUser(newUser, (err, user) => {
                if (err) {
                    res.json({ success: false, msg: 'Failed to register user' });
                }
                else {
                    res.json({ success: true, msg: 'User registered' });
                }
            });
        }
    })
});

// Authenticate
router.post('/authenticate', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username, (err, user) => {
        if (err) throw err;
        if (!user) {
            return res.json({ success: false, msg: 'User not found' });
        }

        User.comparePassword(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                const token = jwt.sign(user, config.secret, {
                    expiresIn: 604800 // 1 week
                });

                res.json({
                    success: true,
                    token: 'JWT ' + token,
                    user: {
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        email: user.email
                    }
                });
            } else {
                return res.json({ success: false, msg: 'Wrong password' });
            }
        });
    });
});

// Profile
router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    res.json({ user: req.user });
});

// Add step
router.post('/cases/write', (req, res, next) => {
    const username = req.body.username;

    User.getUserByUsername(username, (err, user) => {
        if (err) throw err;
        if (!user) {
            return res.json({ success: false, msg: 'User not found' });
        }
        let newCase = {
            caseID: req.body.caseID,
            step: req.body.step,
            caseType: req.body.caseType,
            time: req.body.time,
            role: req.body.role,
            isOBL: req.body.isOBL,
            date: new Date()
        };
        User.update({ username: username }, { $push: { cases: newCase } }, () => { res.json({ success: true, msg: 'User was added' }) });
    });
});

// Get time
router.post('/cases/read', (req, res, next) => {
    const username = req.body.username;
    const dateObj = req.body.date;
    const role = req.body.role;
    const date = new Date(dateObj.y, dateObj.m - 1, dateObj.d);
    let todaysCases = [];
    let timeSynthes = 0, timeObl = 0;
    let separatedStep = 'images qc';

    User.getUserByUsername(username, (err, user) => {
        if (err) throw err;
        if (!user) {
            return res.json({ success: false, msg: 'User not found' });
        } else {

            user.cases.forEach((selectedCase, index, arr) => {
                if (selectedCase.date && selectedCase.time) {
                    let selectedDate = new Date(selectedCase.date.getFullYear(), selectedCase.date.getMonth(), selectedCase.date.getDate());
                    if (selectedDate.getTime() == date.getTime()) {
                        if (role.toLowerCase() == separatedStep.toLowerCase()) {
                            if (selectedCase.step.toLowerCase() == separatedStep.toLowerCase())
                                if (selectedCase.isOBL) {
                                    timeObl += selectedCase.time;
                                } else {
                                    timeSynthes += selectedCase.time;
                                }
                        } else {
                            if (selectedCase.step.toLowerCase() != separatedStep) {
                                if (selectedCase.isOBL) {
                                    timeObl += selectedCase.time;
                                } else {
                                    timeSynthes += selectedCase.time;
                                }
                            }
                        }
                    }
                }
            });
            return res.json({ success: true, caseTime: { timeSynthes: timeSynthes, timeObl: timeObl } });
        }
    });
});

// Get today's cases
router.post('/cases', (req, res, next) => {
    const username = req.body.username;

    User.getUserByUsername(username, (err, user) => {
        if (err) throw err;
        if (!user) {
            return res.json({ success: false, msg: 'User not found' });
        } else {
            return res.json({ success: true, cases: user.cases });
        }
    });
});

router.post('/cases/weekly', (req, res, next) => {
    const username = req.body.username;
    const startDate = new Date(req.body.startDate);
    const endDate = new Date(req.body.endDate);

    User.getUserByUsername(username, (err, user) => {
        if (err) throw err;
        if (!user) {
            return res.json({ success: false, msg: 'User not found' });
        } else {
            let weekCases = [];
            user.cases.forEach((el, i, arr) => {
                if (el.date && el.date >= startDate && el.date <= endDate) {
                    weekCases.push(el);
                }
            });
            return res.json({ success: true, weekCases: weekCases });
        }
    });
});
module.exports = router;