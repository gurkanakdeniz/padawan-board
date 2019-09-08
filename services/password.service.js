const bcrypt = require("bcrypt");

exports.checkPassword = async function(textPass, hash) {
  const response = await bcrypt.compare(textPass, hash);
  return response;
};

exports.hashPassword = async function(pass) {
  const password = pass;
  const saltRounds = 10;

  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, function(err, hash) {
      if (err) reject(err);
      resolve(hash);
    });
  });

  return hashedPassword;
};
