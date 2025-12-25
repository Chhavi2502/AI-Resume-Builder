import { useEffect, useState } from "react";

export default function useDebounce<T>(value: T, delay: number = 250){

    const [debouncedValue, setDebouncedValue] = useState<T>(value)

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)
        // If user types again before delay ends, previous timeout is cleared.

        return () => clearTimeout(handler)
    }, [value, delay])
    
    return debouncedValue
}