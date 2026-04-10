import express from 'express';
const router=express.Router();
import {updateUser,deleteUser,signout,getUsers,getUser} from '../controllers/user.controller.js';
import {verifyAdmin, verifyToken} from '../utils/verifyUser.js';

router.put('/update/:userId',verifyToken,updateUser);
router.delete('/delete/:userId',verifyToken,deleteUser);
router.post('/signout',signout);
router.get('/getusers',verifyToken,verifyAdmin,getUsers);
router.get('/:userId',getUser)

export default router;