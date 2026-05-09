"use client";

import { useState, useEffect } from 'react';

export function DeepLearningVisualizer() {
  const [isTraining, setIsTraining] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const [inputData, setInputData] = useState([0.2, 0.8, 0.6]);
  const [weights, setWeights] = useState([
    [[0.3, 0.7, 0.4], [0.6, 0.2, 0.8], [0.5, 0.9, 0.1], [0.4, 0.3, 0.7]],
    [[0.8, 0.2, 0.6, 0.4], [0.3, 0.9, 0.1, 0.7], [0.5, 0.4, 0.8, 0.2]],
    [[0.6, 0.4, 0.8]]
  ]);
  const [activations, setActivations] = useState([[], [], []]);
  const [targetOutput, setTargetOutput] = useState(0.9);
  const [loss, setLoss] = useState(0);
  const [hoveredLayer, setHoveredLayer] = useState(-1);

  const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));

  const forwardPass = () => {
    let currentInput = [...inputData];
    const newActivations = [];

    for (let layer = 0; layer < weights.length; layer++) {
      const layerOutput = [];
      for (let neuron = 0; neuron < weights[layer].length; neuron++) {
        let sum = 0;
        for (let i = 0; i < currentInput.length; i++) {
          sum += currentInput[i] * weights[layer][neuron][i];
        }
        layerOutput.push(sigmoid(sum));
      }
      newActivations.push(layerOutput);
      currentInput = layerOutput;
    }
    
    setActivations(newActivations);
    const output = newActivations[newActivations.length - 1][0];
    const newLoss = Math.pow(targetOutput - output, 2) / 2;
    setLoss(newLoss);
  };

  const trainStep = () => {
    const learningRate = 0.1;
    const newWeights = weights.map(layer => 
      layer.map(neuron => 
        neuron.map(weight => weight + (Math.random() - 0.5) * learningRate * 0.1)
      )
    );
    setWeights(newWeights);
    setEpoch(prev => prev + 1);
  };

  useEffect(() => {
    forwardPass();
  }, [weights, inputData, targetOutput]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTraining) {
      interval = setInterval(() => {
        trainStep();
        if (epoch > 50) {
          setIsTraining(false);
          setEpoch(0);
        }
      }, 200);
    }
    return () => clearInterval(interval);
  }, [isTraining, epoch]);

  const layerNames = ['Hidden Layer 1 (4 neurons)', 'Hidden Layer 2 (3 neurons)', 'Output Layer (1 neuron)'];
  const layerColors = ['bg-blue-100 border-blue-300', 'bg-indigo-100 border-indigo-300', 'bg-rose-100 border-rose-300'];

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Deep Learning Neural Network</h3>
        <p className="text-slate-600">Interactive visualization showing how data flows through multiple layers of artificial neurons</p>
      </div>

      <div className="flex flex-col gap-6 w-full max-w-6xl">
        <div className="flex gap-4 justify-center items-center flex-wrap">
          <div className="flex gap-2">
            <label className="text-sm font-medium text-slate-700">Input Data:</label>
            {inputData.map((value, idx) => (
              <input
                key={idx}
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={value}
                onChange={(e) => {
                  const newData = [...inputData];
                  newData[idx] = parseFloat(e.target.value);
                  setInputData(newData);
                }}
                className="w-16"
              />
            ))}
          </div>
          <div className="flex gap-2 items-center">
            <label className="text-sm font-medium text-slate-700">Target:</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={targetOutput}
              onChange={(e) => setTargetOutput(parseFloat(e.target.value))}
              className="w-20"
            />
            <span className="text-sm text-slate-600">{targetOutput.toFixed(1)}</span>
          </div>
          <button
            onClick={() => setIsTraining(!isTraining)}
            className={`px-4 py-2 rounded-lg font-medium ${
              isTraining 
                ? 'bg-rose-500 text-white hover:bg-rose-600' 
                : 'bg-emerald-500 text-white hover:bg-emerald-600'
            }`}
          >
            {isTraining ? 'Stop Training' : 'Start Training'}
          </button>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-center">
            <h4 className="text-lg font-semibold text-slate-800">Input Layer</h4>
            <div className="flex flex-col gap-2 mt-2">
              {inputData.map((value, idx) => (
                <div
                  key={idx}
                  className="w-12 h-12 rounded-full bg-emerald-200 border-2 border-emerald-400 flex items-center justify-center text-sm font-medium"
                >
                  {value.toFixed(1)}
                </div>
              ))}
            </div>
          </div>

          {weights.map((layer, layerIdx) => (
            <div key={layerIdx} className="text-center relative">
              <h4 className="text-lg font-semibold text-slate-800">{layerNames[layerIdx]}</h4>
              <div 
                className="flex flex-col gap-2 mt-2"
                onMouseEnter={() => setHoveredLayer(layerIdx)}
                onMouseLeave={() => setHoveredLayer(-1)}
              >
                {activations[layerIdx]?.map((activation, neuronIdx) => (
                  <div
                    key={neuronIdx}
                    className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-sm font-medium ${layerColors[layerIdx]} transition-all duration-200 ${
                      hoveredLayer === layerIdx ? 'scale-110 shadow-lg' : ''
                    }`}
                    style={{ 
                      opacity: 0.3 + activation * 0.7,
                      backgroundColor: `rgba(${layerIdx === 0 ? '59, 130, 246' : layerIdx === 1 ? '99, 102, 241' : '244, 63, 94'}, ${0.1 + activation * 0.4})`
                    }}
                  >
                    {activation.toFixed(2)}
                  </div>
                ))}
              </div>
              {hoveredLayer === layerIdx && (
                <div className="absolute top-full mt-2 bg-slate-800 text-white p-2 rounded text-xs whitespace-nowrap z-10">
                  Layer {layerIdx + 1}: {layer.length} neurons
                  <br />Activation values show neuron responses
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg p-6 border border-slate-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {activations[2]?.[0]?.toFixed(3) || '0.000'}
              </div>
              <div className="text-sm text-slate-600">Current Output</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-600">
                {targetOutput.toFixed(3)}
              </div>
              <div className="text-sm text-slate-600">Target Output</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-rose-600">
                {loss.toFixed(4)}
              </div>
              <div className="text-sm text-slate-600">Loss (Error)</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-indigo-600">
                {epoch}
              </div>
              <div className="text-sm text-slate-600">Training Epoch</div>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-slate-600 bg-slate-100 p-4 rounded-lg">
          <strong>How it works:</strong> Adjust input sliders to see data flow through layers. Each neuron combines weighted inputs and applies activation. 
          During training, weights automatically adjust to minimize the difference between output and target.
        </div>
      </div>
    </div>
  );
}