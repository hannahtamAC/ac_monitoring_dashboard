import React, { useState, createContext, useContext } from 'react';
type AnimationContextType = {
  animationsEnabled: boolean;
  toggleAnimations: () => void;
};
const AnimationContext = createContext<AnimationContextType | undefined>(undefined);
export const AnimationProvider = ({
  children
}) => {
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const toggleAnimations = () => {
    setAnimationsEnabled(prev => !prev);
  };
  return <AnimationContext.Provider value={{
    animationsEnabled,
    toggleAnimations
  }}>
      {children}
    </AnimationContext.Provider>;
};
export const useAnimations = () => {
  const context = useContext(AnimationContext);
  if (context === undefined) {
    throw new Error('useAnimations must be used within an AnimationProvider');
  }
  return context;
};