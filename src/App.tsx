import { WizardShell } from './components/WizardShell'
import { useWizardReducer } from './components/useWizardReducer'
import { WizardStep } from './types/wizard'
import { canNavigateToStep } from './engine/validation'
import { ErrorBoundary } from './components/ErrorBoundary'
import { StepReference } from './components/StepReference'
import { StepOverride } from './components/StepOverride'
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
        return <StepPlaceholder name="Output" description="Review and generate JSON protocol" />
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

// Temporary placeholder — will be replaced in Steps 04-06
function StepPlaceholder({ name, description }: { name: string; description: string }) {
  return (
    <div className="border border-ash/10 rounded-card p-12 text-center">
      <h2 className="font-warbler text-2xl text-bone mb-2">{name}</h2>
      <p className="text-ash/50 text-sm">{description}</p>
    </div>
  )
}
