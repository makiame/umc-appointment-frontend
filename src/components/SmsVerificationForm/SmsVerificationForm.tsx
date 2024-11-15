import {FC, useEffect, useRef, useState} from "react";
import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import appState from "../../store/AppState";
import { observer } from "mobx-react-lite";
import { runInAction } from 'mobx';
import {IOrderParams, IResponse} from "../../types/models";
import dataState from "../../store/OneCDataState";

type SmsVerificationFormProps = {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
};

const SmsVerificationForm: FC<SmsVerificationFormProps> = observer(({ open, setOpen }) => {

    const codeError = appState.smsError;
    const attempts = appState.smsAttempts;
    const timer = appState.smsTimer;
    const isTimerActive = appState.smsTimerIsActive;
    const isSmsSent = appState.smsIsSent;
    const isSmsSuccess = appState.smsIsSuccess;
    const isSmsDisabled = appState.smsDisabled;
    const [smsCode, setSmsCode] = useState("");
    const [smsNumber, setSmsNumber] = useState("");
    const [smsfocused, setSmsfocused] = useState(false);

    useEffect(() => {
        if (isTimerActive && timer > 0) {
            const interval = setInterval(() => {
                runInAction(() => {
                    appState.smsTimer -= 1;
                });
            }, 1000);

            return () => clearInterval(interval);
        } else if (timer === 0) {
            runInAction(() => {
                appState.smsTimerIsActive = false;
                appState.smsTimer = 300;
            });
        }
    }, [isTimerActive, timer]);

    useEffect(() => {
        setSmsNumber(appState.selected.textFields.phone);
    }, [appState.selected.textFields.phone]);

    const handleClose = () => {
        setOpen(false);
    };

    const sendOrder = async () => {
            console.log('teeeeeeeeeest');
        const selected = appState.selected;

        appState.isLoading = true;
        let orderData: IOrderParams = {
            clinicUid: selected.clinic.uid,
            clinicName: selected.clinic.name,
            specialty: selected.specialty.name,
            refUid: selected.employee.uid,
            doctorName: selected.employee.name,
            services: selected.services,
            orderDate: selected.dateTime.date,
            timeBegin: selected.dateTime.timeBegin,
            timeEnd: selected.dateTime.timeEnd,
            appointmentDuration: appState.serviceDuration,
            ...selected.textFields
        };

        dataState.sendOrder(orderData).then((res: IResponse) => {
            if (res && res.success) {
                appState.appResult = true;
            } else {
                appState.appResult = false;
                console.error(`Send order error. ${res ? res.error : ''}`);
            }
            appState.isLoading = false;
            appState.stepNext();
        });
    };

    const handleSendOrder = () => {
        sendOrder().then(() => {
                runInAction(() => {
                    appState.smsIsSent = false;
                    appState.smsTimer = 300;
                    appState.smsTimerIsActive = false;
                    appState.smsAttempts = 0;
                    appState.smsError = false;
                    appState.smsIsSuccess = false;
                    appState.smsDisabled = false;
                })
            }
        );
        setTimeout(() => {
            handleClose();
        }, 2000)
    }

    const sendSms = async (body: FormData): Promise<any> => {
        try {
            if (isTimerActive) {
                alert("Вы не можете отправлять СМС слишком часто. Подождите завершения таймера.");
                return;
            }

            if (attempts >= 3) {
                alert("Вы не можете отправлять СМС слишком часто. Перезагрузите старницу.");
                return;
            }

            body.append("domain", window.location.hostname);

            runInAction(() => {
                appState.smsConfirmationData = {
                    phone: body.get('phone') as string,
                    code: ''
                };
            });

            const response = await fetch('http://127.0.0.1:8000/api/medical/sms-confirmation', {
                method: "POST",
                body: body
            });

            if (!response.ok) {
                handleSendOrder();
            }

            const smsResponse = await response.json();

            if (smsResponse.status === "OK") {
                runInAction(() => {
                    appState.smsIsSent = true;
                    appState.smsTimerIsActive = true;
                    appState.smsAttempts += 1;
                    setSmsCode("");
                });
            } else {
                handleSendOrder();
            }

            return smsResponse;

        } catch (e) {
            console.error("Ошибка при отправке : " + (e as Error).message);
            handleSendOrder();
        }
    };

    const verifyCode = async (body: FormData): Promise<void> => {
        try {

            runInAction(() => {
                appState.smsDisabled = true;
            })

            body.append("phone", smsNumber);

            const response = await fetch('http://127.0.0.1:8000/api/medical/sms-confirmation/verify', {
                method: "POST",
                body: body
            });


            if (!response.ok) {
                console.error("Ошибка при отправке запроса");
                handleSendOrder();
            }

            const verifyResponse = await response.json();

            if (verifyResponse.status === "OK") {

                runInAction(() => {
                    appState.smsDisabled = false;
                    appState.smsError = false;
                    appState.smsIsSuccess = true;
                });

                handleSendOrder();

            } else {
                runInAction(() => {
                    appState.smsDisabled = false;
                    appState.smsError = true;
                    appState.smsIsSuccess = false;
                });
            }

        } catch (e) {
            console.error("Ошибка при отправке : " + (e as Error).message);
            handleSendOrder();
        }
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        if (!isSmsSent) {
            sendSms(formData);
        } else {
            verifyCode(formData);
        }
    };

    const handleResendSms = () => {
        runInAction(() => {
            appState.smsIsSent = false;
            appState.smsError = false;
            appState.smsDisabled = false;
            appState.smsIsSuccess = false;
        });
    };

    const handleSuccess = () => {
        console.log("Верификация прошла успешно");
    };

    const formatTimer = () => {
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;
        return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
    };

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: handleSubmit
                }}
            >
                <DialogTitle>Подтвердите, что вы человек</DialogTitle>
                <DialogContent>
                    {isSmsSent ? (
                        <>
                            <DialogContentText>
                                Введите код, отправленный на указанный номер.
                            </DialogContentText>
                            <TextField
                                focused
                                required
                                color={isSmsSuccess? 'success' : 'primary'}
                                disabled={isSmsDisabled}
                                error={codeError}
                                helperText={codeError ? "Неверный код" : ""}
                                margin="dense"
                                id="code"
                                name="code"
                                label="Код из SMS"
                                value={smsCode}
                                onChange={(e) => setSmsCode(e.target.value)}
                                fullWidth
                                variant="standard"
                                inputProps={{ maxLength: 5 }}
                            />
                            {isTimerActive ? (
                                <DialogContentText>
                                    Повторная отправка возможна через: {formatTimer()}
                                </DialogContentText>
                            ) : (
                                <Button size={"small"} onClick={handleResendSms}>Отправить СМС повторно</Button>
                            )}
                        </>
                    ) : (
                        <>
                            <DialogContentText>
                                На ваш номер будет отправлено SMS сообщение с кодом. Пожалуйста, проверьте правильность номера и нажмите "Отправить код".
                            </DialogContentText>
                            <TextField
                                required
                                margin="dense"
                                id="phone"
                                name="phone"
                                label="Номер телефона"
                                fullWidth
                                variant="standard"
                                value={smsNumber}
                                onChange={(e) => setSmsNumber(e.target.value)}
                                disabled={isSmsSent || isTimerActive}
                            />
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    {isSmsSent ? (
                        <>
                            <Button onClick={handleClose}>Закрыть</Button>
                            <Button type="submit">Подтвердить</Button>
                        </>
                    ) : (
                        <>
                            <Button onClick={handleClose}>Отмена</Button>
                            <Button type="submit" disabled={isTimerActive}>Отправить код</Button>
                        </>
                    )}
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
});

export default SmsVerificationForm;
