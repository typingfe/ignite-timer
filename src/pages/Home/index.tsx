import { zodResolver } from '@hookform/resolvers/zod'
import { HandPalm, Play } from '@phosphor-icons/react'

import { FormProvider, useForm } from 'react-hook-form'
import * as zod from 'zod'

import { useContext } from 'react'
import { CyclesContext } from '../../contexts/CyclesContext'
import { Countdown } from './components/Countdown'
import { NewCycleForm } from './components/NewCycleForm'
import { HomeContainer, StartCountdownButton, StopCountdownButton } from './styles'

const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, 'Por favor, insira mais de um caractere.'),
    minutesAmount: zod
        .number()
        .min(5, 'O ciclo de tempo precisa ser de no minimo 60 mínutos')
        .max(60, 'O ciclo de tempo precisa ser de no máximo 60 minutos'),
})

type newCycleFromData = zod.infer<typeof newCycleFormValidationSchema>

export const Home = () => {
    const { activeCycle, createNewCycle, interruptCurrentCycle } = useContext(CyclesContext)

    const newCycleForm = useForm<newCycleFromData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0,
        },
    })

    const { reset, handleSubmit, watch } = newCycleForm

    const handleCreateNewCycle = (data: newCycleFromData) => {
        createNewCycle(data)

        reset()
    }

    const task = watch('task')
    const isSubmitDisabled = !task

    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCycle)}>
                <FormProvider {...newCycleForm}>
                    <NewCycleForm />
                </FormProvider>
                <Countdown />

                {activeCycle ? (
                    <StopCountdownButton onClick={interruptCurrentCycle} type="button">
                        <HandPalm size={24} />
                        Interromper
                    </StopCountdownButton>
                ) : (
                    <StartCountdownButton type="submit" disabled={isSubmitDisabled}>
                        <Play size={24} />
                        Começar
                    </StartCountdownButton>
                )}
            </form>
        </HomeContainer>
    )
}
