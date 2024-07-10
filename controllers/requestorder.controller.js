const {
    validationResult
} = require('express-validator')
const Requestorder = require('../models/requestorder.model')
const moment = require('moment')
moment.locale('id')


const createRequestOrder = async (req, res) => {
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
            origin,
            destination,
            item_id,
            description,
            est_total_distance,
            est_duration,
            est_sub_total,
            est_vat,
            est_grand_total,

        } = req.body

        var obj = {
            origin,
            destination,
            description,
            est_total_distance,
            est_duration,
            est_sub_total,
            est_vat,
            est_grand_total,
            PaymentStatus: 'unpaid',
            is_active:1,
            customer_id: req.user._id,
            created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
        }
        if (req.body.items_id) {
            obj.items_id = req.body.items_id
        }
        const requestorder = new Requestorder(obj);
        const requestorderData = await requestorder.save()
        const requestorderFullData = await Requestorder.findOne({
            _id: requestorderData._id
        }).populate('items_id')

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

const getDataRequest = async (req, res) => {
    try {
        const is_active =1
        const getData = await Requestorder.find({
          is_active
        }).populate('items_id');
        return res.status(200).json({
            success: true,
            msg: "Fetch Data success",
            data: getData
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message
        })
    }
}

//get data by order customer
const getDataRequestByuser = async (req, res) => {
    try {
        const userId = req.params.customer_id;
        console.log(`Fetching data for user ID: ${userId}`);
        if (!userId) {
            return res.status(404).json({
                success: false,
                msg: "Order is not available"
            })
        }
        const is_active = 1
        const getDataById = await Requestorder.find({
            is_active,
            customer_id: userId
        }).populate('items_id');
        if(getDataById.length === 0) {
            return res.status(200).json({
                success: true,
                msg: "No has Data",
                data: getDataById
            });
        }
        console.log(`Data fetched: ${JSON.stringify(getDataById)}`);
        return res.status(200).json({
            success: true,
            msg: "Fetch Data success",
            data: getDataById
        });
    } catch (error) {
        console.error(`Error fetching data: ${error.message}`);
        return res.status(400).json({
            success: false,
            msg: error.message
        });
    }
}
const cancelRequestOrder = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty) {
            return res.status(400).json({
                success: false,
                msg: "Errors",
                errors: errors.array(),
            })
        }

        const isExist = await Requestorder.findOne({
            _id: req.params._id
        });
        if (!isExist) {
            return res.status(200).json({
                success: false,
                msg: "Order is not exists"
            })
        }
        const is_active = 0
        const userId = req.params.customer_id
        if (!userId) {
            return res.status(200).json({
                success: false,
                msg: "Order is not Your Authorizations"
            })
        }
        const cancelRequestOrder = await Requestorder.findByIdAndUpdate({
            _id: req.params._id
        }, {
            is_active,
            cancel_at: moment().format('YYYY-MM-DD HH:mm:ss')
        }, {
            new: true
        }, {
            where: {
                customer_id: userId
            }
        })

        return res.status(200).json({
            success: true,
            nsg: "Cancel Order Success",
            data: cancelRequestOrder

        })
    } catch (error) {
        console.error(`Error fetching data: ${error.message}`);
        return res.status(400).json({
            success: false,
            msg: error.message
        });
    }
}
module.exports = {
    createRequestOrder,
    getDataRequest,
    getDataRequestByuser,
    cancelRequestOrder
}