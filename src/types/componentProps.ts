import {MouseEventHandler} from "react";

export interface ISubmitButtonProps {
    disabled: boolean,
    clickHandler: MouseEventHandler<HTMLButtonElement>
}