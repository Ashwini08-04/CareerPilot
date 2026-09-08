const swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",

        info: {
            title: "CareerPilot API",
            version: "1.0.0",
            description:
                "API documentation for CareerPilot AI-powered job management SaaS"
        },

        servers: [
            {
                url: "https://careerpilot-n4ys.onrender.com"
            }
        ],

        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        }
    },

    apis: ["./routes/*.js"]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;