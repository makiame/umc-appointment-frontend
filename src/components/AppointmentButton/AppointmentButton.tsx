import LoadingButton from '@mui/lab/LoadingButton';
import './AppointmentButton.css';
import {FC, useEffect} from "react";
import {observer} from "mobx-react-lite";
import appState from "../../store/AppState";
import dataState from "../../store/OneCDataState";
import {IResponse} from "../../types/models";

const AppointmentButton:FC = () => {

    useEffect(() => {
        const wrapper = document.getElementById('appointment-button-wrapper');
        if (wrapper) {
            wrapper.style.setProperty('--pulse-bg-color', appState.primaryColor); // Новый цвет фона
        }
    }, [appState.isLoading, appState.isAppOpen]);

    if (!appState.isCanRender){
        return <></>
    }

    return (
        <div id={`appointment-button-wrapper`}
             className={`${ !appState.isLoading && !appState.isAppOpen ? 'pulse' : ''}`}
        >
            <LoadingButton

                onClick={() => appState.toggleAppointmentForm(true)}
                loading={appState.isLoading}
                loadingPosition="center"
                variant={`${appState.isAppOpen ? 'outlined' : 'contained'}`}
            >
                Запись на приём
            </LoadingButton>
        </div>
    );
}

export default observer(AppointmentButton);