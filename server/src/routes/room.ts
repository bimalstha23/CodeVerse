import express from "express";
import {
  createRoom,
  getRoomsOfUser,
  joinRoom,
  codeSave,
  getRoom,
  getRoomOwndByUser,
} from "../controllers/room";

const router = express.Router();

// new room
router.post("/room", createRoom);

// join room
router.post("/joinRoom", joinRoom);

// get rooms of a user
router.get("/room/:userId", getRoomsOfUser);
// post code to DB
router.post("/code", codeSave);

router.get('/getRoom', getRoom)

router.get("/roomsOwnedByUser/:userId", getRoomOwndByUser);

module.exports = router;
