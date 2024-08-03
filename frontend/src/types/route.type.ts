export type RouteType = {
    route: string,
    title?: string,
    filePathTemplate?: string,
    useLayout?: string,
    load(): void
}

export type OpenNewRoute = (url: string) => Promise<void>;
