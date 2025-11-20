import { useState, useEffect, useCallback } from 'react';
import { ButtonType } from '../types';
import { KEYBOARD_MAP } from '../constants';

export const useControls = () => {
  const [activeButtons, setActiveButtons] = useState<Set<ButtonType>>(new Set());

  const handleButtonPress = useCallback((button: ButtonType) => {
    setActiveButtons(prev => {
      const newSet = new Set(prev);
      newSet.add(button);
      return newSet;
    });
  }, []);

  const handleButtonRelease = useCallback((button: ButtonType) => {
    setActiveButtons(prev => {
      const newSet = new Set(prev);
      newSet.delete(button);
      return newSet;
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const mapped = KEYBOARD_MAP[e.key];
      if (mapped && ButtonType[mapped as keyof typeof ButtonType]) {
        handleButtonPress(ButtonType[mapped as keyof typeof ButtonType]);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const mapped = KEYBOARD_MAP[e.key];
      if (mapped && ButtonType[mapped as keyof typeof ButtonType]) {
        handleButtonRelease(ButtonType[mapped as keyof typeof ButtonType]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleButtonPress, handleButtonRelease]);

  return {
    activeButtons,
    isPressed: (btn: ButtonType) => activeButtons.has(btn),
    press: handleButtonPress,
    release: handleButtonRelease
  };
};