import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import {CssBaseline} from "@mui/material";
import {configure, runInAction, spy} from "mobx";
import appState from './store/AppState';

const btnAppointmentFirst = document.querySelectorAll(".appointment-first-btn")
btnAppointmentFirst.forEach(btn => {
    btn.addEventListener('click', function(){
        appState.isAppOpen = true;
    })
})

configure({
    reactionScheduler: (f) => {
        setTimeout(f)
    }
})

if (process.env.NODE_ENV !== 'production'){
    spy((event) => {
        event.type === "action" ? console.log(event) : void(0)
    })
}


ReactDOM.render(
  <React.StrictMode>
      <CssBaseline />
      <App />
  </React.StrictMode>,
  document.getElementById('appointment-widget-root')
);
