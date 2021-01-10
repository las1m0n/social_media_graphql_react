import {gql, useMutation} from '@apollo/client/index';
import React, {useState} from "react";
import Input from "../../UI/Input/Input";
import Button from "../../UI/Button/Button";

const POST_CREATE = gql`
mutation createPost($name: String!, $message: String!){
  createPost(name: $name, message: $message){
    post{
      id
      name
      message
    }
  }
}
`;

const PostCreate = () => {
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

    const [createPost] = useMutation(POST_CREATE, {
        variables: {
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

    const validateInputs = (value) => {
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
        part.valid = validateInputs(part.value)

        formControls[partName] = part

        Object.keys(formControls).forEach(name => {
            isFormValid = formControls[name].valid && isFormValid
        })
        setPostState({
            formControls, isFormValid
        })
    }

    const renderInputs = () => {
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

    const post_create = (
        <div>
            <form onSubmit={submitHandler}>
                {renderInputs()}
                <Button
                    type="gradient"
                    onClick={createPost}
                    disabled={!postState.isFormValid}
                >
                    Запостить
                </Button>
            </form>
        </div>
    );

    return (
        post_create
    );
}

export default PostCreate;