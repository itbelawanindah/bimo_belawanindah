const mongoose = require('mongoose')

const usersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        default: 0 //o-> Normal user, 1->Admin ->admin, 3->driver
    },

    avatar: {
        type: String,
        default:""
    },
    description: {
        type: String,
        required: false,
    },
    address: {
        type: String,
        required: false,
    },

    mobile: {
        type: String,
        required: false,
    },
    card: {
        type: String,
        required: false,
    },
    kk: {
        type: String,
        required: false,
    },
    ktp: {
        type: String,
        required: false,
    },
    npwp: {
        type: String,
        required: false,
    },

    lisensi: {
        type: String,
        required: false,
    },

    is_active: {
        type: Number,
        required: false,
    },

    aggreement: {
        type: String,
        required: false,
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],

    created_at: {
        type: Date,
        required: false,
    },

    updated_at: {
        type: Date,
        required: false,
    },

    deleted_at: {
        type: Date,
        required: false,
    },
    last_login: {
        type: Date,
        required: false,
    },

    updated_password: {
        type: Date,
        required: false,
    },

})

module.exports = mongoose.model('User', usersSchema)