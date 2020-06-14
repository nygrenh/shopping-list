import { useEffect, useState } from "react"

export const useCheckPeriodically = (doCheck: () => boolean , refreshCycle = 1000) => {
  const [now, setNow] = useState(doCheck())

  useEffect(() => {
    const intervalId = setInterval(() => setNow(doCheck()), refreshCycle)

    return () => clearInterval(intervalId)
  }, [refreshCycle, setInterval, clearInterval, setNow, doCheck])

  return now
}
