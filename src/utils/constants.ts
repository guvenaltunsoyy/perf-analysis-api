const HOST = process.env.HOST || "0.0.0.0";

const ENVIRONMENTS = {
    dev: "dev",
    test: "test",
    stage: "stage",
    prod: "production",
};

const ENV = process.env.ENV || process.env.NODE_ENV || ENVIRONMENTS.dev;

const PORT = process.env.PORT || 8080;

const CONNECTIONS = {
    DATA: "DATA",
    MONGO: "MONGO",
};

export default {
    ENVIRONMENTS,
    ENV,
    PORT,
    HOST,
    CONNECTIONS,
};
