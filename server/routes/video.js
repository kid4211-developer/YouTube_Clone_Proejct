const express = require('express');
const router = express.Router();
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const { Video } = require('../models/Video');
const { Subscriber } = require('../models/Subscriber');

/*=================================
        Storage Multer Config 
================================= */
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        if (ext !== '.mp4') {
            //업로드를 허용하고자 하는 확장자 명을 선언
            return cb(res.status(400).end('only jpg, png, mp4 is allowed'), false);
        }
        cb(null, true);
    },
});

const upload = multer({ storage: storage }).single('file');

/*=================================
               Video
================================= */
router.post('/uploadfiles', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.json({ success: false, err });
        }
        return res.json({ success: true, url: res.req.file.path, fileName: res.req.file.filename });
    });
});

router.post('/uploadVideo', (req, res) => {
    const video = new Video(req.body);
    video.save((err, doc) => {
        if (err) {
            return res.json({ success: false, err });
        }
        res.status(200).json({ success: true });
    });
});

/* VideoList 가져오기 */
router.get('/getVideos', (req, res) => {
    Video.find()
        .populate('writer')
        .exec((err, videos) => {
            if (err) {
                return res.status(400).send(err);
            }
            res.status(200).json({ success: true, videos });
        });
});

/* Video Detail 정보 가져오기 */
router.post('/getVideoDetail', (req, res) => {
    Video.findOne({ _id: req.body.videoId })
        .populate('writer')
        .exec((err, videoDetail) => {
            if (err) {
                return res.status(400).send(err);
            }
            return res.status(200).json({ success: true, videoDetail });
        });
});

/* Subscription VideoList 가져오기 */
router.post('/getSubscriptionVideos', (req, res) => {
    // 자신의 ID를 가지고, 구독한 사람들을 찾음
    Subscriber.find({ userFrom: req.body.userFrom }).exec((err, subscriberInfo) => {
        if (err) {
            return res.status(400).send(err);
        }
        let subscribedUser = [];
        subscriberInfo.map((subscriber, index) => {
            subscribedUser.push(subscriber.userTo);
        });

        // 찾은 사람들의 videoList를 가지고 옴
        Video.find({ writer: { $in: subscribedUser } })
            .populate('writer')
            .exec((err, videos) => {
                if (err) {
                    return res.status(400).send(err);
                }
                res.status(200).json({ success: true, videos });
            });
    });
});

router.post('/thumbnail', (req, res) => {
    let filePath = '';
    let fileDuration = '';

    /* Video 정보 가져오기 */
    ffmpeg.ffprobe(req.body.url, function (err, metadata) {
        console.dir(metadata);
        console.log(metadata.format.duration);
        fileDuration = metadata.format.duration;
    });

    /* Thumbnails 생성 */
    ffmpeg(req.body.url)
        .on('filenames', function (filenames) {
            console.log('Will generate' + filenames.join(','));
            console.log(filenames);
            filePath = 'uploads/thumbnails/' + filenames[0];
        })
        .on('end', function () {
            console.log('Screenshots taken');
            return res.json({ success: true, url: filePath, fileDuration: fileDuration });
        })
        .on('error', function (err) {
            console.error(err);
            return res.json({ success: false, err });
        })
        .screenshots({
            count: 3,
            folder: 'uploads/thumbnails',
            size: '320x240',
            //'%b' : input basename (filename with-out extension)
            filename: 'thumbnail-%b.png',
        });
});

module.exports = router;
