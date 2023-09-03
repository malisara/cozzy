import { BACKEND_API_URL, BASKET_SESSION_KEY } from "@/constants";
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
  const savedBasket = JSON.parse(
    sessionStorage.getItem(BASKET_SESSION_KEY) || "null"
  );

  if (savedBasket !== null) {
    savedBasket.items = updatedBasket;
    sessionStorage.setItem(BASKET_SESSION_KEY, JSON.stringify(savedBasket));
  }

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
