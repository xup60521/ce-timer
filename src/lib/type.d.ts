export type TimerType = {
    id: string,
    name: string,
    time: number,
    muted: boolean,
    todos: {
        id: string,
        title: string,
        checked: boolean
    }[]
}