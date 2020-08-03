const AssistantV2 = require('ibm-watson/assistant/v2');
const { IamAuthenticator } = require('ibm-watson/auth');

const assistant = new AssistantV2({
  version: '2020-04-01',
  authenticator: new IamAuthenticator({
    apikey:'pLd9eu9RyYkkqfuP55GYdtSIhqMxkU_BMIfr_kMlP65o'

  }),
  url: 'https://api.eu-gb.assistant.watson.cloud.ibm.com/instances/0f580d41-1064-4270-9113-6f80b9bc3222',
});
assistant.createSession({
    assistantId:'13720f15-4b8e-4607-a01c-2c979b851c7f'
  })

assistant.message({
  assistantId: '13720f15-4b8e-4607-a01c-2c979b851c7f',
  sessionId: '6d8d0ce3-b7a0-4045-8765-d2dd309a20fc',
  input: {
    'message_type': 'text',
    'text':'i want price of gail tender?'
    }
  })
  .then(res => {
    console.log(JSON.stringify(res.result, null, 2));
  })
  .catch(err => {
    console.log(err);
  });
/*assistant
  .messageStateless({
    assistantId: '13720f15-4b8e-4607-a01c-2c979b851c7f',
    input: {
      'message_type': 'text',
      'text': 'i want price of gail tender book',
    },

  })
  .then(res => {
    console.log(JSON.stringify(res.result, null, 2));
  })
  .catch(err => {
    console.log(err);
  });*/