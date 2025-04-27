import { Request, Response } from 'express';
import { auth } from 'firebase-admin';
import { logger } from '../utils/logger';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, displayName } = req.body;

    // Create user in Firebase Auth
    const userRecord = await auth().createUser({
      email,
      password,
      displayName,
    });

    logger.info('User registered successfully', { uid: userRecord.uid });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
      },
    });
  } catch (error) {
    logger.error('Registration failed', { error });
    throw error;
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;

    // Verify the ID token
    const decodedToken = await auth().verifyIdToken(idToken);
    const user = await auth().getUser(decodedToken.uid);

    logger.info('User logged in successfully', { uid: user.uid });

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      },
    });
  } catch (error) {
    logger.error('Login failed', { error });
    throw error;
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const { uid } = req.user;

    const user = await auth().getUser(uid);

    res.json({
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      },
    });
  } catch (error) {
    logger.error('Failed to get user profile', { error });
    throw error;
  }
}; 