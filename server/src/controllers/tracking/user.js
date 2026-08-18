import { Customer, DeliveryPartner } from "../../models/index.js";

export const updateUser = async (req, reply) => {
  try {
    const { userId } = req.user;
    const updatedData = req.body;

    const user =
      (await Customer.findById(userId)) ||
      (await DeliveryPartner.findById(userId));

    if (!user) {
      return reply.status(404).send({
        message: "user not found",
      });
    }

    let UserModel;

    if (user.role === "Customer") {
      UserModel = Customer;
    } else if (user.role === "DeliveryPartner") {
      UserModel = DeliveryPartner;
    } else {
      return reply.status(400).send({
        message: "Invalid role",
      });
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: updatedData },
      { $new: true, runValidators: true },
    );

    return reply.status(200).send({
      message: "updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    return reply.status(500).send({
      message: error,
    });
  }
};
