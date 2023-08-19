import { LS_KEY_BASKET } from "@/constants";
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
  localStorage.setItem(LS_KEY_BASKET, JSON.stringify(updatedBasket));

  fetch(`https://fakestoreapi.com/carts/${cardNumber}`, {
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
