import React from 'react';
import { FlightTracker } from './components/FlightTracker';
import { AnimationProvider } from './contexts/AnimationContext';
export function App() {
  return <AnimationProvider>
      <div className="min-h-screen bg-gray-50">
        <FlightTracker />
      </div>
    </AnimationProvider>;
}