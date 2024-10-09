import LoadingButton from '@mui/lab/LoadingButton';
import './AppointmentButton.css';
import {FC, useEffect} from "react";
import {observer} from "mobx-react-lite";
import appState from "../../store/AppState";
import dataState from "../../store/OneCDataState";
import {IResponse} from "../../types/models";

const AppointmentButton:FC = () => {
    useEffect(()=>{
        if (appState.isNeedToLoad){
            appState.isLoading = true;
            dataState.loadData()
                .then((res: IResponse) => {
                    if (res && res.error){
                        console.error("Loading data error - " + res.error);
                        appState.isCanRender = false;
                    }
                    else if (res && res.success){
                        appState.isLoading = false;
                    }
                    else{
                        console.error("Loading data error.", res);
                        appState.isCanRender = false;
                    }
                })
                .finally(() => appState.isNeedToLoad = false)
        }
    });

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