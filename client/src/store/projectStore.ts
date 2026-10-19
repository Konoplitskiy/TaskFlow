import {create} from 'zustand'
import { ProjectStore } from '../types/projectStore'

export const useProjectStore = create<ProjectStore>((set) => ({
    selectedProjectId:'',
    
    setSelectedProjectId: (id) => {
        set({selectedProjectId:id})
    }
}))