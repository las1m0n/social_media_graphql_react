import React, {useState} from 'react';
import FormikForm from "./FormikActions";
import {gql, useMutation} from "@apollo/client";

const STATUS_CHANGE = gql`
mutation changeStatus($status: String!){
  changeStatus(status: $status){
    status{
        id
    }
  }
}
`;


function EditProfile(props) {
    const [fields, updateFields] = useState(
        {
            about: props.about || 'Статус не установлен'
        }
    );

    const [changeStatus] = useMutation(STATUS_CHANGE)
    return (
        <div>
            <FormikForm
                fields={fields}
                updateFields={updateFields}
                onChange={changeStatus}
            />
        </div>
    );
}

export default EditProfile;