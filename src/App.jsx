import { useState, useRef, useEffect } from 'react'
import './App.css'
import { bubbleSortSteps } from "./algorithm/bubbleSortSteps"
import { use } from 'react'

function App() {
  // State management for the visualizer
  const [array, setArray] = useState([])  // Stores the current array being sorted
  const [steps, setSteps] = useState([]) // Stores all sorting steps with array snapshots
  const [currentStep, setCurrentStep] = useState(0) // Tracks which step we're currently viewing
  const [isPlaying, setIsPlaying] = useState(false); // Autoplay state
  const [speed, setSpeed] = useState(500); // Decides speed of algorithm, default 500
  const intervalRef = useRef(null) // Interval ID should not cause re-renders
  
  // Initialize array and generate sorting steps
  function generateArray() {
    let list = [5,3,1,10,8,19,15,23]
    setArray(list);
    setIsPlaying(false);
    // Generate all bubble sort steps with array snapshots at each step
    const sortSteps = bubbleSortSteps(list);  
    setSteps(sortSteps)
    setCurrentStep(0) // Reset to first step
    setIsPlaying(0); // stops autoplay when generating
  }

  // Move to the next sorting step
  function nextStep() {
    setCurrentStep(prev=>{
      if(prev < steps.length-1) return prev+1;
      return prev;
    });
  }

   // Handle speed slider change
  function onSliderChange(value) {
    setSpeed(value)
  }

  // Start/pause animation
  function togglePlayPause() {
    setIsPlaying(!isPlaying)
  }

  // Determine which array to render
  // If sorting has started, show the array from current step; otherwise show initial array
  let renderArray = array;
  if(steps.length > 0 && steps[currentStep]) {
    renderArray = steps[currentStep].array;
  }

  // Determine bar color based on current step type and index
  // Returns different colors for compare, swap, and sorted states
  function getBarColor(index) {
    if (steps.length === 0) return 'blue'; // Default color before sorting starts
    const step = steps[currentStep];
    if (!step) return 'blue';  
    // Get indices that should be highlighted based on step type
    let active = []; 
    if (step.type === "compare" || step.type === "swap") {
      active = [step.i, step.j]; // Highlight both bars being compared or swapped
    } else if (step.type === "markSorted") {
      active = [step.index]; // Highlight the sorted bar
    }   
    // Return color based on step type if bar is active
    if (active.includes(index)) {
      if (step.type === "compare") return 'yellow'; // Yellow for comparison
      if (step.type === "swap") return 'red'; // Red for swap operation
      if (step.type === "markSorted") return 'green'; // Green for sorted elements
    }
    return 'blue'; // Default color for inactive bars
  }

  // Auto play effect core logic
  useEffect(()=>{
    if(!isPlaying) {
      clearInterval(intervalRef.current)
      return;
    }
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(()=>{
      setCurrentStep(prev=>{
        if(prev >= steps.length - 1) {
          setIsPlaying(false); // stop at end
          return prev;
        }
        return prev+1;
      });
    }, speed) // speed in ms
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, speed, steps.length])
 
  // silder which updates only state not interval logic
  function onSliderChange(e) {
    setSpeed(Number(e.target.value))
  }

  function handleControlClick() {
    if (steps.length === 0) {
      generateArray()
    } else if (isPlaying) {
      setIsPlaying(false)
    } else if (currentStep === 0) {
      setIsPlaying(true)
    } else if (currentStep < steps.length - 1) {
      setIsPlaying(true)
    } else {
      setCurrentStep(0)
      setIsPlaying(true)
    }
  }

  
  // Get button label based on current state
  function getButtonLabel() {
    if (steps.length === 0) return "Generate"
    if (isPlaying) return "Pause"
    if (currentStep === 0) return "Play"
    if (currentStep < steps.length - 1) return "Resume"
    return "Restart"
  }

  
  return (
    <>
      <div>Welcome to dsa visualizer</div>   
      {/* Speed Slider - Place it here, before or after the container */}
    <div className="controls">
      <label>Speed: {speed}ms</label>
      <input 
        type="range" 
        min="100" 
        max="1000" 
        step="50"
        value={speed}
        onChange={(e) => onSliderChange(Number(e.target.value))}
      />
    </div>
      {/* Container for rendering array bars */}
      <div className="container">
        {renderArray.map((value, index) => (  
          <div 
            key={index} 
            className="bar"
            style={{
              height: `${value * 20}px`, // Height proportional to value
              width: '30px', 
              backgroundColor: getBarColor(index), // Color changes based on sorting step
              borderRadius: 7
            }}
          >
          </div>
        ))}
      </div>
      {/* Control buttons */}
      <button onClick={nextStep} className='btn'>Next Step</button>
      {/* Single smart control button */}
      <button onClick={handleControlClick} className='btn'>
        {getButtonLabel()}
      </button> 
    </>
  )
}
export default App