const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');

async function register({ name, email, password }) {
const existingUser = await prisma.user.findUnique({
where: { email },
});

if (existingUser) {
const error = new Error('Cette adresse e-mail est déjà utilisée.');
error.statusCode = 409;
throw error;
}

const hashedPassword = await bcrypt.hash(password, 12);

const user = await prisma.user.create({
data: {
name,
email,
password: hashedPassword,
},
select: {
id: true,
name: true,
email: true,
role: true,
createdAt: true,
},
});

return user;
}

async function login({ email, password }) {
const user = await prisma.user.findUnique({
where: { email },
});

if (!user || !(await bcrypt.compare(password, user.password))) {
const error = new Error('E-mail ou mot de passe incorrect.');
error.statusCode = 401;
throw error;
}

const token = jwt.sign(
{
userId: user.id,
role: user.role,
},
process.env.JWT_SECRET,
{
expiresIn: process.env.JWT_EXPIRES_IN || '1d',
}
);

return {
user: {
id: user.id,
name: user.name,
email: user.email,
role: user.role,
},
token,
};
}


async function getMe(userId) {
  const user = await prisma.user.findUnique({
    where: { id: Number(userId) },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) {
    const error = new Error('Utilisateur introuvable.');
    error.statusCode = 404;
    throw error;
  }

  return user;
}


module.exports = { register, login, getMe };
