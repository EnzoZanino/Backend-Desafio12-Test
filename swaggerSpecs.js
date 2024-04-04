import swaggerJsDoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Ecommerce API documentation",
      description:
        "This is the documentation for the API of an ecommerce build with NodeJs, Express and Handlebars",
    },
  },
  apis: ["src/docs/**/*.yaml"],
};

const SwaggerSpecs = swaggerJsDoc(swaggerOptions);

export default SwaggerSpecs;
