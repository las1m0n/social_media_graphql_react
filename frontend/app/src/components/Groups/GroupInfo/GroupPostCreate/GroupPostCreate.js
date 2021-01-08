import React, {useState} from 'react';
import {gql, useMutation} from "@apollo/client";
import Input from "../../../UI/Input/Input";
import Button from "../../../UI/Button/Button";

const CREATE_POST_GROUP = gql`
mutation createPostGroup($id: ID!, $name: String!, $message: String!){
  createGroupPost(id:$id, name: $name, message: $message){
    post{
      name
      message
    }
  }
}
`;


const GroupPostCreate = (props) => {
    const [postState, setPostState] = useState({
        isFormValid: false,
        formControls: {
            title: {
                value: '',
                label: 'Title',
                valid: false,
                size: "small"
            },
            message: {
                value: '',
                label: 'Message...',
                valid: false,
                size: "big"
            }
        }
    });

    const [createGroupPost] = useMutation(CREATE_POST_GROUP, {
        variables: {
            id: props.id,
            name: postState.formControls.title.value,
            message: postState.formControls.message.value
        },
        onCompleted: ({action}) => {
            setPostState({
                formControls: {
                    title: {
                        value: '',
                        label: 'Title',
                        valid: false,
                        size: "small"
                    },
                    message: {
                        value: '',
                        label: 'Message...',
                        valid: false,
                        size: "big"
                    }
                },
                isFormValid: false
            })
        }
    });

    const validateGroupPostInputs = (value) => {
        let isValid = true;
        isValid = value.trim() !== '' && isValid
        return isValid
    }

    const submitHandler = event => {
        event.preventDefault();
    }

    const checkValid = (e, partName) => {
        const formControls = {...postState.formControls};
        const part = {...formControls[partName]}
        let isFormValid = true;

        part.value = e.target.value;
        part.valid = validateGroupPostInputs(part.value)

        formControls[partName] = part

        Object.keys(formControls).forEach(name => {
            isFormValid = formControls[name].valid && isFormValid
        })
        setPostState({
            formControls, isFormValid
        })
    }

    const renderPostGroupInputs = () => {
        return Object.keys(postState.formControls).map((partName, index) => {
            const postPart = postState.formControls[partName]
            return (
                <Input
                    key={index}
                    value={postPart.value}
                    label={postPart.label}
                    size={postPart.size}
                    onChange={event => checkValid(event, partName)}
                />
            )
        })
    }

    const group_post_create = (
        <div>
            <form onSubmit={submitHandler}>
                {renderPostGroupInputs()}
                <Button
                    type="gradient"
                    onClick={createGroupPost}
                    disabled={!postState.isFormValid}
                >
                    Запостить
                </Button>
            </form>
        </div>
    );

    return (
        group_post_create
    )
}

export default GroupPostCreate;