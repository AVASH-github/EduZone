"use client";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { DeleteCourse } from "@/actions/courses/delete-course";

export default function Page() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [data, setData] = useState<
    Array<{
      id: string;
      name: string;
      slug: string;
      ratings: number;
      purchased: number;
      createdAt: string;
    }>
  >([]);

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      setError("");
      try {
        const response = await fetch(`/api/get-courses`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const result = await response.json();
        setData(result.data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch courses.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);
  
const handleDeleteCourse = async (slug: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this course?");
    if (!confirmDelete) return;
    try {
      const result = await DeleteCourse(slug);
      if (result.success) {
        // Refresh the course list after deletion
        setData((prevData) => prevData.filter(course => course.slug !== slug));
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      setError("Failed to delete course.");
    }
  };
  return (
    <div className="w-[92%] m-auto mt-10">
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!isLoading && !error && (
        <Table aria-label="Courses Table">
          <TableHeader>
            <TableColumn>Title</TableColumn>
            <TableColumn>Ratings</TableColumn>
            <TableColumn>Purchased</TableColumn>
            <TableColumn>Created At</TableColumn>
            <TableColumn>Edit</TableColumn>
            <TableColumn>Delete</TableColumn>
          </TableHeader>
          <TableBody>
            {data.map(
              (course: {
                id: string;
                name: string;
                ratings: number;
                slug: string;
                purchased: number;
                createdAt: string;
              }) => (
                <TableRow key={course.id}>
                  <TableCell>{course.name}</TableCell>
                  <TableCell>{course.ratings.toFixed(2)}</TableCell>
                  <TableCell>{course.purchased}</TableCell>
                  <TableCell>
                    {new Date(course.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => redirect(`/edit-course/${course.slug}`)}
                      className="text-blue-500 hover:underline"
                    >
                      Edit
                    </button>
                  </TableCell>
                  <TableCell>
                    <button
                     onClick={() => handleDeleteCourse(course.slug)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
