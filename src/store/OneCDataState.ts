import {IOneCClinic, IOneCData, IOneCEmployee, IOrderParams} from "../types/models";
import {makeAutoObservable} from "mobx";
import appState from "./AppState";
import {IEmployee, IService, ISpecialty} from "../types/selectedData";
import {IResponse} from "../types/models";
import AppState from "./AppState";

class OneCDataState {


    private getRequestParams = {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    }

    private requestParams = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Accept': 'application/json'
        },
        body: '',
    }

    private data: IOneCData = {
        clinics:        [],
        employees:      {},
        nomenclature:   {},
        schedule:       {}
    }


    constructor() {
        makeAutoObservable(this, {
            makeResponse: false,
            getNameByUid: false,
            getServiceByUid: false,
        })
    }

    get oneCData() {
        return this.data;
    }

    set oneCData(data: IOneCData){
        this.data = data;
    }

    public async loadData() {
        try {
            const clinics = await this.getClinics();
            const employees = await this.getEmployees();
            if (clinics.length > 0) {
                if (Object.keys(employees).length > 0) {
                    return this.makeResponse(true);
                } else {
                    return this.makeResponse(false);
                }
            } else {
                return this.makeResponse(false);
            }
        } catch (e) {
            return this.makeResponse(false);
        }
    }

    private async getClinics(): Promise<IOneCClinic[]> {
        try {
            appState.isLoading = true;
            const response = await fetch(`${AppState.getApiUrl}clinics`, this.getRequestParams);
            if (response.ok) {
                const data: IOneCClinic[]  = Object.values(await response.json());

                let clinics: IOneCClinic[] = appState.clinicsComparisons.length > 0 ? data.filter((item) => {

                    return appState.clinicsComparisons.includes(item.name) || appState.clinicsComparisons.includes(item.uid);
                    })
                    :
                    data;

                if (appState.clinicsUidNegativeComparison.length > 0) {
                    clinics = clinics.filter((clinic) => {
                        return !appState.clinicsUidNegativeComparison.includes(clinic.uid)
                    })
                }

                this.data.clinics = clinics;
                return Promise.resolve(clinics);
            } else{
                return Promise.reject(`Get data error. Status code ${response.status}`);
            }
        } catch (e) {
            return Promise.reject(`${e}`);
        } finally {
            appState.isLoading = false;
        }
    }

    private async getEmployees(): Promise<IOneCEmployee[]> {
        try {
            appState.isLoading = true;
            const response = await fetch(`${AppState.getApiUrl}employees`, this.getRequestParams);
            if (response.ok) {
                const data: any  = await response.json();
                this.data.employees = data;
                return Promise.resolve(data);
            } else{
                return Promise.reject(`Get data error. Status code ${response.status}`);
            }
        } catch (e) {
            return Promise.reject(`${e}`);
        } finally {
            appState.isLoading = false;
        }
    }

     async getNomenclature(clinicUid: string): Promise<any> {
        try {

            appState.isNomenclatureLoading = true;
            const response = await fetch(`${AppState.getApiUrl}nomenclature/${clinicUid}`, this.getRequestParams);
            if (response.ok) {
                const data: any  = await response.json();
                this.oneCData.nomenclature = data;
                appState.isNomenclatureLoaded = true;
                return Promise.resolve(data);
            } else{
                this.makeResponse(false);
                return Promise.reject(`Get data error. Status code ${response.status}`);
            }
        } catch (e) {
            this.makeResponse(false);
            return Promise.reject(`${e}`);
        } finally {
            appState.isLoading = false;
            appState.isNomenclatureLoading = false;
        }
    }

    async getSchedule(daysCount: number, clinicUid: string, employeeUids: string[], startDate: string): Promise<any> {
        try {
            appState.isLoading = true;
            const response = await fetch(`${AppState.getApiUrl}schedule?daysCount=${daysCount}&clinicUid=${clinicUid}&employeeUids[]=${employeeUids}&startDate=${startDate}`, this.getRequestParams);
            if (response.ok) {
                const data: any  = await response.json();
                this.oneCData.schedule = data;
                appState.isScheduleLoaded = true;
                return Promise.resolve(data);
            } else{
                console.error('Error while loading schedule');
                appState.isScheduleLoaded = false;
                this.makeResponse(false);
                return Promise.reject(`Get data error. Status code ${response.status}`);
            }
        } catch (e) {
            appState.isScheduleLoaded = false;
            this.makeResponse(false);
            console.error('Error while loading schedule');
            return Promise.reject(`${e}`);
        } finally {
            appState.isLoading = false;
        }
    }


    get specialtiesList(): Array<ISpecialty> {
        const specialtiesList: ISpecialty[] = [];
        if(Object.keys(this.data.employees).length > 0)
        {
            for (let uid in this.data.employees)
            {
                if (!this.data.employees.hasOwnProperty(uid)){
                    throw new Error("Employee uid not found on specialties render");
                }
                const clinicCondition = (appState.selected.clinic.uid === this.data.employees[uid].clinicUid);
                let canRender = true;
                if(appState.isStrictCheckingOfRelations){
                    canRender = clinicCondition;
                    if (appState.isShowDoctorsWithoutDepartment){
                        canRender = clinicCondition || !this.data.employees[uid].clinicUid;
                    }
                }

                const employee = this.data.employees[uid];
                if (canRender && employee.specialtyUid)
                {
                    const alreadyRendered = specialtiesList.find(spec => spec.uid === employee.specialtyUid);
                    if (!alreadyRendered){
                        specialtiesList.push({
                            uid: employee.specialtyUid,
                            name: employee.specialtyName,
                        });
                    }
                }
            }
            if (specialtiesList.length === 0){
                specialtiesList.push({
                    uid: '',
                    name: 'В выбранной клинике не найдено направлений деятельности',
                });
            }
        }
        return specialtiesList;
    }

    get employeesList(): Array<IEmployee>{
        const employeesList: IEmployee[] = [];

        if(Object.keys(this.data.employees).length > 0) {
            for (let uid in this.data.employees)
            {
                if (this.data.employees.hasOwnProperty(uid))
                {
                    const selectedSpecialty = appState.selected.specialty.uid;
                    const selectedClinic = appState.selected.clinic.uid;
                    const specialtyCondition = this.data.employees[uid]['specialtyUid'] === selectedSpecialty;
                    const clinicCondition = selectedClinic === this.data.employees[uid].clinicUid;

                    let canRender = specialtyCondition;

                    if(appState.isStrictCheckingOfRelations){
                        if (appState.isShowDoctorsWithoutDepartment){
                            canRender = (specialtyCondition && !this.data.employees[uid].clinicUid)
                                ||
                                (specialtyCondition && clinicCondition);
                        }
                        else
                        {
                            canRender = specialtyCondition && clinicCondition;
                        }
                    }

                    if (typeof this.data.employees[uid].name !== "string") {
                        canRender = false;
                    }

                    if (canRender)
                    {
                        if (!appState.isSelectDoctorBeforeService)
                        {
                            let canDoctorDoSelectedServices: boolean = true;

                            if (appState.selected.services.length > 0){
                                appState.selected.services.forEach((service:IService) => {
                                    if (!this.data.employees[uid].services.hasOwnProperty(service.uid)){
                                        canDoctorDoSelectedServices = false;
                                    }
                                })
                            }
                            else{
                                canDoctorDoSelectedServices = false;
                            }

                            if (!canDoctorDoSelectedServices){
                                continue;
                            }
                        }
                        employeesList.push({
                            uid: uid,
                            name: `${this.data.employees[uid].surname} ${this.data.employees[uid].name} ${this.data.employees[uid].middleName}`
                        });
                    }
                }
            }
        }

        if (employeesList.length === 0){
            employeesList.push({
                uid: '',
                name: 'К сожалению, по выбранным параметрам на ближайшее время нет свободных специалистов',
            });
        }
        return employeesList;
    }

    get servicesList(): Array<IService>{
        const servicesList: IService[] = [];
        if(Object.keys(this.data.nomenclature).length > 0)
        {
            for (let uid in this.data.nomenclature)
            {
                if (!this.data.nomenclature.hasOwnProperty(uid)){
                    throw new Error("Employee uid not found on specialties render");
                }

                let parent: string = 'null';
                if (this.data.nomenclature[uid].parent) {
                    parent = this.data.nomenclature[uid].parent;
                }

                let renderCondition = (appState.selected.specialty.name.toLowerCase()
                    ===  (this.data.nomenclature[uid]?.parent).toLowerCase());

                if (appState.isSelectDoctorBeforeService){
                    const selectedEmployeeUid = appState.selected.employee.uid;
                    renderCondition = renderCondition && selectedEmployeeUid.length > 0
                        && this.data.employees[selectedEmployeeUid].services.hasOwnProperty(uid);
                }

                if (renderCondition)
                {
                    let price = Number(this.data.nomenclature[uid].price);

                    servicesList.push({
                        uid: uid,
                        name: `${this.data.nomenclature[uid].name} ${price>0 ? price+"₽" : ""}`,
                        duration: this.data.nomenclature[uid].duration
                    });
                }
            }
        }

        if (servicesList.length === 0){
            servicesList.push({
                uid: '',
                name: 'К сожалению, по выбранным параметрам нет подходящих услуг',
                duration: 0
            });
        }
        return servicesList;
    }

    public async sendOrder (params: IOrderParams): Promise<IResponse> {
        if (appState.isDemoMode){
            return new Promise(
                (resolve) => setTimeout(
                    () => resolve(this.makeResponse(true)
                    ), 3000
                )
            )
        }
        try {
            this.requestParams.body = JSON.stringify(params);
            const response = await fetch(`${appState.getApiUrl}order`, this.requestParams);

            if (response.ok)
            {
                const result = await response.json();

                if (result.error)
                {
                    if (result.hasOwnProperty("defaultError")){
                        console.error(result.defaultError);
                    }
                    return this.makeResponse(false, result.error);
                }
                else if(result.success)
                {
//                    params["email"] ? await this.sendToEmail(params) : void(0);
                    return this.makeResponse(true);
                }
                else
                {
                    return this.makeResponse(false, 'Can not decode server response.');
                }
            }
            else
            {
                return this.makeResponse(false, 'Can not connect to 1c. Status code - ' + response.status);
            }
        }
        catch(e) {
            return this.makeResponse(false, `${e}`);
        }
    }

    private async sendToEmail (params: IOrderParams) {
        this.requestParams.body = JSON.stringify(params);
        await fetch("/umc-api/email/send", this.requestParams);
    }

    public makeResponse(success: boolean, error: string = ''): IResponse
    {
        const response: IResponse = {success: success};
        if (error.length > 0){
            response.error = error;
        }
        return response;
    }

    getNameByUid(key: string, uid: string){
        switch (key) {
            case 'clinics':
                let clinic = this.data.clinics.find((item: IOneCClinic) => item.uid === uid);
                if (clinic && clinic.hasOwnProperty('name')){
                    return clinic.name;
                }
                return '';
            case 'specialties':
                let specialty = this.specialtiesList.find((item: ISpecialty) => item.uid === uid);
                if (specialty && specialty.hasOwnProperty('name')){
                    return specialty.name;
                }
                return '';
            case 'employees':
                return `${this.data.employees[uid]?.surname} ${this.data.employees[uid]?.name} ${this.data.employees[uid]?.middleName}`;
            case 'services':
                return this.data.nomenclature[uid]?.name;
            default:
                // @ts-ignore
                return this.data[key][uid]?.name;
        }
    }

    getServiceByUid(uid: string){
        return this.data.nomenclature[uid];
    }
}

export default new OneCDataState();