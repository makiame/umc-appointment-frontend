import React, {FC} from 'react';
import {
    Box,
    Button,
    DialogContent,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
} from "@mui/material";
import {observer} from "mobx-react-lite";
import appState from "../../../store/AppState";
import dataState from "../../../store/OneCDataState";

const ModeForm:FC = () => {
    const data = dataState.oneCData;
    const selected = appState.selected;
    const specialties = dataState.specialtiesList;
    const selectedSpecialtyAvailable = specialties.find(spec => spec.uid === selected.specialty.uid);

    const setClinic = (e: any) => {
        appState.selected = {
            clinic: {
                name: dataState.getNameByUid('clinics', e.target.value),
                uid: e.target.value
            },
            specialty: { name: '', uid: '' },
            employee: {name: '', uid: '' },
            dateTime: { date:'',timeBegin:'',timeEnd:'',formattedDate:'',formattedTimeBegin:'',formattedTimeEnd:''},
            services: []
        };
        appState.isNomenclatureLoaded = false;
        dataState.getNomenclature(e.target.value);
        if (Object.keys(data.employees).length === 0) {
            appState.isLoading = true;
        }
    }

    const setSpecialty = (e: any) => appState.selected = {
        specialty: {
            name: dataState.getNameByUid('specialties', e.target.value),
            uid: e.target.value
        },
        employee: {name: '', uid: '' },
        dateTime: { date:'',timeBegin:'',timeEnd:'',formattedDate:'',formattedTimeBegin:'',formattedTimeEnd:''},
        services: []
    };

    const startSelectFromDoctor = (val: boolean) => {
        appState.isSelectDoctorBeforeService = val;
        if (!appState.isNomenclatureLoaded && !appState.isNomenclatureLoading) {
            dataState.getNomenclature(selected.clinic.uid);
        }
        appState.stepNext();
    }

    return (
        <DialogContent>
            <FormControl margin={`dense`} fullWidth>
                <InputLabel id="clinic-select-label">Выберите филиал</InputLabel>
                <Select labelId="clinic-select-label"
                        id="clinic-select"
                        name={'clinic'}
                        value={selected.clinic.uid}
                        label="Выберите филиал"
                        onChange={setClinic}
                >
                    {
                        data.clinics.map(clinic =>  <MenuItem value={clinic.uid} key={clinic.uid}>
                                                        {clinic.name}
                                                    </MenuItem>)
                    }
                </Select>
            </FormControl>

            <FormControl margin={`dense`} fullWidth>
                <InputLabel id="specialty-select-label">Выберите направление</InputLabel>
                <Select labelId="specialty-select-label"
                        id="specialty-select"
                        name={'specialty'}
                        value={selectedSpecialtyAvailable ? selected.specialty.uid : ''}
                        label="Выберите направление"
                        onChange={setSpecialty}
                        disabled={!(selected.clinic.uid.length > 0)}
                >
                    {
                        specialties.sort(function(a, b) {
                            if (a.name > b.name) {
                              return 1;
                            }
                            if (a.name < b.name) {
                              return -1;
                            }
                            return 0;
                          }).map(specialty =>
                            <MenuItem value={specialty.uid} key={specialty.uid} disabled={!(specialty.uid.length > 0)}>
                                {specialty.name}
                            </MenuItem>)
                    }
                </Select>
            </FormControl>

            <Box sx={{pb: 3, display: 'flex', justifyContent: 'space-between'}}>
                <Button
                    variant="contained"
                    onClick={()=>startSelectFromDoctor(true)}
                    sx={{mt: 3, width: '49%'}}
                    disabled={!(selected.clinic.uid.length > 0 && selected.specialty.uid.length > 0)}
                    size="large"
                >
                    Выбрать доктора
                </Button>
                <Button
                    variant="contained"
                    onClick={()=>startSelectFromDoctor(false)}
                    sx={{mt: 3, width: '49%'}}
                    disabled={!(selected.clinic.uid.length > 0 && selected.specialty.uid.length > 0)}
                    size="large"
                >
                    Выбрать услугу
                </Button>
            </Box>
        </DialogContent>
    );
};

export default observer(ModeForm);