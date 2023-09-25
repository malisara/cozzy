import { BACKEND_API_URL, BASKET_SESSION_KEY } from "@/constants";
import { BasketItem } from "@/models/basket";

function getDate(): string {
  let date = new Date();
  return date.toISOString().split("T")[0];
}

export async function updateBasketData(
  userId: number,
  basketId: number,
  updatedItems: BasketItem[]
): Promise<void> {
  const basket = JSON.parse(
    sessionStorage.getItem(BASKET_SESSION_KEY) || "null"
  );

  basket.items = updatedItems;
  basket.basketId = basketId;
  sessionStorage.setItem(BASKET_SESSION_KEY, JSON.stringify(basket));

  //send data to backend
  fetch(`${BACKEND_API_URL}/carts/${basketId}`, {
    method: "PUT",
    body: JSON.stringify({
      userId: userId,
      date: getDate(),
      products: updatedItems,
    }),
  }).catch((error) => {
    console.error("Error fetching shopping bag data:", error);
  });
}
