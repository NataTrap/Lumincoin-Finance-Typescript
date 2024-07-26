export type RouteType = {
    route: string,
    title?: string,
    filePathTemplate?: string,
    useLayout?: boolean | string,
    load(): void
}