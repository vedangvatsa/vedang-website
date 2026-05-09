"use client";
import React, { useState } from 'react';
export function VocabularyVisualizer() {
  const [selectedWord, setSelectedWord] = useState(0);
  const words = [{word:'hello', id:1234, freq:'common'},{word:'transformer',id:8721,freq:'technical'},{word:'cryptocurrency',id:15032,freq:'specialized'},{word:'the',id:4,freq:'very common'}];
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Vocabulary</h3>
        <p className="text-slate-500 mt-2">The set of all tokens a language model knows.</p>
      </div>
      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-6">
        <div className="flex gap-3 flex-wrap justify-center">
          {words.map((w, i) => (
            <button key={i} onClick={() => setSelectedWord(i)} className={`px-4 py-2 rounded-xl font-semibold transition-all ${selectedWord === i ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>{w.word}</button>
          ))}
        </div>
        <div className="p-6 bg-indigo-50 rounded-xl border border-indigo-200">
          <div className="font-mono text-sm text-indigo-800">Token: "{words[selectedWord].word}"</div>
          <div className="font-mono text-sm text-indigo-600 mt-1">ID: {words[selectedWord].id}</div>
          <div className="font-mono text-sm text-indigo-600 mt-1">Frequency: {words[selectedWord].freq}</div>
        </div>
      </div>
    </div>
  );
}