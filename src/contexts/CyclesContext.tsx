import { differenceInSeconds } from 'date-fns'
import { createContext, ReactNode, useEffect, useReducer, useState } from 'react'
import {
    addNewCycleAction,
    interruptCurrentCycleAction,
    markCurrentCycleAsFinishedAction,
} from '../reducers/cycles/actions'
import { Cycle, cyclesReducers } from '../reducers/cycles/reducer'

interface CreacteCycleData {
    task: string
    minutesAmount: number
}

interface CyclesContextType {
    cycles: Cycle[]
    activeCycle: Cycle | undefined
    activeCycleId: string | null
    secondsAmountPassed: number
    setSecondsPassed: (seconds: number) => void
    markCurrentCycleAsFinished: () => void
    createNewCycle: (data: CreacteCycleData) => void
    interruptCurrentCycle: () => void
}

interface CyclesContextProviderProps {
    children: ReactNode
}

export const CyclesContext = createContext({} as CyclesContextType)

export const CyclesContextProvider = ({ children }: CyclesContextProviderProps) => {
    const [cyclesState, dispatch] = useReducer(
        cyclesReducers,
        {
            cycles: [],
            activeCycleId: null,
        },
        (initialState) => {
            const storedStateAsJson = localStorage.getItem('@ignite-timer:cycles-state-1.0.0')

            return storedStateAsJson ? JSON.parse(storedStateAsJson) : initialState
        }
    )
    const { cycles, activeCycleId } = cyclesState
    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

    const [secondsAmountPassed, setSecondsAmountPassed] = useState(() => {
        if (activeCycle) {
            return differenceInSeconds(new Date(), new Date(activeCycle.startDate))
        }

        return 0
    })

    useEffect(() => {
        const stateJSON = JSON.stringify(cyclesState)

        localStorage.setItem('@ignite-timer:cycles-state-1.0.0', stateJSON)
    }, [cyclesState])

    const setSecondsPassed = (seconds: number) => {
        setSecondsAmountPassed(seconds)
    }

    const markCurrentCycleAsFinished = () => {
        dispatch(markCurrentCycleAsFinishedAction())
    }

    const createNewCycle = (data: CreacteCycleData) => {
        const id = String(new Date().getTime())

        const newCycle: Cycle = {
            id,
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
        }

        dispatch(addNewCycleAction(newCycle))

        setSecondsAmountPassed(0)
    }

    const interruptCurrentCycle = () => {
        dispatch(interruptCurrentCycleAction())
    }

    return (
        <CyclesContext.Provider
            value={{
                cycles,
                activeCycle,
                activeCycleId,
                markCurrentCycleAsFinished,
                secondsAmountPassed,
                setSecondsPassed,
                createNewCycle,
                interruptCurrentCycle,
            }}
        >
            {children}
        </CyclesContext.Provider>
    )
}
