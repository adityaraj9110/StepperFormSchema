import React, { ReactNode, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { AccountType } from '../AccountType'
import {
  FormContainer,
  FormWrapper,
  LogoContainer,
  Img,
  StepperWrapper,
  Step,
  FormButton,
} from './styles.component'

// Zod schemas for each step
const accountTypeSchema = z.object({
  accountType: z.string().min(1, 'Select an account type'),
})
const step2Schema = z.object({
  // Define validation for Step 2
})
const step3Schema = z.object({
  // Define validation for Step 3
})
const stepSchemas = [accountTypeSchema, step2Schema, step3Schema] // Add more step schemas as needed

export function Stepper({ step, totalStep }: { step: number, totalStep: number }) {
  return (
    <StepperWrapper>
      {Array.from({ length: totalStep }).map((_, index) => (
        <Step key={index} isActive={index <= step} />
      ))}
    </StepperWrapper>
  )
}

export function OnboardStepper() {
  const [currentStep, setCurrentStep] = useState(0)
  const methods = useForm({
    resolver: zodResolver(stepSchemas[currentStep]), // Use Zod schema resolver based on current step
    mode: 'onChange', // Validate as fields change
  })

  const { handleSubmit, watch, formState: { isValid } } = methods

  // Map forms to steps
  const formMapper: Record<number, ReactNode> = {
    0: <AccountType />, // Step 1 form component
    1: <div>Step 2 Form</div>, // Step 2 form component
    2: <div>Step 3 Form</div>, // Step 3 form component
    // Add more steps as needed
  }

  const onSubmit = (data: any) => {
    console.log('Final form submitted:', data)
    // Handle final form submission (e.g., send to backend)
  }

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, Object.keys(formMapper).length - 1))
  }

  return (
    <FormProvider {...methods}>
      <FormWrapper>
        <FormContainer>
          <LogoContainer>
            <Img src="/assets/Costimizer.png" alt="logo" />
          </LogoContainer>

          {/* Render current step form */}
          {formMapper[currentStep]}

          {/* Conditionally render button */}
          {currentStep < Object.keys(formMapper).length - 1 ? (
            <FormButton
              type="button"
              disabled={!isValid} // Disable if form is not valid
              onClick={handleNext}
            >
              Continue
            </FormButton>
          ) : (
            <FormButton
              type="submit"
              disabled={!isValid} // Disable if form is not valid
              onClick={handleSubmit(onSubmit)} // Submit the form when on the last step
            >
              Submit
            </FormButton>
          )}
        </FormContainer>

        {/* Stepper */}
        <Stepper step={currentStep} totalStep={Object.keys(formMapper).length} />
      </FormWrapper>
    </FormProvider>
  )
}
