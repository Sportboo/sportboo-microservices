import { ActiveUserData } from "./active-user-data.interface"

export interface IamAuthenticateResponse {
    readonly authenticated: boolean
    readonly payload: ActiveUserData
}