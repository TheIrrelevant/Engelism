import { WizardShell } from './components/WizardShell'
import { useWizardReducer } from './components/useWizardReducer'
import { WizardStep } from './types/wizard'
import { canNavigateToStep } from './engine/validation'
import { ErrorBoundary } from './components/ErrorBoundary'
import { StepReference } from './components/StepReference'
import { StepOverride } from './components/StepOverride'
import { StepOutput } from './components/StepOutput'
import { useLibrary } from './data/useLibrary'

export default function App() {
  const [state, dispatch] = useWizardReducer()
  const lib = useLibrary()

  const handleStepClick = (step: WizardStep) => {
    if (canNavigateToStep(state, step)) {
      dispatch({ type: "SET_STEP", step })
    }
  }

  const handleNext = () => dispatch({ type: "NEXT_STEP" })
  const handleBack = () => dispatch({ type: "PREV_STEP" })

  const renderStep = () => {
    switch (state.currentStep) {
      case WizardStep.Reference:
        return <StepReference state={state} dispatch={dispatch} />
      case WizardStep.Override:
        return <StepOverride state={state} dispatch={dispatch} lib={lib} />
      case WizardStep.Output:
        return <StepOutput state={state} dispatch={dispatch} lib={lib} />
    }
  }

  return (
    <WizardShell
      state={state}
      onStepClick={handleStepClick}
      onNext={handleNext}
      onBack={handleBack}
    >
      <ErrorBoundary>{renderStep()}</ErrorBoundary>
    </WizardShell>
  )
}
