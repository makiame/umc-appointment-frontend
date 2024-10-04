import React, {useEffect, FC} from 'react';
import AppointmentForm from "./AppointmentForm/AppointmentForm";
import {observer} from "mobx-react-lite";
import './App.css';
import dataState from "../store/OneCDataState";
import {IResponse} from "../types/models";
import appState from "../store/AppState";
import AppointmentButton from './AppointmentButton/AppointmentButton';

const App: FC = () => {
    useEffect(()=>{
        if(!appState.isUseFloatButton) {
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
        }
    });


    return (
          <>
              <AppointmentForm/>
              {appState.isUseFloatButton?<AppointmentButton/>:<></>}
          </>
    );
}

export default observer(App);