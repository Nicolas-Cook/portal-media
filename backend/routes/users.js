var express = require('express');
var router = express.Router();
var User = require('../models/user');
var bcrypt = require('bcrypt');

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const usernameRegex = /^[a-zA-Z0-9]{4,}$/;
    const passwordRegex = /^[a-zA-Z0-9]{4,}$/;

  if (!usernameRegex.test(username)) {
    return res.status(400).json({ message: 'El nombre de usuario debe tener al menos 4 caracteres y ser alfanumérico' });
  }
  if (!passwordRegex.test(password)) {
    return res.status(400).json({ message: 'La contraseña debe tener al menos 4 caracteres y ser alfanumérico' });
  }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashedPassword.toString() });
    res.json(user);
  } catch (error) {
    res.status(500).json({message: error.message});
  } 
})

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne(username);
  if (!user) {
    return res.status(401).json({ message: 'Usuario no encontrado' });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Contraseña incorrecta' });
  }
  req.session.user = {id: user.id, username: user.username};
  res.status(200).json({ message: 'Login exitoso' });
})

router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Error al cerrar sesion' });
    }
    res.clearCookie('connect.sid');
    return res.status(200).json({ message: 'Sesión cerrada' });
  });
})

router.get('/session', (req, res) => {
  if (req.session && req.session.user) {
    res.status(200).json({authenticated: true, username: req.session.user.username});
  } else {
    res.status(401).send('Not authenticated');
  }
})

router.post('/change-password', async (req, res) => {
   try {
    console.log("test", req.body)
    const { username, oldPassword, newPassword } = req.body;
    const userId = req.session.user.id;

    const user = await User.findOne(username);
    const isValid = await bcrypt.compare(oldPassword, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const passwordRegex = /^[a-zA-Z0-9]{4,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 4 caracteres y ser alfanumérico' });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.changePassword(userId, hashedPassword);
    res.json({ message: 'Contraseña cambiada correctamente' });
  } catch(error) {
    res.status(500).json({message: error.message});
  }
})

module.exports = router;
