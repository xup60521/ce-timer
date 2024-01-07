'use client'

import { Dispatch, RefObject, SetStateAction, useEffect, useRef, useState } from "react"
import { Input } from "./ui/input"
import { useToast } from "./ui/use-toast"
import { Button } from "./ui/button"
import type { TimerType } from "@/lib/type"
import { FaTrashAlt } from "react-icons/fa";

type TimerProps = {
  setTimers: Dispatch<SetStateAction<TimerType[]>>
} & TimerType;

export const Timer = ({time, name, muted, id, setTimers}:TimerProps) => {

  const hourRef = useRef<HTMLInputElement>(null)
  const minRef = useRef<HTMLInputElement>(null)
  const secRef = useRef<HTMLInputElement>(null)
  const titleRef = useRef<HTMLInputElement>(null)
  const [action, setAction] = useState<"" | "pause" | "running">("")
  const [remainingTime, setRemainingTime] = useState(-1)
  const { toast } = useToast()

  const deleteTimer = () => {
    setTimers((prev)=>{
      return prev.filter((item)=>item.id!==id)
    })
  }

  const Go = () => {
      if (!hourRef.current || !minRef.current || !secRef.current) {return }
      if ((hourRef.current.value === "00") && (secRef.current.value === "00") && (minRef.current.value === "00")) {
        toast({
          title: "Invalid time",
          description: "The time should not be zero.",
        })
      }
      setRemainingTime(3600 * Number(hourRef.current.value) + 60 * Number(minRef.current.value) + Number(secRef.current.value))
      setAction("running")
  }

  
  
  if (remainingTime === 0 && action === "running") {
    const audio = new Audio("/ring.mp3")
    audio.play()
    setAction("")
  }
  
  useEffect(()=>{
    let intervalId: NodeJS.Timeout;
    if (action === "running" ) {
      intervalId = setInterval(()=>{
        setRemainingTime(prev =>{
          return prev - 1
        })
      }, 1000)
    }
    return ()=>{clearInterval(intervalId)}
  }, [action])

  

  return (
      <div className="timer w-64 shadow-[rgba(50,50,93,0.25)_0px_6px_12px_-2px,_rgba(0,0,0,0.3)_0px_3px_7px_-3px] rounded-lg p-4 gap-8 flex flex-col">
        <Input className="title text-xl border-none text-center"  readOnly={action !== ""} ref={titleRef} defaultValue={name} onClick={()=>{
        if (action !== "") {return }
        titleRef.current?.select()
      }} onKeyDown={(e)=>{
        if (e.key === "Enter") {
          setTimers((prev)=>{
            if (!titleRef.current) {return [...prev]}
            const index = prev.map((d)=>d.id).indexOf(id)
            prev[index].name = titleRef.current.value
            return [...prev]
          })
          hourRef.current?.focus()
          hourRef.current?.select()
        }
      }} onBlur={()=>{
        setTimers((prev)=>{
          if (!titleRef.current) {return [...prev]}
          const index = prev.map((d)=>d.id).indexOf(id)
          prev[index].name = titleRef.current.value
          return [...prev]
        })
      }} />
      <div className="time  flex gap-2 w-full justify-center items-center">
        {action === "" ? <DefaultTimer hourRef={hourRef} minRef={minRef} secRef={secRef} initTime={time} setTimers={setTimers} id={id} /> : <RemainingTimer remainingTime={remainingTime} />}
      </div>
      <div className="flex justify-center gap-4">
        {(()=>{
          if (action === "") {return <>
            <Button variant={"default"} onClick={deleteTimer} className=" rounded-full bg-red-500 hover:bg-red-700"><FaTrashAlt /></Button>
            <Button variant={"default"} onClick={Go} className=" rounded-full ">Go</Button>
          </>}
          if (action === "running") {return (
            <>
              <Button variant={"secondary"} className="hover:bg-slate-200" onClick={()=>setAction("")}>Cancel</Button>
              <Button variant={"default"} className="bg-red-500 hover:bg-red-700 rounded" onClick={()=>setAction("pause")}>Pause</Button>
            </>
          )}
          if (action === "pause") {return (
            <>
              <Button variant={"secondary"} className="hover:bg-slate-200" onClick={()=>setAction("")}>Cancel</Button>
              <Button variant={"default"} className="bg-blue-500 hover:bg-blue-700 rounded" onClick={()=>setAction("running")}>Resume</Button>
            </>
          )}
        })()}
      </div>
    </div>
  )
}

type DefaultTimerProps = {
    hourRef: RefObject<HTMLInputElement>,
    minRef: RefObject<HTMLInputElement>,
    secRef: RefObject<HTMLInputElement>,
    initTime: number,
    setTimers: Dispatch<SetStateAction<TimerType[]>>,
    id:string
  }
  
