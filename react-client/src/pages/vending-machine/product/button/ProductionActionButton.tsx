import { ProductEntity } from "../../../../entity/ProductEntity";
import ButtonComponent from "./ButtonComponent";

interface ProductionActionButtonProps {
    value: string;
    product: ProductEntity;
    handleProduct: (product: ProductEntity) => void;
}

const ProductionActionButton: React.FC<ProductionActionButtonProps> = ({ value, product, handleProduct }) => {
    return (
        // 상품을 추가(+)하는 것인지, 제거(-)하는 것인지에 따른 버튼 컴포넌트 생성
        <>
            {value === "+" ?
                <ButtonComponent product={product} buttonText='+' handleClick={handleProduct} /> :
                <ButtonComponent product={product} buttonText='-' handleClick={handleProduct} />}
        </>
    );
};

export default ProductionActionButton;
