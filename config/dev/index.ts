export default {
    switches: {
        pug: false,
    },
    databases: {
        mongo: {
            enable: true,
            host: "boss:6516102Gg@cluster0.tdrcz.mongodb.net",
            port: "27017",
            user: "boss",
            password: "6516102Gg",
            user_database: "perf_analysis",
            user_collection: "users",
            navigation_collection: "navigations",
            database: "perf_analysis",
            resource_collection: "resources",
            paint_collection: "paints",
            measure_collection: "measures",
            env: "dev",
        },
    },
};
