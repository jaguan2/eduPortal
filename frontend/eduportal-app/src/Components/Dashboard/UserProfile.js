import React from 'react';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function UserProfile({ name, imageUrl }) {
    return (
        <Box display="flex" alignItems="center" gap={2}>
            <Avatar
                alt="Profile"
                src={imageUrl || "https://via.placeholder.com/80"}  // Use imageUrl or placeholder
                sx={{ width: 80, height: 80 }}
            />
            <Typography variant="h6" component="h2">{name}</Typography>
        </Box>
    );
}

export default UserProfile;
