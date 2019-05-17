const admin = require('firebase-admin');

module.exports = function (req, res) {

    if (!req.body.phone || req.body.code) {
        return res.status(422).send({ error: 'Phone and code must be provideds' });
    }

    const phone = String(req.body.phone).replace(/[^\d]/g, '');
    const code = parseInt(req.body.code);

    admin.auth().getUser(phone)
        .then(() => {
            //admin.database().ref('users/' + phone).on('value', snapshot => {
            const ref = admin.database().ref('users/' + phone);
            ref.on('value', snapshot => {
                ref.off(); // to Stop Listening.
                const user = snapshot.val();

                if (user.code !== code || !user.codeValid) {
                    return res.status(422).send({ error: 'code not valid' });
                }
                ref.update({ codeValid = false });
                // Generate the JWT (JSON Web Token) and send it to the user 
                admin.auth().createCustomToken(phone)
                    .then(token => res.send({Token : token}))

            });

        })
        .catch((err) => res.status(422).send({ error: err || 'User not found' }))

}