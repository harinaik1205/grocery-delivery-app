import Product from "../../models/products.js";

export const getProductsByCategoryId = async (req, reply) => {
  const { categoryId } = req.params;

  try {
    const products = await Product.find({ category: categoryId })
      .select("-category")
      .exec();

    return reply.status(200).send({
      message: "products fetched successfully",
      products,
    });
  } catch (error) {
    return reply.status(500).send({
      message: error,
    });
  }
};
