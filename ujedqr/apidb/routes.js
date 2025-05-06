const express = require('express')
const router = require('express').Router();
const AuthController = require ('./AuthController')

router.post('/login', AuthController.login)
router.get('/datos/:matricula', AuthController.requireLogin, AuthController.qr)
router.get('/logout', AuthController.logout)


  

module.exports = router;