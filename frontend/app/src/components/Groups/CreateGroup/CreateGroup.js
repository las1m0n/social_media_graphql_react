import React, {useState} from 'react';
import {gql, useMutation} from "@apollo/client";
import Input from "../../UI/Input/Input";
import Button from "../../UI/Button/Button";

const CREATE_GROUP = gql`
mutation createGroup($name: String!, $about: String!){
  createGroup(name: $name, about: $about){
	group{
      name
      about
      subscribers{
        id
        username
      }
    }
  }
}
`;

const CreateGroup = (props) => {
    const [groupState, setGroupState] = useState({
        isFormValid: false,
        formControls: {
            name: {
                value: '',
                label: 'Название',
                valid: false,
                size: "small"
            },
            about: {
                value: '',
                label: 'О группе',
                valid: false,
                size: "big"
            }
        }
    });

    const [createGroup] = useMutation(CREATE_GROUP, {
        variables: {
            name: groupState.formControls.name.value,
            about: groupState.formControls.about.value
        },
        onCompleted: ({action}) => {
            setGroupState({
                formControls: {
                    name: {
                        value: '',
                        label: 'Название',
                        valid: false,
                        size: "small"
                    },
                    about: {
                        value: '',
                        label: 'О группе',
                        valid: false,
                        size: "big"
                    }
                },
                isFormValid: false
            })
        }
    });

    const validateGroupInputs = (value) => {
        let isValid = true;
        isValid = value.trim() !== '' && isValid
        return isValid
    }

    const submitHandler = event => {
        event.preventDefault();
    }

    const checkValid = (e, partName) => {
        const formControls = {...groupState.formControls};
        const part = {...formControls[partName]}
        let isFormValid = true;

        part.value = e.target.value;
        part.valid = validateGroupInputs(part.value)

        formControls[partName] = part

        Object.keys(formControls).forEach(name => {
            isFormValid = formControls[name].valid && isFormValid
        })
        setGroupState({
            formControls, isFormValid
        })
    }

    const renderInputs = () => {
        return Object.keys(groupState.formControls).map((partName, index) => {
            const postPart = groupState.formControls[partName]
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
                {renderInputs()}
                <div className="button-center">
                    <Button
                        type="gradient"
                        onClick={createGroup}
                        disabled={!groupState.isFormValid}
                    >
                        Создать группу
                    </Button>
                </div>
            </form>
        </>
    );
}

export default CreateGroup;