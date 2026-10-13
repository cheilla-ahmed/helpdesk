const authService = require('../services/auth.service');

async function register(req, res) {
try {
const { name, email, password } = req.body;


if (!name || !email || !password) {
  return res.status(400).json({
    message: 'Le nom, l’e-mail et le mot de passe sont obligatoires.',
  });
}

if (password.length < 8) {
  return res.status(400).json({
    message: 'Le mot de passe doit contenir au moins 8 caractères.',
  });
}

const user = await authService.register({
  name: name.trim(),
  email: email.trim().toLowerCase(),
  password,
});

return res.status(201).json({
  message: 'Compte créé avec succès.',
  user,
});


} catch (error) {
return res.status(error.statusCode || 500).json({
message: error.statusCode
? error.message
: 'Une erreur interne est survenue.',
});
}
}

async function login(req, res) {
try {
const { email, password } = req.body;


if (
  typeof email !== 'string' ||
  typeof password !== 'string' ||
  !email.trim() ||
  !password
) {
  return res.status(400).json({
    message: 'L’e-mail et le mot de passe sont obligatoires.',
  });
}

const result = await authService.login({
  email: email.trim().toLowerCase(),
  password,
});

return res.status(200).json({
  message: 'Connexion réussie.',
  ...result,
});


} catch (error) {
  console.error('Erreur authentification :', error);

  return res.status(error.statusCode || 500).json({
    message: error.statusCode
      ? error.message
      : 'Une erreur interne est survenue.',
  });
}
}


async function getMe(req, res) {
  try {
    const user = await authService.getMe(req.user.id);

    return res.status(200).json({
      user,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.statusCode
        ? error.message
        : 'Une erreur interne est survenue.',
    });
  }
}


module.exports = { register, login, getMe };
