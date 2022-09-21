var express = require('express');
var router = express.Router();

const fcm = require('firebase-admin');
const fcm_cert = require('../gangnamingan-firebase-adminsdk-x0mqg-0a461abe52.json');
fcm.initializeApp({
  credential: fcm.credential.cert(fcm_cert)
});

const defaultMsg = {
  android: {
    notification: {
      sound: 'default',
      icon: 'ic_icon'
    },
  },
  apns: {
    payload: {
      aps: {
        sound: 'default'
      },
    },
    fcm_options: {}
  },
}


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

router.post('/push-message', function (req, res) {
  console.log(req.body.fcmtoken);
  if(!req.body.fcmtoken) {
    res.send(`
    <script>
      alert('토큰을 입력해 주세요.');
      location.href = '/';
    </script>`);
  }

  if(req.body.picture) {
    defaultMsg.android.notification.imageUrl = req.body.picture;
    defaultMsg.apns.payload.aps = {'mutable-content': 1}
    defaultMsg.apns.fcm_options.image = req.body.picture;
  }

  const message = {
    notification:{
      title: '테스트 발송',
      body: '테스트 푸쉬 알람!',
    },
    token: req.body.fcmtoken,
    ...defaultMsg,
  }

  console.log(message);

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

router.post('/push-message-multi', function (req, res) {
  const tokens = [];
  Object.keys(req.body).forEach(key => {
    if(req.body[key]){
      tokens.push(req.body[key]);
    }
  });

  const message = {
    notification:{
      title: '테스트 발송',
      body: '테스트 푸쉬 알람!',
    },
    tokens: tokens,
    ...defaultMsg
  }

  fcm.messaging()
  .sendMulticast(message)
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

router.post('/push-message-topic', function (req, res) {
  
  const message = {
    notification:{
      title: '단체 공지',
      body: 'notice를 구독중인 단체공지 알람!',
    },
    topic: req.body.topic,
    ...defaultMsg
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
