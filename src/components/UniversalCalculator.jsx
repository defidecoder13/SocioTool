import React, { useState, useEffect, useMemo } from 'react';

export default function UniversalCalculator({ calculatorConfig }) {
  const { inputs, formulas } = calculatorConfig;

  // Initialize state from URL params if present, otherwise default values
  const [state, setState] = useState(() => {
    if (typeof window === 'undefined') {
      return inputs.reduce((acc, input) => {
        acc[input.id] = input.defaultValue;
        return acc;
      }, {});
    }
    
    const params = new URLSearchParams(window.location.search);
    return inputs.reduce((acc, input) => {
      const paramVal = params.get(input.id);
      acc[input.id] = paramVal !== null ? Number(paramVal) : input.defaultValue;
      return acc;
    }, {});
  });

  // Sync state to URL params on change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location);
      Object.keys(state).forEach(key => {
        url.searchParams.set(key, state[key]);
      });
      window.history.replaceState({}, '', url);
    }
  }, [state]);

  const handleChange = (id, value) => {
    setState(prev => ({ ...prev, [id]: Number(value) }));
  };

  const handleStep = (id, step, direction) => {
    setState(prev => {
      const current = prev[id] || 0;
      // using parseFloat/toFixed to avoid floating point math errors
      const newValue = parseFloat((current + (step * direction)).toFixed(4));
      return { ...prev, [id]: newValue };
    });
  };

  // Execution engine
  const results = useMemo(() => {
    try {
      const { extraRules } = formulas;
      
      const paramNames = Object.keys(state);
      const paramValues = Object.values(state);
      
      let functionBody = extraRules.formula;
      if (!functionBody.includes('return')) {
        functionBody = `return ${functionBody};`;
      }

      // eslint-disable-next-line no-new-func
      const executor = new Function(...paramNames, functionBody);
      const mainResult = executor(...paramValues);

      // Attempt to calculate margin
      let margin = null;
      const revenueKey = paramNames.find(k => ['revenue', 'retailPrice', 'orderValue', 'grossAmount', 'currentAOV'].includes(k));
      if (revenueKey && state[revenueKey] > 0 && extraRules.symbol !== '%' && extraRules.metric !== 'Target ROAS') {
        margin = ((mainResult / state[revenueKey]) * 100).toFixed(1);
      }

      return {
        main: mainResult || 0,
        currencySymbol: extraRules.symbol || '$',
        metricName: extraRules.metric || 'Net Profit',
        margin: margin
      };
    } catch (e) {
      console.error("Calculation Error:", e);
      return { main: 0, currencySymbol: '$', metricName: 'Error', margin: null };
    }
  }, [state, formulas]);

  return (
    <div className="bg-white rounded-3xl shadow-2xl shadow-blue-900/5 p-4 md:p-6 lg:p-8 w-full max-w-5xl mx-auto border border-slate-100 backdrop-blur-sm relative overflow-hidden group">
      {/* Subtle ambient background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -z-10 transform -translate-x-1/2 translate-y-1/2"></div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
        {/* Input Controls */}
        <div className="space-y-6 flex flex-col justify-center overflow-x-hidden">
          <h3 className="text-xl md:text-2xl font-semibold text-slate-800 mb-2 font-inter tracking-tight">Parameters</h3>
          <div className="space-y-5">
            {inputs.map((input) => (
              <div key={input.id} className="relative flex flex-col">
                <div className="flex justify-between mb-2 items-end">
                  <label className="text-sm md:text-base font-medium text-slate-600 tracking-wide">{input.label}</label>
                </div>
                
                {input.type === 'slider' ? (
                  <div className="flex flex-col gap-2 min-h-[44px]">
                    <div className="flex justify-between items-center text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-md w-full">
                      <span>{state[input.id]}</span>
                    </div>
                    <input
                      type="range"
                      min={input.min}
                      max={input.max}
                      step={input.step}
                      value={state[input.id]}
                      onChange={(e) => handleChange(input.id, e.target.value)}
                      className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 transition-all hover:accent-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    />
                  </div>
                ) : input.type === 'toggle' ? (
                  <div className="flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => handleChange(input.id, state[input.id] === 1 ? 0 : 1)}
                      className={`min-h-[44px] min-w-[64px] flex items-center rounded-full p-1.5 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${state[input.id] ? 'bg-blue-600' : 'bg-slate-300'}`}
                    >
                      <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${state[input.id] ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                    <span className="text-sm md:text-base font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{state[input.id] ? 'Yes' : 'No'}</span>
                  </div>
                ) : (
                  <div className="relative flex items-center">
                    <button 
                      type="button"
                      onClick={() => handleStep(input.id, input.step || 1, -1)}
                      className="absolute left-1 w-10 h-10 flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors z-10 text-xl font-bold"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={input.min}
                      max={input.max}
                      step={input.step}
                      value={state[input.id]}
                      onChange={(e) => handleChange(input.id, e.target.value)}
                      className="w-full text-center px-12 py-2 min-h-[44px] bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-800 font-bold placeholder-slate-400 focus:bg-white focus:outline-none text-base sm:text-lg tabular-nums"
                    />
                    <button 
                      type="button"
                      onClick={() => handleStep(input.id, input.step || 1, 1)}
                      className="absolute right-1 w-10 h-10 flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors z-10 text-xl font-bold"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Output Display */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 md:p-8 flex flex-col justify-center items-center shadow-xl shadow-blue-900/20 text-white relative overflow-hidden min-h-[180px] md:min-h-[250px]">
          {/* Glassmorphism accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-1/4 -translate-y-1/4"></div>
          
          <div className="text-center z-10 w-full overflow-x-hidden">
            <h3 className="text-xs md:text-base font-semibold text-blue-100 uppercase tracking-widest mb-2 md:mb-4 opacity-90 break-words">
              {results.metricName}
            </h3>
            <div className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tighter tabular-nums drop-shadow-md break-all">
              {results.currencySymbol}{Number(results.main).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            
            {results.margin !== null && (
              <div className="mt-2 md:mt-4 inline-flex items-center px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
                <span className="text-xs md:text-sm font-medium text-blue-50 mr-2">Net Margin:</span>
                <span className="text-base md:text-lg font-bold text-white tabular-nums">{results.margin}%</span>
              </div>
            )}
            
            <div className="mt-4 pt-3 md:mt-8 md:pt-6 border-t border-white/20 w-full flex justify-between items-center text-[10px] md:text-sm font-medium text-blue-100">
              <span>Real-time Calculation</span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-400 animate-pulse"></span>
                Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
