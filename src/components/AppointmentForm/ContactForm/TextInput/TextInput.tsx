import React, { ChangeEvent, FC, SyntheticEvent, useState } from 'react';
import { emailIsValid, maskInput, phoneIsValid } from "../functions";
import { ITextInputProps } from "../../../../types/models";
import { ETextFields } from "../../../../types/selectedData";
import { TextField } from "@mui/material";
import appState from "../../../../store/AppState";
import { observer } from "mobx-react-lite";
import dayjs from 'dayjs';

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

        if (name === ETextFields.clientBirthday) {
            // Форматирование даты в формате "DD/MM/YYYY"
            value = value.replace(/\D/g, ''); // Удаляем все нецифровые символы
            if (value.length >= 5) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4) + '/' + value.slice(4, 8);
            } else if (value.length >= 3) {
                value = value.slice(0, 2) + '/' + value.slice(2);
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
            case ETextFields.clientBirthday:
                // Проверка корректности даты рождения
                const currentYear = dayjs().year();
                const minYear = currentYear - 12;
                const maxYear = currentYear;

                const [day, month, year] = value.split('/').map(Number);
                const clientBirthday = dayjs(`${year}-${month}-${day}`);

                console.log(clientBirthday);
                if (!clientBirthday.isValid() || year > maxYear || month > 12 || day > 31 || year < 1920) {
                    isValid = false;
                    text = 'Некорректная дата рождения';
                }
                break;
            case ETextFields.code:
                if (value.length > 0 && !/^\d{6}$/.test(value)) {
                    isValid = false;
                    text = 'Код должен состоять из 6 цифр';
                }
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
                   type={name === ETextFields.code ? 'tel' : 'text'}
                   error={isChanged && !appState.validityOfTextFields[name]}
                   helperText={helperText}
                   fullWidth
                   inputProps={{
                       maxLength: name === ETextFields.clientBirthday ? 10 : name === ETextFields.code ? 6 : multiline ? 300 : 50,
                       autoComplete: name === ETextFields.phone ? "new-password" : 'on',
                   }}
        />
    );
};

export default observer(TextInput);