const DefaultTimer = ({hourRef, minRef, secRef, initTime, setTimers, id}: DefaultTimerProps) => {

  const hour = Math.floor(initTime / 3600)
  const min = Math.floor( (initTime % 3600) / 60 )
  const sec = initTime % 60

  

return (
    <>
    <Input className=" rounded w-12 text-center bg-slate-100" defaultValue={`${hour}`.padStart(2, "0")} ref={hourRef} onBlur={()=>{
        if (!hourRef.current) { return }
        if (!Number(hourRef.current.value)) {hourRef.current.value = "00"}
        if (Number(hourRef.current.value) > 24 || Number(hourRef.current.value) < 0) {
        hourRef.current.value = "00"
        } else {
        hourRef.current.value = hourRef.current.value.padStart(2, "0")
        }
        setTimers((prev)=>{
          if (!hourRef.current ||!minRef.current || !secRef.current) {return [...prev]}
          const index = prev.map((d)=>d.id).indexOf(id)
          prev[index].time = Number(hourRef.current.value) * 3600 + Number(minRef.current.value) * 60 + Number(secRef.current.value)
          return [...prev]
        })
    }} onKeyDown={(e)=>{            
        if (!hourRef.current || e.key !== "Enter") {
        return
        }
        if (!Number(hourRef.current.value)) {hourRef.current.value = "00"}
        if (Number(hourRef.current.value) > 24 || Number(hourRef.current.value) < 0) {
        hourRef.current.value = "00"
        } else {
        hourRef.current.value = hourRef.current.value.padStart(2, "0")
        }
        minRef.current?.focus()
        minRef.current?.select()
        setTimers((prev)=>{
          if (!hourRef.current ||!minRef.current || !secRef.current) {return [...prev]}
          const index = prev.map((d)=>d.id).indexOf(id)
          prev[index].time = Number(hourRef.current.value) * 3600 + Number(minRef.current.value) * 60 + Number(secRef.current.value)
          return [...prev]
        })
    }} />
    <span>:</span>
    <Input className=" rounded w-12 text-center bg-slate-100" defaultValue={`${min}`.padStart(2, "0")} ref={minRef} onBlur={()=>{
        if (!minRef.current) { return }
        if (!Number(minRef.current.value)) {minRef.current.value = "00"}
        if (Number(minRef.current.value) > 60 || Number(minRef.current.value) < 0) {
        minRef.current.value = "00"
        } else {
        minRef.current.value = minRef.current.value.padStart(2, "0")
        }
        setTimers((prev)=>{
          if (!hourRef.current ||!minRef.current || !secRef.current) {return [...prev]}
          const index = prev.map((d)=>d.id).indexOf(id)
          prev[index].time = Number(hourRef.current.value) * 3600 + Number(minRef.current.value) * 60 + Number(secRef.current.value)
          return [...prev]
        })
    }} onKeyDown={(e)=>{            
        if (!minRef.current || e.key !== "Enter") {
        return
        }
        if (!Number(minRef.current.value)) {minRef.current.value = "00"}
        if (Number(minRef.current.value) > 60 || Number(minRef.current.value) < 0) {
        minRef.current.value = "00"
        } else {
        minRef.current.value = minRef.current.value.padStart(2, "0")
        }
        secRef.current?.focus()
        secRef.current?.select()
        setTimers((prev)=>{
          if (!hourRef.current ||!minRef.current || !secRef.current) {return [...prev]}
          const index = prev.map((d)=>d.id).indexOf(id)
          prev[index].time = Number(hourRef.current.value) * 3600 + Number(minRef.current.value) * 60 + Number(secRef.current.value)
          return [...prev]
        })
    }} />
    <span>:</span>
    <Input className=" rounded w-12 text-center bg-slate-100" defaultValue={`${sec}`.padStart(2, "0")} ref={secRef} onBlur={()=>{
        if (!secRef.current) { return }
        if (!Number(secRef.current.value)) {secRef.current.value = "00"}
        if (Number(secRef.current.value) > 60 || Number(secRef.current.value) < 0) {
        secRef.current.value = "00"
        } else {
        secRef.current.value = secRef.current.value.padStart(2, "0")
        }
        setTimers((prev)=>{
          if (!hourRef.current ||!minRef.current || !secRef.current) {return [...prev]}
          const index = prev.map((d)=>d.id).indexOf(id)
          prev[index].time = Number(hourRef.current.value) * 3600 + Number(minRef.current.value) * 60 + Number(secRef.current.value)
          return [...prev]
        })
    }} onKeyDown={(e)=>{            
        if (!secRef.current || e.key !== "Enter") {
        return
        }
        if (!Number(secRef.current.value)) {secRef.current.value = "00"}
        if (Number(secRef.current.value) > 60 || Number(secRef.current.value) < 0) {
        secRef.current.value = "00"
        } else {
        secRef.current.value = secRef.current.value.padStart(2, "0")
        }
        secRef.current.blur()
        setTimers((prev)=>{
          if (!hourRef.current ||!minRef.current || !secRef.current) {return [...prev]}
          const index = prev.map((d)=>d.id).indexOf(id)
          prev[index].time = Number(hourRef.current.value) * 3600 + Number(minRef.current.value) * 60 + Number(secRef.current.value)
          return [...prev]
        })
    }} />
    </>
)
}

const RemainingTimer = ({remainingTime}: {remainingTime: number}) => {
  const hour = Math.floor(remainingTime / 3600)
  const min = Math.floor( (remainingTime % 3600) / 60 )
  const sec = remainingTime % 60

  return (
  <>
      <Input className="rounded w-12 text-center border-none text-xl" readOnly value={`${hour}`.padStart(2, "0")} />
      <span>:</span>
      <Input className="rounded w-12 text-center border-none text-xl" readOnly value={`${min}`.padStart(2, "0")} />
      <span>:</span>
      <Input className="rounded w-12 text-center border-none text-xl" readOnly value={`${sec}`.padStart(2, "0")} />
  </>)
}