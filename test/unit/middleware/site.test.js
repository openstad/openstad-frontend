const siteMiddleware = require('../../../src/middleware/site.js');
const createError = require('http-errors');

const mockRequest = (path) => ({
  path: path,
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};
jest.mock('../../../src/models', () => () => {
  const SequelizeMock = require("sequelize-mock");
  const dbMock = new SequelizeMock();
  const Site = dbMock.define('site', {
    id: 1500,
    name: 'test site',
    domain: 'test.nl'
  });
  // Need to set prototype because it doesn't exist on Sequelize fake model
  Site.prototype = {};
  return {
    Site
  }
});

describe('Site Middleware', () => {
  test('Should find a site', async () => {
    const request = mockRequest('/site/1500/');
    const response = mockResponse();
    const mockNext = async (data) => {
      expect(request.site.id).toEqual(1500);
      expect(request.site.name).toEqual('test site');
    };

    await siteMiddleware(request, response, mockNext);

  });

  test('Should throw an Site not found Error', async () => {
    const request = mockRequest('/site/sdfsga');
    const response = mockResponse();

    const mockNext = (data) => {
      expect(data).toEqual(new createError(500, 'Site niet gevonden for path: /site/sdfsga'))
    };

    await siteMiddleware(request, response, mockNext);
  });
});
