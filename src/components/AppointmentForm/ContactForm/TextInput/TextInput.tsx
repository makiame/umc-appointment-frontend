import React, {ChangeEvent, FC, SyntheticEvent, useState} from 'react';
import {emailIsValid, maskInput, phoneIsValid} from "../functions";
import {ITextInputProps} from "../../../../types/models";
import {ETextFields} from "../../../../types/selectedData";
import {TextField} from "@mui/material";
import appState from "../../../../store/AppState";
import {observer} from "mobx-react-lite";

const TextInput: FC<ITextInputProps> = ({
        name,
        label,
        required,
        multiline
    }) => {
    const [helperText, setHelperText] = useState('');
    const [isChanged, setIsChanged]   = useState((appState.selected.textFields[name].length > 0));

    const handleInput = (e: SyntheticEvent<HTMLInputElement>) => {
        !isChanged ? setIsChanged(true) : void(0);

        const input = (e.target as HTMLInputElement);
        const name  = input.name;
        let   value = input.value;

        if(name === ETextFields.comment) {
            if ((value.length > 300)){
                return false;
            }
        }

        if(name === ETextFields.phone){
            value = maskInput(value, '+7(000)000-00-00');
        }

        input.value = value;
        appState.selected = {
            textFields: {
                ...appState.selected.textFields,
                ...{ [name]: value }
            }
        };
    }

    const validateInput = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        let isValid = true;
        let text = '';

        switch (name) {
            case "name":
            case "middleName":
            case "surname":
                if (value.length < 2){
                    isValid = false;
                    text = 'Значение должно быть от 2 до 50 символов';
                }
                break;
            case "phone":
                if (!phoneIsValid(value)){
                    isValid = false;
                    text = 'Некорректный номер телефона';
                }
                break;
            case "email":
                if (value.length > 0 && !emailIsValid(value)){
                    isValid = false;
                    text = 'Некорректный email';
                }
                break;
            case "comment":
                //always valid
                text =`Использовано ${value.length} символов из 300`;
                break;
        }

        setHelperText(text);
        appState.validityOfTextFields = {[name]: isValid};
    }

    return (
        <TextField size="small"
                   required={required}
                   multiline={multiline}
                   maxRows={3}
                   margin={`dense`}
                   onInput={handleInput}
                   onChange={validateInput}
                   name={name}
                   label={label}
                   defaultValue={appState.selected.textFields[name]}
                   type={'text'}
                   error={isChanged && !appState.validityOfTextFields[name]}
                   helperText={helperText}
                   fullWidth
                   inputProps={{
                       maxLength: multiline ? 300 : 50,
                       autocomplete: name === 'phone' ? "new-password" : 'on',
                   }}
        />
    );
};

export default observer(TextInput);