import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import {configure, spy} from "mobx";
import appState from './store/AppState';

const btnAppointmentFirst = document.querySelectorAll(".appointment-umc-btn")
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
      <App />
  </React.StrictMode>,
  document.getElementById('appointment-widget-root')
);
