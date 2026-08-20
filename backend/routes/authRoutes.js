const express = require("express");
const { body } = require("express-validator");

const {
    register,
    login,
    getMe,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");
const validate = require("../middleware/validationMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Ashwini
 *               email:
 *                 type: string
 *                 example: ashwini@test.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation failed
 */
router.post(
    "/register",
    [
        body("name")
            .trim()
            .notEmpty()
            .withMessage("Name is required"),

        body("email")
            .trim()
            .isEmail()
            .withMessage("Valid email is required"),

        body("password")
            .isLength({ min: 6 })
            .withMessage("Password must be at least 6 characters")
    ],
    validate,
    register
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: ashwini@test.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Invalid email or password
 */
router.post(
    "/login",
    [
        body("email")
            .trim()
            .isEmail()
            .withMessage("Valid email is required"),

        body("password")
            .notEmpty()
            .withMessage("Password is required")
    ],
    validate,
    login
);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user details
 *       401:
 *         description: Not authorized
 */
router.get("/me", protect, getMe);

/**
 * @swagger
 * /api/auth/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Ashwini
 *               email:
 *                 type: string
 *                 example: newemail@test.com
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Not authorized
 */
router.put(
    "/profile",
    protect,
    [
        body("name")
            .optional()
            .trim()
            .notEmpty()
            .withMessage("Name cannot be empty"),

        body("email")
            .optional()
            .trim()
            .isEmail()
            .withMessage("Valid email is required")
    ],
    validate,
    updateProfile
);

/**
 * @swagger
 * /api/auth/change-password:
 *   put:
 *     summary: Change user password
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: oldpassword
 *               newPassword:
 *                 type: string
 *                 example: newpassword123
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid current password or validation failed
 *       401:
 *         description: Not authorized
 */
router.put(
    "/change-password",
    protect,
    [
        body("currentPassword")
            .notEmpty()
            .withMessage("Current password is required"),

        body("newPassword")
            .isLength({ min: 6 })
            .withMessage("New password must be at least 6 characters")
    ],
    validate,
    changePassword
);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: ashwini@test.com
 *     responses:
 *       200:
 *         description: Password reset token generated
 *       400:
 *         description: Validation failed
 *       404:
 *         description: User not found
 */
router.post(
    "/forgot-password",
    [
        body("email")
            .trim()
            .isEmail()
            .withMessage("Valid email is required")
    ],
    validate,
    forgotPassword
);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *                 example: reset-token
 *               newPassword:
 *                 type: string
 *                 example: newpassword123
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid or expired reset token
 */
router.post(
    "/reset-password",
    [
        body("token")
            .notEmpty()
            .withMessage("Reset token is required"),

        body("newPassword")
            .isLength({ min: 6 })
            .withMessage("New password must be at least 6 characters")
    ],
    validate,
    resetPassword
);

module.exports = router;