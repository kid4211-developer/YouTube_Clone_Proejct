const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const videoSchema = mongoose.Schema(
    {
        /* User Table의 모든 Data를 참조 할 수 있게됨 */
        writer: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        title: {
            type: String,
            maxlength: 50,
        },
        description: {
            type: String,
        },
        privacy: {
            type: Number,
        },
        filePath: {
            type: String,
        },
        category: {
            type: String,
        },
        /* 조회수 */
        views: {
            type: Number,
            default: 0,
        },
        duration: {
            type: String,
        },
        thumbnail: {
            type: String,
        },
    },
    { timestamps: true } /* CreateDate가 표시 됨 */,
);

const Video = mongoose.model('Video', videoSchema);

module.exports = { Video };
