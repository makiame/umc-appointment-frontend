import React, {useEffect, FC} from 'react';
import AppointmentForm from "./AppointmentForm/AppointmentForm";
import {observer} from "mobx-react-lite";
import './App.css';
import dataState from "../store/OneCDataState";
import {IResponse} from "../types/models";
import appState from "../store/AppState";
import AppointmentButton from './AppointmentButton/AppointmentButton';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        text: {
            primary: appState.primaryTextColor, // Основной цвет текста
            secondary: appState.secondaryTextColor, // Второстепенный цвет текста
        },
        primary: {
            main: appState.primaryColor,
        },
        secondary: {
            main: appState.secondaryColor,
        },
    },
    typography: {
        fontFamily: appState.fontFamily,
        fontSize: appState.fontSize
    },
});


const App: FC = () => {
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


    return (
          <ThemeProvider theme={theme}>
              <AppointmentForm/>
              {appState.isUseFloatButton?<AppointmentButton/>:<></>}
          </ThemeProvider>
    );
}

export default observer(App);