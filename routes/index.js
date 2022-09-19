var express = require('express');
var router = express.Router();

const fcm = require('firebase-admin');
const fcm_cert = require('../gangnamingan-firebase-adminsdk-x0mqg-0a461abe52.json');
fcm.initializeApp({
  credential: fcm.credential.cert(fcm_cert)
});



/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

router.post('/push-message', function (req, res) {
  console.log(req.body.fcmtoken);
  const message = {
    notification:{
      title: '테스트 발송',
      body: '테스트 푸쉬 알람!',
    },
    token: req.body.fcmtoken,
  }

  fcm.messaging()
  .send(message)
  .then((response) => {
    console.log('push success', response);
    res.send(`
    <script>
      alert('푸쉬를 발송 했습니다.');
      location.href = '/';
    </script>`);
  })
  .catch((error) => {
    console.log('push failed', error);
    res.send(`
    <script>
      alert('푸쉬를 발송에 실패 했습니다.');
      location.href = '/';
    </script>`);
  });
});

module.exports = router;
