import React, { FC, useEffect, useState } from "react";
import {
  Box,
  Button,
  DialogContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import appState from "../../../store/AppState";
import dataState from "../../../store/OneCDataState";
import { observer } from "mobx-react-lite";
import Calendar from "../Calendar/Calendar";
import {
  IEmployee,
  ISelectionSetterParams,
  IService,
} from "../../../types/selectedData";
import { getScheduleItems } from "../Calendar/functions";
import {runInAction} from "mobx";

const SelectionForm: FC = () => {
  const selected = appState.selected;
  const startFromDoctor = appState.isSelectDoctorBeforeService;

  const getSchedule = () => {
      const date = new Date();
      const formattedDate = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
      dataState.getSchedule(appState.getDaysCountSchedule, selected.clinic.uid, [selected.employee.uid], formattedDate);
  }
  const setDoctor = (e: any) => {
    const newState: ISelectionSetterParams = {
      employee: {
        name: dataState.getNameByUid("employees", e.target.value),
        uid: e.target.value,
      },
      dateTime: {
        date: "",
        timeBegin: "",
        timeEnd: "",
        formattedDate: "",
        formattedTimeBegin: "",
        formattedTimeEnd: "",
      },
    };
    if (startFromDoctor) {
      appState.isScheduleLoaded = false;
      newState.services = [];
    } else {
      appState.isScheduleLoaded = false;
    }

    if (!startFromDoctor && !appState.isScheduleLoaded) {
      getSchedule();
    }
    appState.selected = newState;
  };
  const setService = (e: any) => {
    let duration = dataState.getServiceByUid(e.target.value).duration;
    if (appState.isSelectDoctorBeforeService){
      dataState.servicesList.forEach(
        (service: IService) => (service.uid == e.target.value? duration = service.duration : duration = duration)
      );
    }
    const newState: ISelectionSetterParams = {
      services: [
        {
          uid: e.target.value,
          name: dataState.getServiceByUid(e.target.value).name,
          duration: duration,
        },
      ],
      dateTime: {
        date: "",
        timeBegin: "",
        timeEnd: "",
        formattedDate: "",
        formattedTimeBegin: "",
        formattedTimeEnd: "",
      },
    };
    if (!startFromDoctor) {
      newState.employee = {
        name: "",
        uid: "",
      };
    } else if (startFromDoctor && !appState.isScheduleLoaded) {
      getSchedule();
    }
    appState.selected = newState;
  };

  const canRenderEmployees = selected.services.length > 0 || startFromDoctor;
  const canRenderServices =
    selected.employee.uid.length > 0 || !startFromDoctor;

  const [scheduleItems, setScheduleItems] = useState<any>({})

  useEffect(() => {
    if (appState.isScheduleLoaded) {
      setScheduleItems(getScheduleItems());
    }
  }, [appState.isScheduleLoaded]);

  useEffect(() => {
    if (appState.isNomenclatureLoading) {
      appState.isLoading = true;
    }
  }, [appState.isNomenclatureLoading]);

  const calendarDisabled = !(
    selected.services.length > 0 && selected.employee.uid.length > 0
  );

  const selectedEmployeeAvailable = dataState.employeesList.find(
    (emp: IEmployee) => emp.uid === selected.employee.uid
  );
  const selectedServiceAvailable = appState.isServicesAvailable();

  let sumDuration = 0;

  selected.services.forEach((service: IService) => (sumDuration += service.duration))
  const hours = Math.floor(sumDuration / 3600);
  const minutes = ((sumDuration - hours * 3600) / 60).toFixed(0);
  const durationText =
    hours >= 1 ? `${hours}ч. ${minutes}мин.` : `${minutes} минут`;
  runInAction(() => {
    appState.serviceDuration = Number(sumDuration);
  })

  return (
    <>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <FormControl
            margin={`dense`}
            fullWidth
            sx={{ order: startFromDoctor ? "0" : "1" }}
          >
            <InputLabel id="employee-select-label">Выберите доктора</InputLabel>
            <Select
              labelId="employee-select-label"
              id="employee-select"
              name={"employee"}
              value={selectedEmployeeAvailable ? selected.employee.uid : ""}
              label="Выберите доктора"
              onChange={setDoctor}
              disabled={!canRenderEmployees}
            >
              {canRenderEmployees &&
                dataState.employeesList
                  .sort(function (a, b) {
                    if (a.name > b.name) {
                      return 1;
                    }
                    if (a.name < b.name) {
                      return -1;
                    }
                    return 0;
                  })
                  .map((employee) => (
                    <MenuItem
                      value={employee.uid}
                      key={employee.uid}
                      disabled={!(employee.uid.length > 0)}
                    >
                      {employee.name}
                    </MenuItem>
                  ))}
            </Select>
          </FormControl>
          <FormControl
            margin={`dense`}
            fullWidth
            sx={{ order: startFromDoctor ? "1" : "0" }}
          >
            <InputLabel id="service-select-label">Выберите услугу</InputLabel>
            <Select
              labelId="service-select-label"
              id="service-select"
              name={"service"}
              value={
                selectedServiceAvailable
                  ? selected.services.length > 0
                    ? selected.services[0].uid
                    : ""
                  : ""
              }
              label="Выберите услугу"
              onChange={setService}
              disabled={!canRenderServices}
            >
              {canRenderServices &&
                dataState.servicesList
                  .sort(function (a, b) {
                    if (a.name > b.name) {
                      return 1;
                    }
                    if (a.name < b.name) {
                      return -1;
                    }
                    return 0;
                  })
                  .map((service) => (
                    <MenuItem
                      value={service.uid}
                      key={service.uid}
                      disabled={!(service.uid.length > 0)}
                      sx={{
                        whiteSpace: "normal",
                        borderBottom: "1px solid rgba(0,0,0,.1)",
                      }}
                    >
                      {service.name}
                    </MenuItem>
                  ))}
            </Select>
          </FormControl>
          {selected.services.length > 0 ? (
            <Typography
              variant="caption"
              display="block"
              gutterBottom
              sx={{ order: startFromDoctor ? "1" : "0" }}
            >
              Длительность выбранных услуг - {`${durationText}`}
            </Typography>
          ) : (
            <></>
          )}
        </Box>

        {scheduleItems.hasOwnProperty("error") && !calendarDisabled ? (
          <Typography
            variant="caption"
            sx={{ pb: 2, display: "block", maxWidth: "500px" }}
          >
            {scheduleItems["error"]}
          </Typography>
        ) : (
          <Calendar scheduleItems={scheduleItems} disabled={calendarDisabled} />
        )}

        <Box sx={{ p: 0, display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={appState.stepBack} sx={{ mt: 3, ml: 1 }}>
            Назад
          </Button>
          <Button
            variant="contained"
            onClick={appState.stepNext}
            sx={{ mt: 3, ml: 1 }}
            disabled={
              !(
                selected.services.length > 0 &&
                selected.employee.uid.length > 0 &&
                selected.dateTime.timeBegin.length > 0
              )
            }
          >
            Далее
          </Button>
        </Box>
      </DialogContent>
    </>
  );
};

export default observer(SelectionForm);
