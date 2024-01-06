'use client'

import { Timer } from "@/components/Timer"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import type { TimerType } from "@/lib/type"
import {v4} from "uuid"

export default function Home() {

  const [timers, setTimers] = useState<TimerType[]>([
    {
      id: v4(),
      name: "new timer",
      time: 300,
      muted: false,
    }
  ])

  const newTimer = (event:React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setTimers((prev)=>{
      return [...prev, {
        id: v4(),
        name: "new timer",
        time: 300,
        muted: false,
      }]
    })
  }

  useEffect(()=>{
    localStorage.setItem("timers", JSON.stringify(timers))
  }, [timers])

  return (
    <div className="home flex flex-col justify-center items-center overflow-x-hidden  w-full pb-8 ">
      <div className=" flex justify-center p-16 flex-wrap w-full overflow-x-hidden gap-4 ">
        {timers.map((d)=>{
          return <Timer key={d.id} time={d.time} name={d.name} muted={d.muted} id={d.id} setTimers={setTimers} />
        })}
      </div>
      <Button variant={"default"} onClick={(e)=>newTimer(e)} className=" rounded-ful bg-slate-200 text-black hover:text-white hover:bg-slate-600">+ New Timer</Button>
    </div>
  )
}

