import { expect } from "chai";
import supertest from "supertest";

const requester = supertest("http://localhost:8080");

describe("Advanced test for JasonWebToken", () => {
  let cookie;
  it("Should register a user by providing user information", async () => {
    const userMock = {
      first_name: "Emiliano",
      last_name: "Zapata",
      email: "emiZapata@gmail.com",
      age: 40,
      password: "vivaLaRevolucion",
    };

    const registerResponse = await requester
      .post("/api/jwt/register")
      .send(userMock);

    expect(registerResponse.statusCode).to.eql(201);
    expect(registerResponse._body.status).to.eql("success");
    expect(registerResponse._body.message).to.eql("Success creating user");
  });

  it("Should login a user by providing login information", async () => {
    const userLogin = {
      email: "emiZapata@gmail.com",
      password: "vivaLaRevolucion",
    };

    const result = await requester.post("/api/jwt/login").send(userLogin);

    const cookieResult = result.headers["set-cookie"][0];
    expect(cookieResult).to.be.ok;

    cookie = {
      name: cookieResult.split("=")[0],
      value: cookieResult.split("=")[1],
    };

    expect(cookie.name).to.be.ok.and.eql("jwtCookieToken");
    expect(cookie.value).to.be.ok;
  });

  it("Should logout a user", async () => {
    const result = await requester.post("/api/jwt/logout");

    const cookieResult = result.headers["set-cookie"][0];
    cookie = {
      name: cookieResult.split("=")[0],
      value: cookieResult.split("=")[1].split(";")[0],
    };
    expect(cookie.name).to.be.ok.and.eql("jwtCookieToken");
    expect(cookie.value).to.eql("");
    expect(result.statusCode).to.eql(302); //Redirect to login
  });
});
