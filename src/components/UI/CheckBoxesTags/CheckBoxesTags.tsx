import React, {FC, SyntheticEvent, useState} from 'react';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import {observer} from "mobx-react-lite";
import './CheckboxesTags.css'
import appState from "../../../store/AppState";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

interface ICheckboxesTagsProps{
    id: string,
    options: any[],
    label: string,
    disabled: boolean,
    value: any[],
    valueSetter: (val: any[]) => void,
    multiple: boolean
}

const CheckboxesTags:FC<ICheckboxesTagsProps> = (
    {id, options, label, disabled, value, valueSetter, multiple}
) => {
    const [isMax, setIsMax] = useState(false)

    const changeOption = (e: SyntheticEvent<Element,Event>, val: any[]) => {
        if (appState.isUseMultipleServices){
            if(val.length >= 3){
                setIsMax(true)
            }else{
                setIsMax(false)
            }
        }

        let valueToState = [];
        if (val !== null){
            valueToState = appState.isUseMultipleServices ? val : [val]
        }

        return valueSetter(valueToState);
    };

    let displayValue: any;
    if (appState.isUseMultipleServices){
        displayValue = value;
    }
    else{
        displayValue = value[0] !== undefined ? value[0] : null;
    }


    return (
        <Autocomplete
            autoComplete={true}
            noOptionsText={`Нет результатов`}
            className={'checkboxes-tags-search'}
            //size={'small'}
            limitTags={3}
            disableListWrap={true}
            multiple={multiple}
            onChange={changeOption}
            value={displayValue}
            id={`${id}-checkboxes-tags`}
            options={options}
            disableCloseOnSelect={appState.isUseMultipleServices && appState.selected.services.length < 2}
            ListboxProps={{className: "checkboxes-tags-search-list"}}
            disabled={disabled}
            isOptionEqualToValue={(option, value) => option.uid === value.uid}
            getOptionLabel={(option) => option.name}
            getOptionDisabled={(option) => isMax || !(option.uid.length > 0)}
            renderOption={(props, option, { selected }) => (
                <li {...props}>
                    {
                        multiple && (option.uid.length > 0)
                        ?
                        <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{marginRight: 8}}
                            checked={selected}
                        />
                        : ''
                    }
                    {option.name}
                </li>
            )}
            style={{ width: 500 }}
            renderInput={(params) => (
                <TextField {...params} label={label} placeholder={isMax?'':'Поиск...'} />
            )}
        />
    );
}

export default observer(CheckboxesTags);
