import { Avatar } from '@chakra-ui/react';
import React from 'react';

const Client = ({ username }) => {
    const shortenedUsername = username.slice(0, 8);
    return (
        <div className="client">
            <Avatar size="lg" name={shortenedUsername} />
            <span className="userName">{shortenedUsername}</span>
        </div>
    );
};

export default Client;