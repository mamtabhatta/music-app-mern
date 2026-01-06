const mongoose = require("mongoose");

const adminActionSchema = new mongoose.Schema(
    {
        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        targetType: {
            type: String,
            enum: ["user", "song", "post", "comment"],
            required: true,
        },
        targetId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        actionType: {
            type: String,
            enum: ["approve", "remove", "update"],
            required: true,
        },
        reason: {
            type: String,
            default: "",
        },
        actionDate: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

const AdminAction = mongoose.model("AdminAction", adminActionSchema);
module.exports = AdminAction;
