import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    console.log("Search Param = ",searchParams);

    const queryParam = {
      username: searchParams.get("username"),
    };

    console.log("Query Param = ",queryParam);

    //   Validate with zod
    const result = UsernameQuerySchema.safeParse(queryParam);
    console.log("Result = ",result);

    if(!result.success){
        const usernameError = result.error.format().username?._errors || [];

        return Response.json({
            success: false,
            message: usernameError?.length > 0 ? usernameError.join(', ') : "Invalid username",
        },
        {
            status: 400,
        })
    }
    const { username } = result.data; 

    const existingVerifiedUser = await UserModel.findOne({username, isVerified: true});

    if(existingVerifiedUser){
        return Response.json({
            success: false,
            message: "Username already exists",
        }, 
        {
            status: 400,
        })
    }

    return Response.json({
        success: true,
        message: "Username is unique",
    }, {status: 200});

  } catch (error) {
    console.error("Error in check-username-unique route: ", error);

    return Response.json(
      {
        success: false,
        message: "Error checking username uniqueness",
      },
      {
        status: 500,
      }
    );
  }
}
