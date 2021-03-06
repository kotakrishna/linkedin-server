import { Request, Response } from "express";
import ITeacher from "../../types/teacher";
import teacher from "../../models/teacher";
import user from "../../models/user";
import { uploadProfilePic } from "../utils/storeDataInAws";
import { changeUserToTeacher } from "../user";

export const getTeacher = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const teachers = await user.find({ flag: true });
    res.status(200).json({ message: "all the teachers", teachers: teachers });
  } catch (error) {
    console.log(error);
  }
};

interface MulterRequest extends Request {
  file: Express.MulterS3.File;
}

export const addTeacher = async (
  req: MulterRequest,
  res: Response
): Promise<void> => {
  const upload = uploadProfilePic("linkden-learning/profile-pics").single(
    "image"
  );

  upload(req, res, async (err) => {
    try {
      let body = req.body as Pick<
        ITeacher,
        | "qualification"
        | "description"
        | "DOB"
        | "specializations"
        | "image"
        | "linkedInProfile"
        | "uniqueId"
      >;

      console.log(req.file)

      const new_teacher: ITeacher = new teacher({
        qualification: body.qualification,
        DOB: body.DOB,
        specializations: body.specializations,
        description: body.description,
        image: req.file.location,
        linkedInProfile: body.linkedInProfile,
        uniqueId: body.uniqueId,
      });

      let user;

      if (body?.uniqueId) {
        user = await changeUserToTeacher(body?.uniqueId)
      }

      let allTeachers: ITeacher[] = await teacher.find();
      let newTeacher: ITeacher = await new_teacher.save();

      res.status(202).json({
        message: "the teacher is added",
        user,
        teacher: newTeacher,
        allTeachers: allTeachers,
      });
    } catch (error) {
      res.end();
      console.log(error);
    }
  });
};

export const updateTeacher = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      params: { id },
      body,
    } = req;
    console.log(body, id);
    const updatedTeacher: ITeacher | null = await teacher.findByIdAndUpdate(
      { _id: id },
      body
    );
    // res.status(205).json({testing:"testing",blog: updatedBlog})
    const allTeachers: ITeacher[] = await teacher.find();

    res.status(202).json({
      message: "new teacher as been added ",
      teacher: updatedTeacher,
      teachers: allTeachers,
    });
    // console.log("new")
  } catch (error) {
    console.log(error);
  }
};

export const getTeacherId = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      params: { id },
    } = req;
    const teachers: ITeacher[] | null = await teacher.find({ _id: id });
    res.status(202).json({ message: "found", teacher: teachers });
  } catch (error) {
    console.log(error);
  }
};

// export const getTeacherId = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const {
//       params: { id },
//     } = req;
//     const teachers: ITeacher | null = await teacher
//       .findById({ _id: id })
//       .populate("uniqueId");
//     res.status(202).json({ message: "found", teacher: teachers });
//   } catch (error) {
//     console.log(error);
//   }
// };

export const deleteTeacher = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const delete_teacher: ITeacher | null = await teacher.findByIdAndRemove(
      req.params.id
    );
    const allTeachers: ITeacher[] = await teacher.find();
    res.status(200).json({
      message: "teacher Deleted",
      teacher: delete_teacher,
      teachers: allTeachers,
    });
  } catch (error) {
    console.log(error);
  }
};



export const getTeacherByUniqueId= async(
  req:Request,
  res:Response,
):Promise<void> =>{
  try {
    const {params :{id}}= req;

    const teacherData = await teacher.findOne({uniqueId:id}).lean().exec();
    res.status(200).json({message:"teacher by unique Id", teacher:teacherData})
  } catch (error) {
    res.end()
    console.log(error)
  }
}