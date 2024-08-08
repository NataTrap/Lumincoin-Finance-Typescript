export type ResultType = {
    error: boolean,
    redirect?: string 
    response: any
    balance: number

}

export type ResultBalanceType = ResultType & {
        balance: number,
        error: boolean
    
}

export type ResultCreateCategoryType = ResultType & {
            id: number
            title: string
} 

export type ResultEditCategoryType =  ResultType & {
    id:number
    user_id: number
}

