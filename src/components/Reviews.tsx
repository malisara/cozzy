import { ImStarEmpty, ImStarFull, ImStarHalf } from "react-icons/im";

const MAX_STARS = 5;

type Props = {
  stars: number;
  reviews: number;
};

function Reviews({ stars, reviews }: Props): JSX.Element {
  const roundedStars = Math.round(stars * 2) / 2;
  const filledStars = Math.floor(roundedStars);
  const hasHalfStar = roundedStars - filledStars === 0.5;
  const emptyStars = MAX_STARS - filledStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex gap-1 text-base-secondary text-xl baseline">
      {Array(filledStars)
        .fill(0)
        .map((_, i) => {
          return <ImStarFull key={i} />;
        })}
      {hasHalfStar && <ImStarHalf />}
      {Array(emptyStars)
        .fill(0)
        .map((_, i) => {
          return <ImStarEmpty key={i} />;
        })}
      <div className="ms-2 text-base text-gray-400">({reviews})</div>
    </div>
  );
}

export default Reviews;
