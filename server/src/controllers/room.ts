import express from "express";
import { nanoid } from "nanoid";
import RoomModel from "../models/room";

export const createRoom = async (
  req: express.Request,
  res: express.Response
) => {
  const { userName, roomName, password , userid } = req.body;
  if (!userName || !roomName || !password || !userid) {
    res.status(422).json({ error: "please add all field" });
    return;
  }
  const newRoom = new RoomModel({
    roomId: nanoid(6),
    members: [{ userId:userid, name: userName }],
    roomOwner: userid,
    roomName,
    password,
  });

  try {
    const savedRoom = await newRoom.save();
    res.status(200).json(savedRoom);
    console.log(savedRoom);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getRoomsOfUser = async (
  req: express.Request,
  res: express.Response
) => {
  const { userId } = req.params;
  try {
    const room = await RoomModel.find({
      "members.userId": userId,
    });

    res.status(200).json(room);
  } catch (e) {
    res.status(500).json(e);
  }
};

export const getRoomOwndByUser = async (
  req: express.Request,
  res: express.Response
) => {
  const { userId } = req.params;
  try {
    const room = await RoomModel.find({
      roomOwner: userId,
    });
    console.log(room)
    res.status(200).json(room);
  } catch (e) {
    res.status(500).json(e);
  }
};



export const joinRoom = async (req: express.Request, res: express.Response) => {
  const { userName, roomId, userId, password } = req.body;

  if (!userName || !roomId || !password) {
    res.status(422).json({ error: "please add all field" });
  } else {
    RoomModel.findOne({ roomId: roomId })
      .then(async (savedRoom) => {
        if (!savedRoom) {
          res.status(422).json({ error: "Invalid Room Id or password" });
        } else if (savedRoom?.password === password) {
          if (userId) {
            try {
              const join_room = await RoomModel.updateOne(
                { _id: savedRoom._id },
                { $push: { members: {
                  userId: userId,
                  name: userName,
                } } },
                { new: true }
              );

              res.status(200).json({
                RoomId: roomId,
                RoomName: savedRoom.roomName,
              });
              //res.status(200).json(join_room);
              console.log(join_room);
            } catch (error) {
              res.status(422).json({ error: error.message });
            }
          } 
        } else {
          res.status(422).json({ error: "Invalid room id or password" });
        }
      })
      .catch((err) => {
        res.status(422).json({ error: err });
        console.log(err);
      });
  }
};

export const codeSave = async (
  req: express.Request,
  res: express.Response
) => {
  const { roomId, code,language } = req.body;

  const codeFromdatabase =  await RoomModel.findOneAndUpdate(
    { roomId: roomId },
    { $set: { code: code , language:language } },
    { new: true }
  );
  res.status(200).json(codeFromdatabase); 
};

export const getRoom = async (
  req: express.Request,
  res: express.Response
) => {
  const { roomId } = req.body;
  if  (!roomId) {
    res.status(422).json({ error: "please add all field" });
    return;
  }

  const room = await RoomModel.findOne({ roomId: roomId });
  res.status(200).json(room);
}
