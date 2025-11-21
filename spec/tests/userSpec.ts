import { UserModel } from "../../src/models/UserModel";

const userModel = new UserModel();

describe("User Model", () => {
  it("should create a user", async () => {
    const result = await userModel.create({ firstname: "John", lastname: "Doe", password: "1234" });
    expect(result.firstname).toBe("John");
  });

  it("should return a list of users", async () => {
    const users = await userModel.index();
    expect(users.length).toBeGreaterThan(0);
  });
});
