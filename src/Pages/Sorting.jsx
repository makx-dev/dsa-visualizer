import { useState, useRef, useEffect } from 'react'
import { bubbleSortSteps } from '../Sorting Algorithms/bubbleSortSteps'
import { selectionSortSteps } from '../Sorting Algorithms/selectionSortSteps'
import { insertionSortSteps } from '../Sorting Algorithms/insertionSortSteps'
import { quickSortSteps } from '../Sorting Algorithms/quickSortSteps'
import { mergeSortSteps } from '../Sorting Algorithms/mergeSortSteps'
import { ALGO_STATE } from '../constants/ALGO_STATE'
import { algorithmInfo } from '../components/algorithmInfo'
import '../Sorting.css';

const algorithms = {
  bubble: {
    name: "Bubble Sort",
    steps: bubbleSortSteps
  },
  selection: {
    name: "Selection Sort",
    steps: selectionSortSteps
  },
  insertion: {
    name: "Insertion Sort",
    steps: insertionSortSteps
  },
  quick: {
    name: "Quick Sort",
    steps: quickSortSteps
  },
  merge: {
    name: "Merge Sort",
    steps: mergeSortSteps
  }
}

export default function Sorting() {
  const [arraySize, setArraySize] = useState(7);
  const [array, setArray] = useState(() => generateRandomArray(7));
  const [steps, setSteps] = useState(() => bubbleSortSteps(generateRandomArray(7)));
  const [currentStep, setCurrentStep] = useState(0);
  const [speed, setSpeed] = useState(500);
  const [algoState, setAlgostate] = useState(ALGO_STATE.IDLE);
  const [currentAlgorithm, setCurrentAlgorithm] = useState("bubble");
  const intervalRef = useRef(null);
  const MIN_SIZE = 4;
  const MAX_SIZE = 20;
  
  function generateRandomArray(size) {
    return Array.from({length: size}, () => Math.floor(Math.random() * 10) + 5);
  }

  function generateArray() {
    if (algoState === ALGO_STATE.RUNNING) {
      alert("Pause or reset the algorithm first");
      return;
    }
    const newArray = generateRandomArray(arraySize);
    setArray(newArray);
    const algorithm = algorithms[currentAlgorithm];
    const sortSteps = algorithm.steps(newArray.slice()); 
    setSteps(sortSteps);
    setCurrentStep(0);
    setAlgostate(ALGO_STATE.IDLE);
  }

  const handleSizeChange = (e) => {
    setArraySize(Number(e.target.value));
  };

  const handleSizeCommit = () => {
    if (algoState === ALGO_STATE.RUNNING) return;
    generateArray();
  };

  function onSliderChange(e) {
    setSpeed(Number(e.target.value));
  }

  const renderArray = steps.length > 0 && currentStep < steps.length 
    ? steps[currentStep].array 
    : array;
  
  function getBarClass(index) {
    if (steps.length === 0 || currentStep >= steps.length) return ''; 
    const step = steps[currentStep];
    if (!step) return '';
    
    let active = [];
    if (step.type === 'compare' || step.type === 'swap') {
      active = [step.i, step.j];
    } else if (step.type === 'markSorted' || step.type === 'pivot') {
      active = [step.index];
    } else if (step.type === 'overwrite') {
      active = [step.index];
    }
    
    if (!active.includes(index)) {
      const isSorted = steps.slice(0, currentStep).some(
        s => s.type === 'markSorted' && s.index === index
      );
      return isSorted ? 'sorted' : '';
    }
    
    if (step.type === 'pivot') return 'pivot';
    if (step.type === 'markSorted') return 'sorted';
    if (step.type === 'overwrite') return 'overwriting';
    if (step.type === 'swap') return 'swapping';
    if (step.type === 'compare') return 'comparing';
    
    return '';
  }

  function isBarDimmed(index) {
    if (steps.length === 0 || currentStep >= steps.length) return false; 
    const step = steps[currentStep];
    if (!step || step.type !== 'range') return false;
    return index < step.low || index > step.high;
  }

  useEffect(() => {
    if (algoState !== ALGO_STATE.RUNNING) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) { 
          clearInterval(intervalRef.current);
          setAlgostate(ALGO_STATE.COMPLETED);
          return prev;
        }
        return prev + 1;
      });
    }, speed);

    return () => clearInterval(intervalRef.current);
  }, [algoState, speed, steps.length]);

  function handlePlayPause() {
    if (steps.length === 0) { 
      alert("Generate an array first");
      return;
    }
    
    if (algoState === ALGO_STATE.IDLE || algoState === ALGO_STATE.PAUSED) {
      setAlgostate(ALGO_STATE.RUNNING);
    }
    else if (algoState === ALGO_STATE.RUNNING) {
      setAlgostate(ALGO_STATE.PAUSED);
    }
    else if (algoState === ALGO_STATE.COMPLETED) {
      setCurrentStep(0);
      setAlgostate(ALGO_STATE.RUNNING);
    }
  }

  function handleNextStep() {
    if (algoState !== ALGO_STATE.PAUSED) {
      alert("Pause the algorithm first");
      return;
    }
    if (currentStep < steps.length - 1) { 
      setCurrentStep((prev) => prev + 1);
    }
  }

  function handleReset() {
    clearInterval(intervalRef.current);
    setCurrentStep(0);
    setAlgostate(ALGO_STATE.IDLE);
  }

  function handleAlgorithmChange(algo) {
    if (algoState === ALGO_STATE.RUNNING) {
      alert("Algorithm is running");
      return;
    }
    setCurrentAlgorithm(algo);
    handleReset();
    const sortSteps = algorithms[algo].steps(array.slice());
    setSteps(sortSteps);
  }

  function getButtonLabel() {
    if (algoState === ALGO_STATE.RUNNING) return "Pause";
    if (algoState === ALGO_STATE.PAUSED) return "Resume";
    if (algoState === ALGO_STATE.COMPLETED) return "Restart";
    return "Play";
  }

  return (
    <div className="sorting-visualizer">

      <div className="slider-container">
  <label>Array Size: {arraySize}</label>

  <input
  type="range"
  min={MIN_SIZE}
  max={MAX_SIZE}
  value={arraySize}
  disabled={algoState === ALGO_STATE.RUNNING}
  onChange={handleSizeChange}
  onMouseUp={handleSizeCommit}
  onTouchEnd={handleSizeCommit}
/>
</div>
      
      <div className="control-panel">
        
        <div className="control-section">
          <div className="section-title">Select Algorithm</div>
          <div className="algorithm-buttons">
            <button 
              onClick={() => handleAlgorithmChange("bubble")}
              className={`algo-btn ${currentAlgorithm === "bubble" ? "active" : ""}`}
            >
              Bubble Sort
            </button>
            <button 
              onClick={() => handleAlgorithmChange("selection")}
              className={`algo-btn ${currentAlgorithm === "selection" ? "active" : ""}`}
            >
              Selection Sort
            </button>
            <button 
              onClick={() => handleAlgorithmChange("insertion")}
              className={`algo-btn ${currentAlgorithm === "insertion" ? "active" : ""}`}
            >
              Insertion Sort
            </button>
            <button 
              onClick={() => handleAlgorithmChange("quick")}
              className={`algo-btn ${currentAlgorithm === "quick" ? "active" : ""}`}
            >
              Quick Sort
            </button>
            <button 
              onClick={() => handleAlgorithmChange("merge")}
              className={`algo-btn ${currentAlgorithm === "merge" ? "active" : ""}`}
            >
              Merge Sort
            </button>
          </div>
        </div>

        <div className="control-section">
          <div className="section-title">Animation Speed</div>
          <div className="speed-control">
            <div className="speed-label">
              <span>Speed</span>
              <span className="speed-value">{speed}ms</span>
            </div>
            <input 
              type="range" 
              className="speed-slider"
              min="100"
              max="1000"
              step="50"
              value={speed}
              onChange={onSliderChange}
            />
          </div>
        </div>

        <div className="control-section">
          <div className="action-buttons">
            <button 
              className="action-btn btn-generate"
              onClick={generateArray}
            >
              Generate Array
            </button>
            <button 
              className="action-btn btn-play"
              onClick={handlePlayPause}
            >
              {getButtonLabel()}
            </button>
            <button 
              className="action-btn btn-next"
              onClick={handleNextStep}
              disabled={algoState !== ALGO_STATE.PAUSED}
            >
              Next Step
            </button>
            <button 
              className="action-btn btn-reset"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="array-container">
        {renderArray.map((value, index) => (  
          <div 
            key={index} 
            className={`array-bar ${getBarClass(index)}`}
            style={{
              height: `${value * 18}px`,
              width: '50px',
              opacity: isBarDimmed(index) ? 0.3 : 1
            }}
          >
            <span className="bar-value">{value}</span>
          </div>
        ))}
      </div>

      <div className="status-bar">
        <div className="status-item">
          <span className="status-label">Algorithm</span>
          <span className="status-value" style={{ color: '#22c55e' }}>
            {algorithms[currentAlgorithm].name}
          </span>
        </div>
        <div className="status-item">
          <span className="status-label">Current Step</span>
          <span className="status-value">
            {currentStep} / {steps.length-1}
          </span>
        </div>
        <div className="status-item">
          <span className="status-label">Status</span>
          <span className="status-value" style={{ 
            color: algoState === ALGO_STATE.COMPLETED ? '#22c55e' : 
                   algoState === ALGO_STATE.RUNNING ? '#fbbf24' : '#94a3b8'
          }}>
            {algoState === ALGO_STATE.IDLE ? 'Ready' :
             algoState === ALGO_STATE.RUNNING ? 'Running' :
             algoState === ALGO_STATE.PAUSED ? 'Paused' : 'Completed'}
          </span>
        </div>
      </div>

      <div className="status-bar" style={{ marginTop: '16px' }}>
        <div className="status-item">
          <span className="status-label">Legend</span>
        </div>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ 
              width: '16px', 
              height: '16px', 
              background: 'linear-gradient(180deg, #fbbf24, #f59e0b)',
              borderRadius: '4px' 
            }}></div>
            <span style={{ color: '#94a3b8', fontSize: '13px' }}>Comparing</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ 
              width: '16px', 
              height: '16px', 
              background: 'linear-gradient(180deg, #ef4444, #dc2626)',
              borderRadius: '4px' 
            }}></div>
            <span style={{ color: '#94a3b8', fontSize: '13px' }}>Swapping</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ 
              width: '16px', 
              height: '16px', 
              background: 'linear-gradient(180deg, #a855f7, #9333ea)',
              borderRadius: '4px' 
            }}></div>
            <span style={{ color: '#94a3b8', fontSize: '13px' }}>Pivot</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ 
              width: '16px', 
              height: '16px', 
              background: 'linear-gradient(180deg, #22c55e, #16a34a)',
              borderRadius: '4px' 
            }}></div>
            <span style={{ color: '#94a3b8', fontSize: '13px' }}>Sorted</span>
          </div>
        </div>
      </div>
      
    </div>
  );
}