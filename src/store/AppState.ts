import {makeAutoObservable} from "mobx";
import {
    ETextFields,
    ISelectedParams, IService, ISmsConfirmation
} from "../types/selectedData";
import dataState from "./OneCDataState";
import {privacyLinkComparison} from "../types/models";

class AppState {
    constructor() {
        makeAutoObservable(this, {
            checkTextFields: false,
            isServicesAvailable: false
        });
        if (process.env.NODE_ENV === "development") {
            this.DEMO_MODE = false;
        }
    }

    /* App settings
     *
     * There you can manipulate on app.
     *
     */
    private readonly DEMO_MODE: boolean                    = false;
    private readonly privacyLink: string                   = "https://gazoptika.ru/upload/for-patient/Soglasie_na_obrabotku.pdf";
    private readonly daysCountSchedule: number             = 14; // Дней выгрузки расписания
    private readonly apiUrl: string                        = 'https://appointment.dzmed.ru/api/medical/'; // Адрес серера

    // Список названий и uid клиник для отображения, будут отображаться только указанные клиники.
    private readonly clinicsComparison: Array<string>      = [
                                                                    "21e7d16c-05a2-11ec-1686-2cfda13451df"
                                                             ];

    readonly clinicsUidNegativeComparison: Array<string>      = [

    ];

    // Сопоставление клиник и ссылок на условия конф. информации.
    private readonly privacyLinkComparison: privacyLinkComparison = {
                                                                '21e7d16c-05a2-11ec-1686-2cfda13451df': 'https://dzmed.ru/soglasie152'
                                                             }
    // Google captcha
    private readonly useGoogleCaptcha: boolean             = false;
    private readonly GoogleCaptchaSiteToken: string        = '';

    // Appointment buttons
    private readonly useFloatButton: boolean               = true; // Добавляет плавающую кнопку.


    // App style
    private readonly alwaysOpen: boolean                   = false; // Делает окно записи всегда развернутым.
    public readonly primaryColor: string                   = '#1976d2';
    public readonly secondaryColor: string                 = '#2280ea';
    public readonly primaryTextColor: string               = '#0A0A0A';
    public readonly secondaryTextColor: string             = '#2f2f2f';
    public readonly primaryCalendarTextColor: string       = '#2280ea';
    public readonly fontFamily: string                     = 'HeliosCond, Arial, sans-serif';
    public readonly fontSize: number                       = 14;










    /* App logical part
    *
    * Please, don't change values below
    *
    */
    private loading = true;
    private needToLoad = true;
    private appOpen = this.alwaysOpen;
    private canRender = true;
    private selectDoctorBeforeService = true;
    private nomenclatureLoaded = false;
    private nomenclatureLoading = false;
    private scheduleLoaded = false;
    private activeStepNumber = 0;
    private isDoctor = false;
    private readonly useTimeSteps: boolean = true;
    private readonly timeStepDurationMinutes: number = 20;
    private readonly strictCheckingOfRelations: boolean = true;
    private readonly showDoctorsWithoutDepartment: boolean = false;
    private readonly useMultipleServices: boolean = false;
    private termsAccepted: boolean = false;


    // Sms container
    private sentSms: boolean = false;
    private timerSms: number = 300;
    private timerSmsActive: boolean = false;
    private attemptsSms: number = 0;
    private errorSms: boolean = false;
    private successSms: boolean = false;
    private disabledSms: boolean = false;
    private smsConfirmation: ISmsConfirmation = {
        phone: '',
        code: ''
    }

    private selectedValues: ISelectedParams = {
        clinic: {
            uid: '',
            name: '',
        },
        specialty: {
            uid: '',
            name: '',
        },
        services: [],
        employee: {
            uid: '',
            name: '',
        },
        dateTime: {
            date: '',
            timeBegin: '',
            timeEnd: '',
            formattedDate: '',
            formattedTimeBegin: '',
            formattedTimeEnd: '',
        },
        textFields: {
            name: '',
            secondName: '',
            lastName: '',
            phone: '',
            email: '',
            clientBirthday: '',
            code: '',
        }
    }

    private validTextFields: { [key in ETextFields]: boolean } = {
        name: false,
        secondName: false,
        lastName: false,
        phone: false,
        email: true,
        clientBirthday: false,
        code: true,
    }

    private durationServices: number = 0;
    private result: boolean = false;


    get smsTimer() {
        return this.timerSms;
    }

    set smsTimer(val: number) {
        this.timerSms = val;
    }

    get smsAttempts() {
        return this.attemptsSms;
    }

    set smsAttempts(val: number) {
        this.attemptsSms = val;
    }

    get smsIsSent() {
        return this.sentSms;
    }

    set smsIsSent(value: boolean) {
        this.sentSms = value;
    }

    get termsIsAccepted() {
        return this.termsAccepted;
    }

    set termsIsAccepted(val: boolean) {
        this.termsAccepted = val;
    }

    get smsTimerIsActive() {
        return this.timerSmsActive;
    }

    set smsTimerIsActive(value: boolean) {
        this.timerSmsActive = value;
    }

    get smsError() {
        return this.errorSms;
    }

    set smsError(val: boolean) {
        this.errorSms = val;
    }

