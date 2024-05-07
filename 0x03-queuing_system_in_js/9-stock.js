import express from "express";
import { createClient } from "redis";
import { promisify } from "util";

const listProducts = [
  { id: 1, name: "Suitcase 250", price: 50, stock: 4 },
  { id: 2, name: "Suitcase 450", price: 100, stock: 10 },
  { id: 3, name: "Suitcase 650", price: 350, stock: 2 },
  { id: 4, name: "Suitcase 1050", price: 550, stock: 5 },
];
const app = express();
const redisClient = createClient();

function getItemById(itemId) {
  return listProducts.find((product) => {
    return product.id == itemId;
  });
}

function reserveStockById(itemId, stock) {
  redisClient.get(itemId, (err, data) => {
    if (err) data = 0;
    const item = getItemById(itemId);
    redisClient.set(item.id, Number(data) + stock);
  });
}

async function getCurrentReservedStockById(itemId) {
  const getter = promisify(redisClient.get).bind(redisClient);
  const reservedStock = await getter(itemId);
  if (reservedStock === null) return 0;
  return Number(reservedStock);
}

app.get("/list_products", (request, response) => {
  response.json(listProducts);
});

app.get("/list_products/:itemId", (request, response) => {
  const { itemId } = request.params;
  const item = getItemById(itemId);
  if (item === undefined) {
    return response.json({ status: "Product not found" });
  }
  const reservedItemStock = getCurrentReservedStockById(itemId);
  return response.json({
    itemId: item.id,
    itemName: item.name,
    price: item.price,
    initialAvailableQuantity: item.stock,
    currentQuantity: item.stock - reservedItemStock,
  });
});

app.get("/reserve_product/:itemId", async (request, response) => {
  const { itemId } = request.params;
  const item = getItemById(itemId);
  if (item === undefined) {
    return response.json({ status: "Product not found" });
  }
  const reservedItemStock = await getCurrentReservedStockById(itemId);
  if (item.stock - reservedItemStock < 1) {
    return response.json({
      status: "Not enough stock available",
      itemId: item.id,
    });
  }
  reserveStockById(item.id, 1);
  return response.json({ status: "Reservation confirmed", itemId: item.id });
});

app.listen(1245);
