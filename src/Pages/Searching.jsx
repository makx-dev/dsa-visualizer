import { useState, useRef, useEffect } from 'react'
import { useMemo } from 'react'
import { linearSearchSteps } from '../Searching Algorithms/linearSearchSteps'
import { ALGO_STATE } from '../constants/ALGO_STATE'
import { binarySearchSteps } from '../Searching Algorithms/binarySearchSteps'
import { algorithmInfo } from '../components/algorithmInfo'
import '../Searching.css'

export const algorithms = {
  linear: {
    name: "Linear Search",
    steps: linearSearchSteps
  },
  binary: {
    name:"Binary Search",
    steps: binarySearchSteps
  }
};

export default function Searching() {
  const MIN_SIZE = 4;
  const MAX_SIZE = 20;
  const [arraySize, setArraySize] = useState(10);
  const [array, setArray] = useState(() => generateRandomArray(10));
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [speed, setSpeed] = useState(500);
  const [algoState, setAlgostate] = useState(ALGO_STATE.IDLE);
  const [currentAlgorithm, setCurrentAlgorithm] = useState("linear");
  const [target, setTarget] = useState(6);
  const intervalRef = useRef(null);
  
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
    setSteps([]);
    setCurrentStep(0);
    setAlgostate(ALGO_STATE.IDLE);
  }

  // Generate search steps when search is initiated
  function startSearch() {
    if (algoState === ALGO_STATE.RUNNING) {
      alert("Search is already running");
      return;
    }
    if (array.length === 0) {
      alert("Generate an array first");
      return;
    }
    if (!target && target !== 0) {
      alert("Please enter a target value");
      return;
    }
    
    const algorithm = algorithms[currentAlgorithm];
    const searchSteps = algorithm.steps(array.slice(), target);
    setSteps(searchSteps);
    setCurrentStep(0);
    setAlgostate(ALGO_STATE.RUNNING);
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

  const renderArray = steps.length > 0 && currentStep < steps.length && steps[currentStep].array
  ? steps[currentStep].array
  : array;


function getBarClass(index) {
  if (steps.length === 0 || currentStep >= steps.length) return '';
  const step = steps[currentStep];
  if (!step) return '';
  // If an earlier 'found' step exists, highlight that index as found
  const foundStep = steps.slice(0, currentStep + 1).find(s => s.type === 'found');
  if (foundStep && foundStep.index === index) return 'found';
  // highlight mid selection
  if (step.type === 'mid' && step.index === index) return 'visiting';
  // highlight compare
  if (step.type === 'compare' && step.index === index) return 'visiting';
  // when a range step exists, mark outside-range as eliminated
  if (step.type === 'range') {
    if (index < step.low || index > step.high) return 'eliminated';
  }
  // final not_found state
  if (step.type === 'not_found') return 'eliminated';
  return '';
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
      // First time searching - generate steps and start
      startSearch();
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
    setSteps([]);
    setAlgostate(ALGO_STATE.IDLE);
  }

  function handleAlgorithmChange(algo) {
    if (algoState === ALGO_STATE.RUNNING) {
      alert("Algorithm is running");
      return;
    }
    setCurrentAlgorithm(algo);
    handleReset();
  }

  function getButtonLabel() {
    if (steps.length === 0) return "Search";
    if (algoState === ALGO_STATE.RUNNING) return "Pause";
    if (algoState === ALGO_STATE.PAUSED) return "Resume";
    if (algoState === ALGO_STATE.COMPLETED) return "Restart";
    return "Search";
  }

  return (
    <div className="searching-visualizer">
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

      <div className="control-section">
        <div className="section-title">Select Algorithm</div>
        <div className="algorithm-buttons">
          <button
            className={`algo-btn ${currentAlgorithm === 'linear' ? 'active' : ''}`}
            onClick={() => handleAlgorithmChange('linear')}
          >
            Linear Search
          </button>
          <button
            className={`algo-btn ${currentAlgorithm === 'binary' ? 'active' : ''}`}
            onClick={() => handleAlgorithmChange('binary')}
          >
            Binary Search
          </button>

          <button
            className={`algo-btn ${currentAlgorithm === 'jump' ? 'active' : ''}`}
            onClick={() => handleAlgorithmChange('jump')}
            disabled={true}
          >
            Jump Search (Coming Soon)
          </button>
        </div>
      </div>

      <div className="control-section">
        <div className="section-title">Target Value</div>
        <div className="target-input-group">
          <input
            type="number"
            className="target-input"
            placeholder="Enter target value..."
            value={target}
            onChange={(e) => setTarget(Number(e.target.value))}
            disabled={algoState === ALGO_STATE.RUNNING}
          />
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
            className="action-btn btn-search"
            onClick={handlePlayPause}
            disabled={array.length === 0}
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

      <div className="array-container">
        {renderArray.map((value, index) => (
          <div
            key={index}
            className={`array-bar ${getBarClass(index)}`}
            style={{ height: `${value * 20}px`, width: '50px' }}
          >
            <span className="bar-value">{value}</span>
          </div>
        ))}
      </div>

      <div className="status-bar">
        <div className="status-item">
          <span className="status-label">Algorithm</span>
          <span className="status-value" style={{ color: '#22c55e' }}>
            {currentAlgorithm === 'linear' ? 'Linear Search' :
             currentAlgorithm === 'binary' ? 'Binary Search' : 'Jump Search'}
          </span>
        </div>
        <div className="status-item">
          <span className="status-label">Target</span>
          <span className="status-value">
            {target || target === 0 ? target : '-'}
          </span>
        </div>
        <div className="status-item">
          <span className="status-label">Current Step</span>
          <span className="status-value">{currentStep} / {steps.length}</span>
        </div>
        <div className="status-item">
          <span className="status-label">Status</span>
          <span className="status-value" style={{
            color: algoState === ALGO_STATE.COMPLETED ? '#22c55e' :
                   algoState === ALGO_STATE.RUNNING ? '#fbbf24' : '#94a3b8'
          }}>
            {algoState === ALGO_STATE.IDLE ? 'Ready' :
             algoState === ALGO_STATE.RUNNING ? 'Searching' :
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
            <span style={{ color: '#94a3b8', fontSize: '13px' }}>Visiting</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '16px',
              height: '16px',
              background: 'linear-gradient(180deg, #22c55e, #16a34a)',
              borderRadius: '4px'
            }}></div>
            <span style={{ color: '#94a3b8', fontSize: '13px' }}>Found</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '16px',
              height: '16px',
              background: 'linear-gradient(180deg, #ef4444, #dc2626)',
              borderRadius: '4px',
              opacity: 0.5
            }}></div>
            <span style={{ color: '#94a3b8', fontSize: '13px' }}>Not Found</span>
          </div>
        </div>
      </div>

    </div>
  );
}