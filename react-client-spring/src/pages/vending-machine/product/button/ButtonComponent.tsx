import { ProductEntity } from "../../../../entity/ProductEntity";

interface ButtonComponentProps {
    product: ProductEntity;
    buttonText: string;
    handleClick: (product: ProductEntity) => void;
}
const ButtonComponent: React.FC<ButtonComponentProps> = ({ product, buttonText, handleClick }) => {
    return (
        <>
            <button
                style={{
                    color: "white",
                    width: "40px",
                    height: "40px",
                    padding: "10px 10px",
                    margin: "5px"
                }} onClick={() => handleClick(product)}
            >{buttonText}</button>
        </>
    );
};

export default ButtonComponent;