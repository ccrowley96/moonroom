import { useEffect, useRef } from 'react';

export const useDidUpdateEffect = (fn, inputs) => {
    const didMountRef = useRef(false);

    useEffect(() => {
        if (didMountRef.current) fn();
        else didMountRef.current = true;
    }, inputs);
};
