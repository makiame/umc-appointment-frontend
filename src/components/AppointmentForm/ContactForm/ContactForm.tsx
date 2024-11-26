import React, { FC, useState } from 'react';
import { Button, Checkbox, DialogActions, DialogContent, DialogContentText, Link, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { IOrderParams, IResponse } from '../../../types/models';
import { ETextFields } from '../../../types/selectedData';
import TextInput from './TextInput/TextInput';
import appState from '../../../store/AppState';
import dataState from '../../../store/OneCDataState';
import SubmitBtn from '../SubmitBtn/SubmitBtn';
import ReCAPTCHA from 'react-google-recaptcha';
import './ContactForm.css';
import SmsVerificationForm  from "../../SmsVerificationForm/SmsVerificationForm";

const ContactForm: FC = () => {
    const fields = [
        { name: ETextFields.name, label: 'Ваше имя', required: true, multiline: false },
        { name: ETextFields.secondName, label: 'Ваше Отчество', required: true, multiline: false },
        { name: ETextFields.lastName, label: 'Ваша фамилия', required: true, multiline: false },
        { name: ETextFields.phone, label: 'Телефон', required: true, multiline: false },
        { name: ETextFields.clientBirthday, label: 'Дата рождения', required: true, multiline: true },
        { name: ETextFields.email, label: 'Email', required: false, multiline: false },
    ];

    const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
    const [errorCaptcha, setErrorCaptcha] = useState('');

    const handleRecaptcha = (token: string | null) => {
        setRecaptchaToken(token);
    };

    const [open, setOpen] = useState(false);

    const handleClick = () => {
        if (!appState.termsIsAccepted) {
            alert('Пожалуйста, согласитесь с политикой конфиденциальности, чтобы продолжить!');
        } else {
            setOpen(true);
        }
    }

    const handleChangeTerm = (event: React.ChangeEvent<HTMLInputElement>) => {
        appState.termsIsAccepted = event.target.checked;
    };

    const getPrivacyLink = (): string => {
        if (appState.privacyLinkComparisons.hasOwnProperty(appState.selected.clinic.uid)) return appState.privacyLinkComparisons[appState.selected.clinic.uid];

        if (appState.privacyLinkComparisons.hasOwnProperty(appState.selected.clinic.name)) return appState.privacyLinkComparisons[appState.selected.clinic.name];

        return appState.privacyPageUrl;
    }

    const sendOrder = async () => {
        if (appState.isUseGoogleCaptcha) {
            if (!recaptchaToken) {
                setErrorCaptcha('Пожалуйста, подтвердите, что вы человек');
                return;
            }
        }

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

    return (
        <>
            <SmsVerificationForm open={open} setOpen={setOpen}/>

            <DialogContent>
                <Button onClick={appState.stepBack} sx={{ mt: -2, ml: 1 }}>
                    Назад
                </Button>

                {fields.map((field) => (
                    <TextInput key={field.name} name={field.name} label={field.label} required={field.required} multiline={field.multiline} />
                ))}

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        justifyItems: 'center',
                        width: '100px',
                        paddingLeft: '8px'
                    }}
                >
                    <Typography style={{    fontFamily: "Roboto, Helvetica, Arial, sans-serif",
                                        fontWeight: '400',
                                        fontSize: '0.875rem',
                                        lineHeight: '1.43',
                                        letterSpacing: '0.01071em',
                                        display: 'block'}}>Я врач</Typography>
                    <Checkbox

                        size={"small"}
                        checked={appState.isDoctorClicked}
                        onChange={() => appState.isDoctorClicked = !appState.isDoctorClicked}
                    />
                </div>

                {/* Условное рендеринг поля с CSS-анимацией */}
                <div className={`doctor-code-container ${appState.isDoctorClicked ? 'visible' : 'hidden'}`}>
                    <TextInput
                        name={ETextFields.code}
                        label="Код доктора"
                        required={false}
                        multiline={false}
                    />
                </div>

                {appState.isUseGoogleCaptcha ? (
                    <>
                        <div style={{ paddingTop: '8px' }}>
                            <ReCAPTCHA sitekey={appState.getGoogleCaptchaSiteToken} onChange={handleRecaptcha} />
                        </div>
                        <span className="captcha-error" style={{ color: 'red' }}>
                            {errorCaptcha}
                        </span>
                    </>
                ) : null}

                <DialogActions sx={{ display: 'flex', justifyContent: 'center', mt: '30px' }}>
                    <SubmitBtn disabled={!appState.checkTextFields() || appState.isLoading} clickHandler={handleClick} />
                </DialogActions>

                <DialogContentText sx={{ textAlign: 'center' }}>
                        <Checkbox size={"small"} checked={appState.termsIsAccepted} onChange={handleChangeTerm} sx={{ padding: '2px', marginBottom: '1px'}}></Checkbox>
                        <span>Я даю согласие на обработку персональных данных в соответствии с </span>
                        <Link
                            href={getPrivacyLink()}
                            rel="noopener noreferrer"
                            target={'_blank'}
                            variant="body1"
                        >
                            Политикой конфиденциальности
                        </Link>
                </DialogContentText>
            </DialogContent>
        </>
    );
};

export default observer(ContactForm);
