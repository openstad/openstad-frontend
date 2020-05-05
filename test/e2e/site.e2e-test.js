const db = require('../../src/db');
const supertest = require('supertest');
const appServer = require("./../../src/Server");

let server, request;

describe('Site endpoints', () => {

    beforeAll(async done => {
        appServer.init();

        request = supertest(appServer.app);
        server = await appServer.app.listen(9000);

        done();
    });

    afterAll(async (done) => {
        // Todo: fix open handles
        await server.close();
        await db.sequelize.close();

        done();
    });

    it("GET /api/site", async (done) => {

        const response = await request.get("/api/site").expect(200);

        expect(response.status).toBe(200);
        expect(response.body).toEqual([{
            id: 1,
            name: "site-one",
            title: "OpenStad Development Site",
            domain: "localhost:2000",
            createdAt: "2020-05-03T07:08:53.000Z",
            updatedAt: "2020-05-03T07:08:53.000Z",
            deletedAt: null
        }]);

        done()
    });

    it("GET /api/site/1", async (done) => {

        const response = await request.get("/api/site/1").expect(200);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            id: 1,
            name: "site-one",
            title: "OpenStad Development Site",
            domain: "localhost:2000",
            createdAt: "2020-05-03T07:08:53.000Z",
            updatedAt: "2020-05-03T07:08:53.000Z",
            deletedAt: null
        });

        done();
    });
});
