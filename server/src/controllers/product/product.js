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

export const getProductById = async (req, reply) => {
  const { productId } = req.params;
  try {
    const product = await Product.findById(productId).populate("category");
    if (!product) {
      return reply.status(404).send({
        success: false,
        message: "Product not found.",
      });
    }
    return reply.status(200).send({
      success: true,
      product,
    });
  } catch (error) {
    return reply.status(500).send({
      success: false,
      message: error,
    });
  }
};
