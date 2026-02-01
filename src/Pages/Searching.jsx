import { useState, useRef, useEffect } from 'react'
import { linearSearchSteps } from '../Searching Algorithms/linearSearchSteps'
import { ALGO_STATE } from '../constants/ALGO_STATE'
import '../Searching.css'

export const algorithms = {
  linear: {
    name: "Linear Search",
    steps: linearSearchSteps
  }
}

export default function Searching() {
  const [array, setArray] = useState([])  
  const [steps, setSteps] = useState([]) 
  const [currentStep, setCurrentStep] = useState(0) 
  const [speed, setSpeed] = useState(500)
  const [algoState, setAlgostate] = useState(ALGO_STATE.IDLE)
  const [currentAlgorithm, setCurrentAlgorithm] = useState("linear")
  const [target, setTarget] = useState(6)
  const intervalRef = useRef(null)
  
  function generateArray() {
    if (algoState === ALGO_STATE.RUNNING) {
      alert("Pause or reset the algorithm first");
      return;
    }
    const arrayLength = 7;          
    const minVal = 1;               
    const maxVal = 10;              
    const range = [];
    for (let v = minVal; v < maxVal; v++) range.push(v);
    for (let i = range.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [range[i], range[j]] = [range[j], range[i]];
    }
    const list = range.slice(0, arrayLength);
    setArray(list);
    
    const algorithm = algorithms[currentAlgorithm];
    const searchSteps = algorithm.steps(list, target);
    
    setSteps(searchSteps);
    setCurrentStep(0);
    setAlgostate(ALGO_STATE.IDLE);
  }

  function onSliderChange(e) {
    setSpeed(Number(e.target.value))
  }

  const renderArray = steps.length > 0 && currentStep < steps.length 
    ? steps[currentStep].array 
    : array;

  function getBarClass(index) {
    if (steps.length === 0) return '';
    const step = steps[currentStep];
    if (!step) return '';
    
    const targetFoundStep = steps.slice(0, currentStep + 1).find(s => s.type === 'target');
    
    if (targetFoundStep && targetFoundStep.index === index) {
      return 'found';
    }
    
    if (step.type === 'compare' && step.index === index) {
      return 'visiting';
    }
    if (targetFoundStep && targetFoundStep.index !== index) {
      return '';
    }
    if (step.type === 'not_found') {
      return 'eliminated';
    }
    
    return '';
  }

  useEffect(() => {
    if(steps.length === 0) return; 
    if (algoState !== ALGO_STATE.RUNNING) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if(currentStep >= steps.length - 1) {
        setAlgostate(ALGO_STATE.COMPLETED);
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
  }, [algoState, speed, steps.length, currentStep]);

  function handlePlayPause() {
    if(algoState === ALGO_STATE.IDLE || algoState === ALGO_STATE.PAUSED) {
      setAlgostate(ALGO_STATE.RUNNING);
    }
    else if(algoState === ALGO_STATE.RUNNING) {
      setAlgostate(ALGO_STATE.PAUSED);
    }
    else if(algoState === ALGO_STATE.COMPLETED) {
      setCurrentStep(0);
      setAlgostate(ALGO_STATE.RUNNING);
    }
  }

  function handleNextStep() {
    if(algoState !== ALGO_STATE.PAUSED) {
      alert("Pause the algorithm first");
      return;
    }
    if(currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  }

  function handleReset() {
    clearInterval(intervalRef.current);
    setCurrentStep(0);
    setAlgostate(ALGO_STATE.IDLE);
  }

  function handleAlgorithmChange(algo) {
    if(algoState === ALGO_STATE.RUNNING) {
      alert("Algorithm is running");
      return;
    }
    setCurrentAlgorithm(algo);
    handleReset();
  }

  function getButtonLabel() {
    if (algoState === ALGO_STATE.RUNNING) return "Pause"
    if (algoState === ALGO_STATE.PAUSED) return "Resume"
    if (algoState === ALGO_STATE.COMPLETED) return "Restart"
    return "Search"
  }

  return (
    <div className="searching-visualizer">
      
      <div className="control-panel">
        
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
              disabled={true}
            >
              Binary Search (Coming Soon)
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
              height: `${value * 30}px`,
              width: '50px'
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
            {currentAlgorithm === 'linear' ? 'Linear Search' :
             currentAlgorithm === 'binary' ? 'Binary Search' : 'Jump Search'}
          </span>
        </div>
        <div className="status-item">
          <span className="status-label">Target</span>
          <span className="status-value">
            {target || '-'}
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
  )
}