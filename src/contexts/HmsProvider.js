import React, {
  createContext,
  useContext,
  useRef,
  useEffect,
  useState,
} from 'react';

//! 100ms
import HmsManager from '@100mslive/react-native-hms';

const HmsContext = createContext(null);

const HmsProvider = ({children}) => {
  const [hmsInstance, setHmsInstance] = useState(null);

  useEffect(() => {
    HmsManager.build()
      .then(instance => {
        setHmsInstance(instance);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <HmsContext.Provider value={hmsInstance}>{children}</HmsContext.Provider>
  );
};

export const useHms = () => useContext(HmsContext);

export default HmsProvider;
