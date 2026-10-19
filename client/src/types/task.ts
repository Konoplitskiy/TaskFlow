export type Task = {
    id:string,
    title:string,
    description:string,
    status:string
    project?: {
        id:string
        title:string
    }
}