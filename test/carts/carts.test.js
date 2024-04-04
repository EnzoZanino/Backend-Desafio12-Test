import { expect } from "chai";
import supertest from "supertest";
import config from "../../src/config/config.js";

const requester = supertest("http://localhost:8080");

describe("Advanced test for carts", () => {
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

    token = loginResponse.headers["set-cookie"][0].split("; ")[0].split("=")[1];
    cookieName = loginResponse.headers["set-cookie"][0].split("=")[0];
  });

  it("Should get an array with all carts.", async () => {
    const cartsResponse = await requester
      .get("/api/carts")
      .set("Cookie", `${cookieName}=${token}`);
    expect(cartsResponse.statusCode).to.eql(200);
    expect(Array.isArray(cartsResponse._body)).to.eql(true);
  });

  it("Should get a cart by providing its Id.", async () => {
    const cid = "65f0ae9238d29e9bab6353dc";
    const cartsResponse = await requester
      .get(`/api/carts/${cid}`)
      .set("Cookie", `${cookieName}=${token}`);
    expect(cartsResponse.statusCode).to.eql(200);
    expect(typeof cartsResponse._body).to.eql("object");
  });
  let testCid;
  it("Should post a cart into DB by providing cart info.", async () => {
    const cartMock = {};
    const uid = "66055169c66a6d39488c3dda"; //Replace with real user Id
    const cartsResponse = await requester
      .post(`/api/carts/${uid}`)
      .set("Cookie", `${cookieName}=${token}`)
      .send(cartMock);
    expect(cartsResponse.statusCode).to.eql(200);
    expect(cartsResponse.statusCode).to.be.ok;
    expect(cartsResponse._body).to.have.property("_id");
    testCid = cartsResponse._body._id;
  });

  it("Should post a product on a cart by providing cart Id and product Id.", async () => {
    //User login required to be able to add products in own cart
    const userCredentials = {
      email: "emiZapata@gmail.com",
      password: "vivaLaRevolucion",
    };
    const loginResponse = await requester
      .post("/api/jwt/login")
      .send(userCredentials);
    const userToken = loginResponse.headers["set-cookie"][0]
      .split("; ")[0]
      .split("=")[1];
    const userCookieName = loginResponse.headers["set-cookie"][0].split("=")[0];
    const cid = testCid;
    const pid = "65f09c28320b0e9faff3b3bc"; //Replace with real product Id
    const cartsResponse = await requester
      .post(`/api/carts/${cid}/product/${pid}`)
      .set("Cookie", `${userCookieName}=${userToken}`);
    expect(cartsResponse.statusCode).to.eql(200);
    expect(cartsResponse.statusCode).to.be.ok;
    expect(cartsResponse._body).to.have.property("userId");
  });

  it("Should update a cart by provinding cart Id and new data.", async () => {
    const cid = testCid;

    const productsMock = [
      {
        productId: "65f09c28320b0e9faff3b3bb", //Replace with real product Id
        quantity: 1,
      },
      {
        productId: "65f09c28320b0e9faff3b3bc", //Replace with real product Id
        quantity: 1,
      },
    ];

    const cartResponse = await requester
      .put(`/api/carts/${cid}`)
      .set("Cookie", `${cookieName}=${token}`)
      .send(productsMock);
    expect(cartResponse.statusCode).to.eql(200);
    expect(Array.isArray(cartResponse._body.products)).to.eql(true);
  });

  it("Should delete a cart by providing its Id.", async () => {
    const cid = testCid; //Replace with real cart Id
    const cartsResponse = await requester
      .delete(`/api/carts/${cid}`)
      .set("Cookie", `${cookieName}=${token}`);
    expect(cartsResponse.statusCode).to.eql(200);
    expect(cartsResponse._body.message).to.eql("cart deleted");
  });
});
