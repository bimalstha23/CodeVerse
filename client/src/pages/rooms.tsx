import React, { useContext, useEffect, useState } from 'react'
import API from '../utils/axiosInstance'
import { AuthContext } from '../providers/AuthProvider'
import { PREXIX_SERVER_URL } from '../utils/env'
import { Table, TableContainer, Tbody, Th, Thead, Tr } from '@chakra-ui/react'
import Navbar from "../components/Navbar";

const rooms = () => {
    const { user } = useContext(AuthContext)
    const [rooms, setRooms] = useState<any>([])
    console.log(user)
    const fetchOwnedRooms = async () => {
        try {
            const data = await API({
                url: PREXIX_SERVER_URL + `/roomsOwnedByUser/${user.uid}`
            })
            console.log(data)
            setRooms(data.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (user) {
            fetchOwnedRooms()
        }
    }, [user])

    console.log(rooms)

    if (!user) {
        return (
            <h1>
                Please Login First to see the rooms
            </h1>
        )
    }

    return (
        <div>
            <Navbar />

            <div className='flex flex-col justify-center items-center w-full'>
                <h1 className='text-3xl'>
                    Rooms Owned by you
                </h1>
            </div>

            <TableContainer className='mt-10'>
                <Table variant='striped' colorScheme='teal'>
                    <Thead>
                        <Tr>
                            <Th>Room id</Th>
                            <Th>Room Name</Th>
                            <Th>code language</Th>
                            <Th> Join Room</Th>
                        </Tr>
                    </Thead>
                    {rooms.length ? <Tbody>
                        {rooms.length > 0 && rooms?.map((room: any) => (
                            <Tr>
                                <Th>{room.roomId}</Th>
                                <Th>{room.roomName}</Th>
                                <Th>{room.language}</Th>
                                <Th><a href={`/room/${room.roomId}`}>Join Room</a></Th>
                            </Tr>
                        ))}
                    </Tbody> : <h1>No rooms found</h1>}
                </Table>
            </TableContainer>

        </div>
    )
}

export default rooms