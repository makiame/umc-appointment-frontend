import React, {FC} from 'react';
import {Box, DialogContent, Typography} from "@mui/material";
import ErrorIcon from '@mui/icons-material/Error';
import VerifiedIcon from '@mui/icons-material/Verified';
import appState from "../../../store/AppState";
import {observer} from "mobx-react-lite";

const FinalScreen:FC = () => {
    return (
        <DialogContent>
            <Box sx={{display: 'flex',alignItems:'center',justifyContent: 'center'}}>
                {
                    appState.appResult
                    ?
                    <>
                        <VerifiedIcon sx={{mr:2, width: '50px', height: '50px'}} color={"success"}/>
                        <Typography variant="body1">
                            Вы успешно записаны на приём.<br/>
                            Врач - <b>{appState.selected.employee.name}</b><br/>
                            Дата <b>{appState.selected.dateTime.formattedDate}</b><br/>
                            Время <b>{appState.selected.dateTime.formattedTimeBegin}</b>
                        </Typography>
                    </>
                    :
                    <>
                        <ErrorIcon sx={{mr:2, width: '50px', height: '50px'}} color={"error"}/>
                        <Typography variant="body1">
                            Создание записи не удалось. Возможно время уже занято.<br/>
                            Попробуйте повторить запись, выбрав другое время.
                        </Typography>
                    </>
                }
            </Box>
        </DialogContent>
    );
};

export default observer(FinalScreen);