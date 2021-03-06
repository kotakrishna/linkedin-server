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
exports.checkPassword = exports.checkMailId = void 0;
const user_1 = __importDefault(require("../../models/user"));
const checkMailId = (mail) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(mail);
        if (mail !== undefined) {
            const data = yield user_1.default.find({ emailId: mail });
            console.log(data);
            if (data.length == 0) {
                return false;
            }
            return true;
        }
        else {
            return false;
        }
    }
    catch (err) {
        console.log(err);
    }
});
exports.checkMailId = checkMailId;
const checkPassword = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userData = yield user_1.default.findOne({ emailId: email });
        if (userData && userData.password === password) {
            return true;
        }
        return false;
    }
    catch (err) {
        console.log(err);
    }
});
exports.checkPassword = checkPassword;
