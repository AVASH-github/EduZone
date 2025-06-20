"use server";

import prisma from "@/utils/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const DeleteCourse = async (slug: string) => {
  try {
    // First delete all related records to maintain data integrity
    await prisma.$transaction([
      // Delete course links
      prisma.courseLinks.deleteMany({
        where: {
          contentId: {
            in: (
              await prisma.courseData.findMany({
                where: {
                  Course: {
                    slug: slug
                  }
                },
                select: { id: true }
              })
            ).map((content) => content.id)
          }
        }
      }),
      // Delete course content
      prisma.courseData.deleteMany({
        where: {
          Course: {
            slug: slug
          }
        }
      }),
      // Delete benefits
      prisma.courseBenefits.deleteMany({
        where: {
          course: {
            slug: slug
          }
        }
      }),
      // Delete prerequisites
      prisma.coursePrerequisites.deleteMany({
        where: {
          course: {
            slug: slug
          }
        }
      }),
      // Finally delete the course
      prisma.course.delete({
        where: {
          slug: slug
        }
      })
    ]);

    // Revalidate the live-courses page
    revalidatePath("/live-courses");
    
    // Optionally redirect after deletion
    redirect("/live-courses");
    
    return { success: true, message: "Course deleted successfully" };
  } catch (error) {
    console.error("Error deleting course:", error);
    return { success: false, message: "Failed to delete course" };
  }
};
