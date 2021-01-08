import React from 'react';
import './Input.css';

//rsi

function isInvalid({valid, touched, shouldValidate}) {
    return !valid && shouldValidate && touched
}

const Input = props => {
    const inputType = props.type || 'text'
    const sizeInput = props.size || null
    const cls = ['Input', sizeInput]
    const htmlFor = `${inputType}-${Math.random()}`

    if (isInvalid(props)) {
        cls.push('invalid')
    }

    return (
        <div className={cls.join(' ')}>
            <label htmlFor={htmlFor}>{props.label}</label>
            {props.size !== "big" ?
                <input
                    type={inputType}
                    id={htmlFor}
                    value={props.value}
                    onChange={props.onChange}
                />
                : <textarea
                    id={htmlFor}
                    value={props.value}
                    onChange={props.onChange}
                />
            }
            {isInvalid(props) ? <span>{props.errorMessage || 'Ввести корректное значение'}</span> : null}
        </div>
    )
}

export default Input;
