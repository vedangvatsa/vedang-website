"use client";

import React, { useState } from 'react';

export function PublicKeyCryptographyVisualizer() {
  const [selectedPerson, setSelectedPerson] = useState<'alice' | 'bob'>('alice');
  const [message, setMessage] = useState('Hello World!');
  const [encryptedMessage, setEncryptedMessage] = useState('');
  const [decryptedMessage, setDecryptedMessage] = useState('');
  const [step, setStep] = useState(0);
  const [showKeys, setShowKeys] = useState(false);

  const alice = {
    name: 'Alice',
    publicKey: 'PK_A_9x7z',
    privateKey: 'SK_A_m3n8',
    color: 'blue'
  };

  const bob = {
    name: 'Bob',
    publicKey: 'PK_B_5k2w',
    privateKey: 'SK_B_q1r9',
    color: 'emerald'
  };

  const simpleEncrypt = (text: string, key: string) => {
    return btoa(text + key).slice(0, 12) + '...';
  };

  const handleEncrypt = () => {
    const recipient = selectedPerson === 'alice' ? bob : alice;
    const encrypted = simpleEncrypt(message, recipient.publicKey);
    setEncryptedMessage(encrypted);
    setStep(1);
  };

  const handleDecrypt = () => {
    setDecryptedMessage(message);
    setStep(2);
  };

  const reset = () => {
    setStep(0);
    setEncryptedMessage('');
    setDecryptedMessage('');
  };

  const sender = selectedPerson === 'alice' ? alice : bob;
  const recipient = selectedPerson === 'alice' ? bob : alice;

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Public-Key Cryptography</h3>
        <p className="text-slate-600 max-w-2xl">
          Secure communication using two mathematically linked keys: a public key for encryption and a private key for decryption
        </p>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setSelectedPerson('alice')}
          className={`px-4 py-2 rounded-lg font-medium ${
            selectedPerson === 'alice' 
              ? 'bg-blue-500 text-white' 
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          Alice sends to Bob
        </button>
        <button
          onClick={() => setSelectedPerson('bob')}
          className={`px-4 py-2 rounded-lg font-medium ${
            selectedPerson === 'bob' 
              ? 'bg-emerald-500 text-white' 
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          Bob sends to Alice
        </button>
      </div>

      <div className="flex items-center justify-between w-full max-w-4xl gap-8">
        <div className={`flex-1 p-6 rounded-xl bg-${sender.color}-50 border-2 border-${sender.color}-200`}>
          <h4 className={`text-lg font-bold text-${sender.color}-800 mb-3`}>{sender.name} (Sender)</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Message to send:</label>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter message"
              />
            </div>
            <button
              onClick={() => setShowKeys(!showKeys)}
              className="text-sm text-slate-600 hover:text-slate-800 underline"
            >
              {showKeys ? 'Hide' : 'Show'} Key Details
            </button>
            {showKeys && (
              <div className="text-xs space-y-1">
                <div>Public Key: <span className="font-mono bg-slate-100 px-2 py-1 rounded">{sender.publicKey}</span></div>
                <div>Private Key: <span className="font-mono bg-red-100 px-2 py-1 rounded">{sender.privateKey}</span> (secret)</div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center font-bold text-white ${
            step === 0 ? 'bg-amber-500 border-amber-300 animate-pulse' : 
            step === 1 ? 'bg-rose-500 border-rose-300' : 
            'bg-emerald-500 border-emerald-300'
          }`}>
            {step === 0 ? '1' : step === 1 ? '2' : '✓'}
          </div>
          
          {step === 0 && (
            <button
              onClick={handleEncrypt}
              className="px-6 py-3 bg-indigo-500 text-white rounded-lg font-medium hover:bg-indigo-600 transition-colors"
            >
              Encrypt with {recipient.name}'s Public Key
            </button>
          )}
          
          {step === 1 && (
            <div className="text-center">
              <div className="mb-3 p-3 bg-rose-100 border border-rose-200 rounded-lg">
                <div className="text-sm font-medium text-rose-800">Encrypted Message:</div>
                <div className="font-mono text-xs text-rose-600 mt-1">{encryptedMessage}</div>
              </div>
              <button
                onClick={handleDecrypt}
                className="px-6 py-3 bg-indigo-500 text-white rounded-lg font-medium hover:bg-indigo-600 transition-colors"
              >
                Decrypt with {recipient.name}'s Private Key
              </button>
            </div>
          )}
          
          {step === 2 && (
            <button
              onClick={reset}
              className="px-6 py-3 bg-slate-500 text-white rounded-lg font-medium hover:bg-slate-600 transition-colors"
            >
              Try Again
            </button>
          )}
        </div>

        <div className={`flex-1 p-6 rounded-xl bg-${recipient.color}-50 border-2 border-${recipient.color}-200`}>
          <h4 className={`text-lg font-bold text-${recipient.color}-800 mb-3`}>{recipient.name} (Recipient)</h4>
          <div className="space-y-3">
            <div>
              <div className="text-sm font-medium text-slate-700 mb-2">Public Key (shared with everyone):</div>
              <div className="font-mono text-xs bg-slate-100 p-2 rounded border">{recipient.publicKey}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-slate-700 mb-2">Private Key (secret):</div>
              <div className="font-mono text-xs bg-red-100 p-2 rounded border">{recipient.privateKey}</div>
            </div>
            {step === 2 && (
              <div className="mt-4 p-3 bg-emerald-100 border border-emerald-200 rounded-lg">
                <div className="text-sm font-medium text-emerald-800">Decrypted Message:</div>
                <div className="font-medium text-emerald-900 mt-1">"{decryptedMessage}"</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-3xl text-center space-y-2">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className={`p-3 rounded-lg ${step >= 0 ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-500'}`}>
            <div className="font-medium">1. Encrypt</div>
            <div>Use recipient's public key</div>
          </div>
          <div className={`p-3 rounded-lg ${step >= 1 ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-500'}`}>
            <div className="font-medium">2. Transmit</div>
            <div>Send encrypted data safely</div>
          </div>
          <div className={`p-3 rounded-lg ${step >= 2 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}>
            <div className="font-medium">3. Decrypt</div>
            <div>Use recipient's private key</div>
          </div>
        </div>
      </div>
    </div>
  );
}