/**
 * AuthController.js
 * Maneja autenticación: login, logout y verificación de sesión.
 */

import { verificarUsuarios } from '../DataBase/Mysql/ConsultasSQL.js';

// POST /login
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const usuarioSQL = await verificarUsuarios({ username, password });

        if (!usuarioSQL || !usuarioSQL.success) {
            return res.status(401).json({ message: usuarioSQL?.error || 'Credenciales inválidas' });
        }

        req.session.isLoggedIn = true;
        req.session.rol        = usuarioSQL.data.id_rol;
        req.session.userId     = usuarioSQL.data.id_usuario;
        req.session.username   = username;

        return res.status(200).json({
            message: 'Sesión iniciada',
            data: {
                ...usuarioSQL.data,
                isAdmin: Number(usuarioSQL.data.id_rol) === 1 || usuarioSQL.data.nombre_rol === 'administrador'
            }
        });
    } catch (error) {
        console.error('Error en login:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// GET /check-session
export const checkSession = (req, res) => {
    if (req.session.isLoggedIn) {
        return res.status(200).json({
            isAuthenticated: true,
            userId: req.session.userId,
            datauser: {
                ...req.session,
                isAdmin: Number(req.session.rol) === 1
            }
        });
    }
    return res.status(401).json({ isAuthenticated: false, message: 'No autenticado' });
};

// POST /logout
export const logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error al destruir la sesión:', err);
            return res.status(500).json({ message: 'Error al cerrar sesión' });
        }
        res.clearCookie('mi_sid');
        return res.status(200).json({ message: 'Sesión cerrada correctamente' });
    });
};
