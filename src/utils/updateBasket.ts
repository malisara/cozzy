import { BACKEND_API_URL, BASKET_ITEMS_KEY } from "@/constants";
import { BasketItem } from "@/models/basket";

function getDate(): string {
  let date = new Date();
  return date.toISOString().split("T")[0];
}

export async function updateBasketData(
  userId: number,
  cardNumber: number,
  updatedBasket: BasketItem[]
): Promise<void> {
  //update SS
  sessionStorage.setItem(BASKET_ITEMS_KEY, JSON.stringify(updatedBasket));

  //send data to backend
  fetch(`${BACKEND_API_URL}/carts/${cardNumber}`, {
    method: "PUT",
    body: JSON.stringify({
      userId: userId,
      date: getDate(),
      products: updatedBasket,
    }),
  }).catch((error) => {
    console.error("Error fetching shopping bag data:", error);
  });
}
