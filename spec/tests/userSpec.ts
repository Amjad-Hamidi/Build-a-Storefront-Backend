// spec/tests/userSpec.ts

import { UserModel, User } from "../../src/models/UserModel";
import { createTables } from '../helpers/databaseCleanup';

const userModel = new UserModel();
const testPassword = "securepassword";

let createdUser: User; // تم نقل التخزين هنا

describe("User Model", () => {
    beforeAll(async () => {
        await createTables();
        
        // 🔑 الحل: إنشاء المستخدم في beforeAll ليتم استخدامه في show/authenticate
        createdUser = await userModel.create({ 
            firstname: "Jane", 
            lastname: "Smith", 
            password: testPassword 
        });
    });

    it("should create a user (redundant, but checks model method)", async () => {
        // نستخدم مستخدماً جديداً للتأكد من أن الـ create تعمل
        const tempUser = await userModel.create({ firstname: "John", lastname: "Doe", password: "p1" });
        expect(tempUser.firstname).toBe("John");
    });

    it("should return a list of users (index method)", async () => {
        const users = await userModel.index();
        expect(users.length).toBeGreaterThanOrEqual(1); // يجب أن يكون 1 أو أكثر
    });

    it("should return the correct user when show is called", async () => {
        // 🔑 استخدام createdUser.id المُنشأ في beforeAll
        const user = await userModel.show(createdUser.id as number);
        expect(user?.id).toBe(createdUser.id);
    });

    it("should authenticate a user with correct credentials (authenticate)", async () => {
        // 🔑 استخدام createdUser.firstname و testPassword
        const user = await userModel.authenticate(createdUser.firstname, testPassword);
        expect(user).not.toBeNull();
        expect(user?.firstname).toBe(createdUser.firstname);
    });

    it("should return null for incorrect password (authenticate)", async () => {
        const user = await userModel.authenticate(createdUser.firstname, "wrong_password");
        expect(user).toBeNull();
    });
});