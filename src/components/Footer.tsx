import { flexCenter } from "./utils/style";

function Footer(): JSX.Element {
  return (
    <footer
      className={`fixed bottom-0 w-full h-16 bg-stone-50 drop-shadow-lg 
      ${flexCenter}`}
    >
      <p> copyright © Cozzy 2023 </p>
    </footer>
  );
}

export default Footer;
