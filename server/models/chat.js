const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatSchemma = new Schema({
    isGroupChat:{
        type: Boolean,
        default : false,
    },
    participants : [{
        user : {
            type : Schema.Types.ObjectId,// sender receiver id's
            ref :'User',
            required : true,
        },
        joinedAt: {
            type:Date,
            default : Date.now()
        },
        // validate:{
        //     validator:function (v) {
        //         return this.isGroupChat ? v.length >= 2: v.length === 2;
        //     },
        //     message:props => `${props.value.length} participants are not allowed`
        // }
    }],
    
    groupName : {
        type : String,
        trim : true,
        required:function () {
            return this.isGroupChat;
        }
    },
    lastMessage : {
        type: Schema.Types.ObjectId,
        ref : "Message",
        default : null,
    },
    messages : [{
        type : Schema.Types.ObjectId,//message id
        ref : "Message",
        default:[]
    }],
    createdBy : {
        type : Schema.Types.ObjectId,//sender's id
        ref : "User",
        required : true,
    }
}, {
    timestamps : true
});

module.exports = mongoose.model("Chat", chatSchemma);