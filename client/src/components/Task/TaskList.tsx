import { useQuery } from "@tanstack/react-query"
import { getTasks } from "../../api/tasks"
import TaskCard from "./TaskCard"

export default function TaskList() {


    const {data, isLoading, error} = useQuery({
        queryKey:['tasks'],
        queryFn:getTasks
    })
    if(isLoading) return <div>Loading...</div>
    if(error) return <div>Error</div>
    return (
        <ul>
            {data.map((item:any) => (
                <li key={item.id}>
                    <TaskCard task={item}/>
                </li>
            ))}
        </ul>
    )
    
}