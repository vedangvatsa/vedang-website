"use client";

import React, { useState } from 'react';

export default function NerVisualizer() {
  const [selectedSentence, setSelectedSentence] = useState(0);
  const [hoveredEntity, setHoveredEntity] = useState<number | null>(null);
  const [showLabels, setShowLabels] = useState(false);

  const sentences = [
    {
      text: "Apple released the iPhone in San Francisco on January 9, 2007",
      entities: [
        { word: "Apple", start: 0, end: 5, type: "ORG", color: "bg-blue-200 text-blue-800" },
        { word: "iPhone", start: 17, end: 23, type: "PRODUCT", color: "bg-indigo-200 text-indigo-800" },
        { word: "San Francisco", start: 27, end: 40, type: "LOC", color: "bg-emerald-200 text-emerald-800" },
        { word: "January 9, 2007", start: 44, end: 59, type: "DATE", color: "bg-amber-200 text-amber-800" }
      ]
    },
    {
      text: "Microsoft's CEO Satya Nadella earned $42.9 million in 2023",
      entities: [
        { word: "Microsoft", start: 0, end: 9, type: "ORG", color: "bg-blue-200 text-blue-800" },
        { word: "Satya Nadella", start: 16, end: 29, type: "PERSON", color: "bg-rose-200 text-rose-800" },
        { word: "$42.9 million", start: 37, end: 50, type: "MONEY", color: "bg-emerald-200 text-emerald-800" },
        { word: "2023", start: 54, end: 58, type: "DATE", color: "bg-amber-200 text-amber-800" }
      ]
    },
    {
      text: "Google was founded by Larry Page in Mountain View, California",
      entities: [
        { word: "Google", start: 0, end: 6, type: "ORG", color: "bg-blue-200 text-blue-800" },
        { word: "Larry Page", start: 18, end: 28, type: "PERSON", color: "bg-rose-200 text-rose-800" },
        { word: "Mountain View", start: 32, end: 45, type: "LOC", color: "bg-emerald-200 text-emerald-800" },
        { word: "California", start: 47, end: 57, type: "LOC", color: "bg-emerald-200 text-emerald-800" }
      ]
    }
  ];

  const entityTypes = [
    { type: "PERSON", color: "bg-rose-200 text-rose-800", description: "People names" },
    { type: "ORG", color: "bg-blue-200 text-blue-800", description: "Organizations" },
    { type: "LOC", color: "bg-emerald-200 text-emerald-800", description: "Locations" },
    { type: "DATE", color: "bg-amber-200 text-amber-800", description: "Dates and times" },
    { type: "MONEY", color: "bg-emerald-200 text-emerald-800", description: "Monetary values" },
    { type: "PRODUCT", color: "bg-indigo-200 text-indigo-800", description: "Products" }
  ];

  const renderTextWithEntities = (sentence: typeof sentences[0]) => {
    const { text, entities } = sentence;
    let result = [];
    let lastIndex = 0;

    entities.forEach((entity, idx) => {
      // Add text before entity
      if (entity.start > lastIndex) {
        result.push(
          <span key={`text-${idx}`} className="text-slate-700">
            {text.slice(lastIndex, entity.start)}
          </span>
        );
      }

      // Add entity
      result.push(
        <span
          key={`entity-${idx}`}
          className={`px-2 py-1 rounded-md cursor-pointer transition-all duration-200 ${entity.color} ${
            hoveredEntity === idx ? 'scale-105 shadow-md' : ''
          } ${showLabels ? 'relative' : ''}`}
          onMouseEnter={() => setHoveredEntity(idx)}
          onMouseLeave={() => setHoveredEntity(null)}
        >
          {entity.word}
          {showLabels && (
            <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              {entity.type}
            </span>
          )}
        </span>
      );

      lastIndex = entity.end;
    });

    // Add remaining text
    if (lastIndex < text.length) {
      result.push(
        <span key="text-end" className="text-slate-700">
          {text.slice(lastIndex)}
        </span>
      );
    }

    return result;
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-slate-800 mb-4">Named Entity Recognition (NER)</h3>
        <p className="text-lg text-slate-600">
          Interactive visualization showing how NER identifies and classifies entities in text
        </p>
      </div>

      <div className="w-full max-w-4xl space-y-6">
        {/* Sentence Selector */}
        <div className="flex flex-wrap gap-2 justify-center">
          {sentences.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedSentence(idx)}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                selectedSentence === idx
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              Example {idx + 1}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setShowLabels(!showLabels)}
            className={`px-4 py-2 rounded-lg transition-all duration-200 ${
              showLabels
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            {showLabels ? 'Hide Labels' : 'Show Labels'}
          </button>
        </div>

        {/* Text Display */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xl leading-relaxed">
            {renderTextWithEntities(sentences[selectedSentence])}
          </div>
        </div>

        {/* Entity Legend */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {entityTypes.map((entityType) => (
            <div
              key={entityType.type}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                sentences[selectedSentence].entities.some(e => e.type === entityType.type)
                  ? `${entityType.color} border-current`
                  : 'bg-slate-100 text-slate-400 border-slate-300'
              }`}
            >
              <div className="font-semibold text-sm">{entityType.type}</div>
              <div className="text-xs opacity-75">{entityType.description}</div>
            </div>
          ))}
        </div>

        {/* Entity Details */}
        {hoveredEntity !== null && (
          <div className="bg-slate-800 text-white p-4 rounded-lg text-center">
            <div className="font-semibold">
              "{sentences[selectedSentence].entities[hoveredEntity].word}"
            </div>
            <div className="text-sm opacity-75">
              Type: {sentences[selectedSentence].entities[hoveredEntity].type}
            </div>
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <div className="text-2xl font-bold text-blue-600">
              {sentences[selectedSentence].entities.length}
            </div>
            <div className="text-sm text-slate-600">Entities Found</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <div className="text-2xl font-bold text-indigo-600">
              {new Set(sentences[selectedSentence].entities.map(e => e.type)).size}
            </div>
            <div className="text-sm text-slate-600">Entity Types</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <div className="text-2xl font-bold text-emerald-600">
              {sentences[selectedSentence].text.split(' ').length}
            </div>
            <div className="text-sm text-slate-600">Total Tokens</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <div className="text-2xl font-bold text-rose-600">
              {Math.round((sentences[selectedSentence].entities.length / sentences[selectedSentence].text.split(' ').length) * 100)}%
            </div>
            <div className="text-sm text-slate-600">Entity Density</div>
          </div>
        </div>
      </div>
    </div>
  );
}