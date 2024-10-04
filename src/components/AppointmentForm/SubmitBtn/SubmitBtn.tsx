import {Button, Tooltip} from "@mui/material";
import React, {FC} from "react";
import {observer} from "mobx-react-lite";
import {ISubmitButtonProps} from "../../../types/componentProps";

const SubmitBtn:FC<ISubmitButtonProps> = ({disabled, clickHandler}) => {
    const button =  <Button
        variant="contained"
        onClick={disabled ? ()=>false : clickHandler}
        disabled={disabled}
        size="large"
        className="g-recaptcha" 
        data-sitekey="reCAPTCHA_site_key" 
        data-callback='onSubmit' 
        data-action='submit'
    >
        Записаться на приём
    </Button>
    return (
        disabled
            ?
            <Tooltip placement={'top'} title="Сначала заполните обязательные поля" followCursor>
                
            <span style={{display: 'block',maxWidth: 'max-content',margin:'0 auto'}}>
                 <script src="https://www.google.com/recaptcha/api.js"></script>

                {button}
            </span>
            </Tooltip>
            :
            {...button}
    )
}

export default observer(SubmitBtn);