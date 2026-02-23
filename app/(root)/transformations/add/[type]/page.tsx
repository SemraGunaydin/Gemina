import Header from "@/components/shared/Header";
import TransformationForm from "@/components/shared/TransformationForm";
import { transformationTypes } from "@/constants";
import { getUserById } from "@/lib/actions/user.actions";
import { SearchParamProps, TransformationTypeKey } from "@/types";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation"; // Added missing redirect import

const AddTransformationTypePage = async ({
  params, // Access params directly as a Promise
}: SearchParamProps) => {
  // 1. Await the asynchronous params and auth()
  const { type } = await params;
  const { userId } = await auth(); // Fix: auth() is now a Promise in Next.js 15

  // 2. Protect the route: Redirect if not logged in
  if (!userId) redirect("/sign-in");

  // 3. Get transformation details from constants
  const transformation = transformationTypes[type as TransformationTypeKey];

  // If the transformation type is invalid, redirect to home
  if (!transformation) redirect("/");

  // 4. Fetch the user from MongoDB using the clerkId
  const user = await getUserById(userId);

  // If for some reason the user is not in MongoDB yet, you might want to handle it
  if (!user) redirect("/");

  return (
    <>
      <Header title={transformation.title} subTitle={transformation.subTitle} />

      <section className="mt-10">
        <TransformationForm
          action="Add"
          userId={user._id}
          type={transformation.type as TransformationTypeKey}
          creditBalance={user.creditBalance}
        />
      </section>
    </>
  );
};

export default AddTransformationTypePage;
