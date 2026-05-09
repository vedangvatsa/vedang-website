"use client";

import React, { useState, useEffect } from 'react';

export function ClusterAnalysisVisualizer() {
  const [points, setPoints] = useState<{x: number, y: number, cluster: number, id: number}[]>([]);
  const [k, setK] = useState(3);
  const [centroids, setCentroids] = useState<{x: number, y: number}[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [iteration, setIteration] = useState(0);
  const [algorithm, setAlgorithm] = useState<'kmeans' | 'hierarchical'>('kmeans');

  const colors = ['bg-rose-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-indigo-500'];
  const borderColors = ['border-rose-500', 'border-blue-500', 'border-emerald-500', 'border-amber-500', 'border-indigo-500'];

  useEffect(() => {
    generateRandomPoints();
  }, []);

  const generateRandomPoints = () => {
    const newPoints = [];
    for (let i = 0; i < 50; i++) {
      newPoints.push({
        x: Math.random() * 380 + 10,
        y: Math.random() * 280 + 10,
        cluster: 0,
        id: i
      });
    }
    setPoints(newPoints);
    setIteration(0);
    setCentroids([]);
  };

  const distance = (p1: {x: number, y: number}, p2: {x: number, y: number}) => {
    return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
  };

  const initializeCentroids = () => {
    const newCentroids = [];
    for (let i = 0; i < k; i++) {
      newCentroids.push({
        x: Math.random() * 380 + 10,
        y: Math.random() * 280 + 10
      });
    }
    setCentroids(newCentroids);
    return newCentroids;
  };

  const assignPointsToClusters = (currentCentroids: {x: number, y: number}[]) => {
    return points.map(point => {
      let minDistance = Infinity;
      let closestCluster = 0;
      
      currentCentroids.forEach((centroid, index) => {
        const dist = distance(point, centroid);
        if (dist < minDistance) {
          minDistance = dist;
          closestCluster = index;
        }
      });
      
      return { ...point, cluster: closestCluster };
    });
  };

  const updateCentroids = (clusteredPoints: {x: number, y: number, cluster: number, id: number}[]) => {
    const newCentroids = [];
    
    for (let i = 0; i < k; i++) {
      const clusterPoints = clusteredPoints.filter(point => point.cluster === i);
      if (clusterPoints.length > 0) {
        const avgX = clusterPoints.reduce((sum, point) => sum + point.x, 0) / clusterPoints.length;
        const avgY = clusterPoints.reduce((sum, point) => sum + point.y, 0) / clusterPoints.length;
        newCentroids.push({ x: avgX, y: avgY });
      } else {
        newCentroids.push({ x: Math.random() * 380 + 10, y: Math.random() * 280 + 10 });
      }
    }
    
    return newCentroids;
  };

  const runKMeansStep = async () => {
    if (centroids.length === 0) {
      const initialCentroids = initializeCentroids();
      await new Promise(resolve => setTimeout(resolve, 500));
      return;
    }

    const clusteredPoints = assignPointsToClusters(centroids);
    setPoints(clusteredPoints);
    await new Promise(resolve => setTimeout(resolve, 500));

    const newCentroids = updateCentroids(clusteredPoints);
    setCentroids(newCentroids);
    setIteration(prev => prev + 1);
    await new Promise(resolve => setTimeout(resolve, 500));

    const converged = newCentroids.every((centroid, index) => 
      distance(centroid, centroids[index]) < 2
    );

    if (converged || iteration > 10) {
      setIsRunning(false);
    }
  };

  const runAlgorithm = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setIteration(0);

    if (algorithm === 'kmeans') {
      setCentroids([]);
      while (isRunning) {
        await runKMeansStep();
        if (iteration > 10) break;
      }
    }
  };

  const addPoint = (e: React.MouseEvent<SVGElement>) => {
    if (isRunning) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newPoint = {
      x,
      y,
      cluster: 0,
      id: points.length
    };
    setPoints([...points, newPoint]);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Cluster Analysis</h3>
        <p className="text-slate-600">Interactive visualization of unsupervised clustering algorithms that group similar data points together</p>
      </div>

      <div className="flex gap-4 items-center flex-wrap">
        <div className="flex items-center gap-2">
          <label className="text-slate-700 font-medium">Clusters (k):</label>
          <input
            type="range"
            min="2"
            max="5"
            value={k}
            onChange={(e) => !isRunning && setK(parseInt(e.target.value))}
            className="w-20"
            disabled={isRunning}
          />
          <span className="text-slate-600 w-6">{k}</span>
        </div>

        <button
          onClick={generateRandomPoints}
          disabled={isRunning}
          className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          New Data
        </button>

        <button
          onClick={runAlgorithm}
          disabled={isRunning || points.length === 0}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRunning ? 'Running...' : 'Run K-Means'}
        </button>
      </div>

      <div className="relative">
        <svg
          width="400"
          height="300"
          className="border border-slate-300 rounded-lg bg-white cursor-crosshair"
          onClick={addPoint}
        >
          {/* Data points */}
          {points.map((point) => (
            <circle
              key={point.id}
              cx={point.x}
              cy={point.y}
              r="4"
              className={`${colors[point.cluster % colors.length]} transition-all duration-300`}
            />
          ))}

          {/* Centroids */}
          {centroids.map((centroid, index) => (
            <g key={index}>
              <circle
                cx={centroid.x}
                cy={centroid.y}
                r="8"
                className={`${colors[index % colors.length]} stroke-2 stroke-slate-900`}
              />
              <text
                x={centroid.x}
                y={centroid.y + 1}
                textAnchor="middle"
                className="text-xs font-bold fill-white"
              >
                C{index + 1}
              </text>
            </g>
          ))}

          {/* Cluster boundaries (Voronoi-like visualization) */}
          {centroids.length > 0 && !isRunning && (
            <defs>
              {centroids.map((_, index) => (
                <pattern key={index} id={`pattern-${index}`} x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="0.5" className={`${colors[index % colors.length]} opacity-20`} />
                </pattern>
              ))}
            </defs>
          )}
        </svg>

        <div className="absolute top-2 right-2 bg-white bg-opacity-90 rounded-lg p-2 text-xs">
          <div className="text-slate-600">Iteration: {iteration}</div>
          <div className="text-slate-600">Points: {points.length}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl text-sm">
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <h4 className="font-semibold text-slate-900 mb-2">🎯 How it works</h4>
          <p className="text-slate-600">
            K-means randomly places centroids, assigns each point to the nearest centroid, 
            then moves centroids to the center of their assigned points. This repeats until convergence.
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <h4 className="font-semibold text-slate-900 mb-2">🔧 Interaction</h4>
          <p className="text-slate-600">
            Click on the plot to add data points. Adjust the number of clusters (k) and 
            click "Run K-Means" to see the algorithm find natural groupings in your data.
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <h4 className="font-semibold text-slate-900 mb-2">📊 Applications</h4>
          <p className="text-slate-600">
            Customer segmentation, image compression, gene sequencing, market research, 
            and data preprocessing for other machine learning algorithms.
          </p>
        </div>
      </div>
    </div>
  );
}