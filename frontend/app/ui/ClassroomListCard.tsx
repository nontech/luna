import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Assuming we have a Classroom type
type Classroom = {
  id: string;
  name: string;
  teacher: string;
  students: number;
};

// Mock data for classrooms
const classrooms: Classroom[] = [
  { id: "1", name: "Math 101", teacher: "Mr. Smith", students: 25 },
  { id: "2", name: "English Literature", teacher: "Ms. Johnson", students: 30 },
  { id: "3", name: "Physics", teacher: "Dr. Brown", students: 20 },
  { id: "4", name: "History", teacher: "Mrs. Davis", students: 28 },
];

export default function ClassroomsCard() {
  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle className="text-2xl">Classrooms</CardTitle>
        <CardDescription>View all available classrooms.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {classrooms.map((classroom) => (
            <li
              key={classroom.id}
              className="flex items-center justify-between border-b pb-2"
            >
              <div>
                <h3 className="font-semibold">{classroom.name}</h3>
              </div>
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {classroom.students} students
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Add New Classroom</Button>
      </CardFooter>
    </Card>
  );
}
