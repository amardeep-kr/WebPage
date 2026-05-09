import express from "express"
import ReviewCtrl from "./reviews.controller.js"

const router =express.Router()

router.route("/").get((req, res) => res.send("hello world"))

export default router