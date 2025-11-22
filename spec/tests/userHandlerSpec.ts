import supertest from "supertest";
import app from "../../src/server";
import { UserModel } from "../../src/models/UserModel";
import { createTables } from "../helpers/databaseCleanup";

const request = supertest(app);
const userModel = new UserModel();

// بيانات المستخدم المستخدمة في الاختبارات
const testUser = {
  firstname: "TestHandler",
  lastname: "UserHandler",
  password: "testpassword",
};

let token = "";
let userId: number;

describe("User Handler Endpoints", () => {
  // إعداد المستخدم وتسجيل الدخول للحصول على التوكن
  beforeAll(async () => {
    await createTables();
    
    // يتم حذف المستخدمين وإنشائهم مرة واحدة قبل جميع الاختبارات
    const user = await userModel.create(testUser);
    userId = user.id as number;

    const res = await request
      .post("/users/login")
      .send({ firstname: testUser.firstname, password: testUser.password });
    
    token = res.body.token;
  });

  // Endpoint: POST /users (Create)
  it("should create a user and return a token on POST /users", async () => {
    const res = await request
      .post("/users")
      .send({ firstname: "NewUser", lastname: "Test", password: "password123" });

    expect(res.status).toBe(200);
    expect(res.body.user.firstname).toBe("NewUser");
    expect(res.body.token).toBeDefined();
  });

  // Endpoint: POST /users/login (Authenticate)
  it("should authenticate a user and return a token on POST /users/login", async () => {
    const res = await request
      .post("/users/login")
      .send({ firstname: testUser.firstname, password: testUser.password });

    expect(res.status).toBe(200);
    expect(res.body.user.firstname).toBe(testUser.firstname);
    expect(res.body.token).toBeDefined();
  });

  // Endpoint: GET /users (Index) - Protected
  it("should return a list of users on GET /users (protected)", async () => {
    const res = await request
      .get("/users")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  // Endpoint: GET /users/:id (Show) - Protected
  it("should return the correct user on GET /users/:id (protected)", async () => {
    const res = await request
      .get(`/users/${userId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(userId);
  });

  // اختبار الفشل (غير مصرح به)
  it("should return 401 for unauthorized access on GET /users", async () => {
    const res = await request.get("/users");
    expect(res.status).toBe(401);
  });
});