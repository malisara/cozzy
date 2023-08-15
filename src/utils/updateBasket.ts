function getDate(): string {
  let date = new Date();
  return date.toISOString().split("T")[0];
}

export async function updateBasketData(
  userId: number,
  cardNumber: number,
  itemId: number,
  newQuantity: number
): Promise<void> {
  return fetch(`https://fakestoreapi.com/carts/${cardNumber}`, {
    method: "PUT",
    body: JSON.stringify({
      userId: userId,
      date: getDate(),
      products: [{ productId: itemId, quantity: newQuantity }],
    }),
  })
    .then((res) => res.json())
    .then((json) => console.log(json)) //card id
    .catch((error) => {
      console.error("Error fetching shopping bag data:", error);
    });
}
