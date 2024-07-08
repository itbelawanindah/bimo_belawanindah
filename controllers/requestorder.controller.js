const {
    validationResult
} = require('express-validator')
const Requestorder = require('../models/requestorder.model')
const moment = require('moment')
moment.locale('id')


exports.crateRequestOrder = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty) {
            return res.status(400).json({
                success: false,
                msg: "Errors",
                errors: errors.array(),
            })
        }
        const {
            pickup_address,
            drop_address,
            description,
            est_total_distance,
            est_duration
        } = req.body

        var obj = {
            pickup_address,
            drop_address,
            description,
            est_total_distance,
            est_duration
        }
        if (req.body.item_id) {
            obj.item_id = req.body.item_id
        }
        const requestorder = new Requestorder(obj);
        const requestorderData = await requestorder.save()
        const requestorderFullData = await Requestorder.findOne({
            _id: requestorderData._id
        }).populate('item_id')

        // console.log(postFullData)
        return res.status(200).json({
            success: true,
            msg: "Post saved successfully",
            data: requestorderFullData
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success: false,
            msg: error.message
        })
    }
}