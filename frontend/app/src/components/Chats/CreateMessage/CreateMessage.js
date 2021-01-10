import React, {useState} from 'react';
import {gql, useMutation} from "@apollo/client";
import Input from "../../UI/Input/Input";
import Button from "../../UI/Button/Button";

const CREATE_MESSAGE = gql`
mutation createMessage($body: String!, $chatId: ID!){
  createMessage(body: $body, chatId: $chatId){
    message{
        id
        body
        createdAt
    }
  }
}
`;

const CreateMessage = (props) => {
    const [messageState, setMessageState] = useState({
        isFormValid: false,
        formControls: {
            body: {
                value: '',
                label: 'Сообщение...',
                valid: false,
                size: "big"
            }
        }
    });


    const [createMessage] = useMutation(CREATE_MESSAGE, {
        variables: {
            body: messageState.formControls.body.value,
            chatId: props.chat_id
        },
        onCompleted: ({action}) => {
            console.log(props.chat_id, messageState.formControls.body.value)
            setMessageState({
                formControls: {
                    body: {
                        value: '',
                        label: 'Сообщение...',
                        valid: false,
                        size: "big"
                    }
                },
                isFormValid: false
            })
        }
    });

    const validateMessageInputs = (value) => {
        let isValid = true;
        isValid = value.trim() !== '' && isValid
        return isValid
    }

    const submitHandler = event => {
        event.preventDefault();
    }

    const checkValid = (e, partName) => {
        const formControls = {...messageState.formControls};
        const part = {...formControls[partName]}
        let isFormValid = true;

        part.value = e.target.value;
        part.valid = validateMessageInputs(part.value)

        formControls[partName] = part

        Object.keys(formControls).forEach(name => {
            isFormValid = formControls[name].valid && isFormValid
        })
        setMessageState({
            formControls, isFormValid
        })
    }

    const renderMessageInput = () => {
        return Object.keys(messageState.formControls).map((partName, index) => {
            const postPart = messageState.formControls[partName]
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

    return (
        <>
            <form onSubmit={submitHandler}>
                {renderMessageInput()}
                <div className="button-center">
                    <Button
                        type="gradient"
                        onClick={createMessage}
                        disabled={!messageState.isFormValid}
                    >
                        Отправить
                    </Button>
                </div>
            </form>
        </>
    );
}

export default CreateMessage;