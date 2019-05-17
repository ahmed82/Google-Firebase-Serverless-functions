const twilio = require('twilio');

const accountSid = 'AC1a9deff9e108814837d1b481fbc19d7e';
const authToken = '5aaa765cf78ae5f3d14ffb97d35f09ab';


module.exports = new twilio.Twilio(accountSid, authToken);