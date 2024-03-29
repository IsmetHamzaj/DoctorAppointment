const express = require('express')
const router = express.Router();
const User = require('../models/userModel')
const moment = require('moment')
const Doctor = require("../models/doctorModel")
const Appointment = require("./../models/appointmentModel")
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
const authMiddleware = require("../middlewares/authMiddleware")

router.post('/register', async (req, res) => {
    try {
        const userExists = await User.findOne({ email: req.body.email })
        if (userExists) {
            return res
                .status(200)
                .send({ message: "User already exists", success: false })
        }
        const password = req.body?.password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)
        req.body.password = hashedPassword
        const newUser = new User(req.body)
        await newUser.save()
        res.status(200).send({ message: "User created successfully", success: true })
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "Errorr creating user", success: false, error })
    }
})

router.post('/login', async (req, res) => {
    try {
        console.log(req)
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            return res
                .status(200)
                .send({ message: "User doesnt exist", success: false })
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password)
        if (!isMatch) {
            return res
                .status(200)
                .send({ message: "Password is incorrect", success: false })
        } else {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" })
            res
                .status(200)
                .send({ message: "Login successfully", success: true, data: token })
        }
    }
    catch (err) {
        console.log(err)
        res
            .status(500)
            .send({ message: "Error logging in", success: false, err })
    }
})


router.post('/get-user-info-by-id', authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.body.userId })
        user.password = undefined;
        if (!user) {
            return res
                .status(200)
                .send({ message: "User does not exists", success: false })
        } else {
            res.status(200).send({ success: true, data: user })
        }
    } catch (error) {
        console.log(error)
        res
            .status(500)
            .send({ message: "Error getting user info", success: false, error })
    }
})


router.post('/apply-doctor-account', authMiddleware, async (req, res) => {
    try {
        const newDoctor = new Doctor({ ...req.body, status: "pending" })
        await newDoctor.save()

        const adminUser = await User.findOne({ isAdmin: true })

        const unseenNotifications = adminUser.unseenNotifications
        unseenNotifications.push({
            type: "new-doctor-request",
            message: `${newDoctor.firstName} ${newDoctor.lastName} has applied for a doctor account`,
            data: {
                doctorId: newDoctor._id,
                name: newDoctor.firstName + " " + newDoctor.lastName
            },
            onClickPath: "/admin/doctors"
        })
        await User.findByIdAndUpdate(adminUser._id, { unseenNotifications })
        res.status(200).send({
            success: true,
            message: "Doctor account applied successfully",
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "Errorr applying for doctor", success: false, error })
    }
})


router.post('/mark-all-notifications-as-seen', authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.body.userId })
        const unseenNotifications = user.unseenNotifications
        const seenNotifications = user.seenNotifications
        seenNotifications.push(...unseenNotifications)
        user.unseenNotifications = []
        user.seenNotifications = seenNotifications
        const updatedUser = await user.save()
        updatedUser.password = undefined
        res.status(200).send({
            success: true,
            message: "All notifications marked as seen",
            data: updatedUser
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "Errorr applying for doctor", success: false, error })
    }
})


router.post('/delete-all-notifications', authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.body.userId })
        user.seenNotifications = []
        user.unseenNotifications = []
        const updatedUser = await user.save()
        updatedUser.password = undefined
        res.status(200).send({
            success: true,
            message: "All notifications deleted",
            data: updatedUser
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "Errorr applying for doctor", success: false, error })
    }
})


router.get("/get-all-approved-doctors", authMiddleware, async (req, res) => {
    try {
        const doctors = await Doctor.find({ status: "approved" })
        res.status(200).send({
            message: "Doctors fetched successfully",
            success: true,
            data: doctors
        })
    }
    catch (error) {
        console.log(error)
        res.status(500).send({
            message: "Error applying doctor account",
            success: false,
            error
        })
    }
})


router.post("/book-appointment", authMiddleware, async (req, res) => {
    try {
        req.body.status = "pending"
        const newAppointment = new Appointment(req.body)
        // req.body.doctorInfo.userId = req.body.doctorInfo._id;
        await newAppointment.save()
        const user = await User.findOne({ _id: req.body.doctorInfo.userId})
        console.log(user)
        // user.unseenNotifications = []
        user.unseenNotifications.push({
            type: "new-appointment-request",
            message: `A new appointment has been made by ${req.body.userInfo.name}`,
            onClickPath: '/doctor/appointments'
        })
        await user.save()

        res.status(200).send({
            message: "Appointment booked successfully",
            success: true
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            message: "Error booking appointment",
            success: false,
            error: error
        })
    }
})



router.post("/check-booking-availability", authMiddleware, async (req, res) => {
    try {
        const date = moment(req.body.date, 'DD-MM-YYYY').toISOString()
        const fromTime = moment(req.body.time, 'HH:mm').subtract(60, 'minuts').toISOString()
        const toTime = moment(req.body.time, 'HH:mm').add(60, 'minuts').toISOString()
        const doctorId = req.body.doctorId
        const appointments = await Appointment.find({
            doctorId,
            date,
            time: { $gte: fromTime, $lte: toTime },
            status: "approved"
        })
        if (appointments.length > 0) {
            return res.status(200).send({
                message: "Appointment not available",
                success: false
            })
        } else {
            return res.status(200).send({
                message: "Appointment available",
                success: true
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message: "Error booking appointment",
            success: false,
            error: error
        })
    }
})



module.exports = router