import {ETextFields, IService} from "./selectedData";

export interface IOneCClinic{
    uid: string,
    name: string,
}

export interface IOneCEmployee{
    name:       string,
    surname:    string,
    middleName: string,
    clinic:     string,
    clinicUid:  string,
    inSchedule: boolean,
    specialtyUid: string,
    specialtyName: string,
    specialties: {
        [key: string]: {
            name: string
        }
    },
    services: {
        [key: string]: {
            title: string,
            personalDuration?: string | number
        }
    }
}

export interface IOneCNomenclature{
    name:           string,
    typeOfItem:     string,
    duration:       number,
    specialty:      string,
    specialtyUid:   string,
    artNumber:      string,
    isAnalysis:     boolean,
    isMedicalCheck: boolean,
    parent:         string,
    price:          string | number;
    VAT:            string,
    success:        boolean,
    prices: {
        [key: string]: {
            priceList:  string,
            price:      string
        }
    }
}

// Интерфейс для типа времени (например, рабочее, нерабочее и т.д.)
export interface ITypeOfTime {
  typeOfTimeUid: string;
  date: string;
  timeBegin: string;
  timeEnd: string;
  formattedDate: string;
  formattedTimeBegin: string;
  formattedTimeEnd: string;
}

// Интерфейс для одного элемента расписания
export interface ITimeTableItem {
  typeOfTimeUid?: string;
  date: string;
  timeBegin: string;
  timeEnd: string;
  formattedDate: string;
  formattedTimeBegin: string;
  formattedTimeEnd: string;
}


export interface ITimeTable {
  free: {
    [date: string]: ITimeTableItem[];
  };
  busy: {
    [date: string]: ITimeTableItem[];
  };
  freeFormatted: {
    [date: string]: ITimeTableItem[];
  };
}


export interface IScheduleItem {
  clinicUid: string;
  duration: string;
  durationInSeconds: number;
  name: string;
  refUid: string;
  specialty: string;
  timetable: ITimeTable;
  error?: string;
}


export interface ISchedule {
  [clinicUid: string]: {
    [specialtyUid: string]: {
      [employeeUid: string]: IScheduleItem;
    };
  };
}


export interface IOneCData {
  clinics: IOneCClinic[];
  employees: {
    [key: string]: IOneCEmployee;
  };
  nomenclature: {
    [key: string]: IOneCNomenclature;
  };
  schedule: ISchedule;
  error?: string;
  defaultError?: string;
}


export interface ICalendarProps {
  scheduleItems: {
    [key: string]: ITimeTableItem[];
  };
  disabled: boolean;
}

export interface ITextInputProps {
  required?: boolean;
  name: ETextFields;
  label: string;
  multiline?: boolean;
}

export interface IOrderParams {
  clinicUid: string;
  clinicName: string;
  specialty: string;
  refUid: string;
  doctorName: string;
  services: IService[];
  orderDate: string;
  timeBegin: string;
  timeEnd: string;
  name: string;
  lastName: string;
  secondName: string;
  phone: string;
  email?: string;
  comment?: string;
  address?: string;
  clientUid?: string;
  orderUid?: string;
  code? : string;
  appointmentDuration: number;
}

export interface IResponse {
  success: boolean;
  error?: string;
  defaultError?: string;
}
