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
        expect(response.body[0].id).toEqual(1);

        done()
    });

    it("GET /api/site/1", async (done) => {

        const response = await request.get("/api/site/1").expect(200);

        expect(response.status).toBe(200);
        expect(response.body.name).toEqual('site-one');

        done();
    });
});
