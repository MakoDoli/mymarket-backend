import UserAuthModule from "../modules/userModule.js";
const userAuthModule = new UserAuthModule();
export default class UserAuthService {
    login(req, res) {
        userAuthModule.login(req, res);
    }
    signup(req, res) {
        userAuthModule.signUp(req, res);
    }
    resetPassword(req, res) {
        userAuthModule.resetPassword(req, res);
    }
}
