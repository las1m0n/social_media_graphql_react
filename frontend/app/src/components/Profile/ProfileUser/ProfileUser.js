import React from 'react';

const ProfileUser = (props) => (
    <div>{props.match.params.id}</div>
);

export default ProfileUser;