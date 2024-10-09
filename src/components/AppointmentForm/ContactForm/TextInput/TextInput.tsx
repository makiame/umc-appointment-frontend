import React, { ChangeEvent, FC, SyntheticEvent, useState } from 'react';
import { emailIsValid, maskInput, phoneIsValid } from "../functions";
import { ITextInputProps } from "../../../../types/models";
import { ETextFields } from "../../../../types/selectedData";
import { TextField } from "@mui/material";
import appState from "../../../../store/AppState";
import { observer } from "mobx-react-lite";

const TextInput: FC<ITextInputProps> = ({
    name,
    label,
    required,
    multiline
}) => {
    const [helperText, setHelperText] = useState('');
    const [isChanged, setIsChanged] = useState((appState.selected.textFields[name].length > 0));

    const handleInput = (e: SyntheticEvent<HTMLInputElement>) => {
        !isChanged ? setIsChanged(true) : void 0;

        const input = e.target as HTMLInputElement;
        const name = input.name;
        let value = input.value;

        // Ограничение для поля code — только цифры
        if (name === ETextFields.code) {
            value = value.replace(/\D/g, ''); // Удаляет все нецифровые символы
        }

        if (name === ETextFields.comment) {
            if (value.length > 300) {
                return false;
            }
        }

        if (name === ETextFields.phone) {
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
        const { name, value } = e.target;

        let isValid = true;
        let text = '';

        switch (name) {
            case ETextFields.name:
            case ETextFields.secondName:
            case ETextFields.lastName:
                if (value.length < 2) {
                    isValid = false;
                    text = 'Значение должно быть от 2 до 50 символов';
                }
                break;
            case ETextFields.phone:
                if (!phoneIsValid(value)) {
                    isValid = false;
                    text = 'Некорректный номер телефона';
                }
                break;
            case ETextFields.email:
                if (value.length > 0 && !emailIsValid(value)) {
                    isValid = false;
                    text = 'Некорректный email';
                }
                break;
            case ETextFields.code:
                if (value.length > 0 && !/^\d{6}$/.test(value)) { // Проверка на 6 цифр только если поле не пустое
                    isValid = false;
                    text = 'Код должен состоять из 6 цифр';
                }
                break;
            case ETextFields.comment:
                // Всегда валидный комментарий
                text = `Использовано ${value.length} символов из 300`;
                break;
            default:
                isValid = true;
        }

        setHelperText(text);
        appState.validityOfTextFields = { [name]: isValid };
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
                   type={name === ETextFields.code ? 'tel' : 'text'} // Устанавливаем type='tel' для поля "Код доктора"
                   error={isChanged && !appState.validityOfTextFields[name]}
                   helperText={helperText}
                   fullWidth
                   inputProps={{
                       maxLength: name === ETextFields.code ? 6 : multiline ? 300 : 50, // Ограничение длины для кода
                       autoComplete: name === ETextFields.phone ? "new-password" : 'on',
                   }}
        />
    );
};

export default observer(TextInput);
