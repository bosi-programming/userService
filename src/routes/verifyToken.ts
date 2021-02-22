import express from 'express';

import { verifyJWT } from '../util/verifyToken';
import { User } from '../models/user';

const verifyRouter = express.Router();

verifyRouter.post('/api/verify-token', verifyJWT, async (req, res) => {
  const { userId } = req.body;

  const user = await User.find({ _id: userId });

  // Hide password
  user[0].password = null;
  res.status(200).json(user[0]);
});

export default verifyRouter;
