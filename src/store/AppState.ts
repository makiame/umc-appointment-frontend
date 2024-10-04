import {makeAutoObservable} from "mobx";
import {
    ETextFields,
    ISelectedParams, IService
} from "../types/selectedData";
import dataState from "./OneCDataState";

class AppState {
    constructor() {
        makeAutoObservable(this,{
            checkTextFields: false,
            isServicesAvailable: false
        });
        if (process.env.NODE_ENV === "development"){
            this.DEMO_MODE = false;
        }
    }

    private readonly DEMO_MODE:                     boolean = false;
    private readonly privacyLink:                   string  = "#";
    private readonly useGoogleCaptcha:              boolean = false;
    private readonly GoogleCaptchaSiteToken:        string  = '6LfoEZ8pAAAAADA8JbaXhpM6vyNpKSSrcAjVEmQG';
    private readonly useTimeSteps:                  boolean = true;
    private readonly timeStepDurationMinutes:       number	= 20;
    private readonly daysCountSchedule:             number	= 14;
    private readonly strictCheckingOfRelations:     boolean	= true;
    private readonly showDoctorsWithoutDepartment:  boolean = false;
    private readonly useMultipleServices:           boolean = false;
    private readonly useFloatButton:                boolean = false;
    private readonly useEmailNotification:          boolean = false;
    private readonly apiUrl:                        string  = 'http://127.0.0.1:8000/api/medical/';
    private readonly useOptimizetVersion:           boolean = true;

    private loading                     = true;
    private needToLoad                  = true;
    private appOpen                     = false;
    private canRender                   = true;
    private selectDoctorBeforeService 	= true;
    private nomenclatureLoaded          = false;
    private nomenclatureLoading         = false;
    private scheduleLoaded              = false;
    private activeStepNumber            = 0;

    //!!update
    private activePopupUid = ""
    private spam = false;

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
                comment: '',
                code: '',
            }
        }

    private validTextFields:{[key in ETextFields]:boolean} = {
        name: false,
        secondName: false,
        lastName: false,
        phone: false,
        email: true,
        comment: true,
        code: true,
    }


    private durationServices: number = 0;

    private result: boolean = false;

    set serviceDuration(data: number) {
        this.durationServices = data;
    }

    get serviceDuration() {
        return this.durationServices;
    }

    get isOptimizedVersion() {
        return this.useOptimizetVersion;
    }
    get isUseEmailNotification() {
        return this.useEmailNotification;
    }
    get isActivePopupUid() {
        return this.activePopupUid;
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
    set isActivePopupUid(value: string){
        this.activePopupUid = value;
    }

    get isSpam() {
        return this.spam;
    }
    set isSpam(value: boolean){
        this.spam = value;
    }

    get isLoading() {
        return this.loading;
    }
    set isLoading(value: boolean){
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
    set isNeedToLoad(value: boolean){
        this.needToLoad = value;
    }

    get isAppOpen() {
        return this.appOpen;
    }
    set isAppOpen(value: boolean){
        this.appOpen = value;
    }

    get isCanRender() {
        return this.canRender;
    }
    set isCanRender(value: boolean){
        this.canRender = value;
    }

    get activeStep(){
        return this.activeStepNumber;
    }
    stepNext = () => {
        this.activeStepNumber++;
    }
    stepBack = () => {
        this.activeStepNumber--;
    }
    set setStep(value: number){
        this.activeStepNumber = value;
    }

    toggleAppointmentForm(open: boolean) {
        if (!open && this.activeStep === 3)
        {
            this.isNeedToLoad = true;
            this.activeStepNumber = 0
            this.setSecondStepToDefaults()
        }
        this.isAppOpen = open;
        //!update
        this.isActivePopupUid = "";
    }

    set validityOfTextFields(val: {[key:string]:boolean}){
        this.validTextFields = {...this.validTextFields, ...val};
    }
    get validityOfTextFields() {
        return this.validTextFields;
    }
    checkTextFields(){
        let allValid = true;
        for (const key in this.validTextFields) {
            if (this.validityOfTextFields[key] === false){
                allValid = false;
                break;
            }
        }
        return allValid;
    }

    get selected(): ISelectedParams {
        return this.selectedValues;
    }
    set selected(selected: any){
        this.selectedValues = {...this.selectedValues, ...selected};
    }
    setSecondStepToDefaults(){
        this.selected = {
            services: [],
            employee: { uid: '', name: '', },
            dateTime: { date: '', timeBegin: '', timeEnd: '', formattedDate: '', formattedTimeBegin: '', formattedTimeEnd: ''}
        }
    }
    isServicesAvailable(): boolean{
        let allAvailable = true;
        for(let i=0; i < this.selectedValues.services.length; i++){
            const available = dataState.servicesList.find(
                (service: IService) => service.uid === this.selectedValues.services[i].uid
            );
            if (!available){
                allAvailable = false;
                break;
            }
        }
        return allAvailable;
    }

    get isSelectDoctorBeforeService(){
        return this.selectDoctorBeforeService;
    }
    set isSelectDoctorBeforeService(value: boolean){
        this.selectDoctorBeforeService = value;
    }

    get getApiUrl() {
        return this.apiUrl;
    }

    get appResult() {
        return this.result;
    }
    set appResult(value: boolean){
        this.result = value;
    }

    get isDemoMode() {
        return this.DEMO_MODE;
    }
    get timeStepDuration(){
        return this.timeStepDurationMinutes;
    }
    get isUseTimeSteps(){
        return this.useTimeSteps;
    }
    get isUseGoogleCaptcha(){
        return this.useGoogleCaptcha;
    }
    get isStrictCheckingOfRelations(){
        return this.strictCheckingOfRelations;
    }
    get isShowDoctorsWithoutDepartment(){
        return this.showDoctorsWithoutDepartment;
    }
    get isUseMultipleServices(){
        return this.useMultipleServices;
    }
    get privacyPageUrl(){
        return this.privacyLink;
    }
}

export default new AppState();