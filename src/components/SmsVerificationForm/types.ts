export interface SmsResponse {
    status: string,
    status_code: number,
    sms: Sms[],
    balance: number
}

export interface Sms {
    [key: string] : {
        status: string,
        status_code: number,
        sms_id: string
    }
}
