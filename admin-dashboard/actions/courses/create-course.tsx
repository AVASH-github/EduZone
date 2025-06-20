"use server";

import prisma from "@/utils/prisma";
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dthekfecp",
  api_key: "214135112385349",
  api_secret: "m6gjCaXsrDOuDntEQe_s-hsJxCI",
  secure: true,
});

// Function to upload image to Cloudinary
const uploadImageToCloudinary = async (image:string) => {
  if (!image.startsWith("data:image")) {
    return image; // Return the URL if it's not a base64 image
  }
  try {
    console.log("Uploading image to Cloudinary...");
    const result = await cloudinary.uploader.upload(image, {
      resource_type: "image",
       folder: "courses",
    });
    console.log("Upload result:", result);
    return result.secure_url; // Return the secure URL of the uploaded image
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw new Error("Image upload failed");
  }
};

export const CreateCourse = async ({
  courseInfo,
  benefits,
  prerequisites,
  courseContentData,
}: any) => {
  try {
    // Step 1: Upload the thumbnail to a cloud storage (e.g., Cloudinary)
    let uploadedThumbnailUrl = courseInfo.thumbnail;
    if (courseInfo.thumbnail.startsWith("data:image")) {
      uploadedThumbnailUrl = await uploadImageToCloudinary(
        courseInfo.thumbnail
      );
    }

    // Step 2: Create the course
    const course = await prisma.course.create({
      data: {
        name: courseInfo.name,
        description: courseInfo.description,
        categories: courseInfo.categories,
        price: parseFloat(courseInfo.price),
        estimatedPrice: parseFloat(courseInfo.estimatedPrice),
        thumbnail: uploadedThumbnailUrl,
        tags: courseInfo.tags,
        level: courseInfo.level,
        demoUrl: courseInfo.demoUrl,
        slug: courseInfo.slug,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Step 3: Create course benefits
    if (benefits.length > 0) {
      await Promise.all(
        benefits.map((benefit: { title: string }) =>
          prisma.courseBenefits.create({
            data: {
              title: benefit.title,
              courseId: course.id,
            },
          })
        )
      );
    }

    // Step 4: Create course prerequisites
    if (prerequisites.length > 0) {
      await Promise.all(
        prerequisites.map((prerequisite: { title: string }) =>
          prisma.coursePrerequisites.create({
            data: {
              title: prerequisite.title,
              courseId: course.id,
            },
          })
        )
      );
    }

    // Step 5: Create course content and links
    if (courseContentData.length > 0) {
      await Promise.all(
        courseContentData.map(async (content: any) => {
          const createdContent = await prisma.courseData.create({
            data: {
              title: content.title,
              videoUrl: content.videoUrl,
              videoSection: content.videoSection,
              description: content.description,
              videoLength: content.videoLength,
              courseId: course.id,
            },
          });

          if (content.links && content.links.length > 0) {
            await Promise.all(
              content.links.map((link: { title: string; url: string }) =>
                prisma.courseLinks.create({
                  data: {
                    title: link.title,
                    url: link.url,
                    contentId: createdContent.id,
                  },
                })
              )
            );
          }
        })
      );
    }
    return { success: true, message: "Course created successfully." };
  } catch (error) {
    console.error("Error creating course:", error);
    return { success: false, message: "Error creating course.", error };
  }
};
