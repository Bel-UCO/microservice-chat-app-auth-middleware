var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.json({
    service: 'chat-auth-service',
    status: 'ok',
    endpoints: {
      register: 'POST /auth/register',
      login: 'POST /auth/login',
      me: 'GET /auth/me',
    },
  });
});

module.exports = router;