    get smsDisabled() {
        return this.disabledSms;
    }

    set smsDisabled(val: boolean) {
        this.disabledSms = val;
    }

    get smsIsSuccess() {
        return this.successSms;
    }

    set smsIsSuccess(val: boolean) {
        this.successSms = val;
    }

    get clinicsComparisons() {
        return this.clinicsComparison;
    }

    get privacyLinkComparisons() {
        return this.privacyLinkComparison;
    }

    set serviceDuration(data: number) {
        this.durationServices = data;
    }

    get serviceDuration() {
        return this.durationServices;
    }

    get isDoctorClicked() {
        return this.isDoctor;
    }

    set isDoctorClicked(value: boolean) {
        this.isDoctor = value;
    }

    get getDaysCountSchedule() {
        return this.daysCountSchedule;
    }

    get isUseFloatButton() {
        return this.useFloatButton;
    }

    get getGoogleCaptchaSiteToken() {
        return this.GoogleCaptchaSiteToken;
    }

    get smsConfirmationData() {
        return this.smsConfirmation;
    }

    set smsConfirmationData(sms: any) {
        this.smsConfirmation = {...this.smsConfirmation, ...sms};
    }

    get isLoading() {
        return this.loading;
    }

    set isLoading(value: boolean) {
        this.loading = value;
    }

    get isNomenclatureLoaded() {
        return this.nomenclatureLoaded;
    }

    set isNomenclatureLoaded(value: boolean) {
        this.nomenclatureLoaded = value;
    }

    get isNomenclatureLoading() {
        return this.nomenclatureLoading;
    }

    set isNomenclatureLoading(value: boolean) {
        this.nomenclatureLoading = value;
    }

    get isScheduleLoaded() {
        return this.scheduleLoaded;
    }

    set isScheduleLoaded(value: boolean) {
        this.scheduleLoaded = value;
    }

    get isNeedToLoad() {
        return this.needToLoad;
    }

    set isNeedToLoad(value: boolean) {
        this.needToLoad = value;
    }

    get isAppOpen() {
        return this.appOpen;
    }

    set isAppOpen(value: boolean) {
        if (!this.alwaysOpen) {
            this.appOpen = value;
        }
    }

    get isCanRender() {
        return this.canRender;
    }

    set isCanRender(value: boolean) {
        this.canRender = value;
    }

    get activeStep() {
        return this.activeStepNumber;
    }

    stepNext = () => {
        this.activeStepNumber++;
    }
    stepBack = () => {
        this.activeStepNumber--;
    }

    set setStep(value: number) {
        this.activeStepNumber = value;
    }

    toggleAppointmentForm(open: boolean) {
        if (!open && this.activeStep === 3) {
            this.isNeedToLoad = true;
            this.activeStepNumber = 0
            this.setSecondStepToDefaults()
        }
        this.isAppOpen = open;
    }

    set validityOfTextFields(val: { [key: string]: boolean }) {
        this.validTextFields = {...this.validTextFields, ...val};
    }

    get validityOfTextFields() {
        return this.validTextFields;
    }

    checkTextFields() {
        let allValid = true;
        for (const key in this.validTextFields) {
            if (this.validityOfTextFields[key] === false) {
                allValid = false;
                break;
            }
        }
        return allValid;
    }

    get selected(): ISelectedParams {
        return this.selectedValues;
    }

    set selected(selected: any) {
        this.selectedValues = {...this.selectedValues, ...selected};
    }

    setSecondStepToDefaults() {
        this.selected = {
            services: [],
            employee: {uid: '', name: '',},
            dateTime: {
                date: '',
                timeBegin: '',
                timeEnd: '',
                formattedDate: '',
                formattedTimeBegin: '',
                formattedTimeEnd: ''
            }
        }
    }

    isServicesAvailable(): boolean {
        let allAvailable = true;
        for (let i = 0; i < this.selectedValues.services.length; i++) {
            const available = dataState.servicesList.find(
                (service: IService) => service.uid === this.selectedValues.services[i].uid
            );
            if (!available) {
                allAvailable = false;
                break;
            }
        }
        return allAvailable;
    }

    get isSelectDoctorBeforeService() {
        return this.selectDoctorBeforeService;
    }

    set isSelectDoctorBeforeService(value: boolean) {
        this.selectDoctorBeforeService = value;
    }

    get getApiUrl() {
        return this.apiUrl;
    }

    get appResult() {
        return this.result;
    }

    set appResult(value: boolean) {
        this.result = value;
    }

    get isDemoMode() {
        return this.DEMO_MODE;
    }

    get timeStepDuration() {
        return this.timeStepDurationMinutes;
    }

    get isUseTimeSteps() {
        return this.useTimeSteps;
    }

    get isUseGoogleCaptcha() {
        return this.useGoogleCaptcha;
    }

    get isStrictCheckingOfRelations() {
        return this.strictCheckingOfRelations;
    }

    get isShowDoctorsWithoutDepartment() {
        return this.showDoctorsWithoutDepartment;
    }

    get isUseMultipleServices() {
        return this.useMultipleServices;
    }

    get isAlwaysOpen() {
        return this.alwaysOpen;
    }

    get privacyPageUrl() {
        return this.privacyLink;
    }
}

export default new AppState();