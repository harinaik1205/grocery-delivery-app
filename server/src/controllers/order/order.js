import {
  Order,
  Branch,
  Customer,
  DeliveryPartner,
} from "../../models/index.js";
import { sendNotification } from "../../utils/helper.js";

const STATUS_MESSAGES = {
  accepted: "Your order has been accepted by the delivery partner.",
  pickedup: "Your order has been picked up and is on its way.",
  arriving: "Your delivery partner is on the way.",
  delivered: "Your order has been delivered. Enjoy!",
  cancelled: "Your order has been cancelled.",
};

export const createOrder = async (req, reply) => {
  try {
    const { userId } = req.user;
    const { items, branch, totalPrice } = req.body;

    const customerData = await Customer.findById(userId);
    const branchData = await Branch.findById(branch);
    console.log("userId", userId);
    console.log("customerData", customerData);
    if (!customerData) {
      return reply.status(404).send({
        message: "user not found",
      });
    }

    const newOrder = new Order({
      customer: userId,
      items: items.map((item) => ({
        id: item.id,
        item: item.item,
        count: item.count,
      })),
      branch,
      totalPrice,
      deliveryLocation: {
        latitude: customerData.liveLocation.latitude,
        longitude: customerData.liveLocation.longitude,
        address: customerData.address || "No address available",
      },
      // deliveryPersonLocation: {
      //   latitude: customerData.liveLocation.latitude,
      //   longitude: customerData.liveLocation.longitude,
      //   address: customerData.address || "No address available",
      // },
      pickupLocation: {
        latitude: branchData.location.latitude,
        longitude: branchData.location.longitude,
        address: branchData.address || "No address available",
      },
    });

    let savedOrder = await newOrder.save();
    savedOrder = await savedOrder.populate([
      { path: "customer" },
      {
        path: "branch",
      },
      {
        path: "items.item",
      },
      {
        path: "deliveryPartner",
      },
    ]);
    sendNotification(userId, "customer", {
      title: "Order Created",
      body: `Your order #${newOrder?._id} has been ${newOrder?.status}.`,
      orderId: newOrder?._id,
    });

    sendNotification("6a873e6c1e4b7c320caa9166", "deliveryPartner", {
      title: "New Order",
      body: "Please accept the order within 300 seconds",
      orderId: newOrder?._id,
    });

    return reply.status(201).send(savedOrder);
  } catch (error) {
    return reply.status(500).send({
      message: error,
    });
    console.log("error order", error);
  }
};

export const confirmOrder = async (req, reply) => {
  try {
    const { orderId } = req.params;
    const { userId, role } = req.user;
    const { deliveryPersonLocation } = req.body;

    const deliveryPerson = await DeliveryPartner.findById(userId);

    if (!deliveryPerson) {
      return reply.status(404).send({ message: "Delivery Partner not found" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return reply.status(404).send({ message: "Order not found" });
    }

    if (order.status !== "available") {
      return reply.status(400).send({ message: "Order is not available" });
    }

    order.status = "confirmed";
    order.deliveryPartner = userId;
    order.deliveryLocation = {
      latitude: deliveryPersonLocation?.latitude,
      longitude:
        deliveryPersonLocation?.longitude || deliveryPersonLocation?.logitude,
      address: deliveryPersonLocation?.address || "",
    };
    console.log("confirmOrder", order);

    req.server.io.to(orderId).emit("orderConfirmed", order);
    await order.save();
    sendNotification(order.customer, "customer", {
      title: "Order Confirmed",
      body: `Your order #${order?._id} has been ${order.status}.`,
      orderId: order?._id || orderId,
    });

    console.log("order confirmed", order);

    return reply.send(order);
  } catch (error) {
    return reply.status(500).send({
      message: error,
    });
  }
};

export const updateOrderStatus = async (req, reply) => {
  try {
    const { orderId } = req.params;
    const { status, deliveryPersonLocation } = req.body;
    const { userId } = req.user;

    const deliveryPerson = await DeliveryPartner.findById(userId);

    if (!deliveryPerson) {
      return reply.status(404).send({
        message: "Delivery partner not found",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) return reply.status(404).send({ message: "order not found" });

    if (["cancelled", "delivered"].includes(order.status)) {
      return reply.status(400).send({ message: "Order cannot be updated" });
    }

    if (order.deliveryPartner.toString() !== userId) {
      return reply.status(403).send({ message: "Unauthorizes" });
    }

    order.status = status;
    order.deliveryPersonLocation = deliveryPersonLocation;
    await order.save();

    req.server.io.to(orderId).emit("liveTrackingUpdates", order);
    sendNotification(order.customer, "customer", {
      title: "Order Update",
      body: STATUS_MESSAGES[status] ?? `Your order status is now ${status}.`,
      orderId: order?._id || orderId,
    });

    return reply.send(order);
  } catch (error) {
    return reply.status(500).send({ message: error });
  }
};

export const getOrders = async (req, reply) => {
  try {
    const { status, customerId, deliveryPartnerId, branchId } =
      req?.query || req.body;

    let query = {};

    if (status) {
      query.status = status;
    }
    if (customerId) {
      query.customer = customerId;
    }

    if (deliveryPartnerId) {
      query.deliveryPartner = deliveryPartnerId;
      query.branch = branchId;
    }

    const orders = await Order.find(query).populate(
      "customer branch items.item deliveryPartner",
    );

    return reply.send(orders);
  } catch (error) {
    return reply.status(500).send({
      message: error,
    });
  }
};

export const getOrderById = async (req, reply) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return reply.status(400).send({ message: "orderId is required" });
    }

    const order = await Order.findById(orderId).populate(
      "customer branch items.item deliveryPartner",
    );

    if (!order) {
      return reply.status(404).send({ message: "Order not found" });
    }

    return reply.send(order);
  } catch (error) {
    return reply.status(500).send({ message: error });
  }
};
