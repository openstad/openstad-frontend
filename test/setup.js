// Jest bug in combination with mysql2
require('iconv-lite').encodingExists('cesu8');


// Mock sequelize models by default
jest.mock('../src/models/Article', () => () => {
    const SequelizeMock = require("sequelize-mock");
    return new SequelizeMock();
});

jest.mock('../src/models/ChoicesGuide', () => () => {
    const SequelizeMock = require("sequelize-mock");
    return new SequelizeMock();
});

jest.mock('../src/models/ChoicesGuideChoice', () => () => {
    const SequelizeMock = require("sequelize-mock");
    return new SequelizeMock();
});

jest.mock('../src/models/ChoicesGuideQuestionGroup', () => () => {
    const SequelizeMock = require("sequelize-mock");
    return new SequelizeMock();
});

jest.mock('../src/models/ChoicesGuideQuestion', () => () => {
    const SequelizeMock = require("sequelize-mock");
    return new SequelizeMock();
});

jest.mock('../src/models/ChoicesGuideResult', () => () => {
    const SequelizeMock = require("sequelize-mock");
    return new SequelizeMock();
});

jest.mock('../src/models/Idea', () => () => {
    const SequelizeMock = require("sequelize-mock");
    return new SequelizeMock();
});
jest.mock('../src/models/Argument', () => () => {
    const SequelizeMock = require("sequelize-mock");
    return new SequelizeMock();
});

jest.mock('../src/models/ArgumentVote', () => () => {
    const SequelizeMock = require("sequelize-mock");
    return new SequelizeMock();
});

jest.mock('../src/models/Image', () => () => {
    const SequelizeMock = require("sequelize-mock");
    return new SequelizeMock();
});

jest.mock('../src/models/Meeting', () => () => {
    const SequelizeMock = require("sequelize-mock");
    return new SequelizeMock();
});

jest.mock('../src/models/User', () => () => {
    const SequelizeMock = require("sequelize-mock");
    return new SequelizeMock();
});

jest.mock('../src/models/Vote', () => () => {
    const SequelizeMock = require("sequelize-mock");
    return new SequelizeMock();
});
