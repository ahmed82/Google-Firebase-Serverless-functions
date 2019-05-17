const admin = require('firebase-admin');
const twilio = require('./twilio');
module.exports = function (req, res) {
    if (!req.body.phone) {
        return res.status(422).send({ error: 'You must provide a phone number' });
    }

    const phone = String(req.body.phone).replace(/[^\d]/g, '');

    admin.auth().getUser(phone)
        .then(userRecord => {
            const code = Math.floor((Math.random() * 8999 + 1000));
            twilio.messages.create({
                body: 'Your code is ' + code,
                to: phone,
                from: '+19782282179'
            }, (err) => {
                if (err) { return res.status(422).send(err); }

                // Firebase database - create new node or collection. users/<phone#>/code
                admin.database().ref('user/' + phone)
                    .update({ code: code, codeValid: true }, () => {
                        res.send({ Success: true });
                    })
            })

        })
        .catch((err) => {
            res.status(422).send({ error: err || 'User not found' })
        })
}