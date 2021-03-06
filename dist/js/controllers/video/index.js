"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVideo = exports.getVideoId = exports.updateVideo = exports.addVideo = exports.getVideo = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const uuid_1 = require("uuid");
const path = require("path");
const video_1 = __importDefault(require("../../models/video"));
const process_1 = __importDefault(require("process"));
const chapter_1 = __importDefault(require("../../models/chapter"));
require("dotenv").config();
aws_sdk_1.default.config.update({
    credentials: {
        accessKeyId: process_1.default.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process_1.default.env.AWS_SECRET_ACCESS_KEY || "",
    },
});
const s3 = new aws_sdk_1.default.S3({
    apiVersion: "2012-10-17",
    accessKeyId: process_1.default.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process_1.default.env.AWS_SECRET_ACCESS_KEY,
});
let upload = (bucketName) => multer_1.default({
    storage: multer_s3_1.default({
        s3: s3,
        bucket: bucketName,
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            cb(null, `${uuid_1.v4()}_${ext}`);
        },
    }),
});
const getVideo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const videos = yield video_1.default.find();
        res.status(202).json({ videos });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getVideo = getVideo;
const addVideo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uploadVideo = upload(`linkden-learning/newVideos`).single("video");
        uploadVideo(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
            const { course, chapter } = req.body;
            let body = req.body;
            if (err) {
                return res.status(400).json({ success: false, message: err.message });
            }
            const video = new video_1.default({
                title: body.title,
                description: body.description,
                url: req.file.location,
                authorId: body.authorId,
                chapterId: body.chapterId,
                courseId: body.courseId,
                tags: body.tags,
                content: body.content,
            });
            const newVideo = yield video.save();
            const allVideos = yield video_1.default.find();
            updateChapterWithVideoId(body.chapterId, newVideo._id);
            res
                .status(203)
                .json({
                message: "new Vide o as been added ",
                newLecture: newVideo,
                allLectures: allVideos,
            });
        }));
    }
    catch (error) {
        res.end();
        console.log(error);
    }
});
exports.addVideo = addVideo;
const updateVideo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { params: { id }, body, } = req;
        console.log(body, id);
        const updatedVideo = yield video_1.default.findByIdAndUpdate({ _id: id }, body);
        // res.status(205).json({testing:"testing",blog: updatedBlog})
        const allVideos = yield video_1.default.find();
        res.status(202).json({
            message: "new Video as been added ",
            video: updatedVideo,
            videos: allVideos,
        });
        // console.log("new")
    }
    catch (error) {
        console.log(error);
    }
});
exports.updateVideo = updateVideo;
const getVideoId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { params: { id }, } = req;
        const video = yield video_1.default.findById({ _id: id });
        res.status(202).json({ message: "found", lecture: video });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getVideoId = getVideoId;
const deleteVideo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const delete_video = yield video_1.default.findByIdAndRemove(req.params.id);
        const allVideos = yield video_1.default.find();
        res
            .status(200)
            .json({
            message: "Video Deleted",
            deleted_lecture: delete_video,
            allLectures: allVideos,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.deleteVideo = deleteVideo;
const updateChapterWithVideoId = (id, VId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(id, VId);
        yield chapter_1.default.updateOne({ _id: id }, {
            $push: {
                videoIds: {
                    $each: [{ videoId: VId }],
                    $sort: { updatedAt: -1 },
                },
            },
        });
        console.log(yield chapter_1.default.find({ _id: id }));
        // console.log("course data updated", data);
    }
    catch (error) {
        console.log(error);
    }
});
