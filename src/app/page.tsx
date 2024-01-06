'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { useRef } from "react"

export default function Home() {

  const hourRef = useRef<HTMLInputElement>(null)
  const minRef = useRef<HTMLInputElement>(null)
  const secRef = useRef<HTMLInputElement>(null)

  const { toast } = useToast()

  const Go = () => {
    if (!hourRef.current || !minRef.current || !secRef.current) {return }
    if ((hourRef.current.value === "00") && (secRef.current.value === "00") && (minRef.current.value === "00")) {
      toast({
        title: "Invalid time",
        description: "The time should not be zero.",
      })
    }
  }

  return (
    <div className="home flex justify-center pt-16">
      <div className="timer w-64 shadow-[rgba(50,50,93,0.25)_0px_6px_12px_-2px,_rgba(0,0,0,0.3)_0px_3px_7px_-3px] rounded-lg p-4 gap-8 flex flex-col">
        <h1 className="w-full text-xl text-center">Timer</h1>
        <div className="time  flex gap-2 w-full justify-center items-center">
          <Input className=" rounded w-12 text-center " defaultValue={"00"} ref={hourRef} onBlur={()=>{
            if (!hourRef.current) { return }
            if (!Number(hourRef.current.value)) {hourRef.current.value = "00"}
            if (Number(hourRef.current.value) > 24 || Number(hourRef.current.value) < 0) {
              hourRef.current.value = "00"
            } else {
              hourRef.current.value = hourRef.current.value.padStart(2, "0")
            }
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
          }} />
          <span>:</span>
          <Input className=" rounded w-12 text-center " defaultValue={"05"} ref={minRef} onBlur={()=>{
            if (!minRef.current) { return }
            if (!Number(minRef.current.value)) {minRef.current.value = "00"}
            if (Number(minRef.current.value) > 60 || Number(minRef.current.value) < 0) {
              minRef.current.value = "00"
            } else {
              minRef.current.value = minRef.current.value.padStart(2, "0")
            }
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
          }} />
          <span>:</span>
          <Input className=" rounded w-12 text-center " defaultValue={"00"} ref={secRef} onBlur={()=>{
            if (!secRef.current) { return }
            if (!Number(secRef.current.value)) {secRef.current.value = "00"}
            if (Number(secRef.current.value) > 60 || Number(secRef.current.value) < 0) {
              secRef.current.value = "00"
            } else {
              secRef.current.value = secRef.current.value.padStart(2, "0")
            }
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
          }} />
        </div>
        <div className="flex justify-center">
          <Button variant={"default"} onClick={Go} className=" rounded-full ">Go</Button>
        </div>
      </div>
      
    </div>
  )
}
