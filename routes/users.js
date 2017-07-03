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
        if (err) {
            return res.json({ success: false, msg: err });
        }//throw err;
        if (!user) {
            return res.json({ success: false, msg: 'User not found' });
        }

        User.comparePassword(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                res.json({
                    success: true,
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
router.post('/profile', (req, res, next) => {
    const username = req.body.username;
    User.getUserByUsername(username, (err, user) => {
        if (err) throw err;
        if (!user) {
            return res.json({ success: false, msg: 'User not found' });
        } else {
            return res.json({ user: req.user });
        }
    });
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
        User.update({ username: username }, { $push: { cases: newCase } }, () => { res.json({ success: true, msg: 'User was updated' }) });
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
                            if (selectedCase.step.toLowerCase() == separatedStep.toLowerCase()) {
                                if (selectedCase.isOBL) {
                                    timeObl += selectedCase.time;
                                } else {
                                    timeSynthes += selectedCase.time;
                                }
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

// Get all cases
router.post('/cases', (req, res, next) => {
    const username = req.body.username;

    User.getUserByUsername(username, (err, user) => {
        if (err) return res.json({ success: false, msg: err });// throw err;
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
router.post('/cases/weekly/time', (req, res, next) => {
    const username = req.body.username;
    const startDate = new Date(req.body.startDate);
    const endDate = new Date(req.body.endDate);

    User.getUserByUsername(username, (err, user) => {
        // console.log(user)
        if (err) throw err;
        if (!user) {
            return res.json({ success: false, msg: 'User not found' });
        } else {
            let weekTime = {
                weeklyTimeMM: [0, 0, 0, 0, 0, 0, 0],
                weeklyTimeCEMM: [0, 0, 0, 0, 0, 0, 0],
                weeklyTimeQEMM: [0, 0, 0, 0, 0, 0, 0],
                weeklyTimeOblCEMM: [0, 0, 0, 0, 0, 0, 0],
                weeklyTimeOblQEMM: [0, 0, 0, 0, 0, 0, 0],
                weeklyTimeImagesQCMM: [0, 0, 0, 0, 0, 0, 0],
                totalWeeklyTimeMM: 0
            };

            user.cases.forEach((el, i, arr) => {
                if (el.date && el.date >= startDate && el.date <= endDate) {

                    let ind = new Date(el.date).getDay();

                    weekTime.weeklyTimeMM[ind] += el.time;
                    weekTime.totalWeeklyTimeMM += el.time;

                    if (el.role.toLowerCase() === 'ce') {
                        el.isOBL ? weekTime.weeklyTimeOblCEMM[ind] += el.time : weekTime.weeklyTimeCEMM[ind] += el.time;
                    }
                    if (el.role.toLowerCase() === 'qe') {
                        if (el.step.toLowerCase() === 'images qc') {
                            weekTime.weeklyTimeImagesQCMM[ind] += el.time;
                        } else {
                            el.isOBL ? weekTime.weeklyTimeOblQEMM[ind] += el.time : weekTime.weeklyTimeQEMM[ind] += el.time;
                        }
                    }
                }
            });
            for (var prop in weekTime) {
                if (weekTime.hasOwnProperty(prop)) {
                    if (Array.isArray(weekTime[prop]) && weekTime[prop].every((el, i, arr) => { return el === 0; })) {
                        weekTime[prop] = null;
                    } else if (prop === 0) {
                        weekTime[prop] = null;
                    }
                }
            }
            return res.json({ success: true, weekTime: weekTime });
        }
    });
});

router.post('/cases/details', (req, res, next) => {
    const username = req.body.username;
    const date = new Date(req.body.date);

    User.getUserByUsername(username, (err, user) => {
        if (err) throw err;
        if (!user) {
            return res.json({ success: false, msg: 'User not found' });
        } else {
            let cases = [];
            user.cases.forEach((el, i, arr) => {
                if (el.date && (el.date >= date && el.date <= new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1))) {
                    cases.push(el);
                }
            });
            return res.json({ success: true, cases: cases });
        }
    });

})
module.exports = router;