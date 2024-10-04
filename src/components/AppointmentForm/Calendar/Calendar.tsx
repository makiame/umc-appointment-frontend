import React, {useRef, useState} from 'react';
import './Calendar.css'

import {
    Dialog,
    DialogContent,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    useTheme, useMediaQuery
} from "@mui/material";
import {CalendarToday, ArrowForwardIos, ArrowBackIos} from '@mui/icons-material';
import appState from "../../../store/AppState";
import {observer} from "mobx-react-lite";
import CloseIcon from "@mui/icons-material/Close";
import {ICalendarProps} from "../../../types/models";
import {calendarScrollForward, calendarScrollReward, getCalendarColumns} from "./functions";

const Calendar = observer(({scheduleItems, disabled}: ICalendarProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const selected = appState.selected;

    const changeCalendarVisibility = (val: boolean): void => {
        setIsOpen(val);
    }

    const setDateTime = (e: any) => {
        const dateTime = JSON.parse(e.target.dataset.value);
        appState.selected = {
            dateTime: dateTime
        }
        changeCalendarVisibility(false);
    }

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const columns = disabled ? [] : getCalendarColumns(scheduleItems, setDateTime);

    const scrollerRef = useRef(null);
    const columnRef   = useRef(null);
    return (
        <>
            <FormControl variant="outlined" fullWidth={true} sx={{mt:'7px'}} id="calendarInputSize">
                <InputLabel htmlFor="date">{'Выбрать дату'}</InputLabel>
                <div id='calendarInputSize'>
                    <OutlinedInput
                        onFocus={() => changeCalendarVisibility(true)}
                        id="appointment-dateTime"
                        name="appointment-dateTime"
                        type={'text'}
                        value={disabled ? '' : `${selected.dateTime.formattedDate} ${selected.dateTime.formattedTimeBegin}`}
                        disabled={disabled}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    disabled={disabled}
                                    onClick={() => changeCalendarVisibility(true)}
                                    edge="end"
                                >
                                    <CalendarToday />
                                </IconButton>
                            </InputAdornment>
                        }
                        label={'Выбрать дату'}
                    />
                </div>
            </FormControl>

            <Dialog
                onClose={() => changeCalendarVisibility(false)}
                open={isOpen}
                aria-labelledby={`appointment-calendar`}
                maxWidth={'md'}
                fullWidth={true}
                disableRestoreFocus
                fullScreen={fullScreen}
            >
                <IconButton onClick={()=>changeCalendarVisibility(false)}
                            sx={{position: 'absolute', top: 0, right: 0, zIndex: 5}}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent sx={{position:'relative', flexGrow: 0}}>
                    <div ref={scrollerRef} className={"appointment-calendar-grid-column-wrapper"} id={'calendar-grid-scroller'}>
                        {
                            columns.map((column: any, i: number) => {
                                return (
                                    <div className={"appointment-calendar-grid-column"}
                                         key={i}
                                         ref={i === 0 ? columnRef : null}
                                    >
                                        {column}
                                    </div>
                                )
                            })
                        }
                    </div>
                    <IconButton className={'appointment-calendar-btn back'}
                                onClick={()=>calendarScrollReward(scrollerRef, columnRef)}
                                sx={{position:'absolute'}}
                    >
                        <ArrowBackIos/>
                    </IconButton>
                    <IconButton className={'appointment-calendar-btn next'}
                                onClick={()=>calendarScrollForward(scrollerRef, columnRef)}
                                sx={{position:'absolute'}}
                    >
                        <ArrowForwardIos/>
                    </IconButton>
                </DialogContent>
            </Dialog>
        </>
    );
});

export default Calendar;