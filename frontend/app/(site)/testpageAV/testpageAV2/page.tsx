"use client";
import { useState, useEffect} from "react";

type Employee = {
    name: string;
    job: string;
    years: number;
    email: string;
    number: string;
};

export default function TestPageAV2() {
    const [workers, setWorkers] = useState<Employee[]>([
        {name: "john doe", job: "front end web developer", years: 3, email: "john.doe@gmail.com", number: "(314) 322-5987"},
        {name: "jane doe", job: "marketing manager", years: 5, email: "jane.doe@gmail.com", number: "(314) 524-7854"},
        {name: "Mike Channer", job: "CEO", years: 5, email: "mike.channer@gmail.com", number: "(618) 657-5246"},
    ]);
  return (
    <div>
        <style>
            {`
             .h1{
              font-size: 30px;
              text-align: center;
             }
              .circle{
                background-color: purple;
                height: 100px;
                width: 100px;
                border-radius: 360px;
                margin: auto;
              }
                .workercontainter{
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    text-transform: capitalize;
                    color: white;
                    

                }
                    .name{
                        font-weight: bold;
                    }
            `}
        </style>
        <h1 className="h1 p-5">Our Team</h1>
        <div className="workercontainter">
            {workers.map(worker => (
                <div key={worker.name} className="p-5 bg-primary m-5 rounded">
                    <div className="circle"></div>
                    <h3 className="name mt-5">{worker.name}</h3>
                    <h4>{worker.job}</h4>
                    <p>For {worker.years} years</p>
                    <h5 className="mt-5">Contact Me:</h5>
                    <p>{worker.email}</p>
                    <p>{worker.number}</p>
                </div>
            ))}
        </div>
    </div>
  );
}