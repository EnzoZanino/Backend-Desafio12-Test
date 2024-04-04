import { expect } from "chai";
import supertest from "supertest";
import config from "../../src/config/config.js";

const requester = supertest("http://localhost:8080");

describe("Advanced test for products", () => {
  describe("Tests without admin permision login required", () => {
    it("Should get an array with all mocking products created with faker", async () => {
      const response = await requester.get("/api/products/mockingproducts");
      expect(response.statusCode).to.eql(200);
      expect(response.body.payload).to.be.an("array");
    });
  });
  describe("Tests with admin permision login required", () => {
    let token;
    let cookieName;
    before(async () => {
      const adminCredentials = {
        email: "adminCoder@coder.com",
        password: "12345qwert",
      };
      const loginResponse = await requester
        .post("/api/jwt/login")
        .send(adminCredentials);

      token = loginResponse.headers["set-cookie"][0]
        .split("; ")[0]
        .split("=")[1];
      cookieName = loginResponse.headers["set-cookie"][0].split("=")[0];
    });

    it("Should get an array with all products.", async () => {
      const productsResponse = await requester
        .get("/api/products/getAllProducts")
        .set("Cookie", `${cookieName}=${token}`);
      expect(productsResponse.statusCode).to.eql(200);
      expect(Array.isArray(productsResponse._body)).to.eql(true);
    });

    it("Should get a all products from premium user by providing its user Id.", async () => {
      const uid = "65f072d79a15dc9c0edff33a"; //Replace with real premium user Id
      const productsResponse = await requester
        .get(`/api/products/user/${uid}`)
        .set("Cookie", `${cookieName}=${token}`);
      expect(productsResponse.statusCode).to.eql(200);
      expect(Array.isArray(productsResponse._body)).to.eql(true);
    });

    it("Should get a product by providing its Id.", async () => {
      const pid = "65f09c28320b0e9faff3b3bc"; //Replace with real product Id
      const productsResponse = await requester
        .get(`/api/products/product/${pid}`)
        .set("Cookie", `${cookieName}=${token}`);
      expect(productsResponse.statusCode).to.eql(200);
      expect(typeof productsResponse._body).to.eql("object");
    });

    let testPid;
    it("Should post a product into DB by providing product info.", async () => {
      const productMock = {
        title: "Licensed Wooden Hat",
        description:
          "Carbonite web goalkeeper gloves are ergonomically designed to give easy fit",
        code: "978-1-250-46667-9",
        price: 970.0,
        status: false,
        stock: 38,
        category: "Industrial",
        thumbnails: [
          "https://picsum.photos/seed/DcrFSWRVY4/500/500",
          "https://picsum.photos/seed/Yy1rym8/500/500",
        ],
      };

      const productsResponse = await requester
        .post(`/api/products/`)
        .set("Cookie", `${cookieName}=${token}`)
        .send(productMock);
      expect(productsResponse.statusCode).to.eql(200);
      expect(productsResponse.statusCode).to.be.ok;
      expect(productsResponse._body.code).to.eql(productMock.code);
      testPid = productsResponse._body._id;
    });

    it("Should update a product by provinding product Id and new product data.", async () => {
      const pid = testPid; //Should be updated with real product Id

      const productMock = {
        title: "Practical Fresh Computer",
        description:
          "The beautiful range of Apple Naturalé that has an exciting mix of natu…",
        code: "978-0-421-77763-7",
        price: 2000,
        status: true,
        stock: 35,
        category: "Garden",
        thumbnails: [
          "https://picsum.photos/seed/DcrFSWRVY4/500/500",
          "https://picsum.photos/seed/Yy1rym8/500/500",
        ],
      };

      const productsResponse = await requester
        .put(`/api/products/${pid}`)
        .set("Cookie", `${cookieName}=${token}`)
        .send(productMock);
      expect(productsResponse.statusCode).to.eql(200);
      expect(productsResponse._body.price).to.eql(productMock.price);
    });

    it("Should delete a product by providing its Id.", async () => {
      const pid = testPid; //Should be updated with real product Id
      const productsResponse = await requester
        .delete(`/api/products/${pid}`)
        .set("Cookie", `${cookieName}=${token}`);
      expect(productsResponse.statusCode).to.eql(200);
      expect(productsResponse._body.message).to.eql("Product deleted");
    });
  });
});
