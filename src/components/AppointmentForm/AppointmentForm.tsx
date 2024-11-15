import {FC, useEffect} from 'react';
import {
    Box,
    CircularProgress, Dialog, IconButton,
    Step, StepLabel, Stepper,
    Typography,
    useMediaQuery,
    useTheme
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import SelectionForm from "./SelectionForm/SelectionForm";
import ModeForm from "./ModeForm/ModeForm";
import FinalScreen from "./FinalScreen/FinalScreen";
import ContactForm from "./ContactForm/ContactForm";
import {observer} from "mobx-react-lite";
import appState from "../../store/AppState";
import "./AppointmentForm.css";


const AppointmentForm:FC = () => {

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const steps = [
        {id: 'mode',        label: "Филиал и направление"},
        {id: 'selection',   label: "Доктор, услуга, время"},
        {id: 'contact',     label: "Контакты"},
        {id: 'final',       label: "Результат"},
    ];

    function getStepContent(step: number) {
        switch (step) {
            case 0:
                return <ModeForm />;
            case 1:
                return <SelectionForm />;
            case 2:
                return <ContactForm />;
            case 3:
                return <FinalScreen />;
            default:
                throw new Error('Unknown step');
        }
    }

    return (
        <Dialog open={appState.isAppOpen}
                onClose={()=>appState.toggleAppointmentForm(false)}
                aria-labelledby={`appointment-form`}
                maxWidth={'md'}
                keepMounted={appState.activeStep !== 3}
                fullScreen={fullScreen}
        >
            <Box sx={{p: { xs: 2, md: 2 } }}>
                <Typography component="h1" variant="h4" align="center">Запись на приём</Typography>
                <IconButton onClick={()=>appState.toggleAppointmentForm(false)}
                            sx={{position: 'absolute', top: '10px', right: '10px'}}
                >
                    {!appState.isAlwaysOpen? <CloseIcon /> : <></>}
                    
                </IconButton>
                <Stepper activeStep={appState.activeStep} sx={{ pt: 2, pb: 1 }}>
                    {steps.map((step) => (
                        step.id === 'final'
                          ? void(0)
                          :   <Step key={step.id}>
                                <StepLabel>{step.label}</StepLabel>
                              </Step>
                    ))}
                </Stepper>
            </Box>

            {getStepContent(appState.activeStep)}

            {appState.isLoading && <Box className={'appointment-loading-screen'}>
                <CircularProgress/>
            </Box>}
        </Dialog>
    );
}

export default observer(AppointmentForm);