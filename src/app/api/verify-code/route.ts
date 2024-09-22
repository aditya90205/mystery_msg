import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, code } = await request.json();

    console.log(username);

    const decodedUsername = decodeURIComponent(username);

    console.log(decodedUsername);

    const user = await UserModel.findOne({ username: decodedUsername });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 400,
        }
      );
    }

    const isVerifyCode = user.verifyCode === code;
    const isCodeNotExpired = new Date() < new Date(user.verifyCodeExpiry);

    if (isVerifyCode && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();

      return Response.json(
        {
          success: true,
          message: "User verified successfully",
        },
        { status: 200 }
      );
    } else if (!isVerifyCode) {
      return Response.json(
        {
          success: false,
          message: "Invalid code",
        },
        { status: 400 }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Code expired, please signup again to get a new code",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error in verify coe: ", error);

    return Response.json(
      {
        success: false,
        message: "Error verifying code",
      },
      {
        status: 500,
      }
    );
  }
}
