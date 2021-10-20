require('dotenv').config();

module.exports = {
    port: process.env.SMTP_PORT || 1025,
    host: process.env.SMTP_HOST ||'127.0.0.1',
    auth: {
        user: process.env.SMTP_USER || 'user',
        pass: process.env.SMTP_PASS ||'pass'
    },
    secure: process.env.SMTP_SECURE && process.env.SMTP_SECURE === 'true' ? true : false
}